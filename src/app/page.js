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
    Easy:    { xp: "5–20 XP" },
    Hard:    { xp: "21–60 XP" },
    Extreme: { xp: "61–110 XP" },
  };

  const LANG_CONFIG = {
    python:     { icon: "🐍", label: "Python",     tag: "Stable" },
    javascript: { icon: "⚡", label: "JavaScript",  tag: "Beta"   },
  };

  /* ── LOADING SKELETON ── */
  if (status === "loading") {
    return (
      <div className="page">
        <GridOverlay />
        <Orbs />

        <nav className="nav">
          <div className="skel" style={{ width: 160, height: 20, borderRadius: 4 }} />
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <div className="skel" style={{ width: 80, height: 28, borderRadius: 20 }} />
            <div className="skel" style={{ width: 38, height: 38, borderRadius: "50%" }} />
            <div className="skel" style={{ width: 72, height: 32, borderRadius: 6 }} />
          </div>
        </nav>

        <main className="main">
          <div className="hero" style={{ borderBottom: "1px solid rgba(255,255,255,0.07)", marginBottom: 48 }}>
            <div>
              <div className="skel" style={{ width: 180, height: 12, borderRadius: 4, marginBottom: 20 }} />
              <div className="skel" style={{ width: 320, height: 72, borderRadius: 6, marginBottom: 12 }} />
              <div className="skel" style={{ width: 280, height: 72, borderRadius: 6, marginBottom: 20 }} />
              <div className="skel" style={{ width: 380, height: 16, borderRadius: 4 }} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 1, minWidth: 200 }}>
              {[1, 2, 3].map((i) => (
                <div key={i} className="skel" style={{ height: 56, borderRadius: i === 1 ? "8px 8px 0 0" : i === 3 ? "0 0 8px 8px" : 0 }} />
              ))}
            </div>
          </div>

          <div className="skel" style={{ height: 48, borderRadius: 8, marginBottom: 24 }} />

          <div className="content-grid">
            <div>
              <div className="skel" style={{ height: 320, borderRadius: 12, marginBottom: 24 }} />
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12 }}>
                {[1, 2, 3].map((i) => (
                  <div key={i} className="skel" style={{ height: 100, borderRadius: 10 }} />
                ))}
              </div>
            </div>
            <div className="skel" style={{ height: 500, borderRadius: 12 }} />
          </div>
        </main>
      </div>
    );
  }

  /* ── SIGN IN ── */
  if (status === "unauthenticated") {
    return (
      <div className="page">
        <GridOverlay />
        <Orbs />
        <div className="signin-wrap">
          <div className="signin-card">
            <div style={{
              position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)",
              width: 200, height: 1,
              background: "linear-gradient(90deg, transparent, #00e5ff, transparent)",
            }} />

            <div className="signin-logo">
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#00e5ff", boxShadow: "0 0 12px #00e5ff" }} />
              CODE_RUNNER
            </div>

            <h1 className="signin-title">Welcome<span style={{ color: "#00e5ff" }}>.</span></h1>
            <p className="signin-sub">Sign in to solve AI-generated challenges and climb the leaderboard.</p>

            <button
              className="signin-btn"
              onClick={() => {
                Toast.fire({ icon: "success", title: "Signing In..." });
                signIn("google");
              }}
            >
              <span style={{ width: 18, height: 18, background: "white", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 900, color: "#4285f4" }}>
                G
              </span>
              Continue with Google
            </button>

            <p className="signin-footer">Your progress is saved automatically</p>
          </div>
        </div>
      </div>
    );
  }

  /* ── AUTHENTICATED HOME ── */
  const userXp = session.user.xp || 0;
  const userRank = leaderboard.findIndex((u) => u.name === session.user.name) + 1;

  const tickerItems = [
    "Solve problems, earn XP",
    "AI generates a new challenge every time",
    "Compete on the global leaderboard",
    "Python & JavaScript supported",
    "Easy → Hard → Extreme difficulty",
  ];

  return (
    <div className="page">
      <GridOverlay />
      <Orbs />

      {/* NAV */}
      <nav className="nav">
        <div className="nav-logo">
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#00e5ff", boxShadow: "0 0 12px #00e5ff", animation: "pulse 2s ease-in-out infinite" }} />
          <span><span style={{ color: "#5a6070" }}>{"{ > }"}</span> code_runner</span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span className="xp-pill">⚡ {userXp} XP</span>

          <a href="/profile" style={{ textDecoration: "none" }}>
            <div style={{ width: 38, height: 38, borderRadius: "50%", background: "linear-gradient(135deg,#00e5ff,#00ff94)", padding: 2, cursor: "pointer" }}>
              <div style={{ width: "100%", height: "100%", borderRadius: "50%", background: "#090d1a", overflow: "hidden" }}>
                {session.user.image ? (
                  <Image src={session.user.image} alt="avatar" width={34} height={34} style={{ borderRadius: "50%" }} />
                ) : (
                  <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color: "#e8eaf0" }}>
                    {session.user.name?.[0]}
                  </div>
                )}
              </div>
            </div>
          </a>

          <button className="btn-signout" onClick={() => signOut()}>
            sign out
          </button>
        </div>
      </nav>

      <main className="main">
        {/* HERO */}
        <section className="hero">
          <div style={{ flex: 1 }}>
            <div className="eyebrow">
              <span style={{ width: 24, height: 1, background: "#00e5ff", display: "inline-block" }} />
              AI-Powered Challenges
            </div>
            <h1 className="hero-title">
              <span style={{ display: "block", color: "#e8eaf0" }}>CODE.</span>
              <span style={{ display: "block", color: "transparent", WebkitTextStroke: "1.5px rgba(255,255,255,0.2)" }}>
                COMPETE.<span style={{ color: "#00e5ff", WebkitTextStroke: 0 }}>_</span>
              </span>
            </h1>
            <p className="hero-desc">Infinite AI-generated problems. Real-time leaderboard. No two challenges ever the same.</p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 1, minWidth: 200 }}>
            {[
              { label: "your xp", val: userXp, color: "#ffb800" },
              { label: "rank", val: userRank > 0 ? `#${userRank}` : "—", color: "#00e5ff" },
            ].map(({ label, val, color }, i) => (
              <div
                key={label}
                className="stat-row"
                style={{
                  borderRadius: i === 0 ? "8px 8px 0 0" : i === 1 ? "0 0 8px 8px" : 0,
                }}
              >
                <span className="stat-label">{label}</span>
                <span className="stat-val" style={{ color }}>
                  {val}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* TICKER */}
        <div className="ticker">
          <span className="ticker-label">Live</span>
          <div style={{ flex: 1, overflow: "hidden" }}>
            <div className="ticker-inner">
              {[...tickerItems, ...tickerItems].map((item, i) => (
                <span key={i} className="ticker-item">
                  <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#00ff94", display: "inline-block", flexShrink: 0 }} />
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* CONTENT GRID */}
        <div className="content-grid">
          {/* Challenge Card */}
          <div>
            <div className="card">
              <div className="card-header">
                <span className="card-title">New Challenge</span>
                <span className="badge-live">● AI Ready</span>
              </div>

              <div style={{ padding: "28px" }}>
                {/* Difficulty */}
                <div style={{ marginBottom: 20 }}>
                  <span className="field-label">Difficulty</span>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8 }}>
                    {Object.entries(DIFF_CONFIG).map(([key]) => (
                      <button
                        key={key}
                        onClick={() => setDifficulty(key)}
                        style={{
                          padding: "10px 8px",
                          borderRadius: 8,
                          cursor: "pointer",
                          textAlign: "center",
                          transition: "all 0.2s",
                          border: difficulty === key
                            ? key === "Easy" ? "1px solid #4ade80"
                            : key === "Hard" ? "1px solid #fbbf24"
                            : "1px solid #f87171"
                            : "1px solid rgba(255,255,255,0.07)",
                          backgroundColor: difficulty === key
                            ? key === "Easy" ? "rgba(74,222,128,0.07)"
                            : key === "Hard" ? "rgba(251,191,36,0.07)"
                            : "rgba(248,113,113,0.07)"
                            : "#0d1220",
                        }}
                      >
                        <span style={{ display: "block", fontFamily: "'Space Mono', monospace", fontSize: 11, fontWeight: 700, color: key === "Easy" ? "#4ade80" : key === "Hard" ? "#fbbf24" : "#f87171", marginBottom: 2 }}>
                          {key}
                        </span>
                        <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: "#5a6070" }}>{DIFF_CONFIG[key].xp}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Language */}
                <div style={{ marginBottom: 20 }}>
                  <span className="field-label">Language</span>
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
                        }}
                      >
                        <span style={{ fontSize: 20 }}>{cfg.icon}</span>
                        <span>
                          <span style={{ display: "block", fontFamily: "'Space Mono', monospace", fontSize: 11, fontWeight: 700, color: "#e8eaf0" }}>{cfg.label}</span>
                          <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: "#5a6070" }}>{cfg.tag}</span>
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Start Button */}
                <button
                  onClick={startChallenge}
                  disabled={starting}
                  className="start-btn"
                  style={{ opacity: starting ? 0.8 : 1 }}
                >
                  {starting ? "GENERATING..." : "START_CHALLENGE →"}
                </button>
              </div>
            </div>
          </div>

          {/* Leaderboard */}
          <div className="card" style={{ position: "sticky", top: 80 }}>
            <div className="card-header">
              <span className="card-title">Leaderboard</span>
              <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: "#5a6070" }}>
                Top {Math.min(leaderboard.length, 10)}
              </span>
            </div>

            <div>
              {leaderboard.slice(0, 10).map((user, i) => {
                const isMe = user.email === session.user.email;
                return (
                  <div
                    key={user._id || i}
                    style={{
                      padding: "14px 24px",
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      borderBottom: i < Math.min(leaderboard.length, 10) - 1 ? "1px solid rgba(255,255,255,0.07)" : "none",
                      background: isMe ? "rgba(0,229,255,0.06)" : "transparent",
                      borderLeft: isMe ? "2px solid #00e5ff" : "2px solid transparent",
                    }}
                  >
                    <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, width: 20, textAlign: "center", color: i < 3 ? ["#ffd700", "#c0c0c0", "#cd7f32"][i] : "#3a3f50" }}>
                      {RANK_MEDAL[i] ?? i + 1}
                    </span>

                    <div style={{ width: 30, height: 30, borderRadius: "50%", overflow: "hidden", background: "#0d1220" }}>
                      {user.image ? (
                        <Image src={user.image} alt={user.name} width={30} height={30} style={{ borderRadius: "50%", objectFit: "cover" }} />
                      ) : (
                        <span style={{ color: "#e8eaf0", fontWeight: 700 }}>{user.name?.[0]}</span>
                      )}
                    </div>

                    <span style={{ flex: 1, fontSize: 13, fontWeight: 500, color: isMe ? "#00e5ff" : "#e8eaf0", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {isMe ? "You" : user.name}
                    </span>

                    <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: "#ffb800" }}>{user.xp} XP</span>
                  </div>
                );
              })}

              {leaderboard.length === 0 && (
                <div style={{ padding: "32px 24px", textAlign: "center", fontFamily: "'Space Mono', monospace", fontSize: 11, color: "#5a6070" }}>
                  No data yet. Be the first!
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

/* Background Components */
function GridOverlay() {
  return (
    <div style={{
      position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0,
      backgroundImage: "linear-gradient(rgba(0,229,255,0.03) 1px,transparent 1px), linear-gradient(90deg,rgba(0,229,255,0.03) 1px,transparent 1px)",
      backgroundSize: "60px 60px",
    }} />
  );
}

function Orbs() {
  return (
    <>
      <div style={{ position: "fixed", width: 500, height: 500, borderRadius: "50%", background: "rgba(0,229,255,0.06)", filter: "blur(120px)", top: -100, left: -100, zIndex: 0 }} />
      <div style={{ position: "fixed", width: 400, height: 400, borderRadius: "50%", background: "rgba(255,184,0,0.05)", filter: "blur(120px)", bottom: 100, right: -80, zIndex: 0 }} />
      <div style={{ position: "fixed", width: 300, height: 300, borderRadius: "50%", background: "rgba(0,255,148,0.04)", filter: "blur(120px)", top: "50%", left: "40%", zIndex: 0 }} />
    </>
  );
}