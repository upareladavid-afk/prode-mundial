import { useState, useEffect } from "react";
import { db } from "./firebase";
import { collection, getDocs, doc, setDoc } from "firebase/firestore";

const banderas = {
  "México": "https://flagcdn.com/w40/mx.png",
  "Sudáfrica": "https://flagcdn.com/w40/za.png",
  "Corea del Sur": "https://flagcdn.com/w40/kr.png",
  "Rep. Checa": "https://flagcdn.com/w40/cz.png",
  "Canadá": "https://flagcdn.com/w40/ca.png",
  "Bosnia": "https://flagcdn.com/w40/ba.png",
  "Qatar": "https://flagcdn.com/w40/qa.png",
  "Suiza": "https://flagcdn.com/w40/ch.png",
  "Brasil": "https://flagcdn.com/w40/br.png",
  "Marruecos": "https://flagcdn.com/w40/ma.png",
  "Haití": "https://flagcdn.com/w40/ht.png",
  "Escocia": "https://flagcdn.com/w40/gb-sct.png",
  "USA": "https://flagcdn.com/w40/us.png",
  "Paraguay": "https://flagcdn.com/w40/py.png",
  "Australia": "https://flagcdn.com/w40/au.png",
  "Turquía": "https://flagcdn.com/w40/tr.png",
  "Alemania": "https://flagcdn.com/w40/de.png",
  "Curazao": "https://flagcdn.com/w40/cw.png",
  "Costa de Marfil": "https://flagcdn.com/w40/ci.png",
  "Ecuador": "https://flagcdn.com/w40/ec.png",
  "Países Bajos": "https://flagcdn.com/w40/nl.png",
  "Japón": "https://flagcdn.com/w40/jp.png",
  "Suecia": "https://flagcdn.com/w40/se.png",
  "Túnez": "https://flagcdn.com/w40/tn.png",
  "Bélgica": "https://flagcdn.com/w40/be.png",
  "Egipto": "https://flagcdn.com/w40/eg.png",
  "Irán": "https://flagcdn.com/w40/ir.png",
  "Nueva Zelanda": "https://flagcdn.com/w40/nz.png",
  "España": "https://flagcdn.com/w40/es.png",
  "Cabo Verde": "https://flagcdn.com/w40/cv.png",
  "Arabia Saudita": "https://flagcdn.com/w40/sa.png",
  "Uruguay": "https://flagcdn.com/w40/uy.png",
  "Francia": "https://flagcdn.com/w40/fr.png",
  "Senegal": "https://flagcdn.com/w40/sn.png",
  "Irak": "https://flagcdn.com/w40/iq.png",
  "Noruega": "https://flagcdn.com/w40/no.png",
  "Argentina": "https://flagcdn.com/w40/ar.png",
  "Argelia": "https://flagcdn.com/w40/dz.png",
  "Austria": "https://flagcdn.com/w40/at.png",
  "Jordania": "https://flagcdn.com/w40/jo.png",
  "Portugal": "https://flagcdn.com/w40/pt.png",
  "RD Congo": "https://flagcdn.com/w40/cd.png",
  "Uzbekistán": "https://flagcdn.com/w40/uz.png",
  "Colombia": "https://flagcdn.com/w40/co.png",
  "Inglaterra": "https://flagcdn.com/w40/gb-eng.png",
  "Croacia": "https://flagcdn.com/w40/hr.png",
  "Ghana": "https://flagcdn.com/w40/gh.png",
  "Panamá": "https://flagcdn.com/w40/pa.png",
};

