"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Swal from "sweetalert2";
import Link from "next/link";
import { T, DIFF, LANG } from "../lib/design-tokens";

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

const fetchLiveEvents = async () => {
  try {
    const response = await fetch("/api/live-events");
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching live events:", error);
    return [];
  }
};

// Live events are now fetched from the API in real-time

export default function Home() {
  const { data: session, status } = useSession();
  const [leaderboard, setLeaderboard]   = useState([]);
  const [liveEvents, setLiveEvents]     = useState([]);
  const [difficulty, setDifficulty]     = useState("Easy");
  const [language, setLanguage]         = useState("python");
  const [starting, setStarting]         = useState(false);
  const [lbTab, setLbTab]               = useState("board"); // "board" | "feed"
  const [xpAnim, setXpAnim]             = useState(false);
  const router = useRouter();

  const Toast = Swal.mixin({
    toast: true, position: "top-end", showConfirmButton: false,
    timer: 3000, timerProgressBar: true,
    didOpen: t => { t.onmouseenter = Swal.stopTimer; t.onmouseleave = Swal.resumeTimer; },
  });

  useEffect(() => {
    fetchLeaderboard().then(setLeaderboard);
    fetchLiveEvents().then(setLiveEvents);

    const interval = setInterval(() => {
      fetchLiveEvents().then(setLiveEvents);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const startChallenge = () => {
    setStarting(true);
    router.push(`/question?difficulty=${difficulty}&language=${language}`);
  };

  // ── LOADING ────────────────────────────────────
  if (status === "loading") {
    return (
      <div className="page">
        <Mesh /><Noise />
        <NavBar skeleton />
        <main className="main">
          <div className="hero-section" style={{ marginBottom:56 }}>
            <div className="flex-1">
              {[200,280,180].map((w,i) => <div key={i} className="skeleton" style={{ width:w, height: i===1?60:14, borderRadius:6, marginBottom:16 }} />)}
            </div>
            <div className="flex gap-3">
              {[1,2].map(i => <div key={i} className="skeleton" style={{ width:120, height:80, borderRadius:12 }} />)}
            </div>
          </div>
          <div className="content-grid">
            <div className="skeleton" style={{ height:380, borderRadius:20 }} />
            <div className="skeleton" style={{ height:520, borderRadius:20 }} />
          </div>
        </main>
        <Fonts />
      </div>
    );
  }

  // ── SIGN IN ─────────────────────────────────────
  if (status === "unauthenticated") {
    return (
      <div className="page">
        <Mesh /><Noise />
        <div className="signin-wrap">
          <div className="signin-card">
            <div className="signin-glow" />

            <div className="signin-logo">
              <span className="nav-logo-dot" />
              <span className="text-mono text-xs text-accent-hi" style={{ letterSpacing:1 }}>CODE RUNNER</span>
            </div>

            <h1 className="signin-title">
              Ship code.<br /><span className="text-accent">Earn glory.</span>
            </h1>
            <p className="signin-sub">
              AI-generated challenges, real-time rankings, infinite problems.
            </p>

            <button
              className="signin-btn"
              onMouseEnter={e => { e.currentTarget.style.borderColor = T.accent; e.currentTarget.style.background = T.accentLo; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = T.borderHi; e.currentTarget.style.background = "transparent"; }}
              onClick={() => { Toast.fire({ icon:"success", title:"Signing in..." }); signIn("google"); }}
            >
              <span className="google-icon">G</span>
              Continue with Google
            </button>

            <p className="signin-footer">
              Progress saved automatically
            </p>
          </div>
        </div>
        <Fonts />
      </div>
    );
  }

  // ── AUTHENTICATED ───────────────────────────────
  const userXp    = session.user.xp || 0;
  const userRank  = leaderboard.findIndex(u => u.name === session.user.name) + 1;
  const activeDiff = DIFF[difficulty];
  const maxXp     = leaderboard[0]?.xp || 1;

  return (
    <div className="page">
      <Mesh /><Noise />

      {/* ── NAV ── */}
      <NavBar session={session} userXp={userXp} signOut={signOut} xpAnim={xpAnim} />

      <main className="main">

          ── HERO ──
        <section className="hero-section">
          <div className="hero-content" style={{ textAlign: "left" }}>
            <div className="eyebrow">
              <span className="eyebrow-dot" />
              <span className="text-mono text-xs" style={{ letterSpacing:1.5, textTransform:"uppercase" }}>AI-Powered · Always Unique</span>
            </div>

            <h1 className="hero-title">
              <span style={{ display: "block" }}>Code.</span>
              <span style={{ display: "block", background:`linear-gradient(135deg, ${T.accent}, ${T.accentHi})`, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>Compete.</span>
              <span style={{ display: "block", color:"transparent", WebkitTextStroke:`1px ${T.muted2}` }}>Conquer.</span>
            </h1>
            <p className="hero-desc">
              Infinite AI-generated problems. Every challenge is unique. Climb the global rankings.
            </p>
          </div>

          {/* Hero stat cards */}
          <div className="hero-stats">
            {[
              { label:"Your XP",  val: userXp,                              color: T.amber,  icon:"⚡" },
              { label:"Rank",     val: userRank > 0 ? `#${userRank}` : "—", color: T.accent, icon:"🏆" },
            ].map(({ label, val, color, icon }) => (
              <div key={label} className="stat-card">
                <div className="stat-card-top" style={{ background:`linear-gradient(90deg,transparent,${color},transparent)` }} />
                <div className="stat-card-icon">{icon}</div>
                <div className="stat-card-value" style={{ color }}>{val}</div>
                <div className="stat-card-label">{label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── DIVIDER ── */}
        <div className="section-divider" />

        {/* ── MAIN GRID ── */}
        <div className="content-grid">

          {/* ══════════════════════════════
              CHALLENGE CARD
          ══════════════════════════════ */}
          <div className="challenge-card" style={{ marginBottom: 40 }}>
            {/* Ambient glow reacting to difficulty */}
            <div className="challenge-glow" style={{ background: `radial-gradient(ellipse at top, ${activeDiff.lo} 0%, transparent 50%)`, transition: "background 0.4s" }} />

            {/* Color stripe top */}
            <div className="challenge-stripe" style={{ background: activeDiff.color, transition: "background 0.4s" }} />

            {/* Card top bar */}
            <div className="card-header">
              <span className="card-title">New Challenge</span>
              <div className="badge badge-live">
                <span style={{ width:5, height:5, borderRadius:"50%", background:T.green, boxShadow:`0 0 6px ${T.green}`, display:"inline-block", animation:"blink 2s ease-in-out infinite" }} />
                <span className="text-mono text-xs">AI Ready</span>
              </div>
            </div>

            <div className="challenge-content">

              {/* DIFFICULTY */}
              <div className="difficulty-section">
                <div className="flex justify-between items-center" style={{ marginBottom:12 }}>
                  <span className="field-label">Difficulty</span>
                  <span className="text-mono text-sm" style={{ color: activeDiff.color, transition:"color 0.4s" }}>
                    +{activeDiff.xp} XP on solve
                  </span>
                </div>

                <div className="difficulty-grid">
                  {Object.entries(DIFF).map(([key, cfg]) => {
                    const active = difficulty === key;
                    return (
                      <button key={key} onClick={() => setDifficulty(key)} className={`difficulty-btn ${active ? 'active' : ''}`}>
                        {active && <div className="difficulty-active-bar" style={{ background:cfg.color, boxShadow:`0 0 10px ${cfg.color}` }} />}
                        <div className="difficulty-name" style={{ color: active ? cfg.color : T.muted, transition:"color 0.2s" }}>{key}</div>
                        <div className="difficulty-xp" style={{ color: active ? cfg.color : T.muted2, opacity: active?0.8:1, transition:"all 0.2s" }}>{cfg.xp} XP</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* LANGUAGE */}
              <div className="language-section">
                <span className="field-label">Language</span>
                <div className="language-grid">
                  {Object.entries(LANG).map(([key, cfg]) => {
                    const active = language === key;
                    return (
                      <button key={key} onClick={() => setLanguage(key)} className={`language-btn ${active ? 'active' : ''}`}>
                        <span className="language-emoji" style={{ filter: active ? "none" : "grayscale(0.3)" }}>{cfg.emoji}</span>
                        <span>
                          <span className="language-name" style={{ color: active ? T.accentHi : T.text, transition:"color 0.2s" }}>{cfg.name}</span>
                          <span className="language-sub" style={{ color: active ? T.accent : T.muted, marginTop:2, display:"block" }}>{cfg.sub}</span>
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* START BUTTON */}
              <button
                onClick={startChallenge}
                disabled={starting}
                className={`start-btn ${starting ? 'disabled' : ''}`}
                onMouseEnter={e => { if(!starting){ e.currentTarget.style.transform="translateY(-2px)"; e.currentTarget.style.boxShadow=`0 0 60px ${T.accentGlow}, 0 8px 30px rgba(124,58,237,0.5)`; }}}
                onMouseLeave={e => { e.currentTarget.style.transform="none"; e.currentTarget.style.boxShadow=starting?"none":`0 0 40px ${T.accentLo}, 0 4px 20px rgba(124,58,237,0.4)`; }}
              >
                {starting
                  ? <><Spinner color={T.accent} />Generating your challenge...</>
                  : <>⚡ Start Challenge — {activeDiff.xp} XP</>
                }
              </button>

              {/* Reassurance line */}
              <p className="challenge-reassurance">
                AI generates a unique problem every time
              </p>
            </div>
          </div>

          {/* ══════════════════════════════
              LEADERBOARD
          ══════════════════════════════ */}
          <div className="leaderboard-card" style={{ marginBottom: 40 }}>

            {/* Amber top stripe */}
            <div className="leaderboard-stripe" />

            {/* Tab bar */}
            <div className="tab-bar">
              <div className="tab-buttons">
                {[["board","Rankings"],["feed","Live Feed"]].map(([id,label]) => (
                  <button key={id} onClick={() => setLbTab(id)} className={`tab-btn ${lbTab===id ? 'active' : ''}`}>{label}</button>
                ))}
              </div>
              <div className="live-indicator">
                <span className="live-dot" />
                <span className="live-text">live</span>
              </div>
            </div>

            {/* ── RANKINGS TAB ── */}
            {lbTab === "board" && (
              <div>
                {/* Top 3 Podium */}
                {leaderboard.length >= 3 && (
                  <div className="podium">
                    <div className="podium-grid">
                      {[1,0,2].map((rankIdx, colIdx) => {
                        const u = leaderboard[rankIdx];
                        if (!u) return <div key={colIdx} />;
                        const isMe = u.email === session.user.email;
                        const cfg = [
                          { size:40, barH:36, medal:"🥈", color:"#94a3b8", label:null },
                          { size:52, barH:60, medal:"🥇", color:T.amber,   label:"Champion" },
                          { size:36, barH:24, medal:"🥉", color:"#b45309", label:null },
                        ][colIdx];
                        return (
                          <div key={colIdx} className="podium-item">
                            {cfg.label && <div className="text-mono text-xs" style={{ color:cfg.color, letterSpacing:2, textTransform:"uppercase", marginBottom:6 }}>{cfg.label}</div>}
                            <div className="podium-avatar" style={{ width:cfg.size, height:cfg.size, borderColor:cfg.color, boxShadow:`0 0 16px ${cfg.color}55` }}>
                              {u.image
                                ? <Image src={u.image} alt={u.name} width={cfg.size} height={cfg.size} style={{ objectFit:"cover" }} />
                                : <div style={{ width:"100%", height:"100%", background:T.surface2, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:T.display, fontWeight:700, color:T.text, fontSize:cfg.size*0.36 }}>{u.name?.[0]}</div>
                              }
                            </div>
                            <div style={{ fontSize: colIdx===1?18:15, marginBottom:3 }}>{cfg.medal}</div>
                            <div className={`podium-name ${colIdx===1 ? 'gold' : colIdx===0 ? 'silver' : 'bronze'}`}>
                              {isMe ? "You" : u.name?.split(" ")[0]}
                            </div>
                            <div className="podium-xp">{u.xp} XP</div>
                            <div className={`podium-bar ${colIdx===1 ? 'gold' : colIdx===0 ? 'silver' : 'bronze'}`} style={{ height:cfg.barH }} />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Ranks 4-10 */}
                <div>
                  {leaderboard.slice(leaderboard.length >= 3 ? 3 : 0, 10).map((user, idx) => {
                    const i = leaderboard.length >= 3 ? idx + 3 : idx;
                    const isMe = user.email === session.user.email;
                    const pct = Math.round((user.xp / maxXp) * 100);
                    return (
                      <div key={user._id || i} className={`rank-item ${isMe ? 'me' : ''}`}>
                        {/* XP bar fill */}
                        <div className={`rank-xp-bar ${isMe ? 'me' : ''}`} style={{ width:`${pct*0.55}%` }}>
                          <div className="rank-xp-fill" style={{ width:`${Math.min(100, (user.xp / (user.xp + 100)) * 100)}%` }}></div>
                        </div>

                        <span className="rank-number">{i+1}</span>

                        <div className="rank-avatar">
                          {user.image
                            ? <Image src={user.image} alt={user.name} width={26} height={26} style={{ objectFit:"cover" }} />
                            : <span className="text-display font-bold text-xs" style={{ color:T.text }}>{user.name?.[0]}</span>
                          }
                        </div>

                        <span className={`rank-name ${isMe ? 'me' : ''}`}>
                          {isMe ? "You ←" : user.name?.split(" ")[0]}
                        </span>
                        <span className="rank-xp">{user.xp}</span>
                      </div>
                    );
                  })}

                  {leaderboard.length === 0 && (
                    <div style={{ padding:"40px 20px", textAlign:"center", fontFamily:T.mono, fontSize:11, color:T.muted }}>
                      No players yet — be the first!
                    </div>
                  )}
                </div>

                {/* Your position if outside top 10 */}
                {userRank > 10 && (
                  <div className="user-rank-outside">
                    <span className="rank-number">#{userRank}</span>
                    <div className="rank-avatar">
                      {session.user.image ? <Image src={session.user.image} alt="you" width={26} height={26} style={{ objectFit:"cover" }} /> : <span className="text-display font-bold text-xs" style={{ color:T.accentHi }}>{session.user.name?.[0]}</span>}
                    </div>
                    <span className="rank-name me">You</span>
                    <span className="rank-xp">{userXp}</span>
                  </div>
                )}

                {/* Footer */}
                <div className="leaderboard-footer">
                  <span className="text-mono text-xs" style={{ color:T.muted2 }}>coders globally</span>
                  <span className="text-mono text-xs" style={{ color:T.muted2 }}>updates live</span>
                </div>
              </div>
            )}

            {/* ── LIVE FEED TAB ── */}
            {lbTab === "feed" && (
              <div>
                <div className="live-feed-container">
                  {liveEvents.map((ev, i) => (
                    <div key={i} className="live-feed-item">
                      <div className={`live-feed-icon ${ev.type}`}>
                        {ev.type==="solve" ? "⚡" : ev.type==="rank" ? "📈" : "ℹ️"}
                      </div>
                      <div className="live-feed-content">
                        {ev.type === "info" ? (
                          <div className="text-mono text-xs" style={{ color:T.muted, textAlign:"center" }}>
                            {ev.message}
                          </div>
                        ) : (
                          <>
                            <div className="live-feed-title">
                              <span style={{ color: T.accentHi }}>{ev.user}</span>
                              {ev.type==="solve"
                                ? <> solved a <span style={{ color: DIFF[ev.diff]?.color }}>{ev.diff}</span> challenge</>
                                : <> climbed the rankings</>
                              }
                            </div>
                            <div className="live-feed-meta">
                              {ev.xp && <span className="xp-badge">+{ev.xp} XP</span>}
                              <span className="text-mono text-xs" style={{ color:T.muted }}>{ev.time}</span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="live-feed-footer">
                  <span className="text-mono text-xs" style={{ color:T.muted2 }}>
                    {liveEvents.length > 0 && liveEvents[0].type !== 'info' ? 'Live activity from the last 24 hours' : 'Real-time coding activity'}
                  </span>
                </div>
              </div>
            )}
          </div>

        </div>
      </main>

      <Fonts />
      <style>{`
        @keyframes blink  { 0%,100%{opacity:1} 50%{opacity:0.3} }
        @keyframes spin   { to{transform:rotate(360deg)} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
      `}</style>
    </div>
  );
}

// ── SUB-COMPONENTS ──────────────────────────────

function NavBar({ skeleton, session, userXp, signOut: doSignOut, xpAnim }) {
  const sk = {
    background:'rgba(255,255,255,0.05)',
    animation:'pulse 1.5s ease-in-out infinite',
  };
  return (
    <nav style={{
      position:"sticky", top:0, zIndex:100,
      display:"flex", justifyContent:"space-between", alignItems:"center",
      padding:"14px 48px",
      background:"rgba(12,14,20,0.8)",
      backdropFilter:"blur(24px)",
      borderBottom:`1px solid ${T.border}`,
    }}>
      <div style={{ display:"flex", alignItems:"center", gap:10, fontFamily:T.display, fontSize:16, fontWeight:800, color:T.text, letterSpacing:-0.5 }}>
        <div style={{ width:28, height:28, borderRadius:8, background:`linear-gradient(135deg,${T.accent},#6d28d9)`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, boxShadow:`0 0 14px ${T.accentLo}` }}>⚡</div>
        CodeRunner
      </div>

      {skeleton ? (
        <div style={{ display:"flex", gap:10 }}>
          <div style={{ ...sk, width:80, height:28, borderRadius:20 }} />
          <div style={{ ...sk, width:36, height:36, borderRadius:"50%" }} />
        </div>
      ) : (
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          {/* XP pill */}
          <div style={{
            fontFamily:T.mono, fontSize:12, padding:"6px 14px",
            background:T.amberLo, border:`1px solid rgba(245,158,11,0.3)`,
            borderRadius:20, color:T.amber,
            transition:"all 0.3s",
            boxShadow: xpAnim ? `0 0 20px ${T.amber}` : "none",
          }}>
            ⚡ {userXp} XP
          </div>

          {/* Avatar */}
          <Link href="/profile" style={{ textDecoration:"none" }}>
            <div style={{ width:36, height:36, borderRadius:"50%", background:`linear-gradient(135deg,${T.accent},${T.green})`, padding:2, cursor:"pointer" }}>
              <div style={{ width:"100%", height:"100%", borderRadius:"50%", background:T.surface, overflow:"hidden", display:"flex", alignItems:"center", justifyContent:"center" }}>
                {session?.user?.image
                  ? <Image src={session.user.image} alt="avatar" width={32} height={32} style={{ borderRadius:"50%", objectFit:"cover" }} />
                  : <span style={{ fontFamily:T.display, fontSize:13, fontWeight:700, color:T.text }}>{session?.user?.name?.[0]}</span>
                }
              </div>
            </div>
          </Link>

          {/* Sign out */}
          <button
            onClick={doSignOut}
            style={{
              fontFamily:T.mono, fontSize:11, padding:"6px 14px",
              background:"transparent", border:`1px solid rgba(239,68,68,0.3)`,
              color:T.red, borderRadius:8, cursor:"pointer",
              transition:"all 0.2s", letterSpacing:0.5,
            }}
            onMouseEnter={e => { e.currentTarget.style.background="rgba(239,68,68,0.1)"; e.currentTarget.style.borderColor=T.red; }}
            onMouseLeave={e => { e.currentTarget.style.background="transparent"; e.currentTarget.style.borderColor="rgba(239,68,68,0.3)"; }}
          >Sign out</button>
        </div>
      )}
    </nav>
  );
}

function Spinner({ color }) {
  return <span style={{ width:14, height:14, border:`2px solid ${color}44`, borderTopColor:color, borderRadius:"50%", animation:"spin 0.7s linear infinite", display:"inline-block", flexShrink:0 }} />;
}

function Mesh() {
  return (
    <>
      <div style={{ position:"fixed", inset:0, pointerEvents:"none", zIndex:0,
        backgroundImage:`linear-gradient(${T.border} 1px, transparent 1px), linear-gradient(90deg, ${T.border} 1px, transparent 1px)`,
        backgroundSize:"72px 72px" }} />
      {/* Radial vignette */}
      <div style={{ position:"fixed", inset:0, pointerEvents:"none", zIndex:0,
        background:"radial-gradient(ellipse at 50% 0%, rgba(124,58,237,0.08) 0%, transparent 60%)" }} />
      <div style={{ position:"fixed", width:600, height:600, borderRadius:"50%", background:"rgba(124,58,237,0.05)", filter:"blur(140px)", top:-150, left:-100, pointerEvents:"none", zIndex:0 }} />
      <div style={{ position:"fixed", width:400, height:400, borderRadius:"50%", background:"rgba(245,158,11,0.04)", filter:"blur(120px)", bottom:80, right:-60, pointerEvents:"none", zIndex:0 }} />
    </>
  );
}

function Noise() {
  // SVG grain overlay for texture depth
  return (
    <div style={{
      position:"fixed", inset:0, pointerEvents:"none", zIndex:1, opacity:0.025,
      backgroundImage:`url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
      backgroundRepeat:"repeat", backgroundSize:"128px 128px",
    }} />
  );
}

function Fonts() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=DM+Sans:wght@400;500;600;700;800&display=swap');
      * { box-sizing: border-box; }
      body { margin: 0; background: ${T.bg}; }
      ::-webkit-scrollbar { width: 5px; }
      ::-webkit-scrollbar-track { background: ${T.bg}; }
      ::-webkit-scrollbar-thumb { background: ${T.muted2}; border-radius: 3px; }
    `}</style>
  );
}