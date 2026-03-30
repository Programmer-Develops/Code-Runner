'use client';

import { useEffect, useState } from 'react';
import { useSession, signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if (!session?.user?.id) return;
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/profile?userId=${session.user.id}`);
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        setProfile(data);
      } catch (err) {
        console.error(err);
        setError('Unable to load profile');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [session]);

  /* ── LOADING SKELETON ── */
  if (status === 'loading') {
    return (
      <div style={S.page}>
        <GridOverlay /><Orbs />
        <Nav skeleton />
        <main style={S.main}>
          <div style={{ ...S.profileHeader, marginBottom: 32 }}>
            <div style={{ ...S.skel, width: 96, height: 96, borderRadius: 12 }} />
            <div style={{ flex: 1 }}>
              <div style={{ ...S.skel, width: 220, height: 22, borderRadius: 4, marginBottom: 10 }} />
              <div style={{ ...S.skel, width: 160, height: 14, borderRadius: 4, marginBottom: 10 }} />
              <div style={{ ...S.skel, width: 80,  height: 26, borderRadius: 20 }} />
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 20 }}>
            <div style={{ ...S.card }}>
              <div style={{ ...S.skel, width: 120, height: 14, borderRadius: 4, marginBottom: 20 }} />
              {[1,2,3,4].map(i => (
                <div key={i} style={{ display:'flex', justifyContent:'space-between', padding:'14px 0', borderBottom:'1px solid rgba(255,255,255,0.05)' }}>
                  <div>
                    <div style={{ ...S.skel, width: 180, height: 13, borderRadius: 4, marginBottom: 8 }} />
                    <div style={{ ...S.skel, width: 120, height: 11, borderRadius: 4 }} />
                  </div>
                  <div style={{ ...S.skel, width: 70, height: 32, borderRadius: 6 }} />
                </div>
              ))}
            </div>
            <div>
              <div style={{ ...S.card, marginBottom: 16 }}>
                <div style={{ ...S.skel, width: 60, height: 14, borderRadius: 4, marginBottom: 16 }} />
                {[1,2,3,4].map(i => (
                  <div key={i} style={{ display:'flex', justifyContent:'space-between', padding:'10px 0', borderBottom:'1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ ...S.skel, width: 140, height: 12, borderRadius: 4 }} />
                    <div style={{ ...S.skel, width: 40,  height: 12, borderRadius: 4 }} />
                  </div>
                ))}
              </div>
              <div style={S.card}>
                <div style={{ ...S.skel, width: 80, height: 14, borderRadius: 4, marginBottom: 16 }} />
                <div style={{ display:'flex', gap: 10, flexWrap:'wrap' }}>
                  {[1,2].map(i => <div key={i} style={{ ...S.skel, width: 110, height: 72, borderRadius: 10 }} />)}
                </div>
              </div>
            </div>
          </div>
        </main>
        <style>{fonts}</style>
      </div>
    );
  }

  /* ── NOT SIGNED IN ── */
  if (status === 'unauthenticated') {
    return (
      <div style={S.page}>
        <GridOverlay /><Orbs />
        <div style={S.signinWrap}>
          <div style={S.signinCard}>
            <div style={{ position:'absolute', top:0, left:'50%', transform:'translateX(-50%)', width:200, height:1, background:'linear-gradient(90deg,transparent,#00e5ff,transparent)' }} />
            <div style={S.signinLogo}>
              <span style={{ width:8, height:8, borderRadius:'50%', background:'#00e5ff', boxShadow:'0 0 12px #00e5ff', display:'inline-block' }} />
              CODE_RUNNER
            </div>
            <h1 style={{ fontSize:32, fontWeight:800, letterSpacing:-1.5, marginBottom:10 }}>Profile<span style={{ color:'#00e5ff' }}>.</span></h1>
            <p style={{ fontSize:14, color:'#5a6070', marginBottom:36, lineHeight:1.6 }}>Sign in to view your profile, stats and badges.</p>
            <button style={S.signinBtn} onClick={() => signIn()}>Sign in to continue</button>
          </div>
        </div>
        <style>{fonts}</style>
      </div>
    );
  }

  const xp      = profile?.stats?.xp ?? session.user.xp ?? 0;
  const solved  = profile?.stats?.uniqueSolvedQuestions ?? 0;
  const attempted = profile?.stats?.uniqueQuestionsAttempted ?? 0;
  const totalAttempts = profile?.stats?.totalAttempts ?? 0;
  const successRate = attempted > 0 ? Math.round((solved / attempted) * 100) : 0;

  /* ── AUTHENTICATED PROFILE ── */
  return (
    <div style={S.page}>
      <GridOverlay /><Orbs />

      {/* NAV */}
      <Nav session={session} xp={xp} />

      <main style={S.main}>

        {/* PROFILE HEADER */}
        <div style={S.profileHeader}>
          {/* Avatar */}
          <div style={{ position:'relative', flexShrink:0 }}>
            <div style={{ width:96, height:96, borderRadius:12, overflow:'hidden', background:'#0d1220', border:'1px solid rgba(255,255,255,0.1)', position:'relative' }}>
              {session.user.image
                ? <Image src={session.user.image} alt="avatar" width={96} height={96} style={{ objectFit:'cover' }} />
                : <div style={{ width:'100%', height:'100%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:36 }}>👤</div>
              }
            </div>
            {/* Online dot */}
            <div style={{ position:'absolute', bottom:4, right:4, width:12, height:12, borderRadius:'50%', background:'#00ff94', border:'2px solid #050810', boxShadow:'0 0 8px #00ff94' }} />
          </div>

          {/* Info */}
          <div style={{ flex:1 }}>
            <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:4, flexWrap:'wrap' }}>
              <h1 style={{ margin:0, fontSize:28, fontWeight:800, letterSpacing:-1 }}>{session.user.name}</h1>
              <span style={{ fontFamily:"'Space Mono',monospace", fontSize:10, padding:'3px 10px', borderRadius:20, color:'#00e5ff', border:'1px solid rgba(0,229,255,0.3)', background:'rgba(0,229,255,0.07)' }}>● Active</span>
            </div>
            <p style={{ margin:0, fontFamily:"'Space Mono',monospace", fontSize:11, color:'#5a6070', marginBottom:14 }}>{session.user.email}</p>

            {/* XP + quick stats row */}
            <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
              <span style={{ fontFamily:"'Space Mono',monospace", fontSize:12, padding:'5px 14px', background:'rgba(255,184,0,0.1)', border:'1px solid rgba(255,184,0,0.25)', borderRadius:20, color:'#ffb800' }}>⚡ {xp} XP</span>
              <span style={{ fontFamily:"'Space Mono',monospace", fontSize:12, padding:'5px 14px', background:'rgba(0,255,148,0.07)', border:'1px solid rgba(0,255,148,0.2)', borderRadius:20, color:'#00ff94' }}>✓ {solved} solved</span>
              <span style={{ fontFamily:"'Space Mono',monospace", fontSize:12, padding:'5px 14px', background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:20, color:'#5a6070' }}>{successRate}% success</span>
            </div>
          </div>

          {/* Back button */}
          <button
            onClick={() => router.push('/')}
            style={S.backBtn}
            onMouseEnter={e => { e.currentTarget.style.borderColor='#00e5ff'; e.currentTarget.style.color='#00e5ff'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor='rgba(255,255,255,0.1)'; e.currentTarget.style.color='#5a6070'; }}
          >
            ← home
          </button>
        </div>

        {/* DIVIDER */}
        <div style={{ height:1, background:'linear-gradient(90deg,rgba(0,229,255,0.3),rgba(0,229,255,0.05),transparent)', margin:'28px 0' }} />

        {/* CONTENT GRID */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 300px', gap:20, alignItems:'start' }}>

          {/* LEFT — Activity */}
          <div style={S.card}>
            <div style={S.cardHeader}>
              <span style={S.cardTitle}>Recent Activity</span>
              {profile?.recent?.length > 0 && (
                <span style={{ fontFamily:"'Space Mono',monospace", fontSize:10, color:'#5a6070' }}>{profile.recent.length} submissions</span>
              )}
            </div>

            {loading && (
              <div style={{ padding:'32px 0', textAlign:'center' }}>
                <div style={{ width:24, height:24, border:'2px solid rgba(0,229,255,0.2)', borderTopColor:'#00e5ff', borderRadius:'50%', animation:'spin 0.8s linear infinite', margin:'0 auto 12px' }} />
                <p style={{ fontFamily:"'Space Mono',monospace", fontSize:11, color:'#5a6070', margin:0 }}>Loading activity...</p>
              </div>
            )}

            {error && (
              <div style={{ padding:'20px 0', fontFamily:"'Space Mono',monospace", fontSize:12, color:'#ff4566' }}>{error}</div>
            )}

            {!loading && !error && profile?.recent?.length === 0 && (
              <div style={{ padding:'40px 0', textAlign:'center' }}>
                <div style={{ fontSize:32, marginBottom:12 }}>{'{ }'}</div>
                <p style={{ fontFamily:"'Space Mono',monospace", fontSize:11, color:'#5a6070', margin:0 }}>No activity yet — start solving!</p>
              </div>
            )}

            <div style={{ padding: '0 24px' }}>
              {profile?.recent?.map((item, i) => {
                const accepted = item.status === 'accepted';
                return (
                  <div key={item.id || i} style={{
                    display:'flex', justifyContent:'space-between', alignItems:'center',
                    padding:'14px 0',
                    borderBottom: i < profile.recent.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                    gap: 12,
                  }}>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontWeight:600, fontSize:13, color:'#e8eaf0', marginBottom:4, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>
                        {item.questionTitle}
                      </div>
                      <div style={{ fontFamily:"'Space Mono',monospace", fontSize:10, color:'#5a6070' }}>
                        <span style={{
                          color: item.difficulty === 'Easy' ? '#4ade80' : item.difficulty === 'Hard' ? '#fbbf24' : '#f87171',
                          marginRight: 8,
                        }}>{item.difficulty}</span>
                        {item.testsPassed}/{item.testsTotal} tests passed
                      </div>
                    </div>
                    <div style={{ textAlign:'right', flexShrink:0 }}>
                      <div style={{
                        fontFamily:"'Space Mono',monospace", fontSize:10, padding:'3px 10px', borderRadius:20, marginBottom:4, display:'inline-block',
                        color:      accepted ? '#00ff94' : '#ff4566',
                        background: accepted ? 'rgba(0,255,148,0.08)' : 'rgba(255,69,102,0.08)',
                        border:     `1px solid ${accepted ? 'rgba(0,255,148,0.2)' : 'rgba(255,69,102,0.2)'}`,
                      }}>
                        {accepted ? 'accepted' : item.status}
                      </div>
                      <div style={{ fontFamily:"'Space Mono',monospace", fontSize:11, color:'#ffb800' }}>+{item.xpEarned} XP</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* RIGHT — Stats + Badges */}
          <div style={{ display:'flex', flexDirection:'column', gap:16 }}>

            {/* Stats */}
            <div style={S.card}>
              <div style={S.cardHeader}>
                <span style={S.cardTitle}>Stats</span>
              </div>
              <div style={{ padding:'4px 24px 16px' }}>
                {[
                  { label:'Total XP',           val: xp,            color:'#ffb800' },
                  { label:'Problems Solved',     val: solved,        color:'#00ff94' },
                  { label:'Problems Attempted',  val: attempted,     color:'#00e5ff' },
                  { label:'Total Submissions',   val: totalAttempts, color:'#e8eaf0' },
                  { label:'Success Rate',        val: `${successRate}%`, color: successRate >= 60 ? '#00ff94' : successRate >= 30 ? '#ffb800' : '#ff4566' },
                ].map(({ label, val, color }) => (
                  <div key={label} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'10px 0', borderBottom:'1px solid rgba(255,255,255,0.05)' }}>
                    <span style={{ fontFamily:"'Space Mono',monospace", fontSize:10, color:'#5a6070', textTransform:'uppercase', letterSpacing:1 }}>{label}</span>
                    <span style={{ fontFamily:"'Space Mono',monospace", fontSize:14, fontWeight:700, color }}>{val}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* XP Bar visual */}
            <div style={S.card}>
              <div style={S.cardHeader}>
                <span style={S.cardTitle}>XP Progress</span>
              </div>
              <div style={{ padding:'16px 24px' }}>
                {(() => {
                  const level      = Math.floor(xp / 100) + 1;
                  const levelXp    = xp % 100;
                  const levelPct   = levelXp;
                  return (
                    <>
                      <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8 }}>
                        <span style={{ fontFamily:"'Space Mono',monospace", fontSize:10, color:'#5a6070' }}>LVL {level}</span>
                        <span style={{ fontFamily:"'Space Mono',monospace", fontSize:10, color:'#5a6070' }}>{levelXp}/100 XP</span>
                      </div>
                      <div style={{ height:6, background:'rgba(255,255,255,0.06)', borderRadius:3, overflow:'hidden' }}>
                        <div style={{ height:'100%', width:`${levelPct}%`, background:'linear-gradient(90deg,#00e5ff,#00ff94)', borderRadius:3, transition:'width 0.5s ease' }} />
                      </div>
                      <div style={{ fontFamily:"'Space Mono',monospace", fontSize:10, color:'#5a6070', marginTop:8 }}>
                        {100 - levelXp} XP to level {level + 1}
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>

            {/* Badges */}
            <div style={S.card}>
              <div style={S.cardHeader}>
                <span style={S.cardTitle}>Badges</span>
                {profile?.badges?.length > 0 && (
                  <span style={{ fontFamily:"'Space Mono',monospace", fontSize:10, color:'#5a6070' }}>{profile.badges.length} earned</span>
                )}
              </div>
              <div style={{ padding:'8px 24px 20px' }}>
                {!profile?.badges?.length
                  ? <p style={{ fontFamily:"'Space Mono',monospace", fontSize:11, color:'#5a6070', margin:'12px 0 0' }}>Keep solving to earn badges!</p>
                  : (
                    <div style={{ display:'flex', gap:10, flexWrap:'wrap', marginTop:8 }}>
                      {profile.badges.map(b => (
                        <div key={b.key} style={{
                          padding:'10px 12px', borderRadius:10, textAlign:'center', minWidth:100,
                          background:'rgba(255,255,255,0.03)',
                          border:'1px solid rgba(255,255,255,0.07)',
                          transition:'all 0.2s',
                        }}>
                          <div style={{ fontSize:22, marginBottom:4 }}>{b.emoji}</div>
                          <div style={{ fontWeight:600, fontSize:12, color:'#e8eaf0' }}>{b.name}</div>
                          <div style={{ fontFamily:"'Space Mono',monospace", fontSize:10, color:'#5a6070', marginTop:2 }}>{b.desc}</div>
                        </div>
                      ))}
                    </div>
                  )
                }
              </div>
            </div>

          </div>
        </div>
      </main>

      <style>{fonts + extra}</style>
    </div>
  );
}

/* ── SUB COMPONENTS ── */

function Nav({ skeleton, session, xp }) {
  return (
    <nav style={S.nav}>
      <div style={S.navLogo}>
        <span style={{ width:8, height:8, borderRadius:'50%', background:'#00e5ff', boxShadow:'0 0 12px #00e5ff', display:'inline-block', animation:'pulse 2s ease-in-out infinite' }} />
        <span><span style={{ color:'#5a6070' }}>{'{ > }'}</span> code_runner</span>
      </div>
      {skeleton
        ? <div style={{ display:'flex', gap:10 }}>
            <div style={{ ...S.skel, width:80,  height:28, borderRadius:20 }} />
            <div style={{ ...S.skel, width:38,  height:38, borderRadius:'50%' }} />
          </div>
        : <div style={{ display:'flex', alignItems:'center', gap:12 }}>
            <span style={S.xpPill}>⚡ {xp} XP</span>
            <Link href="/" style={{ textDecoration: 'none' }}>
              <div style={{ width:38, height:38, borderRadius:'50%', background:'linear-gradient(135deg,#00e5ff,#00ff94)', padding:2 }}>
                <div style={{ width:'100%', height:'100%', borderRadius:'50%', background:'#090d1a', overflow:'hidden', display:'flex', alignItems:'center', justifyContent:'center' }}>
                  {session?.user?.image
                    ? <Image src={session.user.image} alt="avatar" width={34} height={34} style={{ borderRadius:'50%' }} />
                    : <span style={{ fontSize:14, fontWeight:700, color:'#e8eaf0' }}>{session?.user?.name?.[0]}</span>
                  }
                </div>
              </div>
            </Link>
          </div>
      }
    </nav>
  );
}

<<<<<<< HEAD
const buttonStyle ={
    padding: '0.5rem 0.9rem',
    background: '#0070f3',
    color:'#fff',
    border: 'none',
    borderRadius:6,
    cursur:"pointer",
    fontSize:'1rem',
    // borderRadius:6,
    // cursur:"pointer"
    // color: '#fff',
};
=======
function GridOverlay() {
  return (
    <div style={{ position:'fixed', inset:0, pointerEvents:'none', zIndex:0,
      backgroundImage:'linear-gradient(rgba(0,229,255,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(0,229,255,0.03) 1px,transparent 1px)',
      backgroundSize:'60px 60px' }} />
  );
}
>>>>>>> 15103668fc0f30d62dc64d1073c0ea539e4e165d

function Orbs() {
  return (
    <>
      <div style={{ position:'fixed', width:500, height:500, borderRadius:'50%', background:'rgba(0,229,255,0.05)', filter:'blur(120px)', top:-100, left:-100, pointerEvents:'none', zIndex:0 }} />
      <div style={{ position:'fixed', width:400, height:400, borderRadius:'50%', background:'rgba(255,184,0,0.04)',  filter:'blur(120px)', bottom:100, right:-80, pointerEvents:'none', zIndex:0 }} />
    </>
  );
}

/* ── STYLES ── */
const S = {
  page: {
    minHeight:'100vh', background:'#050810', color:'#e8eaf0',
    fontFamily:"'Syne', sans-serif", position:'relative', overflowX:'hidden',
  },
  nav: {
    position:'sticky', top:0, zIndex:100,
    display:'flex', justifyContent:'space-between', alignItems:'center',
    padding:'16px 48px',
    background:'rgba(5,8,16,0.85)', backdropFilter:'blur(20px)',
    borderBottom:'1px solid rgba(255,255,255,0.07)',
  },
  navLogo: {
    display:'flex', alignItems:'center', gap:10,
    fontFamily:"'Space Mono',monospace", fontSize:15, fontWeight:700, color:'#00e5ff', letterSpacing:'-0.5px',
  },
  xpPill: {
    fontFamily:"'Space Mono',monospace", fontSize:12,
    padding:'6px 14px', background:'rgba(255,184,0,0.1)',
    border:'1px solid rgba(255,184,0,0.25)', borderRadius:20, color:'#ffb800',
  },
  main: {
    position:'relative', zIndex:1,
    maxWidth:1100, margin:'0 auto', padding:'40px 48px 80px',
  },
  profileHeader: {
    display:'flex', alignItems:'flex-start', gap:20, flexWrap:'wrap',
  },
  backBtn: {
    fontFamily:"'Space Mono',monospace", fontSize:11,
    padding:'7px 14px', background:'transparent',
    border:'1px solid rgba(255,255,255,0.1)',
    color:'#5a6070', borderRadius:6,
    cursor:'pointer', letterSpacing:'0.5px',
    transition:'all 0.2s', alignSelf:'flex-start',
  },
  card: {
    background:'#090d1a', border:'1px solid rgba(255,255,255,0.07)', borderRadius:12, overflow:'hidden',
  },
  cardHeader: {
    padding:'18px 24px', borderBottom:'1px solid rgba(255,255,255,0.07)',
    display:'flex', alignItems:'center', justifyContent:'space-between',
  },
  cardTitle: {
    fontFamily:"'Space Mono',monospace", fontSize:10,
    color:'#5a6070', textTransform:'uppercase', letterSpacing:2,
  },
  skel: { background:'rgba(255,255,255,0.05)', animation:'pulse 1.5s ease-in-out infinite' },
  signinWrap: {
    minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center',
    position:'relative', zIndex:1,
  },
  signinCard: {
    width:'100%', maxWidth:400, padding:'52px 44px',
    background:'#090d1a', border:'1px solid rgba(255,255,255,0.15)',
    borderRadius:16, textAlign:'center', position:'relative', overflow:'hidden',
  },
  signinLogo: {
    fontFamily:"'Space Mono',monospace", fontSize:12, color:'#00e5ff',
    letterSpacing:2, marginBottom:28,
    display:'flex', alignItems:'center', justifyContent:'center', gap:8,
  },
  signinBtn: {
    width:'100%', padding:15, background:'transparent',
    border:'1px solid rgba(255,255,255,0.15)', borderRadius:10,
    color:'#e8eaf0', fontFamily:"'Syne',sans-serif", fontSize:14, fontWeight:600,
    cursor:'pointer', transition:'all 0.2s',
  },
};

const fonts = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Syne:wght@400;500;600;700;800&display=swap');
  @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
  @keyframes spin   { to { transform: rotate(360deg); } }
  * { box-sizing: border-box; }
  body { margin: 0; }
  ::-webkit-scrollbar{width:6px}
  ::-webkit-scrollbar-track{background:#050810}
  ::-webkit-scrollbar-thumb{background:#3a3f50;border-radius:3px}
`;

const extra = ``;