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
        <div style={{ display:'flex', alignItems:'flex-start', gap:24, marginBottom:0, flexWrap:'wrap' }}>

          {/* Avatar */}
          <div style={{ position:'relative', flexShrink:0 }}>
            <div style={{
              width:100, height:100, borderRadius:16, overflow:'hidden',
              background:T.surface2,
              border:`1px solid ${T.borderHi}`,
              boxShadow:`0 0 0 4px ${T.accentLo}`,
            }}>
              {session.user.image
                ? <Image src={session.user.image} alt="avatar" width={100} height={100} style={{ objectFit:'cover' }} />
                : <div style={{ width:'100%', height:'100%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:40 }}>👤</div>
              }
            </div>
            {/* Online indicator */}
            <div style={{ position:'absolute', bottom:6, right:6, width:14, height:14, borderRadius:'50%', background:T.green, border:`2px solid ${T.bg}`, boxShadow:`0 0 8px ${T.green}` }} />
          </div>

          {/* Name + meta */}
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:4, flexWrap:'wrap' }}>
              <h1 style={{ margin:0, fontFamily:T.display, fontSize:30, fontWeight:800, letterSpacing:-1, color:T.text }}>{session.user.name}</h1>
              <span style={{ fontFamily:T.mono, fontSize:10, padding:'3px 10px', borderRadius:20, color:T.green, border:`1px solid rgba(16,185,129,0.25)`, background:T.greenLo }}>● Online</span>
              <span style={{ fontFamily:T.mono, fontSize:10, padding:'3px 10px', borderRadius:20, color:T.accentHi, border:`1px solid ${T.accentGlow}`, background:T.accentLo }}>Lv.{level}</span>
            </div>

            <p style={{ margin:'0 0 14px', fontFamily:T.mono, fontSize:11, color:T.muted }}>{session.user.email}</p>

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
                <span key={label} style={{ fontFamily:T.mono, fontSize:12, padding:'6px 14px', background:lo, border:`1px solid ${border}`, borderRadius:20, color, display:'flex', alignItems:'center', gap:5 }}>
                  <span style={{ fontSize:11 }}>{icon}</span>{label}
                </span>
              ))}
            </div>
          </div>

          {/* Back button */}
          <Link href="/" style={{ textDecoration:'none', alignSelf:'flex-start' }}>
            <button
              style={{ fontFamily:T.mono, fontSize:11, padding:'8px 16px', background:'transparent', border:`1px solid ${T.border}`, color:T.muted, borderRadius:8, cursor:'pointer', transition:'all 0.2s', letterSpacing:0.5 }}
              onMouseEnter={e => { e.currentTarget.style.borderColor=T.accent; e.currentTarget.style.color=T.accentHi; e.currentTarget.style.background=T.accentLo; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor=T.border; e.currentTarget.style.color=T.muted; e.currentTarget.style.background='transparent'; }}
            >← Home</button>
          </Link>
        </div>

        {/* Accent divider */}
        <div style={{ height:1, background:`linear-gradient(90deg,${T.accent}66,${T.accentHi}22,transparent)`, margin:'28px 0 32px' }} />

        {/* ── CONTENT GRID ── */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 300px', gap:20, alignItems:'start' }}>

          {/* LEFT — Activity */}
          <div style={{ ...card, overflow:'hidden' }}>
            {/* Card header with tab switcher */}
            <div style={{ padding:'18px 24px', borderBottom:`1px solid ${T.border}`, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
              <div style={{ display:'flex', gap:4, background:T.surface2, borderRadius:10, padding:3 }}>
                {[['activity','Activity'],['badges','Badges']].map(([id,label]) => (
                  <button key={id} onClick={() => setActiveTab(id)} style={{
                    padding:'6px 14px', borderRadius:8,
                    background: activeTab===id ? T.accent : 'transparent',
                    border:'none', color: activeTab===id ? '#fff' : T.muted,
                    fontFamily:T.mono, fontSize:10, cursor:'pointer',
                    transition:'all 0.2s', fontWeight: activeTab===id ? 700 : 400, letterSpacing:0.5,
                  }}>{label}</button>
                ))}
              </div>
              {profile?.recent?.length > 0 && activeTab==='activity' && (
                <span style={{ fontFamily:T.mono, fontSize:10, color:T.muted }}>{profile.recent.length} submissions</span>
              )}
            </div>

            {/* ── ACTIVITY TAB ── */}
            {activeTab === 'activity' && (
              <div>
                {loading && (
                  <div style={{ padding:'40px 0', textAlign:'center' }}>
                    <div style={{ width:24, height:24, border:`2px solid ${T.accentLo}`, borderTopColor:T.accent, borderRadius:'50%', animation:'spin 0.8s linear infinite', margin:'0 auto 12px' }} />
                    <p style={{ fontFamily:T.mono, fontSize:11, color:T.muted, margin:0 }}>Loading activity...</p>
                  </div>
                )}

                {error && <div style={{ padding:'20px 24px', fontFamily:T.mono, fontSize:12, color:T.red }}>{error}</div>}

                {!loading && !error && !profile?.recent?.length && (
                  <div style={{ padding:'52px 24px', textAlign:'center' }}>
                    <div style={{ fontSize:36, marginBottom:12, opacity:0.4 }}>{'{ }'}</div>
                    <p style={{ fontFamily:T.mono, fontSize:12, color:T.muted, margin:0 }}>No submissions yet — start solving!</p>
                    <Link href="/" style={{ textDecoration:'none' }}>
                      <button style={{ marginTop:16, padding:'9px 20px', background:T.accentLo, border:`1px solid ${T.accentGlow}`, borderRadius:10, color:T.accentHi, fontFamily:T.mono, fontSize:11, cursor:'pointer' }}>
                        ⚡ Start a challenge
                      </button>
                    </Link>
                  </div>
                )}

                <div style={{ padding:'0 24px' }}>
                  {profile?.recent?.map((item, i) => {
                    const ok = item.status === 'accepted';
                    const diffColor = item.difficulty==='Easy' ? T.green : item.difficulty==='Hard' ? T.amber : T.red;
                    return (
                      <div key={item.id || i} style={{
                        display:'flex', justifyContent:'space-between', alignItems:'center',
                        padding:'14px 0',
                        borderBottom: i < profile.recent.length-1 ? `1px solid ${T.border}` : 'none',
                        gap:12,
                      }}>
                        {/* Left: status icon + info */}
                        <div style={{ display:'flex', alignItems:'center', gap:12, flex:1, minWidth:0 }}>
                          <div style={{ width:32, height:32, borderRadius:'50%', flexShrink:0, background: ok ? T.greenLo : T.redLo, border:`1px solid ${ok?'rgba(16,185,129,0.25)':'rgba(239,68,68,0.25)'}`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:13 }}>
                            {ok ? '✓' : '✗'}
                          </div>
                          <div style={{ minWidth:0 }}>
                            <div style={{ fontFamily:T.display, fontWeight:600, fontSize:13, color:T.text, marginBottom:3, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>
                              {item.questionTitle}
                            </div>
                            <div style={{ display:'flex', gap:8, alignItems:'center' }}>
                              <span style={{ fontFamily:T.mono, fontSize:9, padding:'2px 7px', borderRadius:10, color:diffColor, background: item.difficulty==='Easy'?T.greenLo:item.difficulty==='Hard'?T.amberLo:T.redLo, border:`1px solid ${diffColor}44` }}>{item.difficulty}</span>
                              <span style={{ fontFamily:T.mono, fontSize:10, color:T.muted }}>{item.testsPassed}/{item.testsTotal} tests</span>
                            </div>
                          </div>
                        </div>

                        {/* Right: status + XP */}
                        <div style={{ textAlign:'right', flexShrink:0 }}>
                          <div style={{ fontFamily:T.mono, fontSize:10, padding:'3px 10px', borderRadius:20, marginBottom:4, display:'inline-block', color: ok?T.green:T.red, background: ok?T.greenLo:T.redLo, border:`1px solid ${ok?'rgba(16,185,129,0.2)':'rgba(239,68,68,0.2)'}` }}>
                            {ok ? 'accepted' : item.status}
                          </div>
                          <div style={{ fontFamily:T.mono, fontSize:11, color:T.amber, fontWeight:700 }}>+{item.xpEarned} XP</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ── BADGES TAB ── */}
            {activeTab === 'badges' && (
              <div style={{ padding:'20px 24px' }}>
                {!profile?.badges?.length
                  ? (
                    <div style={{ padding:'32px 0', textAlign:'center' }}>
                      <div style={{ fontSize:36, marginBottom:12, opacity:0.4 }}>🏅</div>
                      <p style={{ fontFamily:T.mono, fontSize:12, color:T.muted, margin:0 }}>No badges yet — keep solving to earn them!</p>
                    </div>
                  ) : (
                    <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(130px,1fr))', gap:12 }}>
                      {profile.badges.map(b => (
                        <div key={b.key} style={{
                          padding:'16px 12px', borderRadius:12, textAlign:'center',
                          background:T.surface2,
                          border:`1px solid ${T.border}`,
                          transition:'all 0.2s',
                          position:'relative', overflow:'hidden',
                        }}
                          onMouseEnter={e => { e.currentTarget.style.borderColor=T.accentGlow; e.currentTarget.style.transform='translateY(-2px)'; }}
                          onMouseLeave={e => { e.currentTarget.style.borderColor=T.border; e.currentTarget.style.transform='none'; }}
                        >
                          <div style={{ position:'absolute', top:0, left:0, right:0, height:2, background:`linear-gradient(90deg,transparent,${T.accent},transparent)` }} />
                          <div style={{ fontSize:28, marginBottom:8 }}>{b.emoji}</div>
                          <div style={{ fontFamily:T.display, fontWeight:700, fontSize:12, color:T.text, marginBottom:3 }}>{b.name}</div>
                          <div style={{ fontFamily:T.mono, fontSize:10, color:T.muted, lineHeight:1.4 }}>{b.desc}</div>
                        </div>
                      ))}
                    </div>
                  )
                }
              </div>
            )}
          </div>

          {/* RIGHT — Stats + XP */}
          <div style={{ display:'flex', flexDirection:'column', gap:16 }}>

            {/* Stats card */}
            <div style={{ ...card, overflow:'hidden' }}>
              <div style={{ height:3, background:`linear-gradient(90deg,${T.accent},${T.accentHi},transparent)` }} />
              <div style={{ padding:'16px 20px', borderBottom:`1px solid ${T.border}` }}>
                <span style={{ fontFamily:T.mono, fontSize:10, color:T.muted, textTransform:'uppercase', letterSpacing:2 }}>Stats</span>
              </div>
              <div style={{ padding:'4px 20px 16px' }}>
                {[
                  { label:'Total XP',          val: xp,                   color:T.amber  },
                  { label:'Solved',             val: solved,               color:T.green  },
                  { label:'Attempted',          val: attempted,            color:T.accentHi },
                  { label:'Submissions',        val: totalAttempts,        color:T.text   },
                  { label:'Win Rate',           val: `${successRate}%`,    color: successRate>=60?T.green:successRate>=30?T.amber:T.red },
                ].map(({ label, val, color }) => (
                  <div key={label} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'10px 0', borderBottom:`1px solid ${T.border}` }}>
                    <span style={{ fontFamily:T.mono, fontSize:10, color:T.muted, textTransform:'uppercase', letterSpacing:1 }}>{label}</span>
                    <span style={{ fontFamily:T.mono, fontSize:15, fontWeight:700, color }}>{val}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* XP / Level card */}
            <div style={{ ...card, overflow:'hidden' }}>
              <div style={{ height:3, background:`linear-gradient(90deg,${T.amber},${T.accent},transparent)` }} />
              <div style={{ padding:'16px 20px', borderBottom:`1px solid ${T.border}` }}>
                <span style={{ fontFamily:T.mono, fontSize:10, color:T.muted, textTransform:'uppercase', letterSpacing:2 }}>Level Progress</span>
              </div>
              <div style={{ padding:'18px 20px' }}>
                {/* Level badge */}
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                    <div style={{ width:40, height:40, borderRadius:10, background:T.accentLo, border:`1px solid ${T.accentGlow}`, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:T.display, fontSize:16, fontWeight:800, color:T.accentHi }}>
                      {level}
                    </div>
                    <div>
                      <div style={{ fontFamily:T.display, fontSize:13, fontWeight:700, color:T.text }}>Level {level}</div>
                      <div style={{ fontFamily:T.mono, fontSize:10, color:T.muted }}>{levelXp} / 100 XP</div>
                    </div>
                  </div>
                  <div style={{ fontFamily:T.mono, fontSize:10, color:T.muted }}>→ Lv.{level+1}</div>
                </div>

                {/* Progress bar */}
                <div style={{ height:8, background:T.surface2, borderRadius:4, overflow:'hidden', marginBottom:10, border:`1px solid ${T.border}` }}>
                  <div style={{
                    height:'100%', width:`${levelXp}%`,
                    background:`linear-gradient(90deg,${T.accent},${T.accentHi})`,
                    borderRadius:4, transition:'width 0.6s ease',
                    boxShadow:`0 0 12px ${T.accentLo}`,
                  }} />
                </div>
                <div style={{ fontFamily:T.mono, fontSize:10, color:T.muted }}>
                  {100 - levelXp} XP to next level
                </div>

                {/* Mini XP milestones */}
                <div style={{ display:'flex', gap:6, marginTop:16, flexWrap:'wrap' }}>
                  {[100,500,1000,2500].map(milestone => {
                    const reached = xp >= milestone;
                    return (
                      <div key={milestone} style={{
                        fontFamily:T.mono, fontSize:9, padding:'3px 8px', borderRadius:10,
                        color: reached ? T.amber : T.muted2,
                        background: reached ? T.amberLo : 'transparent',
                        border: `1px solid ${reached ? 'rgba(245,158,11,0.3)' : T.border}`,
                        transition:'all 0.2s',
                      }}>
                        {reached ? '✓ ' : ''}{milestone} XP
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Quick actions */}
            <div style={{ display:'flex', gap:10 }}>
              <Link href="/" style={{ textDecoration:'none', flex:1 }}>
                <button style={{
                  width:'100%', padding:'12px', borderRadius:10,
                  background:`linear-gradient(135deg,${T.accent},#6d28d9)`,
                  border:'none', color:'#fff',
                  fontFamily:T.display, fontSize:13, fontWeight:700,
                  cursor:'pointer', transition:'all 0.2s',
                  boxShadow:`0 4px 20px ${T.accentLo}`,
                }}
                  onMouseEnter={e => { e.currentTarget.style.transform='translateY(-1px)'; e.currentTarget.style.boxShadow=`0 6px 28px ${T.accentGlow}`; }}
                  onMouseLeave={e => { e.currentTarget.style.transform='none'; e.currentTarget.style.boxShadow=`0 4px 20px ${T.accentLo}`; }}
                >
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
const sk = {
  background:'rgba(255,255,255,0.05)',
  animation:'pulse 1.5s ease-in-out infinite',
};