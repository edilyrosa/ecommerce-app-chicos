


import { useState } from "react";

const sucursales = [
  {
    id: 1,
    nombre: "Sala de Exhibición",
    tipo: "Showroom",
    icono: "✦",
    direccion: "Calle Gregorio Torres Quintero 357, Fátima, 28050 Colima, Col.",
    horario: [
      { dias: "Lunes – Viernes", horas: "9:00 am – 2:00 pm  |  4:00 pm – 7:00 pm" },
      { dias: "Sábado", horas: "9:00 am – 2:00 pm" },
    ],
    telefonos: ["(312) 314 5343", "(312) 690 4793"],
    mapQuery: "Calle+Gregorio+Torres+Quintero+357,+Fatima,+28050+Colima,+Mexico",
  },
  {
    id: 2,
    nombre: "Bodega Placetas",
    tipo: "Bodega",
    icono: "◈",
    direccion: "Blvd. Rodolfo Chávez Carrillo 598, Placetas Estadio, 28050 Colima, Col.",
    horario: [
      { dias: "Lunes – Viernes", horas: "9:00 am – 7:00 pm" },
      { dias: "Sábado", horas: "9:00 am – 2:00 pm" },
    ],
    telefonos: ["(312) 313 7879", "(312) 313 7799"],
    mapQuery: "Blvd+Rodolfo+Chavez+Carrillo+598,+Placetas+Estadio,+28050+Colima,+Mexico",
  },
  {
    id: 3,
    nombre: "Bodega Trapiche",
    tipo: "Bodega",
    icono: "◉",
    direccion: "Carretera Colima-Guadalajara Km 5.8, El Trapiche, Colima.",
    horario: [
      { dias: "Lunes – Viernes", horas: "9:00 am – 2:00 pm  |  4:00 pm – 7:00 pm" },
      { dias: "Sábado", horas: "9:00 am – 2:00 pm" },
    ],
    telefonos: ["(312) 315 0232", "(312) 313 8310"],
    mapQuery: "Carretera+Colima-Guadalajara+Km+5.8,+El+Trapiche,+Colima,+Mexico",
  },
];

const Pin = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
  </svg>
);
const Clock = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
  </svg>
);
const Phone = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.95 10.5 19.79 19.79 0 01.88 1.86 2 2 0 012.86 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L7.09 7.61a16 16 0 006.29 6.29l.98-.98a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
  </svg>
);
const Arrow = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/>
  </svg>
);

/* Patrón de azulejo adaptado a fondo claro */
function TilePattern() {
  return (
    <svg
      style={{ position:"absolute",inset:0,width:"100%",height:"100%",opacity:.06,pointerEvents:"none", maskImage:"linear-gradient(to bottom, transparent 0px, black 20px, black calc(100% - 20px), transparent 100%)", WebkitMaskImage:"linear-gradient(to bottom, transparent 0px, black 20px, black calc(100% - 20px), transparent 100%)" }}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern id="azulejo-light" x="0" y="0" width="56" height="56" patternUnits="userSpaceOnUse">
          <rect x="1" y="1" width="25" height="25" fill="none" stroke="#0F1C2E" strokeWidth="0.8"/>
          <rect x="30" y="1" width="25" height="25" fill="none" stroke="#0F1C2E" strokeWidth="0.8"/>
          <rect x="1" y="30" width="25" height="25" fill="none" stroke="#0F1C2E" strokeWidth="0.8"/>
          <rect x="30" y="30" width="25" height="25" fill="none" stroke="#0F1C2E" strokeWidth="0.8"/>
          <circle cx="28" cy="28" r="1.8" fill="#C9A84C"/>
          <line x1="13" y1="1" x2="13" y2="26" stroke="#0F1C2E" strokeWidth="0.4" opacity="0.5"/>
          <line x1="1" y1="13" x2="26" y2="13" stroke="#0F1C2E" strokeWidth="0.4" opacity="0.5"/>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#azulejo-light)"/>
    </svg>
  );
}

