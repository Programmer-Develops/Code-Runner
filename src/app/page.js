"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Swal from "sweetalert2";
import Link from "next/link";

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

// ── DESIGN TOKENS ──────────────────────────────
const T = {
  bg:        "#0c0e14",
  surface:   "#12151f",
  surface2:  "#181c28",
  border:    "rgba(255,255,255,0.07)",
  borderHi:  "rgba(255,255,255,0.14)",
  accent:    "#7c3aed",
  accentLo:  "rgba(124,58,237,0.15)",
  accentGlow:"rgba(124,58,237,0.35)",
  accentHi:  "#9f6ef5",
  green:     "#10b981",
  greenLo:   "rgba(16,185,129,0.12)",
  amber:     "#f59e0b",
  amberLo:   "rgba(245,158,11,0.12)",
  red:       "#ef4444",
  redLo:     "rgba(239,68,68,0.12)",
  text:      "#f1f5f9",
  muted:     "#64748b",
  muted2:    "#334155",
  mono:      "'DM Mono', 'Fira Code', monospace",
  display:   "'Cabinet Grotesk', 'DM Sans', sans-serif",
};

const DIFF = {
  Easy:    { color: T.green,  lo: T.greenLo, border: "rgba(16,185,129,0.3)",  xp: "5–20",   label: "Easy"    },
  Hard:    { color: T.amber,  lo: T.amberLo, border: "rgba(245,158,11,0.3)",  xp: "21–60",  label: "Hard"    },
  Extreme: { color: T.red,    lo: T.redLo,   border: "rgba(239,68,68,0.3)",   xp: "61–110", label: "Extreme" },
};

const LANG = {
  python:     { emoji: "🐍", name: "Python",     sub: "v3.10 · Stable" },
  javascript: { emoji: "⚡", name: "JavaScript",  sub: "Node 18 · Beta" },
};

// Mock live events for the feed (in real app, replace with WebSocket/polling)
const LIVE_EVENTS_MOCK = [
  { type: "solve", user: "Priya", diff: "Extreme", xp: 87,  time: "2m ago"  },
  { type: "solve", user: "Alex",  diff: "Hard",    xp: 45,  time: "5m ago"  },
  { type: "rank",  user: "Rahul",                           time: "8m ago"  },
  { type: "solve", user: "Kavya", diff: "Easy",    xp: 12,  time: "11m ago" },
  { type: "solve", user: "Dev",   diff: "Hard",    xp: 38,  time: "14m ago" },
];

