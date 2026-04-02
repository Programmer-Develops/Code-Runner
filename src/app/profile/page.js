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
<<<<<<< HEAD
      <div style={S.page}>
        <GridOverlay /><Orbs />
        <Nav skeleton />
        <main style={S.main}>
          <div style={{ ...S.profileHeader, marginBottom: 32 }}>
            <div style={{ ...S.skel, width: 96, height: 96, borderRadius: 12 }} />
            <div style={{ flex: 1 }}>
              <div style={{ ...S.skel, width: 220, height: 22, borderRadius: 4, marginBottom: 10 }} />
              <div style={{ ...S.skel, width: 160, height: 14, borderRadius: 4, marginBottom: 10 }} />
              <div style={{ ...S.skel, width: 80, height: 26, borderRadius: 20 }} />
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 20 }}>
            <div style={{ ...S.card }}>
              <div style={{ ...S.skel, width: 120, height: 14, borderRadius: 4, marginBottom: 20 }} />
              {[1, 2, 3, 4].map(i => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '14px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
=======
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
>>>>>>> 90b5dd2fd77ddf1ec4942dd53909bcddc94e3d51
                  <div>
                    <div style={{ ...sk, width:200, height:13, borderRadius:4, marginBottom:8 }} />
                    <div style={{ ...sk, width:130, height:11, borderRadius:4 }} />
                  </div>
                  <div style={{ ...sk, width:72, height:32, borderRadius:8 }} />
                </div>
              ))}
            </div>
<<<<<<< HEAD
            <div>
              <div style={{ ...S.card, marginBottom: 16 }}>
                <div style={{ ...S.skel, width: 60, height: 14, borderRadius: 4, marginBottom: 16 }} />
                {[1, 2, 3, 4].map(i => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ ...S.skel, width: 140, height: 12, borderRadius: 4 }} />
                    <div style={{ ...S.skel, width: 40, height: 12, borderRadius: 4 }} />
                  </div>
                ))}
              </div>
              <div style={S.card}>
                <div style={{ ...S.skel, width: 80, height: 14, borderRadius: 4, marginBottom: 16 }} />
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  {[1, 2].map(i => <div key={i} style={{ ...S.skel, width: 110, height: 72, borderRadius: 10 }} />)}
                </div>
              </div>
=======
            <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
              {[180,120,100].map(h => <div key={h} style={{ ...sk, height:h, borderRadius:16 }} />)}
>>>>>>> 90b5dd2fd77ddf1ec4942dd53909bcddc94e3d51
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
<<<<<<< HEAD
      <div style={S.page}>
        <GridOverlay /><Orbs />
        <div style={S.signinWrap}>
          <div style={S.signinCard}>
            <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: 200, height: 1, background: 'linear-gradient(90deg,transparent,#00e5ff,transparent)' }} />
            <div style={S.signinLogo}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#00e5ff', boxShadow: '0 0 12px #00e5ff', display: 'inline-block' }} />
              CODE_RUNNER
            </div>
            <h1 style={{ fontSize: 32, fontWeight: 800, letterSpacing: -1.5, marginBottom: 10 }}>Profile<span style={{ color: '#00e5ff' }}>.</span></h1>
            <p style={{ fontSize: 14, color: '#5a6070', marginBottom: 36, lineHeight: 1.6 }}>Sign in to view your profile, stats and badges.</p>
            <button style={S.signinBtn} onClick={() => signIn()}>Sign in to continue</button>
=======
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
>>>>>>> 90b5dd2fd77ddf1ec4942dd53909bcddc94e3d51
          </div>
        </div>
        <Fonts />
      </div>
    );
  }

<<<<<<< HEAD
  const xp = profile?.stats?.xp ?? session.user.xp ?? 0;
  const solved = profile?.stats?.uniqueSolvedQuestions ?? 0;
  const attempted = profile?.stats?.uniqueQuestionsAttempted ?? 0;
=======
  // ── AUTHENTICATED ───────────────────────────────
  const xp            = profile?.stats?.xp ?? session.user.xp ?? 0;
  const solved        = profile?.stats?.uniqueSolvedQuestions ?? 0;
  const attempted     = profile?.stats?.uniqueQuestionsAttempted ?? 0;