export default function SucursalesSection() {
  const [selected, setSelected] = useState(0);
  const s = sucursales[selected];

  return (
    <div className="py-10">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Nunito+Sans:wght@300;400;600;700&display=swap');

        .suc-section *, .suc-section *::before, .suc-section *::after { box-sizing: border-box; }
        .suc-section { font-family: 'Nunito Sans', sans-serif; }

        @keyframes suc-fadeUp {
          from { opacity:0; transform:translateY(18px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes suc-fadeIn { from{opacity:0} to{opacity:1} }

        /* ── Cards grid (sin cambios) ── */
        .suc-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1rem;
          margin-bottom: 1.25rem;
        }
       
        @media (max-width: 760px) { .suc-grid { grid-template-columns: 1fr; } }

        /* ── Cards: se mantienen intactas (fondo azul oscuro) ── */
        .suc-card {
          position: relative;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 3px;
          padding: 1.35rem 1.2rem 1.15rem;
          cursor: pointer;
          overflow: hidden;
          transition: background 0.28s, border-color 0.28s, transform 0.2s, box-shadow 0.28s;
          animation: suc-fadeUp 0.55s ease both;
          user-select: none;
          /* base azul oscuro para que las cards siempre tengan fondo propio */
          background-color: #0F1C2E;
        }
        .suc-card:hover {
          background: #0F1C2E;
          border-color: rgba(201,168,76,0.35);
          transform: translateY(-3px);
        }
        .suc-card.suc-active {
          background: #0F1C2E;
          border-color: rgba(201,168,76,0.7);
          transform: translateY(-4px);
          box-shadow: 0 8px 32px rgba(201,168,76,0.15);
        }
        .suc-bar {
          position:absolute; top:0; left:0; right:0; height:3px;
          background: rgba(201,168,76,0.2);
          transition: background 0.28s;
        }
        .suc-card:hover .suc-bar,
        .suc-card.suc-active .suc-bar {
          background: linear-gradient(90deg,#C9A84C,#E8C878);
        }
        .suc-pulse {
          position:absolute; top:11px; right:11px;
          width:7px; height:7px; border-radius:50%;
          background:#C9A84C;
          opacity:0; transition:opacity 0.3s;
          box-shadow:0 0 8px rgba(201,168,76,0.8);
        }
        .suc-active .suc-pulse { opacity:1; }

        .suc-divider {
          width:1.5rem; height:1px;
          background:rgba(201,168,76,0.4);
          margin:0.65rem 0 0.85rem;
          transition:width 0.3s;
        }
        .suc-card:hover .suc-divider,
        .suc-active .suc-divider { width:2.6rem; }

        .suc-row { display:flex; gap:7px; align-items:flex-start; margin-bottom:0.65rem; }

        .suc-tel { font-size:.78rem; color:rgba(255,255,255,0.58); text-decoration:none; display:block; transition:color .2s; }
        .suc-tel:hover { color:#C9A84C; }

        /* ── Dots: adaptados a fondo claro ── */
        .suc-dots { display:flex; justify-content:center; gap:8px; margin-bottom:1.25rem; }
        .suc-dot {
          width:6px; height:6px; border-radius:50%;
          background: rgba(15,28,46,0.2);
          border:none; cursor:pointer; padding:0;
          transition:background .3s, transform .2s;
        }
        .suc-dot.suc-dot-active { background:#C9A84C; transform:scale(1.5); }

        /* ── Mapa (sin cambios estructurales) ── */
        .suc-map-wrap {
          position:relative; border-radius:4px; overflow:hidden;
          border:1px solid rgba(201,168,76,0.35);
          box-shadow: 0 4px 24px rgba(15,28,46,0.1);
        }
        .suc-map-bar {
          position:absolute; top:0; left:0; right:0; height:3px;
          background:linear-gradient(90deg,#C9A84C,#E8C878); z-index:2;
        }
        .suc-map-footer {
          position:absolute; bottom:0; left:0; right:0;
          background:linear-gradient(0deg,rgba(15,28,46,.96) 0%,rgba(15,28,46,.65) 65%,transparent 100%);
          padding:1.25rem 1.25rem 0.9rem;
          z-index:2;
          display:flex; align-items:flex-end; justify-content:space-between;
          gap:1rem; flex-wrap:wrap;
        }
        .suc-map-cta {
          display:inline-flex; align-items:center; gap:5px;
          font-size:.72rem; font-weight:700;
          letter-spacing:.12em; text-transform:uppercase;
          color:#C9A84C; text-decoration:none;
          border:1px solid rgba(201,168,76,0.45); border-radius:2px;
          padding:6px 13px; white-space:nowrap;
          transition:background .2s, border-color .2s;
          font-family:'Nunito Sans',sans-serif;
        }
        .suc-map-cta:hover { background:rgba(201,168,76,.13); border-color:#C9A84C; }

        .suc-map-iframe { display:block; border:none; height:400px; width:100%; }
        @media (max-width:600px) { .suc-map-iframe { height:270px; } }

        /* ── WhatsApp link en header (fondo claro) ── */
        .suc-wa-link {
          color: #C9A84C;
          text-decoration: none;
          font-weight: 600;
          transition: color .2s;
        }
        .suc-wa-link:hover { color: #0F1C2E; }
      `}</style>

      <section
        className="suc-section"
        style={{
          position: "relative",
          background: "#FFFFFF",       /* ← FONDO BLANCO */
          padding: "4.5rem 1.5rem 3.5rem",
          overflow: "hidden",
        }}
      >
        <TilePattern />

        {/* Glow sutil en azul de la marca en lugar del dorado */}
        <div style={{
          position:"absolute", top:"-90px", left:"50%", transform:"translateX(-50%)",
          width:"700px", height:"280px",
          background:"radial-gradient(ellipse, rgba(15,28,46,0.04) 0%, transparent 70%)",
          pointerEvents:"none",
        }}/>

        <div style={{ maxWidth:"1100px", margin:"0 auto", position:"relative" }}>

          {/* ── Header ── */}
          <div style={{ textAlign:"center", marginBottom:"2.5rem", animation:"suc-fadeIn .7s ease both" }}>

            {/* Eyebrow */}
            <span style={{
              display:"inline-block", fontSize:"20px", fontWeight:700,
              letterSpacing:"0.22em", textTransform:"uppercase",
              color:"#C9A84C", marginBottom:"0.75rem",
            }}>
              ── Visítanos ──
            </span>

            {/* Título en azul oscuro de la empresa */}
            <h2 style={{
              fontFamily:"'Playfair Display',Georgia,serif",
              fontSize:"clamp(2.3rem,5vw,3rem)",
              fontWeight:700,
              color:"#0F1C2E",           /* ← AZUL EMPRESA */
              margin:"0 0 .6rem",
              lineHeight:1.15,
            }}>
              Nuestras Sucursales
            </h2>

            {/* Subtítulo en gris-azul oscuro */}
            <p style={{
              fontSize:".88rem",
              color:"rgb(15,28,46)",  /* ← TONO OSCURO SUAVE */
              maxWidth:"460px",
              margin:"0 auto .6rem",
              lineHeight:1.75,
              fontWeight:300,
            }}>
              Selecciona una sucursal para ver su ubicación en el mapa. Material de entrega inmediata y servicio a domicilio.
            </p>

            {/* WhatsApp Business */}
            <p style={{
              fontSize:".88rem",
              color:"#0F1C2E",            /* ← AZUL EMPRESA */
              maxWidth:"460px",
              margin:"0 auto",
              lineHeight:1.75,
              fontWeight:600,
            }}>
              WhatsApp Business{" "}
              <a
                className="suc-wa-link"
                href="https://wa.me/523121907380"
                target="_blank"
                rel="noopener noreferrer"
                onClick={e => e.stopPropagation()}
              >
                +52 312 190 7380
              </a>
            </p>
          </div>

          {/* ── Cards (fondo azul oscuro intacto) ── */}
          <div className="suc-grid">
            {sucursales.map((suc, i) => (
              <div
                key={suc.id}
                className={`suc-card${selected === i ? " suc-active" : ""}`}
                style={{ animationDelay:`${i * 110}ms` }}
                onClick={() => setSelected(i)}
                role="button"
                tabIndex={0}
                onKeyDown={e => e.key === "Enter" && setSelected(i)}
              >
                <div className="suc-bar"/>
                <div className="suc-pulse"/>

                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:".85rem" }}>
                  <span style={{
                    fontSize:"9px", fontWeight:700, letterSpacing:".16em",
                    textTransform:"uppercase", color:"#C9A84C",
                    background:"rgba(201,168,76,.12)",
                    padding:"3px 9px",
                    border:"1px solid rgba(201,168,76,.25)",
                    borderRadius:"1px",
                  }}>
                    {suc.tipo}
                  </span>
                  <span style={{ fontSize:"15px", color: selected === i ? "#C9A84C" : "rgba(201,168,76,.3)", transition:"color .3s" }}>
                    {suc.icono}
                  </span>
                </div>

                <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:"1.1rem", fontWeight:700, color:"#FFF", margin:0, lineHeight:1.2 }}>
                  {suc.nombre}
                </h3>
                <div className="suc-divider"/>

                <div className="suc-row">
                  <span style={{ color:"#C9A84C", flexShrink:0, marginTop:"2px" }}><Pin/></span>
                  <p style={{ margin:0, fontSize:".77rem", color:"rgba(255,255,255,.56)", lineHeight:1.55 }}>{suc.direccion}</p>
                </div>

                <div className="suc-row">
                  <span style={{ color:"#C9A84C", flexShrink:0, marginTop:"3px" }}><Clock/></span>
                  <div>
                    {suc.horario.map(h => (
                      <div key={h.dias} style={{ marginBottom:"3px" }}>
                        <span style={{ fontSize:".68rem", fontWeight:700, color:"rgba(201,168,76,.85)", letterSpacing:".04em", display:"block" }}>{h.dias}</span>
                        <span style={{ fontSize:".73rem", color:"rgba(255,255,255,.48)" }}>{h.horas}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="suc-row" style={{ marginBottom:0 }}>
                  <span style={{ color:"#C9A84C", flexShrink:0, marginTop:"2px" }}><Phone/></span>
                  <div>
                    {suc.telefonos.map(t => (
                      <a
                        key={t}
                        className="suc-tel"
                        href={`tel:${t.replace(/\s|\(|\)|-/g,"")}`}
                        onClick={e => e.stopPropagation()}
                      >
                        {t}
                      </a>
                    ))}
                  </div>
                </div>

                <p style={{
                  margin:".8rem 0 0", fontSize:".67rem",
                  letterSpacing:".09em", textTransform:"uppercase", fontWeight:700,
                  color: selected === i ? "#C9A84C" : "rgba(201,168,76,.35)",
                  transition:"color .3s",
                }}>
                  {selected === i ? "● Mostrando en mapa" : "Clic para ver en mapa"}
                </p>
              </div>
            ))}
          </div>

          {/* ── Dot indicators ── */}
          <div className="suc-dots" aria-hidden="true">
            {sucursales.map((_, i) => (
              <button
                key={i}
                className={`suc-dot${selected === i ? " suc-dot-active" : ""}`}
                onClick={() => setSelected(i)}
                aria-label={`Ver sucursal ${i + 1}`}
              />
            ))}
          </div>

          {/* ── Mapa ── */}
          <div className="suc-map-wrap">
            <div className="suc-map-bar"/>
            <iframe
              key={selected}
              className="suc-map-iframe"
              title={`Mapa ${s.nombre}`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              src={`https://maps.google.com/maps?q=${s.mapQuery}&output=embed&hl=es&z=16`}
            />
            <div className="suc-map-footer">
              <div>
                <span style={{ display:"block", fontSize:"9px", fontWeight:700, letterSpacing:".18em", textTransform:"uppercase", color:"rgba(201,168,76,.7)", marginBottom:"4px" }}>
                  {s.tipo}
                </span>
                <span style={{ fontFamily:"'Playfair Display',serif", fontSize:"1.1rem", fontWeight:700, color:"#FFF", display:"block", lineHeight:1.1 }}>
                  {s.nombre}
                </span>
                <span style={{ fontSize:".77rem", color:"rgba(255,255,255,.52)", display:"block", marginTop:"4px" }}>
                  {s.direccion}
                </span>
              </div>
              <a
                className="suc-map-cta"
                href={`https://maps.google.com/?q=${s.mapQuery}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Abrir en Google Maps <Arrow/>
              </a>
            </div>
          </div>

          {/* Nota al pie en azul oscuro */}
          <p style={{
            textAlign:"center", marginTop:"1.75rem",
            fontSize:".74rem",
            color:"rgb(15,28,46)",   /* ← AZUL SUAVE */
            letterSpacing:".05em",
          }}>
            Servicio a domicilio disponible en todo el estado de Colima
          </p>

        </div>
      </section>
    </div>
  );
}