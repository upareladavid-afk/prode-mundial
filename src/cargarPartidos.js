import { db } from "./firebase";
import { doc, setDoc } from "firebase/firestore";

const partidos = [
  // Grupo A
  { id: "p01", equipoA: "México", equipoB: "Sudáfrica", fecha: "2026-06-11", fase: "Grupo A" },
  { id: "p02", equipoA: "Corea del Sur", equipoB: "Rep. Checa", fecha: "2026-06-11", fase: "Grupo A" },
  { id: "p03", equipoA: "Rep. Checa", equipoB: "Sudáfrica", fecha: "2026-06-18", fase: "Grupo A" },
  { id: "p04", equipoA: "México", equipoB: "Corea del Sur", fecha: "2026-06-18", fase: "Grupo A" },
  { id: "p05", equipoA: "Rep. Checa", equipoB: "México", fecha: "2026-06-24", fase: "Grupo A" },
  { id: "p06", equipoA: "Sudáfrica", equipoB: "Corea del Sur", fecha: "2026-06-24", fase: "Grupo A" },

  // Grupo B
  { id: "p07", equipoA: "Canadá", equipoB: "Bosnia", fecha: "2026-06-12", fase: "Grupo B" },
  { id: "p08", equipoA: "Qatar", equipoB: "Suiza", fecha: "2026-06-13", fase: "Grupo B" },
  { id: "p09", equipoA: "Suiza", equipoB: "Bosnia", fecha: "2026-06-18", fase: "Grupo B" },
  { id: "p10", equipoA: "Canadá", equipoB: "Qatar", fecha: "2026-06-18", fase: "Grupo B" },
  { id: "p11", equipoA: "Suiza", equipoB: "Canadá", fecha: "2026-06-24", fase: "Grupo B" },
  { id: "p12", equipoA: "Bosnia", equipoB: "Qatar", fecha: "2026-06-24", fase: "Grupo B" },

  // Grupo C
  { id: "p13", equipoA: "Brasil", equipoB: "Marruecos", fecha: "2026-06-13", fase: "Grupo C" },
  { id: "p14", equipoA: "Haití", equipoB: "Escocia", fecha: "2026-06-13", fase: "Grupo C" },
  { id: "p15", equipoA: "Escocia", equipoB: "Marruecos", fecha: "2026-06-19", fase: "Grupo C" },
  { id: "p16", equipoA: "Brasil", equipoB: "Haití", fecha: "2026-06-19", fase: "Grupo C" },
  { id: "p17", equipoA: "Escocia", equipoB: "Brasil", fecha: "2026-06-24", fase: "Grupo C" },
  { id: "p18", equipoA: "Marruecos", equipoB: "Haití", fecha: "2026-06-24", fase: "Grupo C" },

  // Grupo D
  { id: "p19", equipoA: "USA", equipoB: "Paraguay", fecha: "2026-06-12", fase: "Grupo D" },
  { id: "p20", equipoA: "Australia", equipoB: "Turquía", fecha: "2026-06-13", fase: "Grupo D" },
  { id: "p21", equipoA: "USA", equipoB: "Australia", fecha: "2026-06-19", fase: "Grupo D" },
  { id: "p22", equipoA: "Turquía", equipoB: "Paraguay", fecha: "2026-06-19", fase: "Grupo D" },
  { id: "p23", equipoA: "Turquía", equipoB: "USA", fecha: "2026-06-25", fase: "Grupo D" },
  { id: "p24", equipoA: "Paraguay", equipoB: "Australia", fecha: "2026-06-25", fase: "Grupo D" },

  // Grupo E
  { id: "p25", equipoA: "Alemania", equipoB: "Curazao", fecha: "2026-06-14", fase: "Grupo E" },
  { id: "p26", equipoA: "Costa de Marfil", equipoB: "Ecuador", fecha: "2026-06-14", fase: "Grupo E" },
  { id: "p27", equipoA: "Alemania", equipoB: "Costa de Marfil", fecha: "2026-06-20", fase: "Grupo E" },
  { id: "p28", equipoA: "Ecuador", equipoB: "Curazao", fecha: "2026-06-20", fase: "Grupo E" },
  { id: "p29", equipoA: "Ecuador", equipoB: "Alemania", fecha: "2026-06-25", fase: "Grupo E" },
  { id: "p30", equipoA: "Curazao", equipoB: "Costa de Marfil", fecha: "2026-06-25", fase: "Grupo E" },

  // Grupo F
  { id: "p31", equipoA: "Países Bajos", equipoB: "Japón", fecha: "2026-06-14", fase: "Grupo F" },
  { id: "p32", equipoA: "Suecia", equipoB: "Túnez", fecha: "2026-06-14", fase: "Grupo F" },
  { id: "p33", equipoA: "Países Bajos", equipoB: "Suecia", fecha: "2026-06-20", fase: "Grupo F" },
  { id: "p34", equipoA: "Túnez", equipoB: "Japón", fecha: "2026-06-20", fase: "Grupo F" },
  { id: "p35", equipoA: "Japón", equipoB: "Suecia", fecha: "2026-06-25", fase: "Grupo F" },
  { id: "p36", equipoA: "Túnez", equipoB: "Países Bajos", fecha: "2026-06-25", fase: "Grupo F" },

  // Grupo G
  { id: "p37", equipoA: "Bélgica", equipoB: "Egipto", fecha: "2026-06-15", fase: "Grupo G" },
  { id: "p38", equipoA: "Irán", equipoB: "Nueva Zelanda", fecha: "2026-06-15", fase: "Grupo G" },
  { id: "p39", equipoA: "Bélgica", equipoB: "Irán", fecha: "2026-06-21", fase: "Grupo G" },
  { id: "p40", equipoA: "Nueva Zelanda", equipoB: "Egipto", fecha: "2026-06-21", fase: "Grupo G" },
  { id: "p41", equipoA: "Nueva Zelanda", equipoB: "Bélgica", fecha: "2026-06-26", fase: "Grupo G" },
  { id: "p42", equipoA: "Egipto", equipoB: "Irán", fecha: "2026-06-26", fase: "Grupo G" },

  // Grupo H
  { id: "p43", equipoA: "España", equipoB: "Cabo Verde", fecha: "2026-06-15", fase: "Grupo H" },
  { id: "p44", equipoA: "Arabia Saudita", equipoB: "Uruguay", fecha: "2026-06-15", fase: "Grupo H" },
  { id: "p45", equipoA: "España", equipoB: "Arabia Saudita", fecha: "2026-06-21", fase: "Grupo H" },
  { id: "p46", equipoA: "Uruguay", equipoB: "Cabo Verde", fecha: "2026-06-21", fase: "Grupo H" },
  { id: "p47", equipoA: "Uruguay", equipoB: "España", fecha: "2026-06-26", fase: "Grupo H" },
  { id: "p48", equipoA: "Cabo Verde", equipoB: "Arabia Saudita", fecha: "2026-06-26", fase: "Grupo H" },

  // Grupo I
  { id: "p49", equipoA: "Francia", equipoB: "Senegal", fecha: "2026-06-16", fase: "Grupo I" },
  { id: "p50", equipoA: "Irak", equipoB: "Noruega", fecha: "2026-06-16", fase: "Grupo I" },
  { id: "p51", equipoA: "Francia", equipoB: "Irak", fecha: "2026-06-22", fase: "Grupo I" },
  { id: "p52", equipoA: "Noruega", equipoB: "Senegal", fecha: "2026-06-22", fase: "Grupo I" },
  { id: "p53", equipoA: "Noruega", equipoB: "Francia", fecha: "2026-06-26", fase: "Grupo I" },
  { id: "p54", equipoA: "Senegal", equipoB: "Irak", fecha: "2026-06-26", fase: "Grupo I" },

  // Grupo J
  { id: "p55", equipoA: "Argentina", equipoB: "Argelia", fecha: "2026-06-16", fase: "Grupo J" },
  { id: "p56", equipoA: "Austria", equipoB: "Jordania", fecha: "2026-06-16", fase: "Grupo J" },
  { id: "p57", equipoA: "Argentina", equipoB: "Austria", fecha: "2026-06-22", fase: "Grupo J" },
  { id: "p58", equipoA: "Jordania", equipoB: "Argelia", fecha: "2026-06-22", fase: "Grupo J" },
  { id: "p59", equipoA: "Argelia", equipoB: "Austria", fecha: "2026-06-27", fase: "Grupo J" },
  { id: "p60", equipoA: "Jordania", equipoB: "Argentina", fecha: "2026-06-27", fase: "Grupo J" },

  // Grupo K
  { id: "p61", equipoA: "Portugal", equipoB: "RD Congo", fecha: "2026-06-17", fase: "Grupo K" },
  { id: "p62", equipoA: "Uzbekistán", equipoB: "Colombia", fecha: "2026-06-17", fase: "Grupo K" },
  { id: "p63", equipoA: "Portugal", equipoB: "Uzbekistán", fecha: "2026-06-23", fase: "Grupo K" },
  { id: "p64", equipoA: "Colombia", equipoB: "RD Congo", fecha: "2026-06-23", fase: "Grupo K" },
  { id: "p65", equipoA: "Colombia", equipoB: "Portugal", fecha: "2026-06-27", fase: "Grupo K" },
  { id: "p66", equipoA: "RD Congo", equipoB: "Uzbekistán", fecha: "2026-06-27", fase: "Grupo K" },

  // Grupo L
  { id: "p67", equipoA: "Inglaterra", equipoB: "Croacia", fecha: "2026-06-17", fase: "Grupo L" },
  { id: "p68", equipoA: "Ghana", equipoB: "Panamá", fecha: "2026-06-17", fase: "Grupo L" },
  { id: "p69", equipoA: "Inglaterra", equipoB: "Ghana", fecha: "2026-06-23", fase: "Grupo L" },
  { id: "p70", equipoA: "Panamá", equipoB: "Croacia", fecha: "2026-06-23", fase: "Grupo L" },
  { id: "p71", equipoA: "Panamá", equipoB: "Inglaterra", fecha: "2026-06-27", fase: "Grupo L" },
  { id: "p72", equipoA: "Croacia", equipoB: "Ghana", fecha: "2026-06-27", fase: "Grupo L" },
];

export async function cargarPartidos() {
  for (const p of partidos) {
    await setDoc(doc(db, "partidos", p.id), {
      equipoA: p.equipoA,
      equipoB: p.equipoB,
      fecha: p.fecha,
      fase: p.fase,
      golesA: null,
      golesB: null,
    });
  }
  alert("¡Partidos reales cargados!");
}