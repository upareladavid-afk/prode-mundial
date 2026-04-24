import { useState, useEffect } from "react";
import { db } from "./firebase";
import { collection, onSnapshot } from "firebase/firestore";

export default function Tabla() {
  const [jugadores, setJugadores] = useState([]);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "pronosticos"), (snap) => {
      const puntosPorUsuario = {};
      snap.docs.forEach(d => {
        const data = d.data();
        if (!puntosPorUsuario[data.uid]) {
          puntosPorUsuario[data.uid] = {
            uid: data.uid, nombre: data.nombre, foto: data.foto,
            puntos: 0, aciertos: 0, exactos: 0,
          };
        }
        puntosPorUsuario[data.uid].puntos += data.puntos || 0;
        if (data.puntos >= 5) puntosPorUsuario[data.uid].aciertos += 1;
        if (data.puntos === 10) puntosPorUsuario[data.uid].exactos += 1;
      });
      const lista = Object.values(puntosPorUsuario);
      lista.sort((a, b) => b.puntos - a.puntos);
      setJugadores(lista);
    });
    return unsub;
  }, []);

  const medallas = ["🥇", "🥈", "🥉"];
  const coloresPodio = ["#f5a623", "#aaa", "#cd7f32"];

  return (
    <div style={{ maxWidth: 600, margin: "2rem auto", padding: "0 1rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: "1.2rem" }}>
        <div style={{ flex: 1, height: 1, background: "#222" }} />
        <h2 style={{ color: "#f5a623", fontSize: "1.1rem", fontWeight: 700,
          letterSpacing: "0.05em", textTransform: "uppercase", whiteSpace: "nowrap" }}>
          Tabla de posiciones
        </h2>
        <div style={{ flex: 1, height: 1, background: "#222" }} />
      </div>
      {jugadores.length === 0 && (
        <p style={{ color: "#555", textAlign: "center" }}>Aún no hay puntos registrados.</p>
      )}
      {jugadores.map((j, i) => (
        <div key={j.uid} style={{
          display: "flex", alignItems: "center", gap: 12,
          background: i === 0 ? "linear-gradient(90deg, #1a1100, #111)" : "#111",
          border: `1px solid ${i === 0 ? "#f5a62350" : "#1e1e1e"}`,
          borderRadius: 12, padding: "12px 16px", marginBottom: 8,
        }}>
          <span style={{ fontSize: 20, width: 30, textAlign: "center",
            color: coloresPodio[i] || "#555", fontWeight: 700 }}>
            {medallas[i] || `${i + 1}`}
          </span>
          <img src={j.foto} alt="foto" style={{ width: 38, height: 38, borderRadius: "50%",
            border: `2px solid ${coloresPodio[i] || "#333"}` }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 600, fontSize: 15, color: "#f0f0f0" }}>{j.nombre}</div>
            <div style={{ fontSize: 12, color: "#555", marginTop: 2 }}>
              {j.aciertos} ganador{j.aciertos !== 1 ? "es" : ""} · {j.exactos} exacto{j.exactos !== 1 ? "s" : ""}
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 24, fontWeight: 800,
              color: i === 0 ? "#f5a623" : "#fff" }}>{j.puntos}</div>
            <div style={{ fontSize: 11, color: "#555" }}>pts</div>
          </div>
        </div>
      ))}
    </div>
  );
}