>>>>>>> 90b5dd2fd77ddf1ec4942dd53909bcddc94e3d51
  const totalAttempts = profile?.stats?.totalAttempts ?? 0;
  const successRate   = attempted > 0 ? Math.round((solved / attempted) * 100) : 0;
  const level         = Math.floor(xp / 100) + 1;
  const levelXp       = xp % 100;

  return (
    <div style={pg}>
      <Mesh /><Noise />

      <NavBar session={session} xp={xp} />

      <main style={mainS}>

<<<<<<< HEAD
        <div style={S.profileHeader}>
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <div style={{ width: 96, height: 96, borderRadius: 12, overflow: 'hidden', background: '#0d1220', border: '1px solid rgba(255,255,255,0.1)', position: 'relative' }}>
              {session.user.image
                ? <Image src={session.user.image} alt="avatar" width={96} height={96} style={{ objectFit: 'cover' }} />
                : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36 }}>👤</div>
              }
            </div>
            <div style={{ position: 'absolute', bottom: 4, right: 4, width: 12, height: 12, borderRadius: '50%', background: '#00ff94', border: '2px solid #050810', boxShadow: '0 0 8px #00ff94' }} />
          </div>

          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4, flexWrap: 'wrap' }}>
              <h1 style={{ margin: 0, fontSize: 28, fontWeight: 800, letterSpacing: -1 }}>{session.user.name}</h1>
              <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 10, padding: '3px 10px', borderRadius: 20, color: '#00e5ff', border: '1px solid rgba(0,229,255,0.3)', background: 'rgba(0,229,255,0.07)' }}>● Active</span>
            </div>
            <p style={{ margin: 0, fontFamily: "'Space Mono',monospace", fontSize: 11, color: '#5a6070', marginBottom: 14 }}>{session.user.email}</p>

            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 12, padding: '5px 14px', background: 'rgba(255,184,0,0.1)', border: '1px solid rgba(255,184,0,0.25)', borderRadius: 20, color: '#ffb800' }}>⚡ {xp} XP</span>
              <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 12, padding: '5px 14px', background: 'rgba(0,255,148,0.07)', border: '1px solid rgba(0,255,148,0.2)', borderRadius: 20, color: '#00ff94' }}>✓ {solved} solved</span>
              <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 12, padding: '5px 14px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, color: '#5a6070' }}>{successRate}% success</span>
            </div>
          </div>

          <Link href="/" style={{ textDecoration: 'none' }}>
            <button
              style={S.backBtn}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#00e5ff'; e.currentTarget.style.color = '#00e5ff'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = '#5a6070'; }}
            >
              ← home
            </button>
          </Link>
        </div>

        <div style={{ height: 1, background: 'linear-gradient(90deg,rgba(0,229,255,0.3),rgba(0,229,255,0.05),transparent)', margin: '28px 0' }} />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 20, alignItems: 'start' }}>

          <div style={S.card}>
            <div style={S.cardHeader}>
              <span style={S.cardTitle}>Recent Activity</span>
              {profile?.recent?.length > 0 && (
                <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 10, color: '#5a6070' }}>{profile.recent.length} submissions</span>
              )}
            </div>

            {loading && (
              <div style={{ padding: '32px 0', textAlign: 'center' }}>
                <div style={{ width: 24, height: 24, border: '2px solid rgba(0,229,255,0.2)', borderTopColor: '#00e5ff', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 12px' }} />
                <p style={{ fontFamily: "'Space Mono',monospace", fontSize: 11, color: '#5a6070', margin: 0 }}>Loading activity...</p>
              </div>
            )}

            {error && (
              <div style={{ padding: '20px 0', fontFamily: "'Space Mono',monospace", fontSize: 12, color: '#ff4566' }}>{error}</div>
            )}

            {!loading && !error && profile?.recent?.length === 0 && (
              <div style={{ padding: '40px 0', textAlign: 'center' }}>
                <div style={{ fontSize: 32, marginBottom: 12 }}>{'{ }'}</div>
                <p style={{ fontFamily: "'Space Mono',monospace", fontSize: 11, color: '#5a6070', margin: 0 }}>No activity yet — start solving!</p>
              </div>
            )}

            <div style={{ padding: '0 24px' }}>
              {profile?.recent?.map((item, i) => {
                const accepted = item.status === 'accepted';
                return (
                  <div key={item.id || i} style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '14px 0',
                    borderBottom: i < profile.recent.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                    gap: 12,
                  }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 600, fontSize: 13, color: '#e8eaf0', marginBottom: 4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {item.questionTitle}
                      </div>
                      <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 10, color: '#5a6070' }}>
                        <span style={{
                          color: item.difficulty === 'Easy' ? '#4ade80' : item.difficulty === 'Hard' ? '#fbbf24' : '#f87171',
                          marginRight: 8,
                        }}>{item.difficulty}</span>
                        {item.testsPassed}/{item.testsTotal} tests passed
                      </div>
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <div style={{
                        fontFamily: "'Space Mono',monospace", fontSize: 10, padding: '3px 10px', borderRadius: 20, marginBottom: 4, display: 'inline-block',
                        color: accepted ? '#00ff94' : '#ff4566',
                        background: accepted ? 'rgba(0,255,148,0.08)' : 'rgba(255,69,102,0.08)',
                        border: `1px solid ${accepted ? 'rgba(0,255,148,0.2)' : 'rgba(255,69,102,0.2)'}`,
                      }}>
                        {accepted ? 'accepted' : item.status}
                      </div>
                      <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 11, color: '#ffb800' }}>+{item.xpEarned} XP</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            <div style={S.card}>
              <div style={S.cardHeader}>
                <span style={S.cardTitle}>Stats</span>
              </div>
              <div style={{ padding: '4px 24px 16px' }}>
                {[
                  { label: 'Total XP', val: xp, color: '#ffb800' },
                  { label: 'Problems Solved', val: solved, color: '#00ff94' },
                  { label: 'Problems Attempted', val: attempted, color: '#00e5ff' },
                  { label: 'Total Submissions', val: totalAttempts, color: '#e8eaf0' },
                  { label: 'Success Rate', val: `${successRate}%`, color: successRate >= 60 ? '#00ff94' : successRate >= 30 ? '#ffb800' : '#ff4566' },
                ].map(({ label, val, color }) => (
                  <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 10, color: '#5a6070', textTransform: 'uppercase', letterSpacing: 1 }}>{label}</span>
                    <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 14, fontWeight: 700, color }}>{val}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={S.card}>
              <div style={S.cardHeader}>
                <span style={S.cardTitle}>XP Progress</span>
              </div>
              <div style={{ padding: '16px 24px' }}>
                {(() => {
                  const level = Math.floor(xp / 100) + 1;
                  const levelXp = xp % 100;
                  const levelPct = levelXp;
                  return (
                    <>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                        <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 10, color: '#5a6070' }}>LVL {level}</span>
                        <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 10, color: '#5a6070' }}>{levelXp}/100 XP</span>
                      </div>
                      <div style={{ height: 6, background: 'rgba(255,255,255,0.06)', borderRadius: 3, overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${levelPct}%`, background: 'linear-gradient(90deg,#00e5ff,#00ff94)', borderRadius: 3, transition: 'width 0.5s ease' }} />
                      </div>
                      <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 10, color: '#5a6070', marginTop: 8 }}>
                        {100 - levelXp} XP to level {level + 1}
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>

            <div style={S.card}>
              <div style={S.cardHeader}>
                <span style={S.cardTitle}>Badges</span>
                {profile?.badges?.length > 0 && (
                  <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 10, color: '#5a6070' }}>{profile.badges.length} earned</span>
=======
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
>>>>>>> 90b5dd2fd77ddf1ec4942dd53909bcddc94e3d51
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
<<<<<<< HEAD
              <div style={{ padding: '8px 24px 20px' }}>
                {!profile?.badges?.length
                  ? <p style={{ fontFamily: "'Space Mono',monospace", fontSize: 11, color: '#5a6070', margin: '12px 0 0' }}>Keep solving to earn badges!</p>
                  : (
                    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 8 }}>
                      {profile.badges.map(b => (
                        <div key={b.key} style={{
                          padding: '10px 12px', borderRadius: 10, textAlign: 'center', minWidth: 100,
                          background: 'rgba(255,255,255,0.03)',
                          border: '1px solid rgba(255,255,255,0.07)',
                          transition: 'all 0.2s',
                        }}>
                          <div style={{ fontSize: 22, marginBottom: 4 }}>{b.emoji}</div>
                          <div style={{ fontWeight: 600, fontSize: 12, color: '#e8eaf0' }}>{b.name}</div>
                          <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 10, color: '#5a6070', marginTop: 2 }}>{b.desc}</div>
=======
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
>>>>>>> 90b5dd2fd77ddf1ec4942dd53909bcddc94e3d51
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
<<<<<<< HEAD
    <nav style={S.nav}>
      <div style={S.navLogo}>
        <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#00e5ff', boxShadow: '0 0 12px #00e5ff', display: 'inline-block', animation: 'pulse 2s ease-in-out infinite' }} />
        <span><span style={{ color: '#5a6070' }}>{'{ > }'}</span> code_runner</span>
      </div>
      {skeleton
        ? <div style={{ display: 'flex', gap: 10 }}>
          <div style={{ ...S.skel, width: 80, height: 28, borderRadius: 20 }} />
          <div style={{ ...S.skel, width: 38, height: 38, borderRadius: '50%' }} />
        </div>
        : <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={S.xpPill}>⚡ {xp} XP</span>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'linear-gradient(135deg,#00e5ff,#00ff94)', padding: 2 }}>
              <div style={{ width: '100%', height: '100%', borderRadius: '50%', background: '#090d1a', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {session?.user?.image
                  ? <Image src={session.user.image} alt="avatar" width={34} height={34} style={{ borderRadius: '50%' }} />
                  : <span style={{ fontSize: 14, fontWeight: 700, color: '#e8eaf0' }}>{session?.user?.name?.[0]}</span>
                }
              </div>
            </div>
          </Link>
        </div>
      }
=======
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
>>>>>>> 90b5dd2fd77ddf1ec4942dd53909bcddc94e3d51
    </nav>
  );
}

<<<<<<< HEAD
function GridOverlay() {
  return (
    <div style={{
      position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0,
      backgroundImage: 'linear-gradient(rgba(0,229,255,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(0,229,255,0.03) 1px,transparent 1px)',
      backgroundSize: '60px 60px'
    }} />
  );
}

function Orbs() {
  return (
    <>
      <div style={{ position: 'fixed', width: 500, height: 500, borderRadius: '50%', background: 'rgba(0,229,255,0.05)', filter: 'blur(120px)', top: -100, left: -100, pointerEvents: 'none', zIndex: 0 }} />
      <div style={{ position: 'fixed', width: 400, height: 400, borderRadius: '50%', background: 'rgba(255,184,0,0.04)', filter: 'blur(120px)', bottom: 100, right: -80, pointerEvents: 'none', zIndex: 0 }} />
=======
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
>>>>>>> 90b5dd2fd77ddf1ec4942dd53909bcddc94e3d51
    </>
  );
}

<<<<<<< HEAD
const S = {
  page: {
    minHeight: '100vh', background: '#050810', color: '#e8eaf0',
    fontFamily: "'Syne', sans-serif", position: 'relative', overflowX: 'hidden',
  },
  nav: {
    position: 'sticky', top: 0, zIndex: 100,
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '16px 48px',
    background: 'rgba(5,8,16,0.85)', backdropFilter: 'blur(20px)',
    borderBottom: '1px solid rgba(255,255,255,0.07)',
  },
  navLogo: {
    display: 'flex', alignItems: 'center', gap: 10,
    fontFamily: "'Space Mono',monospace", fontSize: 15, fontWeight: 700, color: '#00e5ff', letterSpacing: '-0.5px',
  },
  xpPill: {
    fontFamily: "'Space Mono',monospace", fontSize: 12,
    padding: '6px 14px', background: 'rgba(255,184,0,0.1)',
    border: '1px solid rgba(255,184,0,0.25)', borderRadius: 20, color: '#ffb800',
  },
  main: {
    position: 'relative', zIndex: 1,
    maxWidth: 1100, margin: '0 auto', padding: '40px 48px 80px',
  },
  profileHeader: {
    display: 'flex', alignItems: 'flex-start', gap: 20, flexWrap: 'wrap',
  },
  backBtn: {
    fontFamily: "'Space Mono',monospace", fontSize: 11,
    padding: '7px 14px', background: 'transparent',
    border: '1px solid rgba(255,255,255,0.1)',
    color: '#5a6070', borderRadius: 6,
    cursor: 'pointer', letterSpacing: '0.5px',
    transition: 'all 0.2s', alignSelf: 'flex-start',
  },
  card: {
    background: '#090d1a', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, overflow: 'hidden',
  },
  cardHeader: {
    padding: '18px 24px', borderBottom: '1px solid rgba(255,255,255,0.07)',
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
  },
  cardTitle: {
    fontFamily: "'Space Mono',monospace", fontSize: 10,
    color: '#5a6070', textTransform: 'uppercase', letterSpacing: 2,
  },
  skel: { background: 'rgba(255,255,255,0.05)', animation: 'pulse 1.5s ease-in-out infinite' },
  signinWrap: {
    minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
    position: 'relative', zIndex: 1,
  },
  signinCard: {
    width: '100%', maxWidth: 400, padding: '52px 44px',
    background: '#090d1a', border: '1px solid rgba(255,255,255,0.15)',
    borderRadius: 16, textAlign: 'center', position: 'relative', overflow: 'hidden',
  },
  signinLogo: {
    fontFamily: "'Space Mono',monospace", fontSize: 12, color: '#00e5ff',
    letterSpacing: 2, marginBottom: 28,
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
  },
  signinBtn: {
    width: '100%', padding: 15, background: 'transparent',
    border: '1px solid rgba(255,255,255,0.15)', borderRadius: 10,
    color: '#e8eaf0', fontFamily: "'Syne',sans-serif", fontSize: 14, fontWeight: 600,
    cursor: 'pointer', transition: 'all 0.2s',
  },
=======
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
>>>>>>> 90b5dd2fd77ddf1ec4942dd53909bcddc94e3d51
};
const mainS = {
  position:'relative', zIndex:2,
  maxWidth:1100, margin:'0 auto', padding:'44px 48px 80px',
};
const card = {
  background:T.surface, border:`1px solid ${T.border}`, borderRadius:16,
};