import { useState, useEffect, useRef } from "react";

// ID du trailer officiel Nintendo (Nintendo Direct 6.9.2026)
const TRAILER_YT_ID = "r8eMoxo4ipE";

const SYSTEM_PROMPT = `Tu es un assistant qui analyse les dernières informations sur "The Legend of Zelda: Ocarina of Time Remake" pour Nintendo Switch 2.

À partir des résultats de recherche web, extrais et structure les informations en JSON UNIQUEMENT (pas de texte avant ni après, pas de backticks markdown) :

{
  "announcement_date":  { "value": "string (date en français ou 'Non annoncé')", "status": "confirmed|pending|unknown", "note": "string courte" },
  "release_date":       { "value": "string", "status": "confirmed|pending|unknown", "note": "string courte" },
  "platform":           { "value": "string", "status": "confirmed|pending|unknown", "note": "string courte" },
  "gameplay":           { "value": "string", "status": "confirmed|pending|unknown", "note": "string courte" },
  "next_direct":        { "value": "string (date prévue ou 'Non planifié')", "status": "confirmed|pending|unknown", "note": "string courte décrivant ce qui est attendu pour Zelda OoT" },
  "preorder_collector": { "value": "string (date ou 'Non ouvertes')", "status": "confirmed|pending|unknown", "note": "string courte" },
  "preorder_standard":  { "value": "string", "status": "confirmed|pending|unknown", "note": "string courte" },
  "preorder_switch2_le":{ "value": "string (date ou 'Non confirmée')", "status": "confirmed|pending|unknown", "note": "string courte sur la Switch 2 édition limitée Zelda leakée par Shpeshal Nick" },
  "news": [
    {
      "date": "string (JJ MMM AAAA)",
      "headline": "string (titre en français, ~60 chars max)",
      "detail": "string (détail en français, ~100 chars max)",
      "source": "string (nom du site, 12 chars max)",
      "url": "string (URL exacte si disponible, sinon '')"
    }
  ]
}

Règles :
- "confirmed" = info officielle Nintendo avec date précise
- "pending" = fenêtre connue ou leak sérieux mais pas officiellement confirmé
- "unknown" = aucune info disponible
- Pour next_direct : cherche s'il y a un Nintendo Direct planifié après juin 2026 (septembre ?)
- Pour preorder_switch2_le : c'est un LEAK (Shpeshal Nick), pas une annonce officielle — statut "pending"
- news : 5 à 7 items max, les plus récents d'abord
- Réponds UNIQUEMENT avec le JSON valide, rien d'autre`;