export default function Pronosticos({ usuario }) {
  const [partidos, setPartidos] = useState([]);
  const [pronosticos, setPronosticos] = useState({});
  const [guardando, setGuardando] = useState({});

  useEffect(() => {
    cargarPartidos();
    cargarMisPronosticos();
  }, []);

  async function cargarPartidos() {
    const snap = await getDocs(collection(db, "partidos"));
    const lista = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    lista.sort((a, b) => a.fecha.localeCompare(b.fecha));
    setPartidos(lista);
  }

  async function cargarMisPronosticos() {
    const snap = await getDocs(collection(db, "pronosticos"));
    const mios = {};
    snap.docs.forEach(d => {
      const data = d.data();
      if (data.uid === usuario.uid) mios[data.partidoId] = data;
    });
    setPronosticos(mios);
  }

  function actualizarInput(partidoId, campo, valor) {
    setPronosticos(prev => ({
      ...prev,
      [partidoId]: { ...prev[partidoId], [campo]: valor }
    }));
  }

  async function guardarPronostico(partido) {
    const p = pronosticos[partido.id] || {};
    if (p.golesA === undefined || p.golesB === undefined || p.golesA === "" || p.golesB === "") {
      alert("Ingresa ambos marcadores antes de guardar.");
      return;
    }
    setGuardando(prev => ({ ...prev, [partido.id]: true }));
    const id = `${usuario.uid}_${partido.id}`;
    await setDoc(doc(db, "pronosticos", id), {
      uid: usuario.uid, nombre: usuario.displayName, foto: usuario.photoURL,
      partidoId: partido.id, equipoA: partido.equipoA, equipoB: partido.equipoB,
      golesA: Number(p.golesA), golesB: Number(p.golesB), puntos: 0,
    });
    setGuardando(prev => ({ ...prev, [partido.id]: false }));
    alert(`✅ ¡Pronóstico guardado! ${partido.equipoA} ${p.golesA} - ${p.golesB} ${partido.equipoB}`);
  }

  const yaTermino = (partido) => partido.golesA !== null && partido.golesB !== null;
  const tienePron = (id) => pronosticos[id] && pronosticos[id].golesA !== undefined && pronosticos[id].golesA !== "";
  let grupoActual = "";

  return (
    <div style={{ maxWidth: 620, margin: "0 auto", padding: "0.5rem 1rem" }}>
      {/* Título con balón imagen */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: "1.2rem" }}>
        <div style={{ flex: 1, height: 1, background: "#2a1500" }} />
        <h2 style={{ color: "#f5a623", fontSize: "1.1rem", fontWeight: 700,
          letterSpacing: "0.05em", textTransform: "uppercase", whiteSpace: "nowrap",
          display: "flex", alignItems: "center", gap: 8 }}>
          <img src="/balon.png" alt="" style={{ width: 20, height: 20, objectFit: "contain" }} />
          Fase de grupos
        </h2>
        <div style={{ flex: 1, height: 1, background: "#2a1500" }} />
      </div>

      {partidos.map(partido => {
        const p = pronosticos[partido.id] || {};
        const terminado = yaTermino(partido);
        const guardado = tienePron(partido.id);
        const banderaA = banderas[partido.equipoA];
        const banderaB = banderas[partido.equipoB];
        const esNuevoGrupo = partido.fase !== grupoActual;
        if (esNuevoGrupo) grupoActual = partido.fase;

        return (
          <div key={partido.id}>
            {esNuevoGrupo && (
              <div style={{ display: "flex", alignItems: "center", gap: 8,
                margin: "1.5rem 0 0.6rem" }}>
                <div style={{ background: "#f5a623", borderRadius: 4,
                  padding: "2px 10px", fontSize: 11, fontWeight: 700,
                  color: "#000", letterSpacing: "0.08em" }}>
                  {partido.fase.toUpperCase()}
                </div>
                <div style={{ flex: 1, height: 1, background: "#1e1000" }} />
              </div>
            )}
            <div style={{
              background: terminado ? "#0d0800" : guardado ? "#0d1a0d" : "#111",
              border: `1px solid ${terminado ? "#1a1000" : guardado ? "#1a3a1a" : "#1e1000"}`,
              borderRadius: 14, padding: "1rem 1.25rem",
              marginBottom: "0.6rem",
              borderLeft: `3px solid ${terminado ? "#2a1500" : guardado ? "#2a7a2a" : "#f5a62340"}`,
            }}>
              <div style={{ display: "flex", justifyContent: "space-between",
                alignItems: "center", marginBottom: 10 }}>
                <span style={{ fontSize: 11, color: "#444" }}>{partido.fecha}</span>
                {terminado && (
                  <span style={{ fontSize: 11, background: "#2a0000",
                    color: "#e53935", padding: "2px 8px", borderRadius: 20,
                    fontWeight: 600 }}>FINALIZADO</span>
                )}
                {!terminado && guardado && (
                  <span style={{ fontSize: 11, background: "#002a00",
                    color: "#4caf50", padding: "2px 8px", borderRadius: 20,
                    fontWeight: 600 }}>✓ GUARDADO</span>
                )}
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: "center" }}>
                <div style={{ flex: 1, display: "flex", alignItems: "center",
                  justifyContent: "flex-end", gap: 8 }}>
                  {banderaA && <img src={banderaA} alt={partido.equipoA}
                    style={{ width: 30, height: 22, objectFit: "cover", borderRadius: 3,
                      boxShadow: "0 1px 4px rgba(0,0,0,0.4)" }} />}
                  <span style={{ fontWeight: 600, fontSize: 14, color: "#eee",
                    textAlign: "right" }}>{partido.equipoA}</span>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <input type="number" min="0" max="20"
                    value={p.golesA ?? ""}
                    onChange={e => actualizarInput(partido.id, "golesA", e.target.value)}
                    disabled={terminado}
                    style={{ width: 46, textAlign: "center", fontSize: 22, fontWeight: 800,
                      background: terminado ? "#0a0500" : "#1a1000",
                      color: terminado ? "#444" : "#f5a623",
                      border: `1px solid ${terminado ? "#1a1000" : "#333"}`,
                      borderRadius: 8, padding: "4px 0", outline: "none" }}
                  />
                  <span style={{ color: "#333", fontSize: 20, fontWeight: 300 }}>:</span>
                  <input type="number" min="0" max="20"
                    value={p.golesB ?? ""}
                    onChange={e => actualizarInput(partido.id, "golesB", e.target.value)}
                    disabled={terminado}
                    style={{ width: 46, textAlign: "center", fontSize: 22, fontWeight: 800,
                      background: terminado ? "#0a0500" : "#1a1000",
                      color: terminado ? "#444" : "#f5a623",
                      border: `1px solid ${terminado ? "#1a1000" : "#333"}`,
                      borderRadius: 8, padding: "4px 0", outline: "none" }}
                  />
                </div>

                <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontWeight: 600, fontSize: 14, color: "#eee" }}>{partido.equipoB}</span>
                  {banderaB && <img src={banderaB} alt={partido.equipoB}
                    style={{ width: 30, height: 22, objectFit: "cover", borderRadius: 3,
                      boxShadow: "0 1px 4px rgba(0,0,0,0.4)" }} />}
                </div>
              </div>

              {terminado ? (
                <div style={{ textAlign: "center", marginTop: 10, fontSize: 12, color: "#555" }}>
                  Resultado final: {partido.golesA} - {partido.golesB}
                  {p.puntos > 0 && (
                    <span style={{ marginLeft: 8, color: "#f5a623", fontWeight: 700,
                      fontSize: 13 }}>+{p.puntos} pts</span>
                  )}
                </div>
              ) : (
                <button onClick={() => guardarPronostico(partido)}
                  disabled={guardando[partido.id]}
                  style={{ display: "block", margin: "12px auto 0", padding: "8px 28px",
                    background: guardado ? "#1a3a1a" : "linear-gradient(90deg, #f5a623, #e8890a)",
                    color: guardado ? "#4caf50" : "#000",
                    border: `1px solid ${guardado ? "#2a5a2a" : "transparent"}`,
                    borderRadius: 8, cursor: "pointer", fontSize: 13, fontWeight: 700 }}>
                  {guardando[partido.id] ? "Guardando..." : guardado ? "✓ Actualizar pronóstico" : "Guardar pronóstico"}
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}