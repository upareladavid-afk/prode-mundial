import { useState, useEffect } from "react";
import { db } from "./firebase";
import { collection, getDocs, doc, updateDoc, writeBatch } from "firebase/firestore";

const ADMIN_EMAIL = "upareladavid@gmail.com";

export default function Admin({ usuario }) {
  const [partidos, setPartidos] = useState([]);
  const [resultados, setResultados] = useState({});
  const [guardando, setGuardando] = useState({});
  const [reseteando, setReseteando] = useState({});
  const [abierto, setAbierto] = useState(false);
  const [jugadores, setJugadores] = useState([]);
  const [eliminando, setEliminando] = useState({});

  if (usuario.email !== ADMIN_EMAIL) return null;

  useEffect(() => {
    cargarPartidos();
    cargarJugadores();
  }, []);

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

  async function cargarJugadores() {
    const snap = await getDocs(collection(db, "pronosticos"));
    const jugadoresMap = {};
    snap.docs.forEach(d => {
      const data = d.data();
      if (!jugadoresMap[data.uid]) {
        jugadoresMap[data.uid] = {
          uid: data.uid,
          nombre: data.nombre,
          foto: data.foto,
          pronosticos: [],
        };
      }
      jugadoresMap[data.uid].pronosticos.push(d.id);
    });
    setJugadores(Object.values(jugadoresMap));
  }

  async function eliminarJugador(jugador) {
    if (!window.confirm(`¿Seguro que quieres eliminar a ${jugador.nombre} y todos sus pronósticos?`)) return;
    setEliminando(prev => ({ ...prev, [jugador.uid]: true }));
    const batch = writeBatch(db);
    jugador.pronosticos.forEach(id => {
      batch.delete(doc(db, "pronosticos", id));
    });
    await batch.commit();
    setEliminando(prev => ({ ...prev, [jugador.uid]: false }));
    alert(`✅ ${jugador.nombre} eliminado correctamente.`);
    cargarJugadores();
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

  async function resetearResultado(partido) {
    if (!window.confirm(`¿Resetear resultado de ${partido.equipoA} vs ${partido.equipoB}? Los puntos volverán a 0.`)) return;
    setReseteando(prev => ({ ...prev, [partido.id]: true }));
    await updateDoc(doc(db, "partidos", partido.id), { golesA: null, golesB: null });
    const snapPron = await getDocs(collection(db, "pronosticos"));
    const batch = writeBatch(db);
    snapPron.docs.forEach(d => {
      if (d.data().partidoId === partido.id) {
        batch.update(doc(db, "pronosticos", d.id), { puntos: 0 });
      }
    });
    await batch.commit();
    setReseteando(prev => ({ ...prev, [partido.id]: false }));
    alert(`✅ Resultado reseteado. Pronósticos vuelven a 0 puntos.`);
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

          {/* Jugadores */}
          <div style={{ background: "#111", border: "1px solid #1e1000",
            borderRadius: 12, padding: "1rem", marginBottom: 16 }}>
            <h3 style={{ color: "#f5a623", fontSize: 13, fontWeight: 700,
              letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 12 }}>
              👥 Jugadores inscritos
            </h3>
            {jugadores.length === 0 && (
              <p style={{ color: "#555", fontSize: 13 }}>No hay jugadores aún.</p>
            )}
            {jugadores.map(j => (
              <div key={j.uid} style={{ display: "flex", alignItems: "center", gap: 10,
                padding: "8px 0", borderBottom: "1px solid #1a1000" }}>
                <img src={j.foto} alt="foto" style={{ width: 32, height: 32,
                  borderRadius: "50%", border: "1px solid #333" }} />
                <span style={{ flex: 1, color: "#ddd", fontSize: 14 }}>{j.nombre}</span>
                <span style={{ color: "#555", fontSize: 12 }}>
                  {j.pronosticos.length} pronósticos
                </span>
                <button onClick={() => eliminarJugador(j)}
                  disabled={eliminando[j.uid]}
                  style={{ padding: "5px 14px", background: "transparent",
                    border: "1px solid #e53935", color: "#e53935",
                    borderRadius: 8, cursor: "pointer", fontSize: 12, fontWeight: 600 }}>
                  {eliminando[j.uid] ? "Eliminando..." : "Eliminar"}
                </button>
              </div>
            ))}
          </div>

          {/* Resultados */}
          <h3 style={{ color: "#f5a623", fontSize: 13, fontWeight: 700,
            letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 10 }}>
            ⚽ Ingresar resultados
          </h3>
          {partidos.map(partido => (
            <div key={partido.id} style={{
              background: "#111", border: "1px solid #1e1000",
              borderRadius: 12, padding: "1rem 1.25rem", marginBottom: 8
            }}>
              <div style={{ fontSize: 11, color: "#444", marginBottom: 8 }}>
                {partido.fecha} · {partido.fase}
                {partido.golesA !== null && partido.golesA !== undefined && (
                  <span style={{ marginLeft: 8, color: "#f5a623", fontWeight: 600 }}>
                    Resultado actual: {partido.golesA} - {partido.golesB}
                  </span>
                )}
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
                    background: "#1a1000", color: "#f5a623", border: "1px solid #333",
                    borderRadius: 8, padding: "4px 0" }}
                />
                <span style={{ color: "#333", fontSize: 18 }}>:</span>
                <input type="number" min="0" max="20"
                  value={resultados[partido.id]?.golesB ?? ""}
                  onChange={e => setResultados(prev => ({
                    ...prev, [partido.id]: { ...prev[partido.id], golesB: e.target.value }
                  }))}
                  style={{ width: 46, textAlign: "center", fontSize: 20, fontWeight: 800,
                    background: "#1a1000", color: "#f5a623", border: "1px solid #333",
                    borderRadius: 8, padding: "4px 0" }}
                />
                <span style={{ fontWeight: 600, flex: 1, color: "#eee", fontSize: 14 }}>
                  {partido.equipoB}
                </span>
              </div>
              <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 10 }}>
                <button onClick={() => guardarResultado(partido)}
                  disabled={guardando[partido.id]}
                  style={{ padding: "7px 18px",
                    background: "linear-gradient(90deg, #e53935, #c62828)",
                    color: "white", border: "none", borderRadius: 8,
                    cursor: "pointer", fontSize: 13, fontWeight: 700 }}>
                  {guardando[partido.id] ? "Guardando..." : "Guardar resultado"}
                </button>
                <button onClick={() => resetearResultado(partido)}
                  disabled={reseteando[partido.id]}
                  style={{ padding: "7px 18px", background: "transparent",
                    color: "#888", border: "1px solid #333",
                    borderRadius: 8, cursor: "pointer", fontSize: 13, fontWeight: 600 }}>
                  {reseteando[partido.id] ? "Reseteando..." : "🔄 Resetear"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}