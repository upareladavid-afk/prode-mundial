import { useState, useEffect } from "react";
import { auth, provider } from "./firebase";
import { signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";
import Pronosticos from "./Pronosticos";
import Tabla from "./Tabla";
import Admin from "./Admin";
import Historial from "./Historial";

const todosLosEquipos = [
  { code: "mx" }, { code: "za" }, { code: "kr" }, { code: "cz" },
  { code: "ca" }, { code: "ba" }, { code: "qa" }, { code: "ch" },
  { code: "br" }, { code: "ma" }, { code: "ht" }, { code: "gb-sct" },
  { code: "us" }, { code: "py" }, { code: "au" }, { code: "tr" },
  { code: "de" }, { code: "cw" }, { code: "ci" }, { code: "ec" },
  { code: "nl" }, { code: "jp" }, { code: "se" }, { code: "tn" },
  { code: "be" }, { code: "eg" }, { code: "ir" }, { code: "nz" },
  { code: "es" }, { code: "cv" }, { code: "sa" }, { code: "uy" },
  { code: "fr" }, { code: "sn" }, { code: "iq" }, { code: "no" },
  { code: "ar" }, { code: "dz" }, { code: "at" }, { code: "jo" },
  { code: "pt" }, { code: "cd" }, { code: "uz" }, { code: "co" },
  { code: "gb-eng" }, { code: "hr" }, { code: "gh" }, { code: "pa" },
];

const Bandera = ({ code, size = 24 }) => (
  <img src={`https://flagcdn.com/w40/${code}.png`} alt={code}
    style={{ width: size * 1.4, height: size, objectFit: "cover", borderRadius: 3,
      boxShadow: "0 1px 4px rgba(0,0,0,0.5)" }} />
);

export default function App() {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [pestana, setPestana] = useState("pronosticos");
  const [esMobil, setEsMobil] = useState(window.innerWidth < 600);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUsuario(u);
      setCargando(false);
    });
    const handleResize = () => setEsMobil(window.innerWidth < 600);
    window.addEventListener("resize", handleResize);
    return () => { unsub(); window.removeEventListener("resize", handleResize); };
  }, []);

  const entrar = () => signInWithPopup(auth, provider);
  const salir = () => signOut(auth);

  if (cargando) return <p style={{ padding: "2rem", color: "#fff" }}>Cargando...</p>;

  if (!usuario) return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center",
      justifyContent: "center", minHeight: "100vh", gap: "1rem",
      background: "linear-gradient(135deg, #0a0500 0%, #1a0e00 40%, #0a0500 100%)",
      position: "relative", overflow: "hidden", padding: "1rem" }}>

      {/* Decoración izquierda - solo desktop */}
      {!esMobil && (
        <div style={{ position: "absolute", left: 20, top: "50%", transform: "translateY(-50%)",
          display: "flex", flexDirection: "column", gap: 30, alignItems: "center" }}>
          <img src="/cerveza.png" alt="cerveza" style={{ width: 90, height: 130,
            objectFit: "contain", opacity: 0.75,
            filter: "drop-shadow(0 4px 16px rgba(0,0,0,0.6))" }} />
          <img src="/balon.png" alt="balon" style={{ width: 60, height: 60,
            objectFit: "contain", opacity: 0.65,
            filter: "drop-shadow(0 4px 16px rgba(0,0,0,0.6))" }} />
          <img src="/barril.png" alt="barril" style={{ width: 90, height: 90,
            objectFit: "contain", opacity: 0.75,
            filter: "drop-shadow(0 4px 16px rgba(0,0,0,0.6))" }} />
        </div>
      )}

      {/* Decoración derecha - solo desktop */}
      {!esMobil && (
        <div style={{ position: "absolute", right: 20, top: "50%", transform: "translateY(-50%)",
          display: "flex", flexDirection: "column", gap: 30, alignItems: "center" }}>
          <img src="/copa.png" alt="copa" style={{ width: 90, height: 130,
            objectFit: "contain", opacity: 0.75,
            filter: "drop-shadow(0 4px 16px rgba(245,166,35,0.3))" }} />
          <img src="/cerveza.png" alt="cerveza" style={{ width: 90, height: 90,
            objectFit: "contain", opacity: 0.75,
            filter: "drop-shadow(0 4px 16px rgba(0,0,0,0.6))" }} />
          <img src="/barril.png" alt="barril" style={{ width: 90, height: 90,
            objectFit: "contain", opacity: 0.75,
            filter: "drop-shadow(0 4px 16px rgba(0,0,0,0.6))" }} />
        </div>
      )}

      {/* Contenido central */}
      <div style={{ zIndex: 1, display: "flex", flexDirection: "column",
        alignItems: "center", gap: "0.9rem", width: "100%", maxWidth: 400 }}>
        <img src="/logo.png" alt="Logo" style={{ height: esMobil ? 80 : 110,
          objectFit: "contain", borderRadius: 14, padding: 10,
          background: "rgba(255,255,255,0.04)", border: "1px solid #f5a62220" }} />
        <h1 style={{ fontSize: esMobil ? "1.6rem" : "2.2rem", color: "#fff", fontWeight: 800,
          textAlign: "center", textShadow: "0 0 40px rgba(245,166,35,0.5)",
          margin: "0.2rem 0" }}>
          Mundial Imporbeer 2026
        </h1>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ color: "#f5a623", fontSize: 12, letterSpacing: "0.14em",
            fontWeight: 700, textTransform: "uppercase" }}>Cerveza</span>
          <span style={{ color: "#f5a62370", fontSize: 12, fontWeight: 600 }}>Y</span>
          <span style={{ color: "#f5a623", fontSize: 12, letterSpacing: "0.14em",
            fontWeight: 700, textTransform: "uppercase" }}>Fútbol</span>
        </div>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <Bandera code="mx" size={20} />
          <span style={{ color: "#333" }}>·</span>
          <Bandera code="us" size={20} />
          <span style={{ color: "#333" }}>·</span>
          <Bandera code="ca" size={20} />
        </div>
        <p style={{ color: "#444", fontSize: 13 }}>Inicia sesión para hacer tus pronósticos</p>
        <button onClick={entrar} style={{ padding: "13px 38px", fontSize: "14px",
          cursor: "pointer", borderRadius: "10px",
          border: "1px solid #f5a623", background: "transparent",
          color: "#f5a623", fontWeight: 700, letterSpacing: "0.06em",
          width: esMobil ? "100%" : "auto" }}>
          Entrar con Google
        </button>
      </div>
    </div>
  );

  const tabs = [
    { id: "pronosticos", label: esMobil ? "Pronósticos" : "Pronósticos" },
    { id: "historial", label: "Historial" },
    { id: "tabla", label: "Tabla" },
  ];

  return (
    <div style={{ background: "#0a0500", minHeight: "100vh", overflowX: "hidden" }}>
      {/* Header */}
      <div style={{ background: "linear-gradient(90deg, #1a0a00 0%, #0f0800 50%, #1a0a00 100%)",
        borderBottom: "1px solid #f5a62325", padding: "0.6rem 1rem",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <img src="/logo.png" alt="Logo" style={{ height: 30, objectFit: "contain", borderRadius: 6 }} />
          {!esMobil && (
            <span style={{ color: "#f5a623", fontWeight: 800, fontSize: "1rem" }}>
              Mundial Imporbeer 2026
            </span>
          )}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <img src={usuario.photoURL} alt="foto" style={{ width: 30, height: 30,
            borderRadius: "50%", border: "2px solid #f5a62350" }} />
          {!esMobil && <span style={{ color: "#888", fontSize: 13 }}>{usuario.displayName}</span>}
          <button onClick={salir} style={{ cursor: "pointer", background: "transparent",
            color: "#555", border: "1px solid #222", borderRadius: 8,
            padding: "5px 10px", fontSize: 12 }}>
            Salir
          </button>
        </div>
      </div>

      {/* Banner banderas */}
      <div style={{ background: "linear-gradient(90deg, #1a0a00, #0f0800, #1a0a00)",
        borderBottom: "1px solid #1a1000", padding: "0.35rem 0.5rem",
        display: "flex", alignItems: "center", justifyContent: "center",
        gap: esMobil ? 3 : 6, flexWrap: "nowrap", overflow: "hidden" }}>
        {todosLosEquipos.map(e => (
          <Bandera key={e.code} code={e.code} size={esMobil ? 11 : 14} />
        ))}
      </div>

      {/* Pestañas */}
      <div style={{ display: "flex", borderBottom: "1px solid #1a1000",
        background: "#0a0500", padding: "0 0.5rem" }}>
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setPestana(tab.id)} style={{
            padding: esMobil ? "10px 12px" : "12px 20px",
            fontSize: esMobil ? 12 : 13, fontWeight: 600, cursor: "pointer",
            background: "transparent", border: "none",
            borderBottom: pestana === tab.id ? "2px solid #f5a623" : "2px solid transparent",
            color: pestana === tab.id ? "#f5a623" : "#555",
            transition: "all 0.15s", display: "flex", alignItems: "center", gap: 4
          }}>
            {tab.id === "pronosticos" && (
              <img src="/balon.png" alt="" style={{ width: 14, height: 14, objectFit: "contain" }} />
            )}
            {tab.id === "historial" && "📋 "}
            {tab.id === "tabla" && "🏆 "}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Contenido */}
      <div style={{ position: "relative" }}>
        {!esMobil && (
          <>
            <div style={{ position: "fixed", left: 8, top: "55%", transform: "translateY(-50%)",
              display: "flex", flexDirection: "column", gap: 24, alignItems: "center",
              opacity: 0.13, pointerEvents: "none" }}>
              <img src="/cerveza.png" alt="" style={{ width: 65, height: 100, objectFit: "contain" }} />
              <img src="/balon.png" alt="" style={{ width: 50, height: 50, objectFit: "contain" }} />
              <img src="/barril.png" alt="" style={{ width: 65, height: 65, objectFit: "contain" }} />
            </div>
            <div style={{ position: "fixed", right: 8, top: "55%", transform: "translateY(-50%)",
              display: "flex", flexDirection: "column", gap: 24, alignItems: "center",
              opacity: 0.13, pointerEvents: "none" }}>
              <img src="/copa.png" alt="" style={{ width: 65, height: 100, objectFit: "contain" }} />
              <img src="/cerveza.png" alt="" style={{ width: 65, height: 65, objectFit: "contain" }} />
              <img src="/barril.png" alt="" style={{ width: 65, height: 65, objectFit: "contain" }} />
            </div>
          </>
        )}
        <div style={{ padding: esMobil ? "1rem 0.25rem" : "1.5rem 0.5rem" }}>
          {pestana === "pronosticos" && <Pronosticos usuario={usuario} />}
          {pestana === "historial" && <Historial usuario={usuario} />}
          {pestana === "tabla" && <Tabla />}
          <Admin usuario={usuario} />
        </div>
      </div>
    </div>
  );
}