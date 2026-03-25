"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import Image from "next/image";
import Swal from "sweetalert2";

const fetchLeaderboard = async () => {
  try {
    const response = await fetch("/api/leaderboard");
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    return [];
  }
};

const RANK_MEDAL = { 0: "🥇", 1: "🥈", 2: "🥉" };

export default function Home() {
  const { data: session, status } = useSession();
  const [leaderboard, setLeaderboard] = useState([]);
  const [difficulty, setDifficulty] = useState("Easy");
  const [language, setLanguage] = useState("python");
  const [starting, setStarting] = useState(false);

  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.onmouseenter = Swal.stopTimer;
      toast.onmouseleave = Swal.resumeTimer;
    },
  });

  useEffect(() => {
    const loadLeaderboard = async () => {
      const data = await fetchLeaderboard();
      setLeaderboard(data);
    };
    loadLeaderboard();
  }, []);

  const startChallenge = () => {
    setStarting(true);
    window.location.href = `/question?difficulty=${difficulty}&language=${language}`;
  };

  const DIFF_CONFIG = {
    Easy:    { activeClass: "border-green-400 bg-green-400/5",  labelClass: "text-green-400",  xp: "5–20 XP"   },
    Hard:    { activeClass: "border-amber-400 bg-amber-400/5",  labelClass: "text-amber-400",  xp: "21–60 XP"  },
    Extreme: { activeClass: "border-red-400 bg-red-400/5",      labelClass: "text-red-400",    xp: "61–110 XP" },
  };

  const LANG_CONFIG = {
    python:     { icon: "🐍", label: "Python",     tag: "Stable" },
    javascript: { icon: "⚡", label: "JavaScript",  tag: "Beta"   },
  };

  /* ── LOADING SKELETON ── */
  if (status === "loading") {
    return (
      <div style={styles.page}>
        <GridOverlay />
        <Orbs />
        {/* nav skeleton */}
        <nav style={styles.nav}>
          <div style={{ ...styles.skel, width: 160, height: 20, borderRadius: 4 }} />
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <div style={{ ...styles.skel, width: 80, height: 28, borderRadius: 20 }} />
            <div style={{ ...styles.skel, width: 38, height: 38, borderRadius: "50%" }} />
            <div style={{ ...styles.skel, width: 72, height: 32, borderRadius: 6 }} />
          </div>
        </nav>
        <main style={styles.main}>
          {/* hero skeleton */}
          <div style={{ ...styles.hero, borderBottom: "1px solid rgba(255,255,255,0.07)", marginBottom: 48 }}>
            <div>
              <div style={{ ...styles.skel, width: 180, height: 12, borderRadius: 4, marginBottom: 20 }} />
              <div style={{ ...styles.skel, width: 320, height: 72, borderRadius: 6, marginBottom: 12 }} />
              <div style={{ ...styles.skel, width: 280, height: 72, borderRadius: 6, marginBottom: 20 }} />
              <div style={{ ...styles.skel, width: 380, height: 16, borderRadius: 4 }} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 1, minWidth: 200 }}>
              {[1,2,3].map(i => (
                <div key={i} style={{ ...styles.skel, height: 56, borderRadius: i===1?'8px 8px 0 0':i===3?'0 0 8px 8px':0 }} />
              ))}
            </div>
          </div>
          {/* ticker skeleton */}
          <div style={{ ...styles.skel, height: 48, borderRadius: 8, marginBottom: 24 }} />
          {/* grid skeleton */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: 24 }}>
            <div>
              <div style={{ ...styles.skel, height: 320, borderRadius: 12, marginBottom: 24 }} />
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12 }}>
                {[1,2,3].map(i => <div key={i} style={{ ...styles.skel, height: 100, borderRadius: 10 }} />)}
              </div>
            </div>
            <div style={{ ...styles.skel, height: 500, borderRadius: 12 }} />
          </div>
        </main>
      </div>
    );
  }

  /* ── SIGN IN ── */
  if (status === "unauthenticated") {
    return (
      <div style={styles.page}>
        <GridOverlay />
        <Orbs />
        <div style={styles.signinWrap}>
          <div style={styles.signinCard}>
            {/* top glow line */}
            <div style={{
              position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)",
              width: 200, height: 1,
              background: "linear-gradient(90deg, transparent, #00e5ff, transparent)",
            }} />
            <div style={styles.signinLogo}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#00e5ff", boxShadow: "0 0 12px #00e5ff", display: "inline-block" }} />
              CODE_RUNNER
            </div>
            <h1 style={styles.signinTitle}>Welcome<span style={{ color: "#00e5ff" }}>.</span></h1>
            <p style={styles.signinSub}>Sign in to solve AI-generated challenges and climb the leaderboard.</p>
            <button
              style={styles.signinBtn}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = "#00e5ff";
                e.currentTarget.style.color = "#00e5ff";
                e.currentTarget.style.boxShadow = "0 0 20px rgba(0,229,255,0.1)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)";
                e.currentTarget.style.color = "#e8eaf0";
                e.currentTarget.style.boxShadow = "none";
              }}
              onClick={() => {
                Toast.fire({ icon: "success", title: "Signing In..." });
                signIn("google");
              }}
            >
              <span style={{ width: 18, height: 18, background: "white", borderRadius: "50%", display:"flex", alignItems:"center", justifyContent:"center", fontSize: 11, fontWeight: 900, color: "#4285f4" }}>G</span>
              Continue with Google
            </button>
            <p style={styles.signinFooter}>Your progress is saved automatically</p>
          </div>
        </div>
      </div>
    );
  }

  /* ── AUTHENTICATED HOME ── */
  const userXp = session.user.xp || 0;
  const userRank = leaderboard.findIndex(u => u.name === session.user.name) + 1;

  const tickerItems = [
    "Solve problems, earn XP",
    "AI generates a new challenge every time",
    "Compete on the global leaderboard",
    "Python & JavaScript supported",
    "Easy → Hard → Extreme difficulty",
  ];

  return (
    <div style={styles.page}>
      <GridOverlay />
      <Orbs />

      {/* ── NAV ── */}
      <nav style={styles.nav}>
        <div style={styles.navLogo}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#00e5ff", boxShadow: "0 0 12px #00e5ff", animation: "pulse 2s ease-in-out infinite", display: "inline-block" }} />
          <span><span style={{ color: "#5a6070" }}>{"{ > }"}</span> code_runner</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={styles.xpPill}>⚡ {userXp} XP</span>
          <a href="/profile" style={{ textDecoration: "none" }}>
            <div style={{ width: 38, height: 38, borderRadius: "50%", background: "linear-gradient(135deg,#00e5ff,#00ff94)", padding: 2, cursor: "pointer" }}>
              <div style={{ width: "100%", height: "100%", borderRadius: "50%", background: "#090d1a", overflow: "hidden" }}>
                {session.user.image
                  ? <Image src={session.user.image} alt="avatar" width={34} height={34} style={{ borderRadius: "50%" }} />
                  : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color: "#e8eaf0" }}>{session.user.name?.[0]}</div>
                }
              </div>
            </div>
          </a>
          <button
            style={styles.btnSignout}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,69,102,0.1)"; e.currentTarget.style.borderColor = "#ff4566"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = "rgba(255,69,102,0.4)"; }}
            onClick={() => signOut()}
          >
            sign out
          </button>
        </div>
      </nav>

      <main style={styles.main}>

        {/* ── HERO ── */}
        <section style={styles.hero}>
          <div style={{ flex: 1 }}>
            <div style={styles.eyebrow}>
              <span style={{ width: 24, height: 1, background: "#00e5ff", display: "inline-block" }} />
              AI-Powered Challenges
            </div>
            <h1 style={styles.heroTitle}>
              <span style={{ display: "block", color: "#e8eaf0" }}>CODE.</span>
              <span style={{ display: "block", color: "transparent", WebkitTextStroke: "1.5px rgba(255,255,255,0.2)" }}>
                COMPETE.<span style={{ color: "#00e5ff", WebkitTextStroke: 0 }}>_</span>
              </span>
            </h1>
            <p style={styles.heroDesc}>Infinite AI-generated problems. Real-time leaderboard. No two challenges ever the same.</p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 1, minWidth: 200 }}>
            {[
              { label: "your xp",   val: userXp,                       color: "#ffb800" },
              { label: "rank",      val: userRank > 0 ? `#${userRank}` : "—", color: "#00e5ff" },
              { label: "solved",    val: session.user.solved || "—",   color: "#00ff94" },
            ].map(({ label, val, color }, i) => (
              <div key={label} style={{
                ...styles.statRow,
                borderRadius: i === 0 ? "8px 8px 0 0" : i === 2 ? "0 0 8px 8px" : 0,
              }}>
                <span style={styles.statLabel}>{label}</span>
                <span style={{ ...styles.statVal, color }}>{val}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ── TICKER ── */}
        <div style={styles.ticker}>
          <span style={styles.tickerLabel}>Live</span>
          <div style={{ flex: 1, overflow: "hidden" }}>
            <div style={styles.tickerInner}>
              {[...tickerItems, ...tickerItems].map((item, i) => (
                <span key={i} style={styles.tickerItem}>
                  <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#00ff94", display: "inline-block", flexShrink: 0 }} />
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* ── CONTENT GRID ── */}
        <div style={styles.contentGrid}>

          {/* LEFT */}
          <div>
            {/* Challenge Card */}
            <div style={styles.card}>
              <div style={styles.cardHeader}>
                <span style={styles.cardTitle}>New Challenge</span>
                <span style={styles.badgeLive}>● AI Ready</span>
              </div>
              <div style={{ padding: "28px" }}>

                {/* Difficulty */}
                <div style={{ marginBottom: 20 }}>
                  <span style={styles.fieldLabel}>Difficulty</span>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8 }}>
                    {Object.entries(DIFF_CONFIG).map(([key, cfg]) => (
                      <button
                        key={key}
                        onClick={() => setDifficulty(key)}
                        style={{
                          padding: "10px 8px",
                          background: difficulty === key ? undefined : "#0d1220",
                          border: `1px solid ${difficulty === key ? cfg.activeClass.includes("green") ? "#4ade80" : cfg.activeClass.includes("amber") ? "#fbbf24" : "#f87171" : "rgba(255,255,255,0.07)"}`,
                          borderRadius: 8,
                          cursor: "pointer",
                          textAlign: "center",
                          transition: "all 0.2s",
                          backgroundColor: difficulty === key
                            ? cfg.activeClass.includes("green") ? "rgba(74,222,128,0.07)"
                            : cfg.activeClass.includes("amber") ? "rgba(251,191,36,0.07)"
                            : "rgba(248,113,113,0.07)"
                            : "#0d1220",
                        }}
                      >
                        <span style={{ display: "block", fontFamily: "'Space Mono',monospace", fontSize: 11, fontWeight: 700, color: cfg.labelClass.includes("green") ? "#4ade80" : cfg.labelClass.includes("amber") ? "#fbbf24" : "#f87171", marginBottom: 2 }}>{key}</span>
                        <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 10, color: "#5a6070" }}>{cfg.xp}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Language */}
                <div style={{ marginBottom: 20 }}>
                  <span style={styles.fieldLabel}>Language</span>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                    {Object.entries(LANG_CONFIG).map(([key, cfg]) => (
                      <button
                        key={key}
                        onClick={() => setLanguage(key)}
                        style={{
                          padding: "12px 16px",
                          background: language === key ? "rgba(0,229,255,0.07)" : "#0d1220",
                          border: `1px solid ${language === key ? "#00e5ff" : "rgba(255,255,255,0.07)"}`,
                          borderRadius: 8,
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                          transition: "all 0.2s",
                          textAlign: "left",
                        }}
                      >
                        <span style={{ fontSize: 20 }}>{cfg.icon}</span>
                        <span>
                          <span style={{ display: "block", fontFamily: "'Space Mono',monospace", fontSize: 11, fontWeight: 700, color: "#e8eaf0" }}>{cfg.label}</span>
                          <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 9, color: "#5a6070" }}>{cfg.tag}</span>
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Start Button */}
                <button
                  onClick={startChallenge}
                  disabled={starting}
                  style={styles.startBtn}
                  onMouseEnter={e => { if (!starting) { e.currentTarget.style.boxShadow = "0 0 30px rgba(0,229,255,0.35)"; e.currentTarget.style.transform = "translateY(-1px)"; }}}
                  onMouseLeave={e => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "translateY(0)"; }}
                >
                  {starting ? "GENERATING..." : "START_CHALLENGE →"}
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT — Leaderboard */}
          <div style={{ ...styles.card, position: "sticky", top: 80 }}>
            <div style={styles.cardHeader}>
              <span style={styles.cardTitle}>Leaderboard</span>
              <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 10, color: "#5a6070" }}>Top {Math.min(leaderboard.length, 10)}</span>
            </div>
            <div>
              {leaderboard.slice(0, 10).map((user, i) => {
                const isMe = user.email === session.user.email;
                return (
                  <div key={user._id || i} style={{
                    padding: "14px 24px",
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    borderBottom: i < Math.min(leaderboard.length, 10) - 1 ? "1px solid rgba(255,255,255,0.07)" : "none",
                    background: isMe ? "rgba(0,229,255,0.06)" : "transparent",
                    borderLeft: isMe ? "2px solid #00e5ff" : "2px solid transparent",
                    transition: "background 0.15s",
                  }}>
                    <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 11, width: 20, textAlign: "center", flexShrink: 0, color: i < 3 ? ["#ffd700","#c0c0c0","#cd7f32"][i] : "#3a3f50" }}>
                      {RANK_MEDAL[i] ?? i + 1}
                    </span>
                    <div style={{ width: 30, height: 30, borderRadius: "50%", overflow: "hidden", flexShrink: 0, background: "#0d1220", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700 }}>
                      {user.image
                        ? <Image src={user.image} alt={user.name} width={30} height={30} style={{ borderRadius: "50%", objectFit: "cover" }} />
                        : <span style={{ color: "#e8eaf0" }}>{user.name?.[0]}</span>
                      }
                    </div>
                    <span style={{ flex: 1, fontSize: 13, fontWeight: 500, color: isMe ? "#00e5ff" : "#e8eaf0", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {isMe ? "You" : user.name}
                    </span>
                    <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 11, color: "#ffb800", flexShrink: 0 }}>{user.xp} XP</span>
                  </div>
                );
              })}
              {leaderboard.length === 0 && (
                <div style={{ padding: "32px 24px", textAlign: "center", fontFamily: "'Space Mono',monospace", fontSize: 11, color: "#5a6070" }}>
                  No data yet. Be the first!
                </div>
              )}
            </div>
          </div>

        </div>
      </main>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Syne:wght@400;500;600;700;800&display=swap');
        @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(0.8)} }
        @keyframes ticker { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
        * { box-sizing: border-box; }
        body { margin: 0; }
        ::-webkit-scrollbar{width:6px}
        ::-webkit-scrollbar-track{background:#050810}
        ::-webkit-scrollbar-thumb{background:#3a3f50;border-radius:3px}
      `}</style>
    </div>
  );
}

/* ── STATIC SUB-COMPONENTS ── */

function GridOverlay() {
  return (
    <div style={{
      position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0,
      backgroundImage: "linear-gradient(rgba(0,229,255,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(0,229,255,0.03) 1px,transparent 1px)",
      backgroundSize: "60px 60px",
    }} />
  );
}

function Orbs() {
  return (
    <>
      <div style={{ position:"fixed", width:500, height:500, borderRadius:"50%", background:"rgba(0,229,255,0.06)", filter:"blur(120px)", top:-100, left:-100, pointerEvents:"none", zIndex:0 }} />
      <div style={{ position:"fixed", width:400, height:400, borderRadius:"50%", background:"rgba(255,184,0,0.05)",  filter:"blur(120px)", bottom:100, right:-80, pointerEvents:"none", zIndex:0 }} />
      <div style={{ position:"fixed", width:300, height:300, borderRadius:"50%", background:"rgba(0,255,148,0.04)", filter:"blur(120px)", top:"50%", left:"40%", pointerEvents:"none", zIndex:0 }} />
    </>
  );
}

/* ── STYLES ── */
const styles = {
  page: {
    minHeight: "100vh",
    background: "#050810",
    color: "#e8eaf0",
    fontFamily: "'Syne', sans-serif",
    position: "relative",
    overflowX: "hidden",
  },
  nav: {
    position: "sticky", top: 0, zIndex: 100,
    display: "flex", justifyContent: "space-between", alignItems: "center",
    padding: "16px 48px",
    background: "rgba(5,8,16,0.85)",
    backdropFilter: "blur(20px)",
    borderBottom: "1px solid rgba(255,255,255,0.07)",
  },
  navLogo: {
    display: "flex", alignItems: "center", gap: 10,
    fontFamily: "'Space Mono', monospace",
    fontSize: 15, fontWeight: 700, color: "#00e5ff", letterSpacing: "-0.5px",
  },
  xpPill: {
    fontFamily: "'Space Mono', monospace", fontSize: 12,
    padding: "6px 14px",
    background: "rgba(255,184,0,0.1)",
    border: "1px solid rgba(255,184,0,0.25)",
    borderRadius: 20, color: "#ffb800",
  },
  btnSignout: {
    fontFamily: "'Space Mono', monospace", fontSize: 11,
    padding: "7px 14px",
    background: "transparent",
    border: "1px solid rgba(255,69,102,0.4)",
    color: "#ff4566", borderRadius: 6,
    cursor: "pointer", letterSpacing: "0.5px", transition: "all 0.2s",
  },
  main: {
    position: "relative", zIndex: 1,
    maxWidth: 1280, margin: "0 auto",
    padding: "0 48px 80px",
  },
  hero: {
    padding: "64px 0 48px",
    display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 40,
    borderBottom: "1px solid rgba(255,255,255,0.07)",
    marginBottom: 48,
  },
  eyebrow: {
    fontFamily: "'Space Mono', monospace", fontSize: 11, color: "#00e5ff",
    letterSpacing: 3, textTransform: "uppercase",
    marginBottom: 20, display: "flex", alignItems: "center", gap: 10,
  },
  heroTitle: {
    fontSize: "clamp(52px, 7vw, 96px)", fontWeight: 800,
    lineHeight: 0.9, letterSpacing: -3, marginBottom: 24,
  },
  heroDesc: {
    fontSize: 15, color: "#5a6070", lineHeight: 1.7, maxWidth: 420, fontWeight: 400,
  },
  statRow: {
    display: "flex", justifyContent: "space-between", alignItems: "center",
    padding: "14px 20px",
    background: "#090d1a",
    border: "1px solid rgba(255,255,255,0.07)",
  },
  statLabel: {
    fontFamily: "'Space Mono', monospace", fontSize: 10,
    color: "#5a6070", textTransform: "uppercase", letterSpacing: 1,
  },
  statVal: {
    fontFamily: "'Space Mono', monospace", fontSize: 18, fontWeight: 700,
  },
  ticker: {
    padding: "14px 20px",
    background: "#090d1a",
    border: "1px solid rgba(255,255,255,0.07)",
    borderRadius: 8,
    display: "flex", alignItems: "center", gap: 12,
    overflow: "hidden", marginBottom: 24,
  },
  tickerLabel: {
    fontFamily: "'Space Mono', monospace", fontSize: 10, color: "#00e5ff",
    textTransform: "uppercase", letterSpacing: 1, flexShrink: 0,
  },
  tickerInner: {
    display: "flex", gap: 48, animation: "ticker 20s linear infinite", whiteSpace: "nowrap",
  },
  tickerItem: {
    fontFamily: "'Space Mono', monospace", fontSize: 11, color: "#5a6070",
    display: "flex", alignItems: "center", gap: 6, flexShrink: 0,
  },
  contentGrid: {
    display: "grid", gridTemplateColumns: "1fr 380px", gap: 24, alignItems: "start",
  },
  card: {
    background: "#090d1a",
    border: "1px solid rgba(255,255,255,0.07)",
    borderRadius: 12, overflow: "hidden",
  },
  cardHeader: {
    padding: "20px 24px",
    borderBottom: "1px solid rgba(255,255,255,0.07)",
    display: "flex", alignItems: "center", justifyContent: "space-between",
  },
  cardTitle: {
    fontFamily: "'Space Mono', monospace", fontSize: 10,
    color: "#5a6070", textTransform: "uppercase", letterSpacing: 2,
  },
  badgeLive: {
    fontFamily: "'Space Mono', monospace", fontSize: 10,
    padding: "3px 10px", borderRadius: 20,
    color: "#00ff94",
    border: "1px solid rgba(0,255,148,0.3)",
    background: "rgba(0,255,148,0.06)",
  },
  fieldLabel: {
    fontFamily: "'Space Mono', monospace", fontSize: 10, color: "#5a6070",
    textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: 10, display: "block",
  },
  startBtn: {
    width: "100%", padding: 18, marginTop: 8,
    background: "#00e5ff", color: "#050810",
    border: "none", borderRadius: 8,
    fontFamily: "'Space Mono', monospace", fontSize: 13, fontWeight: 700,
    letterSpacing: 1, cursor: "pointer",
    textTransform: "uppercase", transition: "all 0.2s",
  },
  signinWrap: {
    minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
    position: "relative", zIndex: 1,
  },
  signinCard: {
    width: "100%", maxWidth: 420, padding: "56px 48px",
    background: "#090d1a",
    border: "1px solid rgba(255,255,255,0.15)",
    borderRadius: 16, textAlign: "center", position: "relative", overflow: "hidden",
  },
  signinLogo: {
    fontFamily: "'Space Mono', monospace", fontSize: 13, color: "#00e5ff",
    letterSpacing: 2, marginBottom: 32,
    display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
  },
  signinTitle: {
    fontSize: 36, fontWeight: 800, letterSpacing: -1.5, marginBottom: 10,
  },
  signinSub: {
    fontSize: 14, color: "#5a6070", marginBottom: 40, lineHeight: 1.6,
  },
  signinBtn: {
    width: "100%", padding: 16,
    background: "transparent",
    border: "1px solid rgba(255,255,255,0.15)",
    borderRadius: 10, color: "#e8eaf0",
    fontFamily: "'Syne', sans-serif", fontSize: 14, fontWeight: 600,
    cursor: "pointer",
    display: "flex", alignItems: "center", justifyContent: "center", gap: 12,
    transition: "all 0.2s",
  },
  signinFooter: {
    marginTop: 24, fontFamily: "'Space Mono', monospace", fontSize: 10, color: "#3a3f50",
  },
  skel: {
    background: "rgba(255,255,255,0.05)",
    animation: "pulse 1.5s ease-in-out infinite",
  },
};