export default function Home() {
  const { data: session, status } = useSession();
  const [leaderboard, setLeaderboard]   = useState([]);
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
  }, []);

  const startChallenge = () => {
    setStarting(true);
    router.push(`/question?difficulty=${difficulty}&language=${language}`);
  };

  // ── LOADING ────────────────────────────────────
  if (status === "loading") {
    return (
      <div style={pg}>
        <Mesh /><Noise />
        <NavBar skeleton />
        <main style={mainStyle}>
          <div style={{ ...heroWrap, borderBottom:`1px solid ${T.border}`, marginBottom:56 }}>
            <div style={{ flex:1 }}>
              {[200,280,180].map((w,i) => <div key={i} style={{ ...sk, width:w, height: i===1?60:14, borderRadius:6, marginBottom:16 }} />)}
            </div>
            <div style={{ display:"flex", gap:12 }}>
              {[1,2].map(i => <div key={i} style={{ ...sk, width:120, height:80, borderRadius:12 }} />)}
            </div>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 400px", gap:24 }}>
            <div style={{ ...sk, height:380, borderRadius:20 }} />
            <div style={{ ...sk, height:520, borderRadius:20 }} />
          </div>
        </main>
        <Fonts />
      </div>
    );
  }

  // ── SIGN IN ─────────────────────────────────────
  if (status === "unauthenticated") {
    return (
      <div style={pg}>
        <Mesh /><Noise />
        <div style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", position:"relative", zIndex:1 }}>
          <div style={{
            width:"100%", maxWidth:440, padding:"60px 52px",
            background: T.surface,
            border: `1px solid ${T.borderHi}`,
            borderRadius:24, textAlign:"center", position:"relative",
          }}>
            {/* Top shimmer */}
            <div style={{ position:"absolute", top:0, left:"10%", right:"10%", height:1, background:`linear-gradient(90deg,transparent,${T.accent},transparent)` }} />

            <div style={{ display:"inline-flex", alignItems:"center", gap:8, padding:"5px 14px", borderRadius:20, background:T.accentLo, border:`1px solid ${T.accentGlow}`, marginBottom:28 }}>
              <span style={{ width:6, height:6, borderRadius:"50%", background:T.accent, boxShadow:`0 0 8px ${T.accent}`, display:"inline-block" }} />
              <span style={{ fontFamily:T.mono, fontSize:11, color:T.accentHi, letterSpacing:1 }}>CODE RUNNER</span>
            </div>

            <h1 style={{ fontSize:42, fontWeight:800, letterSpacing:-2, lineHeight:1, marginBottom:12, fontFamily:T.display }}>
              Ship code.<br /><span style={{ color:T.accent }}>Earn glory.</span>
            </h1>
            <p style={{ fontSize:15, color:T.muted, marginBottom:40, lineHeight:1.7 }}>
              AI-generated challenges, real-time rankings, infinite problems.
            </p>

            <button
              style={{
                width:"100%", padding:"15px 20px",
                background:"transparent",
                border:`1px solid ${T.borderHi}`,
                borderRadius:12, color:T.text,
                fontFamily:T.display, fontSize:15, fontWeight:600,
                cursor:"pointer",
                display:"flex", alignItems:"center", justifyContent:"center", gap:12,
                transition:"all 0.2s",
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = T.accent; e.currentTarget.style.background = T.accentLo; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = T.borderHi; e.currentTarget.style.background = "transparent"; }}
              onClick={() => { Toast.fire({ icon:"success", title:"Signing in..." }); signIn("google"); }}
            >
              <span style={{ width:20, height:20, background:"white", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, fontWeight:900, color:"#4285f4", flexShrink:0 }}>G</span>
              Continue with Google
            </button>

            <p style={{ marginTop:20, fontFamily:T.mono, fontSize:11, color:T.muted2 }}>Progress saved automatically</p>
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
    <div style={pg}>
      <Mesh /><Noise />

      {/* ── NAV ── */}
      <NavBar session={session} userXp={userXp} signOut={signOut} xpAnim={xpAnim} />

      <main style={mainStyle}>

        {/* ── HERO ── */}
        <section style={heroWrap}>
          <div style={{ flex:1 }}>
            <div style={{ display:"inline-flex", alignItems:"center", gap:8, padding:"4px 12px", borderRadius:20, background:T.accentLo, border:`1px solid rgba(124,58,237,0.25)`, marginBottom:20 }}>
              <span style={{ width:5, height:5, borderRadius:"50%", background:T.green, boxShadow:`0 0 6px ${T.green}`, display:"inline-block", animation:"blink 2s ease-in-out infinite" }} />
              <span style={{ fontFamily:T.mono, fontSize:10, color:T.accentHi, letterSpacing:1.5, textTransform:"uppercase" }}>AI-Powered · Always Unique</span>
            </div>

            <h1 style={{ fontSize:"clamp(48px,6vw,88px)", fontWeight:800, lineHeight:0.92, letterSpacing:-3, marginBottom:20, fontFamily:T.display }}>
              <span style={{ display:"block", color:T.text }}>Code.</span>
              <span style={{ display:"block", background:`linear-gradient(135deg, ${T.accent}, ${T.accentHi})`, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>Compete.</span>
              <span style={{ display:"block", color:"transparent", WebkitTextStroke:`1px ${T.muted2}` }}>Conquer.</span>
            </h1>
            <p style={{ fontSize:16, color:T.muted, lineHeight:1.75, maxWidth:400, fontFamily:T.display, fontWeight:400 }}>
              Infinite AI-generated problems. Every challenge is unique. Climb the global rankings.
            </p>
          </div>

          {/* Hero stat cards */}
          <div style={{ display:"flex", gap:12, alignItems:"stretch" }}>
            {[
              { label:"Your XP",  val: userXp,                              color: T.amber,  icon:"⚡" },
              { label:"Rank",     val: userRank > 0 ? `#${userRank}` : "—", color: T.accent, icon:"🏆" },
            ].map(({ label, val, color, icon }) => (
              <div key={label} style={{
                padding:"20px 24px", background:T.surface,
                border:`1px solid ${T.border}`, borderRadius:16,
                minWidth:120, textAlign:"center",
                position:"relative", overflow:"hidden",
              }}>
                <div style={{ position:"absolute", top:0, left:0, right:0, height:2, background:`linear-gradient(90deg,transparent,${color},transparent)` }} />
                <div style={{ fontSize:22, marginBottom:6 }}>{icon}</div>
                <div style={{ fontFamily:T.mono, fontSize:22, fontWeight:700, color, marginBottom:4, letterSpacing:-1 }}>{val}</div>
                <div style={{ fontFamily:T.mono, fontSize:10, color:T.muted, textTransform:"uppercase", letterSpacing:1 }}>{label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── DIVIDER ── */}
        <div style={{ height:1, background:`linear-gradient(90deg, ${T.accent}55, ${T.accentHi}22, transparent)`, margin:"0 0 40px" }} />

        {/* ── MAIN GRID ── */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 400px", gap:24, alignItems:"start" }}>

          {/* ══════════════════════════════
              CHALLENGE CARD
          ══════════════════════════════ */}
          <div style={{
            background: T.surface,
            border: `1px solid ${T.border}`,
            borderRadius: 20,
            overflow: "hidden",
            position: "relative",
          }}>
            {/* Ambient glow reacting to difficulty */}
            <div style={{
              position:"absolute", top:0, left:0, right:0, height:280,
              background:`radial-gradient(ellipse at 30% 0%, ${activeDiff.lo} 0%, transparent 65%)`,
              transition:"background 0.5s", pointerEvents:"none",
            }} />

            {/* Color stripe top */}
            <div style={{ height:3, background:`linear-gradient(90deg, ${activeDiff.color}, ${T.accent})`, transition:"background 0.5s" }} />

            {/* Card top bar */}
            <div style={{ padding:"18px 24px", borderBottom:`1px solid ${T.border}`, display:"flex", alignItems:"center", justifyContent:"space-between", position:"relative" }}>
              <span style={{ fontFamily:T.mono, fontSize:11, color:T.muted, textTransform:"uppercase", letterSpacing:2 }}>New Challenge</span>
              <div style={{ display:"flex", alignItems:"center", gap:6, padding:"4px 12px", borderRadius:20, background:T.greenLo, border:`1px solid rgba(16,185,129,0.25)` }}>
                <span style={{ width:5, height:5, borderRadius:"50%", background:T.green, boxShadow:`0 0 6px ${T.green}`, display:"inline-block", animation:"blink 2s ease-in-out infinite" }} />
                <span style={{ fontFamily:T.mono, fontSize:10, color:T.green }}>AI Ready</span>
              </div>
            </div>

            <div style={{ padding:"28px 24px", position:"relative" }}>

              {/* DIFFICULTY */}
              <div style={{ marginBottom:28 }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
                  <span style={{ fontFamily:T.mono, fontSize:10, color:T.muted, textTransform:"uppercase", letterSpacing:2 }}>Difficulty</span>
                  <span style={{ fontFamily:T.mono, fontSize:11, color:activeDiff.color, transition:"color 0.4s" }}>
                    +{activeDiff.xp} XP on solve
                  </span>
                </div>

                <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:8 }}>
                  {Object.entries(DIFF).map(([key, cfg]) => {
                    const active = difficulty === key;
                    return (
                      <button key={key} onClick={() => setDifficulty(key)} style={{
                        padding:"16px 8px", borderRadius:12,
                        cursor:"pointer", textAlign:"center",
                        transition:"all 0.25s",
                        border: `1px solid ${active ? cfg.border : T.border}`,
                        background: active ? cfg.lo : "rgba(255,255,255,0.02)",
                        boxShadow: active ? `0 0 24px ${cfg.lo}, inset 0 1px 0 rgba(255,255,255,0.06)` : "none",
                        transform: active ? "translateY(-2px)" : "none",
                        position:"relative", overflow:"hidden",
                      }}>
                        {active && <div style={{ position:"absolute", bottom:0, left:"15%", right:"15%", height:2, background:cfg.color, borderRadius:2, boxShadow:`0 0 10px ${cfg.color}` }} />}
                        <div style={{ fontFamily:T.display, fontSize:13, fontWeight:700, color: active ? cfg.color : T.muted, marginBottom:3, transition:"color 0.2s" }}>{key}</div>
                        <div style={{ fontFamily:T.mono, fontSize:10, color: active ? cfg.color : T.muted2, opacity: active?0.8:1, transition:"all 0.2s" }}>{cfg.xp} XP</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* LANGUAGE */}
              <div style={{ marginBottom:28 }}>
                <span style={{ fontFamily:T.mono, fontSize:10, color:T.muted, textTransform:"uppercase", letterSpacing:2, marginBottom:12, display:"block" }}>Language</span>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
                  {Object.entries(LANG).map(([key, cfg]) => {
                    const active = language === key;
                    return (
                      <button key={key} onClick={() => setLanguage(key)} style={{
                        padding:"16px", borderRadius:12,
                        background: active ? T.accentLo : "rgba(255,255,255,0.02)",
                        border: `1px solid ${active ? T.accent : T.border}`,
                        cursor:"pointer", display:"flex", alignItems:"center", gap:12,
                        transition:"all 0.2s",
                        boxShadow: active ? `0 0 20px ${T.accentLo}` : "none",
                        transform: active ? "translateY(-1px)" : "none",
                      }}>
                        <span style={{ fontSize:24, lineHeight:1, filter: active ? "none" : "grayscale(0.3)" }}>{cfg.emoji}</span>
                        <span style={{ textAlign:"left" }}>
                          <span style={{ display:"block", fontFamily:T.display, fontSize:13, fontWeight:700, color: active ? T.accentHi : T.text, transition:"color 0.2s" }}>{cfg.name}</span>
                          <span style={{ fontFamily:T.mono, fontSize:9, color: active ? T.accent : T.muted, marginTop:2, display:"block" }}>{cfg.sub}</span>
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
                style={{
                  width:"100%", padding:"18px",
                  background: starting
                    ? "transparent"
                    : `linear-gradient(135deg, ${T.accent}, #6d28d9)`,
                  color: starting ? T.accent : "#fff",
                  border: starting ? `1px solid ${T.accent}` : "none",
                  borderRadius:12,
                  fontFamily:T.display, fontSize:15, fontWeight:700,
                  cursor: starting ? "not-allowed" : "pointer",
                  transition:"all 0.25s",
                  display:"flex", alignItems:"center", justifyContent:"center", gap:10,
                  boxShadow: starting ? "none" : `0 0 40px ${T.accentLo}, 0 4px 20px rgba(124,58,237,0.4)`,
                  letterSpacing:0.5,
                }}
                onMouseEnter={e => { if(!starting){ e.currentTarget.style.transform="translateY(-2px)"; e.currentTarget.style.boxShadow=`0 0 60px ${T.accentGlow}, 0 8px 30px rgba(124,58,237,0.5)`; }}}
                onMouseLeave={e => { e.currentTarget.style.transform="none"; e.currentTarget.style.boxShadow=starting?"none":`0 0 40px ${T.accentLo}, 0 4px 20px rgba(124,58,237,0.4)`; }}
              >
                {starting
                  ? <><Spinner color={T.accent} />Generating your challenge...</>
                  : <>⚡ Start Challenge — {activeDiff.xp} XP</>
                }
              </button>

              {/* Reassurance line */}
              <p style={{ textAlign:"center", fontFamily:T.mono, fontSize:10, color:T.muted2, marginTop:10 }}>
                AI generates a unique problem every time
              </p>
            </div>
          </div>

          {/* ══════════════════════════════
              LEADERBOARD
          ══════════════════════════════ */}
          <div style={{ background:T.surface, border:`1px solid ${T.border}`, borderRadius:20, overflow:"hidden", position:"sticky", top:80 }}>

            {/* Amber top stripe */}
            <div style={{ height:3, background:`linear-gradient(90deg, ${T.amber}, ${T.accent})` }} />

            {/* Tab bar */}
            <div style={{ padding:"16px 20px", borderBottom:`1px solid ${T.border}`, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
              <div style={{ display:"flex", gap:4, background:T.surface2, borderRadius:10, padding:3 }}>
                {[["board","Rankings"],["feed","Live Feed"]].map(([id,label]) => (
                  <button key={id} onClick={() => setLbTab(id)} style={{
                    padding:"6px 14px", borderRadius:8,
                    background: lbTab===id ? T.accent : "transparent",
                    border:"none", color: lbTab===id ? "#fff" : T.muted,
                    fontFamily:T.mono, fontSize:10, cursor:"pointer",
                    transition:"all 0.2s", fontWeight: lbTab===id ? 700 : 400,
                    letterSpacing:0.5,
                  }}>{label}</button>
                ))}
              </div>
              <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                <span style={{ width:5, height:5, borderRadius:"50%", background:T.green, boxShadow:`0 0 6px ${T.green}`, display:"inline-block", animation:"blink 1.5s ease-in-out infinite" }} />
                <span style={{ fontFamily:T.mono, fontSize:10, color:T.green }}>live</span>
              </div>
            </div>

            {/* ── RANKINGS TAB ── */}
            {lbTab === "board" && (
              <div>
                {/* Top 3 Podium */}
                {leaderboard.length >= 3 && (
                  <div style={{ padding:"20px 16px 0", borderBottom:`1px solid ${T.border}` }}>
                    <div style={{ display:"grid", gridTemplateColumns:"1fr 1.25fr 1fr", gap:8, alignItems:"flex-end" }}>
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
                          <div key={colIdx} style={{ textAlign:"center" }}>
                            {cfg.label && <div style={{ fontFamily:T.mono, fontSize:9, color:cfg.color, letterSpacing:2, textTransform:"uppercase", marginBottom:6 }}>{cfg.label}</div>}
                            <div style={{ width:cfg.size, height:cfg.size, borderRadius:"50%", overflow:"hidden", margin:"0 auto 6px", border:`2px solid ${cfg.color}`, boxShadow:`0 0 16px ${cfg.color}55` }}>
                              {u.image
                                ? <Image src={u.image} alt={u.name} width={cfg.size} height={cfg.size} style={{ objectFit:"cover" }} />
                                : <div style={{ width:"100%", height:"100%", background:T.surface2, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:T.display, fontWeight:700, color:T.text, fontSize:cfg.size*0.36 }}>{u.name?.[0]}</div>
                              }
                            </div>
                            <div style={{ fontSize: colIdx===1?18:15, marginBottom:3 }}>{cfg.medal}</div>
                            <div style={{ fontFamily:T.display, fontSize:12, fontWeight:700, color: isMe ? T.accentHi : colIdx===1 ? T.amber : T.text, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis", maxWidth:"100%" }}>
                              {isMe ? "You" : u.name?.split(" ")[0]}
                            </div>
                            <div style={{ fontFamily:T.mono, fontSize:10, color:T.amber, marginTop:2 }}>{u.xp} XP</div>
                            <div style={{ height:cfg.barH, background:`${cfg.color}12`, borderTop:`1px solid ${cfg.color}30`, borderRadius:"4px 4px 0 0", marginTop:8 }} />
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
                      <div key={user._id || i} style={{
                        padding:"10px 18px",
                        display:"flex", alignItems:"center", gap:10,
                        borderBottom:`1px solid ${T.border}`,
                        background: isMe ? `${T.accent}0d` : "transparent",
                        borderLeft: isMe ? `2px solid ${T.accent}` : "2px solid transparent",
                        position:"relative", transition:"background 0.15s",
                      }}>
                        {/* XP bar fill */}
                        <div style={{ position:"absolute", left:0, top:0, bottom:0, width:`${pct*0.55}%`, background: isMe?`${T.accent}08`:`rgba(255,255,255,0.012)`, pointerEvents:"none" }} />

                        <span style={{ fontFamily:T.mono, fontSize:10, width:16, textAlign:"center", color:T.muted2, flexShrink:0 }}>{i+1}</span>

                        <div style={{ width:26, height:26, borderRadius:"50%", overflow:"hidden", flexShrink:0, background:T.surface2, border:`1px solid ${isMe ? T.accent+"55" : T.border}`, display:"flex", alignItems:"center", justifyContent:"center" }}>
                          {user.image
                            ? <Image src={user.image} alt={user.name} width={26} height={26} style={{ objectFit:"cover" }} />
                            : <span style={{ fontFamily:T.display, fontSize:10, fontWeight:700, color:T.text }}>{user.name?.[0]}</span>
                          }
                        </div>

                        <span style={{ flex:1, fontFamily:T.display, fontSize:13, fontWeight:500, color: isMe ? T.accentHi : T.text, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>
                          {isMe ? "You ←" : user.name?.split(" ")[0]}
                        </span>
                        <span style={{ fontFamily:T.mono, fontSize:10, color:T.amber, flexShrink:0 }}>{user.xp}</span>
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
                  <div style={{ padding:"10px 18px", borderTop:`1px solid ${T.border}`, background:`${T.accent}0d`, display:"flex", alignItems:"center", gap:10 }}>
                    <span style={{ fontFamily:T.mono, fontSize:10, color:T.muted2, width:16 }}>#{userRank}</span>
                    <div style={{ width:26, height:26, borderRadius:"50%", overflow:"hidden", background:T.surface2, border:`1px solid ${T.accent}55`, display:"flex", alignItems:"center", justifyContent:"center" }}>
                      {session.user.image ? <Image src={session.user.image} alt="you" width={26} height={26} style={{ objectFit:"cover" }} /> : <span style={{ fontFamily:T.display, fontSize:10, fontWeight:700, color:T.accentHi }}>{session.user.name?.[0]}</span>}
                    </div>
                    <span style={{ flex:1, fontFamily:T.display, fontSize:13, fontWeight:600, color:T.accentHi }}>You</span>
                    <span style={{ fontFamily:T.mono, fontSize:10, color:T.amber }}>{userXp}</span>
                  </div>
                )}

                {/* Footer */}
                <div style={{ padding:"12px 18px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                  <span style={{ fontFamily:T.mono, fontSize:10, color:T.muted2 }}>{leaderboard.length} coders globally</span>
                  <span style={{ fontFamily:T.mono, fontSize:10, color:T.muted2 }}>updates live</span>
                </div>
              </div>
            )}

            {/* ── LIVE FEED TAB ── */}
            {lbTab === "feed" && (
              <div>
                <div style={{ padding:"8px 0" }}>
                  {LIVE_EVENTS_MOCK.map((ev, i) => (
                    <div key={i} style={{
                      padding:"12px 18px",
                      borderBottom:`1px solid ${T.border}`,
                      display:"flex", alignItems:"flex-start", gap:12,
                      transition:"background 0.15s",
                    }}>
                      <div style={{
                        width:32, height:32, borderRadius:"50%", flexShrink:0,
                        background: ev.type==="solve"
                          ? DIFF[ev.diff]?.lo || T.accentLo
                          : T.accentLo,
                        display:"flex", alignItems:"center", justifyContent:"center",
                        fontSize:14,
                      }}>
                        {ev.type==="solve" ? "⚡" : "📈"}
                      </div>
                      <div style={{ flex:1 }}>
                        <div style={{ fontFamily:T.display, fontSize:13, fontWeight:600, color:T.text, marginBottom:2 }}>
                          <span style={{ color: T.accentHi }}>{ev.user}</span>
                          {ev.type==="solve"
                            ? <> solved a <span style={{ color: DIFF[ev.diff]?.color }}>{ev.diff}</span> challenge</>
                            : <> climbed the rankings</>
                          }
                        </div>
                        <div style={{ display:"flex", gap:8, alignItems:"center" }}>
                          {ev.xp && <span style={{ fontFamily:T.mono, fontSize:10, padding:"2px 8px", borderRadius:10, background:T.greenLo, color:T.green, border:`1px solid rgba(16,185,129,0.2)` }}>+{ev.xp} XP</span>}
                          <span style={{ fontFamily:T.mono, fontSize:10, color:T.muted }}>{ev.time}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{ padding:"14px 18px", textAlign:"center" }}>
                  <span style={{ fontFamily:T.mono, fontSize:10, color:T.muted2 }}>Showing recent activity</span>
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

// ── SHARED STYLES ──────────────────────────────
const pg = {
  minHeight:"100vh", background:T.bg, color:T.text,
  fontFamily:T.display, position:"relative", overflowX:"hidden",
};
const mainStyle = {
  position:"relative", zIndex:2,
  maxWidth:1240, margin:"0 auto", padding:"48px 48px 80px",
};
const heroWrap = {
  display:"flex", alignItems:"flex-end", justifyContent:"space-between",
  gap:40, paddingBottom:40, marginBottom:0,
};
const sk = {
  background:"rgba(255,255,255,0.05)",
  animation:"pulse 1.5s ease-in-out infinite",
};