import { useState, useEffect } from "react";
import { db } from "./firebase";
import { collection, getDocs } from "firebase/firestore";

export default function Historial({ usuario }) {
  const [pronosticos, setPronosticos] = useState([]);
  const [partidos, setPartidos] = useState({});
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    cargarDatos();
  }, []);

  async function cargarDatos() {
    const snapPartidos = await getDocs(collection(db, "partidos"));
    const mapaPartidos = {};
    snapPartidos.docs.forEach(d => { mapaPartidos[d.id] = d.data(); });
    setPartidos(mapaPartidos);

    const snapPron = await getDocs(collection(db, "pronosticos"));
    const mios = snapPron.docs
      .map(d => ({ id: d.id, ...d.data() }))
      .filter(d => d.uid === usuario.uid)
      .sort((a, b) => {
        const fechaA = mapaPartidos[a.partidoId]?.fecha || "";
        const fechaB = mapaPartidos[b.partidoId]?.fecha || "";
        return fechaA.localeCompare(fechaB);
      });
    setPronosticos(mios);
    setCargando(false);
  }

  const colorPuntos = (pts) => {
    if (pts === 10) return "#f5a623";
    if (pts === 7) return "#4caf50";
    if (pts === 5) return "#2196f3";
    if (pts > 0) return "#9c27b0";
    return "#444";
  };

  const etiquetaPuntos = (pts) => {
    if (pts === 10) return "¡Exacto!";
    if (pts === 7) return "Diferencia";
    if (pts === 5) return "Ganador";
    if (pts > 0) return `+${pts}`;
    return "—";
  };

  const totalPuntos = pronosticos.reduce((sum, p) => sum + (p.puntos || 0), 0);
  const exactos = pronosticos.filter(p => p.puntos === 10).length;
  const acertados = pronosticos.filter(p => p.puntos >= 5).length;

  if (cargando) return <p style={{ textAlign: "center", color: "#555", padding: "2rem" }}>Cargando...</p>;

  return (
    <div style={{ maxWidth: 660, margin: "0 auto", padding: "0 1rem" }}>

      {/* Resumen */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginBottom: "1.5rem" }}>
        {[
          { label: "Total puntos", valor: totalPuntos, color: "#f5a623" },
          { label: "Ganadores acertados", valor: acertados, color: "#4caf50" },
          { label: "Marcadores exactos", valor: exactos, color: "#f5a623" },
        ].map((item, i) => (
          <div key={i} style={{ background: "#111", border: "1px solid #1e1e1e",
            borderRadius: 12, padding: "14px 12px", textAlign: "center" }}>
            <div style={{ fontSize: 28, fontWeight: 800, color: item.color }}>{item.valor}</div>
            <div style={{ fontSize: 11, color: "#555", marginTop: 4 }}>{item.label}</div>
          </div>
        ))}
      </div>

      {/* Tabla */}
      {pronosticos.length === 0 ? (
        <p style={{ textAlign: "center", color: "#555" }}>Aún no tienes pronósticos guardados.</p>
      ) : (
        <div style={{ background: "#111", border: "1px solid #1e1e1e", borderRadius: 14, overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#0a0a0a", borderBottom: "1px solid #1e1e1e" }}>
                <th style={{ padding: "10px 14px", textAlign: "left", fontSize: 11,
                  color: "#444", fontWeight: 600, letterSpacing: "0.06em" }}>PARTIDO</th>
                <th style={{ padding: "10px 14px", textAlign: "center", fontSize: 11,
                  color: "#444", fontWeight: 600, letterSpacing: "0.06em" }}>TU PRONÓSTICO</th>
                <th style={{ padding: "10px 14px", textAlign: "center", fontSize: 11,
                  color: "#444", fontWeight: 600, letterSpacing: "0.06em" }}>RESULTADO</th>
                <th style={{ padding: "10px 14px", textAlign: "center", fontSize: 11,
                  color: "#444", fontWeight: 600, letterSpacing: "0.06em" }}>PTS</th>
              </tr>
            </thead>
            <tbody>
              {pronosticos.map((p, i) => {
                const partido = partidos[p.partidoId] || {};
                const terminado = partido.golesA !== null && partido.golesA !== undefined;
                return (
                  <tr key={p.id} style={{
                    borderBottom: i < pronosticos.length - 1 ? "1px solid #161616" : "none",
                    background: i % 2 === 0 ? "#111" : "#0d0d0d"
                  }}>
                    <td style={{ padding: "10px 14px" }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: "#ddd" }}>
                        {p.equipoA} vs {p.equipoB}
                      </div>
                      <div style={{ fontSize: 11, color: "#444", marginTop: 2 }}>
                        {partido.fecha} · {partido.fase}
                      </div>
                    </td>
                    <td style={{ padding: "10px 14px", textAlign: "center" }}>
                      <span style={{ fontSize: 16, fontWeight: 800, color: "#f5a623" }}>
                        {p.golesA} - {p.golesB}
                      </span>
                    </td>
                    <td style={{ padding: "10px 14px", textAlign: "center" }}>
                      {terminado ? (
                        <span style={{ fontSize: 16, fontWeight: 800, color: "#fff" }}>
                          {partido.golesA} - {partido.golesB}
                        </span>
                      ) : (
                        <span style={{ fontSize: 12, color: "#333" }}>Pendiente</span>
                      )}
                    </td>
                    <td style={{ padding: "10px 14px", textAlign: "center" }}>
                      {terminado ? (
                        <div>
                          <div style={{ fontSize: 16, fontWeight: 800, color: colorPuntos(p.puntos) }}>
                            {p.puntos > 0 ? `+${p.puntos}` : "0"}
                          </div>
                          <div style={{ fontSize: 10, color: colorPuntos(p.puntos), marginTop: 2 }}>
                            {etiquetaPuntos(p.puntos)}
                          </div>
                        </div>
                      ) : (
                        <span style={{ fontSize: 12, color: "#333" }}>—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}