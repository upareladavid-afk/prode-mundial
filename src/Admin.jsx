import { useState, useEffect } from "react";
import { db } from "./firebase";
import { collection, getDocs, doc, updateDoc, writeBatch } from "firebase/firestore";

const ADMIN_EMAIL = "davidlozanobotero@gmail.com";

export default function Admin({ usuario }) {
  const [partidos, setPartidos] = useState([]);
  const [resultados, setResultados] = useState({});
  const [guardando, setGuardando] = useState({});
  const [abierto, setAbierto] = useState(false);

  if (usuario.email !== ADMIN_EMAIL) return null;

  useEffect(() => { cargarPartidos(); }, []);

  async function cargarPartidos() {
    const snap = await getDocs(collection(db, "partidos"));
    const lista = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    lista.sort((a, b) => a.fecha.localeCompare(b.fecha));
    setPartidos(lista);
    const res = {};
    lista.forEach(p => {
      res[p.id] = { golesA: p.golesA ?? "", golesB: p.golesB ?? "" };
    });
    setResultados(res);
  }

  function calcularPuntos(pronostico, realA, realB) {
    const pA = Number(pronostico.golesA);
    const pB = Number(pronostico.golesB);
    if (pA === realA && pB === realB) return 10;
    const ganadorReal = realA > realB ? "A" : realB > realA ? "B" : "E";
    const ganadorPron = pA > pB ? "A" : pB > pA ? "B" : "E";
    if (ganadorReal === ganadorPron) {
      if (realA - realB === pA - pB) return 7;
      return 5;
    }
    return 0;
  }

  async function guardarResultado(partido) {
    const r = resultados[partido.id];
    if (r.golesA === "" || r.golesB === "") {
      alert("Ingresa ambos goles.");
      return;
    }
    setGuardando(prev => ({ ...prev, [partido.id]: true }));
    const realA = Number(r.golesA);
    const realB = Number(r.golesB);
    await updateDoc(doc(db, "partidos", partido.id), { golesA: realA, golesB: realB });
    const snapPron = await getDocs(collection(db, "pronosticos"));
    const batch = writeBatch(db);
    snapPron.docs.forEach(d => {
      const data = d.data();
      if (data.partidoId === partido.id) {
        const puntos = calcularPuntos(data, realA, realB);
        batch.update(doc(db, "pronosticos", d.id), { puntos });
      }
    });
    await batch.commit();
    setGuardando(prev => ({ ...prev, [partido.id]: false }));
    alert(`✅ Resultado guardado. Puntos calculados.`);
    cargarPartidos();
  }

  return (
    <div style={{ maxWidth: 620, margin: "2rem auto", padding: "0 1rem" }}>
      <button onClick={() => setAbierto(!abierto)} style={{
        width: "100%", padding: "12px", background: "#1a0a00",
        border: "1px solid #f5a62340", borderRadius: 12, cursor: "pointer",
        color: "#f5a623", fontWeight: 700, fontSize: 14, letterSpacing: "0.05em",
        display: "flex", alignItems: "center", justifyContent: "center", gap: 8
      }}>
        🔧 PANEL DE ADMIN {abierto ? "▲" : "▼"}
      </button>

      {abierto && (
        <div style={{ marginTop: 12 }}>
          {partidos.map(partido => (
            <div key={partido.id} style={{
              background: "#111", border: "1px solid #1e1e1e",
              borderRadius: 12, padding: "1rem 1.25rem", marginBottom: 8
            }}>
              <div style={{ fontSize: 11, color: "#444", marginBottom: 8 }}>
                {partido.fecha} · {partido.fase}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: "center" }}>
                <span style={{ fontWeight: 600, flex: 1, textAlign: "right", color: "#eee", fontSize: 14 }}>
                  {partido.equipoA}
                </span>
                <input type="number" min="0" max="20"
                  value={resultados[partido.id]?.golesA ?? ""}
                  onChange={e => setResultados(prev => ({
                    ...prev, [partido.id]: { ...prev[partido.id], golesA: e.target.value }
                  }))}
                  style={{ width: 46, textAlign: "center", fontSize: 20, fontWeight: 800,
                    background: "#1a1a1a", color: "#f5a623", border: "1px solid #333",
                    borderRadius: 8, padding: "4px 0" }}
                />
                <span style={{ color: "#333", fontSize: 18 }}>:</span>
                <input type="number" min="0" max="20"
                  value={resultados[partido.id]?.golesB ?? ""}
                  onChange={e => setResultados(prev => ({
                    ...prev, [partido.id]: { ...prev[partido.id], golesB: e.target.value }
                  }))}
                  style={{ width: 46, textAlign: "center", fontSize: 20, fontWeight: 800,
                    background: "#1a1a1a", color: "#f5a623", border: "1px solid #333",
                    borderRadius: 8, padding: "4px 0" }}
                />
                <span style={{ fontWeight: 600, flex: 1, color: "#eee", fontSize: 14 }}>
                  {partido.equipoB}
                </span>
              </div>
              <button onClick={() => guardarResultado(partido)}
                disabled={guardando[partido.id]}
                style={{ display: "block", margin: "10px auto 0", padding: "7px 22px",
                  background: "linear-gradient(90deg, #e53935, #c62828)",
                  color: "white", border: "none", borderRadius: 8,
                  cursor: "pointer", fontSize: 13, fontWeight: 700 }}>
                {guardando[partido.id] ? "Calculando..." : "Guardar resultado"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}