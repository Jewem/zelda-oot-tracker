import { useState, useEffect } from "react";

const styles = {
  app: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #0a0a0a 0%, #1a1200 50%, #0a0a0a 100%)",
    color: "#f0c040",
    fontFamily: "'Georgia', serif",
    padding: "0",
    margin: "0",
  },
  header: {
    textAlign: "center",
    padding: "60px 20px 40px",
    borderBottom: "2px solid #c8a000",
    background: "rgba(0,0,0,0.5)",
  },
  triforce: {
    fontSize: "60px",
    marginBottom: "10px",
  },
  title: {
    fontSize: "2.8rem",
    color: "#f0c040",
    textShadow: "0 0 30px #c8a000, 0 0 60px #c8a00066",
    margin: "0 0 10px",
    letterSpacing: "3px",
  },
  subtitle: {
    fontSize: "1.1rem",
    color: "#c8a000",
    letterSpacing: "5px",
    textTransform: "uppercase",
  },
  section: {
    maxWidth: "900px",
    margin: "50px auto",
    padding: "0 20px",
  },
  sectionTitle: {
    fontSize: "1.6rem",
    color: "#f0c040",
    borderLeft: "4px solid #c8a000",
    paddingLeft: "15px",
    marginBottom: "25px",
    textShadow: "0 0 10px #c8a00066",
  },
  cardsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "20px",
    marginBottom: "40px",
  },
  card: {
    background: "rgba(200, 160, 0, 0.08)",
    border: "1px solid #c8a000",
    borderRadius: "10px",
    padding: "25px",
    textAlign: "center",
    boxShadow: "0 0 20px rgba(200,160,0,0.1)",
  },
  cardIcon: {
    fontSize: "2.5rem",
    marginBottom: "10px",
  },
  cardLabel: {
    fontSize: "0.85rem",
    color: "#c8a000",
    letterSpacing: "2px",
    textTransform: "uppercase",
    marginBottom: "8px",
  },
  cardValue: {
    fontSize: "1.3rem",
    color: "#f0c040",
    fontWeight: "bold",
  },
  videoWrapper: {
    position: "relative",
    paddingBottom: "56.25%",
    height: 0,
    borderRadius: "12px",
    overflow: "hidden",
    border: "2px solid #c8a000",
    boxShadow: "0 0 40px rgba(200,160,0,0.2)",
    marginBottom: "40px",
  },
  iframe: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    border: "none",
  },
  newsItem: {
    background: "rgba(200, 160, 0, 0.06)",
    border: "1px solid #c8a00066",
    borderRadius: "8px",
    padding: "20px",
    marginBottom: "15px",
    borderLeft: "4px solid #c8a000",
  },
  newsDate: {
    fontSize: "0.8rem",
    color: "#c8a000",
    letterSpacing: "2px",
    marginBottom: "8px",
  },
  newsTitle: {
    fontSize: "1.1rem",
    color: "#f0c040",
    marginBottom: "8px",
  },
  newsText: {
    fontSize: "0.95rem",
    color: "#d4a800aa",
    lineHeight: "1.6",
  },
  preorderGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "20px",
  },
  preorderCard: {
    background: "rgba(200, 160, 0, 0.08)",
    border: "1px solid #c8a000",
    borderRadius: "10px",
    padding: "25px",
    textAlign: "center",
  },
  preorderBtn: {
    display: "inline-block",
    marginTop: "15px",
    padding: "10px 25px",
    background: "linear-gradient(135deg, #c8a000, #f0c040)",
    color: "#0a0a0a",
    borderRadius: "6px",
    fontWeight: "bold",
    textDecoration: "none",
    fontSize: "0.9rem",
    letterSpacing: "1px",
    cursor: "pointer",
    border: "none",
  },
  footer: {
    textAlign: "center",
    padding: "40px 20px",
    borderTop: "1px solid #c8a00044",
    color: "#c8a00088",
    fontSize: "0.85rem",
    marginTop: "60px",
  },
};

