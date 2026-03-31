'use client';

import { useEffect, useState } from 'react';
import { useSession, signIn } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';

// ── DESIGN TOKENS (must match page.js exactly) ──
const T = {
  bg:         "#0c0e14",
  surface:    "#12151f",
  surface2:   "#181c28",
  border:     "rgba(255,255,255,0.07)",
  borderHi:   "rgba(255,255,255,0.14)",
  accent:     "#7c3aed",
  accentLo:   "rgba(124,58,237,0.15)",
  accentGlow: "rgba(124,58,237,0.35)",
  accentHi:   "#9f6ef5",
  green:      "#10b981",
  greenLo:    "rgba(16,185,129,0.12)",
  amber:      "#f59e0b",
  amberLo:    "rgba(245,158,11,0.12)",
  red:        "#ef4444",
  redLo:      "rgba(239,68,68,0.12)",
  text:       "#f1f5f9",
  muted:      "#64748b",
  muted2:     "#334155",
  mono:       "'DM Mono', 'Fira Code', monospace",
  display:    "'DM Sans', sans-serif",
};

const sk = {
  background:'rgba(255,255,255,0.05)',
  animation:'pulse 1.5s ease-in-out infinite',
};

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const [profile, setProfile]     = useState(null);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState(null);
  const [activeTab, setActiveTab] = useState('activity'); // 'activity' | 'stats'

  useEffect(() => {
    if (!session?.user?.id) return;
    fetch(`/api/profile?userId=${session.user.id}`)
      .then(r => { if (!r.ok) throw new Error('Failed'); return r.json(); })
      .then(data => { setLoading(false); setProfile(data); })
      .catch(() => { setLoading(false); setError('Unable to load profile'); });
  }, [session]);

  // ── LOADING ─────────────────────────────────────
  if (status === 'loading') {
    return (
      <div style={pg}>
        <Mesh /><Noise />
        <NavBar skeleton />
        <main style={mainS}>
          {/* Profile header skeleton */}
          <div style={{ display:'flex', alignItems:'flex-start', gap:20, marginBottom:40 }}>
            <div style={{ ...sk, width:100, height:100, borderRadius:16, flexShrink:0 }} />
            <div style={{ flex:1, paddingTop:4 }}>
              <div style={{ ...sk, width:240, height:24, borderRadius:6, marginBottom:12 }} />
              <div style={{ ...sk, width:180, height:14, borderRadius:4, marginBottom:16 }} />
              <div style={{ display:'flex', gap:8 }}>
                {[90,80,100].map(w => <div key={w} style={{ ...sk, width:w, height:28, borderRadius:20 }} />)}
              </div>
            </div>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 300px', gap:20 }}>
            <div style={{ ...card, padding:24 }}>
              {[1,2,3,4].map(i => (
                <div key={i} style={{ display:'flex', justifyContent:'space-between', padding:'14px 0', borderBottom:`1px solid ${T.border}` }}>
                  <div>
                    <div style={{ ...sk, width:200, height:13, borderRadius:4, marginBottom:8 }} />
                    <div style={{ ...sk, width:130, height:11, borderRadius:4 }} />
                  </div>
                  <div style={{ ...sk, width:72, height:32, borderRadius:8 }} />
                </div>
              ))}
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
              {[180,120,100].map(h => <div key={h} style={{ ...sk, height:h, borderRadius:16 }} />)}
            </div>
          </div>
        </main>
        <Fonts />
      </div>
    );
  }

  // ── UNAUTHENTICATED ─────────────────────────────
  if (status === 'unauthenticated') {
    return (
      <div style={pg}>
        <Mesh /><Noise />
        <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', position:'relative', zIndex:1 }}>
          <div style={{
            width:'100%', maxWidth:440, padding:'60px 52px',
            background:T.surface, border:`1px solid ${T.borderHi}`,
            borderRadius:24, textAlign:'center', position:'relative',
          }}>
            <div style={{ position:'absolute', top:0, left:'10%', right:'10%', height:1, background:`linear-gradient(90deg,transparent,${T.accent},transparent)` }} />
            <div style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'5px 14px', borderRadius:20, background:T.accentLo, border:`1px solid ${T.accentGlow}`, marginBottom:28 }}>
              <span style={{ width:6, height:6, borderRadius:'50%', background:T.accent, boxShadow:`0 0 8px ${T.accent}`, display:'inline-block' }} />
              <span style={{ fontFamily:T.mono, fontSize:11, color:T.accentHi, letterSpacing:1 }}>CODE RUNNER</span>
            </div>
            <h1 style={{ fontSize:38, fontWeight:800, letterSpacing:-2, lineHeight:1.1, marginBottom:12, fontFamily:T.display }}>
              Your Profile<span style={{ color:T.accent }}>.</span>
            </h1>
            <p style={{ fontSize:15, color:T.muted, marginBottom:40, lineHeight:1.7 }}>Sign in to view your stats, badges and submission history.</p>
            <button
              style={{ width:'100%', padding:'15px 20px', background:'transparent', border:`1px solid ${T.borderHi}`, borderRadius:12, color:T.text, fontFamily:T.display, fontSize:15, fontWeight:600, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:12, transition:'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor=T.accent; e.currentTarget.style.background=T.accentLo; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor=T.borderHi; e.currentTarget.style.background='transparent'; }}
              onClick={() => signIn('google')}
            >
              <span style={{ width:20, height:20, background:'white', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, fontWeight:900, color:'#4285f4' }}>G</span>
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
  const xp            = profile?.stats?.xp ?? session.user.xp ?? 0;
  const solved        = profile?.stats?.uniqueSolvedQuestions ?? 0;
  const attempted     = profile?.stats?.uniqueQuestionsAttempted ?? 0;
  const totalAttempts = profile?.stats?.totalAttempts ?? 0;
  const successRate   = attempted > 0 ? Math.round((solved / attempted) * 100) : 0;
  const level         = Math.floor(xp / 100) + 1;
  const levelXp       = xp % 100;

  return (
    <div style={pg}>
      <Mesh /><Noise />

      <NavBar session={session} xp={xp} />

      <main style={mainS}>

        {/* ── PROFILE HERO ── */}
        <div className="profile-hero">

          {/* Avatar */}
          <div className="profile-avatar-container">
            <div className="profile-avatar">
              {session.user.image
                ? <Image src={session.user.image} alt="avatar" width={100} height={100} style={{ objectFit:'cover' }} />
                : <div style={{ width:'100%', height:'100%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:40 }}>👤</div>
              }
            </div>
            {/* Online indicator */}
            <div className="profile-online-indicator" />
          </div>

          {/* Name + meta */}
          <div className="profile-info">
            <div className="profile-header">
              <h1 className="profile-name">{session.user.name}</h1>
              <span className="profile-status-online">● Online</span>
              <span className="profile-level">Lv.{level}</span>
            </div>

            <p className="profile-email">{session.user.email}</p>

            {/* Stat pills */}
            <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
              {[
                { label:`${xp} XP`,          color:T.amber,   lo:T.amberLo,  border:'rgba(245,158,11,0.3)',  icon:'⚡' },
                { label:`${solved} Solved`,  color:T.green,   lo:T.greenLo,  border:'rgba(16,185,129,0.3)',  icon:'✓'  },
                { label:`${successRate}% Win`, color:successRate>=60?T.green:successRate>=30?T.amber:T.red,
                  lo:successRate>=60?T.greenLo:successRate>=30?T.amberLo:T.redLo,
                  border:successRate>=60?'rgba(16,185,129,0.3)':successRate>=30?'rgba(245,158,11,0.3)':'rgba(239,68,68,0.3)',
                  icon:'📊' },
              ].map(({ label, color, lo, border, icon }) => (
                <span key={label} className="profile-stat-pill" style={{ background:lo, border:`1px solid ${border}`, color }}>
                  <span className="profile-stat-icon">{icon}</span>{label}
                </span>
              ))}
            </div>
          </div>

          {/* Back button */}
          <Link href="/" style={{ textDecoration:'none', alignSelf:'flex-start' }}>
            <button className="profile-back-btn">← Home</button>
          </Link>
        </div>

        {/* Accent divider */}
        <div className="profile-divider" />

        {/* ── CONTENT GRID ── */}
        <div className="profile-content-grid">

          {/* LEFT — Activity */}
          <div className="profile-activity-card">
            {/* Card header with tab switcher */}
            <div className="profile-card-header">
              <div className="profile-tabs">
                {[['activity','Activity'],['badges','Badges']].map(([id,label]) => (
                  <button key={id} onClick={() => setActiveTab(id)} className={`profile-tab ${activeTab === id ? 'active' : ''}`}>
                    {label}
                  </button>
                ))}
              </div>
              {profile?.recent?.length > 0 && activeTab==='activity' && (
                <span className="text-mono text-xs" style={{ color:T.muted }}>{profile.recent.length} submissions</span>
              )}
            </div>

            {/* ── ACTIVITY TAB ── */}
            {activeTab === 'activity' && (
              <div>
                {loading && (
                  <div className="profile-loading">
                    <div className="spinner" />
                    <p className="text-mono text-xs" style={{ color:T.muted, margin:0 }}>Loading activity...</p>
                  </div>
                )}

                {error && <div className="profile-error">{error}</div>}

                {!loading && !error && !profile?.recent?.length && (
                  <div className="profile-empty">
                    <div className="profile-empty-icon">{'{ }'}</div>
                    <p className="text-mono text-xs" style={{ color:T.muted, margin:0 }}>No submissions yet — start solving!</p>
                    <Link href="/" style={{ textDecoration:'none' }}>
                      <button className="profile-start-btn">⚡ Start a challenge</button>
                    </Link>
                  </div>
                )}

                <div className="profile-activity-list">
                  {profile?.recent?.map((item, i) => {
                    const ok = item.status === 'accepted';
                    const diffColor = item.difficulty==='Easy' ? T.green : item.difficulty==='Hard' ? T.amber : T.red;
                    return (
                      <div key={item.id || i} className="profile-activity-item">
                        {/* Left: status icon + info */}
                        <div className="profile-activity-left">
                          <div className={`profile-activity-icon ${ok ? 'success' : 'error'}`}>
                            {ok ? '✓' : '✗'}
                          </div>
                          <div className="profile-activity-info">
                            <div className="profile-activity-title">
                              {item.questionTitle}
                            </div>
                            <div className="profile-activity-meta">
                              <span className="profile-difficulty-badge" style={{ color:diffColor, background: item.difficulty==='Easy'?T.greenLo:item.difficulty==='Hard'?T.amberLo:T.redLo, border:`1px solid ${diffColor}44` }}>{item.difficulty}</span>
                              <span className="text-mono text-xs" style={{ color:T.muted }}>{item.testsPassed}/{item.testsTotal} tests</span>
                            </div>
                          </div>
                        </div>

                        {/* Right: status + XP */}
                        <div className="profile-activity-right">
                          <div className={`profile-status-badge ${ok ? 'accepted' : 'failed'}`}>
                            {ok ? 'accepted' : item.status}
                          </div>
                          <div className="profile-xp-earned">+{item.xpEarned} XP</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ── BADGES TAB ── */}
            {activeTab === 'badges' && (
              <div className="profile-badges-content">
                {!profile?.badges?.length
                  ? (
                    <div className="profile-badges-empty">
                      <div className="profile-badges-empty-icon">🏅</div>
                      <p className="text-mono text-xs" style={{ color:T.muted, margin:0 }}>No badges yet — keep solving to earn them!</p>
                    </div>
                  ) : (
                    <div className="profile-badges-grid">
                      {profile.badges.map(b => (
                        <div key={b.key} className="profile-badge-card">
                          <div className="profile-badge-top" />
                          <div className="profile-badge-emoji">{b.emoji}</div>
                          <div className="profile-badge-name">{b.name}</div>
                          <div className="profile-badge-desc">{b.desc}</div>
                        </div>
                      ))}
                    </div>
                  )
                }
              </div>
            )}
          </div>

          {/* RIGHT — Stats + XP */}
          <div className="profile-right-column">

            {/* Stats card */}
            <div className="profile-stats-card">
              <div className="profile-stats-card-top" />
              <div className="profile-stats-card-header">
                <span className="text-mono text-xs" style={{ color:T.muted, textTransform:'uppercase', letterSpacing:2 }}>Stats</span>
              </div>
              <div className="profile-stats-content">
                {[
                  { label:'Total XP',          val: xp,                   color:T.amber  },
                  { label:'Solved',             val: solved,               color:T.green  },
                  { label:'Attempted',          val: attempted,            color:T.accentHi },
                  { label:'Submissions',        val: totalAttempts,        color:T.text   },
                  { label:'Win Rate',           val: `${successRate}%`,    color: successRate>=60?T.green:successRate>=30?T.amber:T.red },
                ].map(({ label, val, color }) => (
                  <div key={label} className="profile-stat-item">
                    <span className="profile-stat-label">{label}</span>
                    <span className="profile-stat-value" style={{ color }}>{val}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* XP / Level card */}
            <div className="profile-level-card">
              <div className="profile-level-card-top" />
              <div className="profile-level-card-header">
                <span className="text-mono text-xs" style={{ color:T.muted, textTransform:'uppercase', letterSpacing:2 }}>Level Progress</span>
              </div>
              <div className="profile-level-content">
                {/* Level badge */}
                <div className="profile-level-badge-container">
                  <div className="profile-level-badge">
                    <div className="profile-level-number">{level}</div>
                    <div className="profile-level-info">
                      <div className="profile-level-title">Level {level}</div>
                      <div className="text-mono text-xs" style={{ color:T.muted }}>{levelXp} / 100 XP</div>
                    </div>
                  </div>
                  <div className="text-mono text-xs" style={{ color:T.muted }}>→ Lv.{level+1}</div>
                </div>

                {/* Progress bar */}
                <div className="profile-level-progress">
                  <div className="profile-level-progress-fill" style={{ width:`${levelXp}%` }} />
                </div>
                <div className="text-mono text-xs" style={{ color:T.muted }}>
                  {100 - levelXp} XP to next level
                </div>

                {/* Mini XP milestones */}
                <div className="profile-milestones">
                  {[100,500,1000,2500].map(milestone => {
                    const reached = xp >= milestone;
                    return (
                      <div key={milestone} className={`profile-milestone ${reached ? 'reached' : ''}`}>
                        {reached ? '✓ ' : ''}{milestone} XP
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Quick actions */}
            <div className="profile-quick-actions">
              <Link href="/" style={{ textDecoration:'none', flex:1 }}>
                <button className="profile-new-challenge-btn">
                  ⚡ New Challenge
                </button>
              </Link>
            </div>

          </div>
        </div>
      </main>

      <Fonts />
      <style>{`
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.3} }
        @keyframes spin  { to{transform:rotate(360deg)} }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
      `}</style>
    </div>
  );
}

// ── SUB COMPONENTS ──────────────────────────────

function NavBar({ skeleton, session, xp }) {
  return (
    <nav style={{
      position:'sticky', top:0, zIndex:100,
      display:'flex', justifyContent:'space-between', alignItems:'center',
      padding:'14px 48px',
      background:'rgba(12,14,20,0.8)',
      backdropFilter:'blur(24px)',
      borderBottom:`1px solid ${T.border}`,
    }}>
      {/* Logo */}
      <Link href="/" style={{ textDecoration:'none', display:'flex', alignItems:'center', gap:10 }}>
        <div style={{ width:28, height:28, borderRadius:8, background:`linear-gradient(135deg,${T.accent},#6d28d9)`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:14, boxShadow:`0 0 14px ${T.accentLo}` }}>⚡</div>
        <span style={{ fontFamily:T.display, fontSize:16, fontWeight:800, color:T.text, letterSpacing:-0.5 }}>CodeRunner</span>
      </Link>

      {skeleton ? (
        <div style={{ display:'flex', gap:10 }}>
          <div style={{ ...sk, width:80, height:28, borderRadius:20 }} />
          <div style={{ ...sk, width:36, height:36, borderRadius:'50%' }} />
        </div>
      ) : (
        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
          <span style={{ fontFamily:T.mono, fontSize:12, padding:'6px 14px', background:T.amberLo, border:`1px solid rgba(245,158,11,0.3)`, borderRadius:20, color:T.amber }}>
            ⚡ {xp} XP
          </span>
          <div style={{ width:36, height:36, borderRadius:'50%', background:`linear-gradient(135deg,${T.accent},${T.green})`, padding:2 }}>
            <div style={{ width:'100%', height:'100%', borderRadius:'50%', background:T.surface, overflow:'hidden', display:'flex', alignItems:'center', justifyContent:'center' }}>
              {session?.user?.image
                ? <Image src={session.user.image} alt="avatar" width={32} height={32} style={{ borderRadius:'50%', objectFit:'cover' }} />
                : <span style={{ fontFamily:T.display, fontSize:13, fontWeight:700, color:T.text }}>{session?.user?.name?.[0]}</span>
              }
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

function Mesh() {
  return (
    <>
      <div style={{ position:'fixed', inset:0, pointerEvents:'none', zIndex:0,
        backgroundImage:`linear-gradient(${T.border} 1px,transparent 1px),linear-gradient(90deg,${T.border} 1px,transparent 1px)`,
        backgroundSize:'72px 72px' }} />
      <div style={{ position:'fixed', inset:0, pointerEvents:'none', zIndex:0,
        background:'radial-gradient(ellipse at 50% 0%, rgba(124,58,237,0.07) 0%, transparent 60%)' }} />
      <div style={{ position:'fixed', width:600, height:600, borderRadius:'50%', background:'rgba(124,58,237,0.05)', filter:'blur(140px)', top:-150, left:-100, pointerEvents:'none', zIndex:0 }} />
      <div style={{ position:'fixed', width:400, height:400, borderRadius:'50%', background:'rgba(245,158,11,0.04)', filter:'blur(120px)', bottom:80, right:-60, pointerEvents:'none', zIndex:0 }} />
    </>
  );
}

function Noise() {
  return (
    <div style={{
      position:'fixed', inset:0, pointerEvents:'none', zIndex:1, opacity:0.025,
      backgroundImage:`url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
      backgroundRepeat:'repeat', backgroundSize:'128px 128px',
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
  minHeight:'100vh', background:T.bg, color:T.text,
  fontFamily:T.display, position:'relative', overflowX:'hidden',
};
const mainS = {
  position:'relative', zIndex:2,
  maxWidth:1100, margin:'0 auto', padding:'44px 48px 80px',
};
const card = {
  background:T.surface, border:`1px solid ${T.border}`, borderRadius:16,
};