// ── Starfield ─────────────────────────────────────────────────────────────────
function Starfield() {
  useEffect(() => {
    const c = document.getElementById("sf");
    if (!c) return;
    const ctx = c.getContext("2d");
    let stars = [], raf;
    const resize = () => {
      c.width = window.innerWidth; c.height = window.innerHeight;
      stars = Array.from({ length: 160 }, () => ({
        x: Math.random() * c.width, y: Math.random() * c.height,
        r: Math.random() * 1.3 + 0.2, a: Math.random() * 0.6 + 0.1,
        sp: Math.random() * 0.003 + 0.001, ph: Math.random() * Math.PI * 2,
      }));
    };
    const draw = t => {
      ctx.clearRect(0, 0, c.width, c.height);
      stars.forEach(s => {
        const a = s.a * (0.55 + 0.45 * Math.sin(t * s.sp * 0.1 + s.ph));
        ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,240,200,${a})`; ctx.fill();
      });
      raf = requestAnimationFrame(draw);
    };
    resize(); raf = requestAnimationFrame(draw);
    window.addEventListener("resize", resize);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas id="sf" style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }} />;
}

// ── Triforce ──────────────────────────────────────────────────────────────────
function Triforce() {
  return (
    <svg viewBox="0 0 80 70" style={{ width: 68, display: "block", margin: "0 auto 16px", animation: "tfP 3.5s ease-in-out infinite" }}>
      <polygon points="40,2 70,52 10,52" fill="#C9A84C" />
      <polygon points="18,56 48,56 33,31" fill="#C9A84C" opacity="0.8" />
      <polygon points="52,56 82,56 67,31" fill="#C9A84C" opacity="0.55" />
    </svg>
  );
}

// ── Status helpers ────────────────────────────────────────────────────────────
const SC = { confirmed: "#4CAF7D", pending: "#C9A84C", unknown: "#4C7BAF", loading: "#252840" };

function Card({ icon, type, title, value, status, note }) {
  const c = SC[status] || SC.unknown;
  const blink = status === "unknown" || status === "loading";
  return (
    <div style={{ background: "#111422", border: "1px solid rgba(201,168,76,.18)", borderRadius: 3, padding: "20px 16px 16px", position: "relative", overflow: "hidden", transition: "border-color .2s, transform .2s" }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(201,168,76,.45)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(201,168,76,.18)"; e.currentTarget.style.transform = "none"; }}>
      <div style={{ position: "absolute", top: 0, left: 0, width: 3, height: "100%", background: c }} />
      <div style={{ fontSize: 24, marginBottom: 9 }}>{icon}</div>
      <div style={{ fontFamily: "'Press Start 2P',monospace", fontSize: 6.5, letterSpacing: 2, color: c, textTransform: "uppercase", marginBottom: 6 }}>{type}</div>
      <div style={{ fontFamily: "'Cinzel',serif", fontSize: 13.5, color: "#EDE0C4", marginBottom: 7, lineHeight: 1.3 }}>{title}</div>
      <div style={{ fontFamily: "'VT323',monospace", fontSize: 27, color: c, lineHeight: 1, marginBottom: 6 }}>
        {value || "—"}{blink && <span style={{ animation: "blink 1.2s step-end infinite" }}>_</span>}
      </div>
      <div style={{ fontSize: 13, color: "#7A6E55", lineHeight: 1.45 }}>{note}</div>
    </div>
  );
}

function PCard({ edition, title, value, status, note }) {
  const isC = edition === "collector";
  const isLE = edition === "switch2le";
  const c = SC[status] || SC.unknown;
  const blink = status !== "confirmed";

  const badgeStyle = isLE
    ? { background: "rgba(75,107,175,.12)", color: "#7A9FD4", border: "1px solid #2D4070" }
    : isC
    ? { background: "rgba(201,168,76,.1)", color: "#C9A84C", border: "1px solid #8B6914" }
    : { background: "rgba(76,175,125,.1)", color: "#4CAF7D", border: "1px solid #2D6B4E" };

  const label = isLE ? "🎮 Switch 2 Édition Limitée" : isC ? "✦ Édition Collector" : "▸ Édition Standard";

  return (
    <div style={{ background: isC ? "linear-gradient(135deg,#111422,#161929)" : "#111422", border: `1px solid ${isC ? "rgba(201,168,76,.3)" : isLE ? "rgba(77,107,175,.25)" : "rgba(201,168,76,.18)"}`, borderRadius: 3, padding: "18px 14px", transition: "border-color .2s" }}
      onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(201,168,76,.45)"}
      onMouseLeave={e => e.currentTarget.style.borderColor = isC ? "rgba(201,168,76,.3)" : isLE ? "rgba(77,107,175,.25)" : "rgba(201,168,76,.18)"}>
      <div style={{ display: "inline-block", fontFamily: "'Press Start 2P',monospace", fontSize: 5.5, letterSpacing: 1, padding: "3px 7px", borderRadius: 2, marginBottom: 9, textTransform: "uppercase", ...badgeStyle }}>{label}</div>
      {isLE && <div style={{ fontFamily: "'Press Start 2P',monospace", fontSize: 5.5, letterSpacing: 1, color: "#5A6A8A", marginBottom: 7 }}>⚠ LEAK — non confirmé officiellement</div>}
      <div style={{ fontFamily: "'Cinzel',serif", fontSize: 13, color: "#EDE0C4", marginBottom: 6 }}>{title}</div>
      <div style={{ fontFamily: "'VT323',monospace", fontSize: 22, color: c, marginBottom: 5 }}>
        {value || "—"}{blink && <span style={{ animation: "blink 1.2s step-end infinite" }}>_</span>}
      </div>
      <div style={{ fontSize: 12.5, color: "#7A6E55", lineHeight: 1.4 }}>{note}</div>
    </div>
  );
}

function NewsItem({ date, headline, detail, source, url }) {
  const Tag = url ? "a" : "div";
  const extra = url ? { href: url, target: "_blank", rel: "noopener noreferrer" } : {};
  return (
    <Tag {...extra} style={{ background: "#111422", border: "1px solid rgba(201,168,76,.18)", borderRadius: 3, padding: "14px 16px", display: "grid", gridTemplateColumns: "8px 1fr auto", gap: 11, alignItems: "start", textDecoration: "none", color: "inherit", transition: "border-color .2s" }}
      onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(201,168,76,.45)"}
      onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(201,168,76,.18)"}>
      <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#C9A84C", boxShadow: "0 0 5px #C9A84C", marginTop: 5 }} />
      <div>
        <div style={{ fontFamily: "'Press Start 2P',monospace", fontSize: 6, color: "#7A6E55", letterSpacing: 1, marginBottom: 5 }}>{date}</div>
        <div style={{ fontFamily: "'VT323',monospace", fontSize: 18, color: "#EDE0C4", lineHeight: 1.3, marginBottom: 4 }}>{headline}</div>
        <div style={{ fontSize: 13, color: "#7A6E55", lineHeight: 1.4 }}>{detail}</div>
      </div>
      <div style={{ fontFamily: "'Press Start 2P',monospace", fontSize: 5, color: "#8B6914", letterSpacing: 1, whiteSpace: "nowrap", padding: "3px 5px", border: "1px solid rgba(201,168,76,.18)", borderRadius: 2, marginTop: 2 }}>{source}</div>
    </Tag>
  );
}

function Skel() {
  return (
    <div style={{ background: "#111422", border: "1px solid rgba(201,168,76,.1)", borderRadius: 3, padding: "16px 18px", opacity: 0.5 }}>
      {["40%", "90%", "60%"].map((w, i) => <div key={i} style={{ height: 9, borderRadius: 2, background: "#252840", width: w, marginBottom: 8, animation: "skP 1.5s ease-in-out infinite" }} />)}
    </div>
  );
}

function SLabel({ children }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
      <span style={{ fontFamily: "'Press Start 2P',monospace", fontSize: 7, letterSpacing: 3, color: "#8B6914", textTransform: "uppercase", whiteSpace: "nowrap" }}>{children}</span>
      <div style={{ flex: 1, height: 1, background: "linear-gradient(to right, rgba(201,168,76,.18), transparent)" }} />
    </div>
  );
}

// ── Trailer Player ────────────────────────────────────────────────────────────
function TrailerBlock() {
  const [playing, setPlaying] = useState(false);
  return (
    <div style={{ marginBottom: 44 }}>
      <SLabel>◈ Trailer officiel</SLabel>
      <div style={{ background: "#0C0E1A", border: "1px solid rgba(201,168,76,.28)", borderRadius: 4, overflow: "hidden", position: "relative" }}>
        {!playing ? (
          // Thumbnail clickable
          <div onClick={() => setPlaying(true)} style={{ position: "relative", cursor: "pointer", aspectRatio: "16/9", background: "#0A0B14", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
            <img
              src={`https://img.youtube.com/vi/${TRAILER_YT_ID}/maxresdefault.jpg`}
              alt="Trailer Zelda OoT Remake"
              style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.75, transition: "opacity .2s" }}
              onMouseEnter={e => e.currentTarget.style.opacity = "0.9"}
              onMouseLeave={e => e.currentTarget.style.opacity = "0.75"}
            />
            {/* Play button */}
            <div style={{ position: "absolute", width: 68, height: 68, borderRadius: "50%", background: "rgba(0,0,0,.7)", border: "2px solid rgba(201,168,76,.6)", display: "flex", alignItems: "center", justifyContent: "center", transition: "border-color .2s, transform .2s" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "#C9A84C"; e.currentTarget.style.transform = "scale(1.08)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(201,168,76,.6)"; e.currentTarget.style.transform = "scale(1)"; }}>
              <div style={{ width: 0, height: 0, borderTop: "14px solid transparent", borderBottom: "14px solid transparent", borderLeft: "24px solid #C9A84C", marginLeft: 5 }} />
            </div>
            {/* Label */}
            <div style={{ position: "absolute", bottom: 14, left: 16, fontFamily: "'Press Start 2P',monospace", fontSize: 7, color: "rgba(201,168,76,.8)", letterSpacing: 2 }}>
              NINTENDO DIRECT · 9.6.2026
            </div>
          </div>
        ) : (
          <div style={{ aspectRatio: "16/9" }}>
            <iframe
              src={`https://www.youtube.com/embed/${TRAILER_YT_ID}?autoplay=1&rel=0&modestbranding=1`}
              title="Zelda OoT Remake — Trailer officiel"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{ width: "100%", height: "100%", border: "none", display: "block" }}
            />
          </div>
        )}
        {/* Bottom bar */}
        <div style={{ padding: "10px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ fontFamily: "'Cinzel',serif", fontSize: 13, color: "#C9A84C" }}>The Legend of Zelda: Ocarina of Time — Trailer</div>
          <a href={`https://www.youtube.com/watch?v=${TRAILER_YT_ID}`} target="_blank" rel="noopener noreferrer"
            style={{ fontFamily: "'Press Start 2P',monospace", fontSize: 6, color: "#8B6914", letterSpacing: 1, textDecoration: "none", border: "1px solid rgba(201,168,76,.2)", padding: "4px 7px", borderRadius: 2 }}>
            YT ↗
          </a>
        </div>
      </div>
    </div>
  );
}