const news = [
  {
    date: "Juin 2025",
    title: "🎮 Annonce officielle — Nintendo Direct",
    text: "Nintendo confirme le développement d'un remake HD d'Ocarina of Time pour Nintendo Switch 2, prévu pour fin 2025.",
  },
  {
    date: "Mai 2025",
    title: "🎬 Premier trailer dévoilé",
    text: "Un trailer cinématique de 3 minutes montre Hyrule entièrement reconstruit en 4K avec un nouveau moteur graphique.",
  },
  {
    date: "Avril 2025",
    title: "🏰 Détails sur le gameplay",
    text: "Le remake conserve le gameplay original tout en ajoutant des contrôles gyroscopiques et une caméra modernisée.",
  },
];

export default function App() {
  const [countdown, setCountdown] = useState("");

  useEffect(() => {
    const target = new Date("2025-12-31T00:00:00");
    const interval = setInterval(() => {
      const now = new Date();
      const diff = target - now;
      if (diff <= 0) {
        setCountdown("DISPONIBLE !");
        clearInterval(interval);
        return;
      }
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);
      setCountdown(`${days}j ${hours}h ${minutes}m ${seconds}s`);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={styles.app}>
      {/* HEADER */}
      <header style={styles.header}>
        <div style={styles.triforce}>🔺</div>
        <h1 style={styles.title}>Zelda: Ocarina of Time</h1>
        <p style={styles.subtitle}>Nintendo Switch 2 — Remake HD 2025</p>
      </header>

      {/* STATUS CARDS */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>📊 Statut du projet</h2>
        <div style={styles.cardsGrid}>
          <div style={styles.card}>
            <div style={styles.cardIcon}>📅</div>
            <div style={styles.cardLabel}>Sortie prévue</div>
            <div style={styles.cardValue}>Fin 2025</div>
          </div>
          <div style={styles.card}>
            <div style={styles.cardIcon}>🎮</div>
            <div style={styles.cardLabel}>Plateforme</div>
            <div style={styles.cardValue}>Switch 2</div>
          </div>
          <div style={styles.card}>
            <div style={styles.cardIcon}>⏳</div>
            <div style={styles.cardLabel}>Compte à rebours</div>
            <div style={styles.cardValue}>{countdown}</div>
          </div>
          <div style={styles.card}>
            <div style={styles.cardIcon}>✅</div>
            <div style={styles.cardLabel}>Statut</div>
            <div style={styles.cardValue}>Confirmé</div>
          </div>
        </div>
      </section>

      {/* TRAILER */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>🎬 Trailer officiel</h2>
        <div style={styles.videoWrapper}>
          <iframe
            style={styles.iframe}
            src="https://www.youtube.com/embed/dQw4w9WgXcQ"
            title="Zelda OoT Remake Trailer"
            allowFullScreen
          />
        </div>
      </section>

      {/* NEWS */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>📰 Dernières nouvelles</h2>
        {news.map((item, i) => (
          <div key={i} style={styles.newsItem}>
            <div style={styles.newsDate}>{item.date}</div>
            <div style={styles.newsTitle}>{item.title}</div>
            <div style={styles.newsText}>{item.text}</div>
          </div>
        ))}
      </section>

      {/* PREORDER */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>🛒 Précommandes</h2>
        <div style={styles.preorderGrid}>
          {["Amazon", "Fnac", "Micromania", "Nintendo eShop"].map((shop) => (
            <div key={shop} style={styles.preorderCard}>
              <div style={{ fontSize: "2rem", marginBottom: "10px" }}>🏪</div>
              <div style={{ color: "#f0c040", fontWeight: "bold", marginBottom: "5px" }}>{shop}</div>
              <div style={{ color: "#c8a000", fontSize: "0.85rem", marginBottom: "10px" }}>Disponible bientôt</div>
              <button style={styles.preorderBtn}>Précommander</button>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer style={styles.footer}>
        <p>🔺 Zelda OoT Remake Tracker — Fan Site non officiel</p>
        <p style={{ marginTop: "8px" }}>© 2025 — Nintendo owns all rights to The Legend of Zelda</p>
      </footer>
    </div>
  );
}