// ── Main App ──────────────────────────────────────────────────────────────────
export default function App() {
  const [loading, setLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [error, setError] = useState(false);
  const [data, setData] = useState(null);

  const LOAD = { value: "—", status: "loading", note: "Recherche en cours…" };

  const fetchData = async () => {
    setLoading(true); setError(false); setData(null);
    try {
      const res = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 2000,
          system: SYSTEM_PROMPT,
          tools: [{ type: "web_search_20250305", name: "web_search" }],
          messages: [{
            role: "user",
            content: "Recherche les dernières infos sur 'Zelda Ocarina of Time Remake Nintendo Switch 2 2026' : date sortie, prochain Nintendo Direct planifié, précommandes collector et standard, Switch 2 édition limitée Zelda (leak Shpeshal Nick), actualités récentes. Cherche en français et en anglais."
          }]
        })
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      const text = json.content.filter(b => b.type === "text").map(b => b.text).join("");
      let parsed;
      try { parsed = JSON.parse(text.replace(/```json|```/g, "").trim()); }
      catch { const m = text.match(/\{[\s\S]*\}/); if (m) parsed = JSON.parse(m[0]); else throw new Error("JSON introuvable"); }
      setData(parsed);
      setLastUpdate(new Date());
    } catch (e) { console.error(e); setError(true); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const statusCards = [
    { icon: "📣", type: "Annonce",     title: "Date d'annonce officielle",      key: "announcement_date" },
    { icon: "🗓️", type: "Sortie",      title: "Date de sortie",                 key: "release_date" },
    { icon: "🎮", type: "Plateforme",  title: "Support confirmé",               key: "platform" },
    { icon: "⚔️", type: "Gameplay",   title: "Infos de jeu",                   key: "gameplay" },
    { icon: "📡", type: "Prochain Direct", title: "Prochaine com Nintendo",     key: "next_direct" },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&family=VT323&family=Cinzel:wght@400;700&display=swap');
        *{margin:0;padding:0;box-sizing:border-box}
        body{background:#080910}
        @keyframes tfP{0%,100%{filter:drop-shadow(0 0 8px #C9A84C88)}50%{filter:drop-shadow(0 0 22px #FFD700CC)}}
        @keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
        @keyframes skP{0%,100%{opacity:.3}50%{opacity:.7}}
        @keyframes ldSlide{0%{background-position:-100% 0}100%{background-position:200% 0}}
      `}</style>

      <Starfield />

      {loading && <div style={{ position: "fixed", top: 0, left: 0, right: 0, height: 2, zIndex: 999, background: "linear-gradient(to right,transparent,#C9A84C,transparent)", backgroundSize: "200% 100%", animation: "ldSlide 1.4s linear infinite" }} />}

      {/* HERO */}
      <header style={{ position: "relative", zIndex: 1, textAlign: "center", padding: "48px 20px 32px", background: "linear-gradient(to bottom,#080910 0%,#0C0E1A 60%,transparent 100%)" }}>
        <Triforce />
        <p style={{ fontFamily: "'Press Start 2P',monospace", fontSize: 7.5, letterSpacing: 4, color: "#8B6914", marginBottom: 13 }}>◆ Nintendo Switch 2 · Tracker ◆</p>
        <h1 style={{ fontFamily: "'Cinzel',serif", fontWeight: 700, fontSize: "clamp(19px,4.5vw,40px)", color: "#C9A84C", textShadow: "0 0 28px rgba(201,168,76,.4),0 2px 0 #3C2800", lineHeight: 1.2, letterSpacing: 2, marginBottom: 5 }}>
          The Legend of Zelda<br />Ocarina of Time
        </h1>
        <p style={{ fontFamily: "'VT323',monospace", fontSize: 21, color: "#7A6E55", letterSpacing: 4, marginBottom: 26 }}>— REMAKE 2026 —</p>

        <button onClick={fetchData} disabled={loading} style={{ fontFamily: "'Press Start 2P',monospace", fontSize: 7.5, letterSpacing: 2, padding: "9px 16px", background: "transparent", color: "#C9A84C", border: "1px solid #8B6914", borderRadius: 2, cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.4 : 1, transition: "all .2s" }}
          onMouseEnter={e => { if (!loading) { e.currentTarget.style.background = "rgba(201,168,76,.1)"; e.currentTarget.style.borderColor = "#C9A84C"; } }}
          onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = "#8B6914"; }}>
          ⟳ Actualiser les infos
        </button>

        <p style={{ fontFamily: "'Press Start 2P',monospace", fontSize: 6, color: "#252840", letterSpacing: 1, marginTop: 9 }}>
          {loading ? "Recherche en cours…" : lastUpdate ? `Mise à jour : ${lastUpdate.toLocaleDateString("fr-FR")} à ${lastUpdate.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}` : error ? "Erreur de chargement" : "Chargement…"}
        </p>
      </header>

      <main style={{ position: "relative", zIndex: 1, maxWidth: 920, margin: "0 auto", padding: "32px 20px 80px" }}>

        {/* TRAILER */}
        <TrailerBlock />

        {/* STATUS CARDS */}
        <SLabel>◈ Statut des annonces</SLabel>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 13, marginBottom: 40 }}>
          {statusCards.map(({ icon, type, title, key }) => {
            const d = data?.[key] || LOAD;
            return <Card key={key} icon={icon} type={type} title={title} {...d} />;
          })}
        </div>

        {/* PREORDERS */}
        <SLabel>◈ Précommandes</SLabel>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 13, marginBottom: 40 }}>
          <PCard edition="collector"  title="Jeu — Édition Collector"     value={data?.preorder_collector?.value}   status={data?.preorder_collector?.status  || "loading"} note={data?.preorder_collector?.note  || "Recherche en cours…"} />
          <PCard edition="standard"   title="Jeu — Édition Standard"      value={data?.preorder_standard?.value}    status={data?.preorder_standard?.status   || "loading"} note={data?.preorder_standard?.note   || "Recherche en cours…"} />
          <PCard edition="switch2le"  title="Console Switch 2 édition Zelda" value={data?.preorder_switch2_le?.value} status={data?.preorder_switch2_le?.status || "loading"} note={data?.preorder_switch2_le?.note || "Recherche en cours…"} />
        </div>

        {/* DIVIDER */}
        <div style={{ display: "flex", gap: 3, marginBottom: 34, opacity: .2 }}>
          {Array.from({ length: 30 }).map((_, i) => <div key={i} style={{ height: 3, flex: 1, background: "#C9A84C", opacity: i % 3 === 0 ? .2 : i % 2 === 0 ? .5 : 1 }} />)}
        </div>

        {/* NEWS */}
        <SLabel>◈ Fil d'actu</SLabel>
        <div style={{ display: "flex", flexDirection: "column", gap: 9, marginBottom: 40 }}>
          {loading || !data
            ? [1, 2, 3, 4].map(i => <Skel key={i} />)
            : error
            ? <div style={{ background: "rgba(175,76,76,.08)", border: "1px solid rgba(175,76,76,.3)", borderRadius: 3, padding: 20, textAlign: "center", color: "#AF8080", fontFamily: "'VT323',monospace", fontSize: 18 }}>
                ⚠ Impossible de récupérer les données.<br />Vérifie ta connexion et clique sur Actualiser.
              </div>
            : (data.news || []).map((n, i) => <NewsItem key={i} {...n} />)
          }
        </div>

      </main>

      <footer style={{ position: "relative", zIndex: 1, textAlign: "center", padding: "18px 20px 32px", borderTop: "1px solid rgba(201,168,76,.14)" }}>
        <p style={{ fontFamily: "'Press Start 2P',monospace", fontSize: 6, color: "#1E2035", letterSpacing: 2, lineHeight: 2.2 }}>
          The Legend of Zelda : Ocarina of Time © Nintendo<br />
          Tracker non officiel · Données via Claude AI + Web Search<br />
          ♦ Hyrule Field — Switch 2 Era ♦
        </p>
      </footer>
    </>
  );
}
