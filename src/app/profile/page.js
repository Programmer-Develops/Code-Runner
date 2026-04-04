'use client';

import { useEffect, useState } from 'react';
import { useSession, signIn } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { T } from '../../lib/design-tokens';

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
      .then(setProfile)
      .catch(() => setError('Unable to load profile'))
      .finally(() => setLoading(false));
  }, [session]);

  // ── LOADING ─────────────────────────────────────
  if (status === 'loading') {
    return (
      <div className="profile-page">
        <Mesh /><Noise />
        <NavBar skeleton />
        <main className="profile-main">
          <div className="profile-header">
            <div className="profile-avatar-container">
              <div className="profile-avatar skeleton" />
            </div>
            <div className="profile-info">
              <div className="skeleton" style={{ width: 240, height: 24, borderRadius: 6, marginBottom: 12 }} />
              <div className="skeleton" style={{ width: 180, height: 14, borderRadius: 4, marginBottom: 16 }} />
              <div className="profile-stats-row">
                {[90, 80, 100].map(w => <div key={w} className="skeleton" style={{ width: w, height: 28, borderRadius: 20 }} />)}
              </div>
            </div>
          </div>
          <div className="profile-content-grid">
            <div className="profile-activity-card">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="profile-activity-item">
                  <div className="profile-activity-left">
                    <div className="skeleton" style={{ width: 200, height: 13, borderRadius: 4, marginBottom: 8 }} />
                    <div className="skeleton" style={{ width: 130, height: 11, borderRadius: 4 }} />
                  </div>
                  <div className="skeleton" style={{ width: 72, height: 32, borderRadius: 8 }} />
                </div>
              ))}
            </div>
            <div className="profile-sidebar">
              {[180, 120, 100].map(h => <div key={h} className="skeleton" style={{ height: h, borderRadius: 16 }} />)}
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
      <div className="profile-page">
        <Mesh /><Noise />
        <div className="signin-wrap">
          <div className="signin-card">
            <div className="signin-glow" />

            <div className="signin-logo">
              <span className="text-mono text-xs text-accent-hi" style={{ letterSpacing: 1 }}>CODE RUNNER</span>
            </div>

            <h1 className="signin-title">
              Your Profile<span className="text-accent">.</span>
            </h1>
            <p className="signin-sub">
              Sign in to view your stats, badges and submission history.
            </p>

            <button
              className="signin-btn"
              onClick={() => signIn('google')}
            >
              <span style={{ width: 20, height: 20, background: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 900, color: '#4285f4' }}>G</span>
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
  const xp            = profile?.stats?.xp ?? session.user.xp ?? 0;
  const solved        = profile?.stats?.uniqueSolvedQuestions ?? 0;
  const attempted     = profile?.stats?.uniqueQuestionsAttempted ?? 0;
  const totalAttempts = profile?.stats?.totalAttempts ?? 0;
  const successRate   = attempted > 0 ? Math.round((solved / attempted) * 100) : 0;
  const level         = Math.floor(xp / 100) + 1;
  const levelXp       = xp % 100;

  return (
    <div className="profile-page">
      <Mesh /><Noise />

      <NavBar session={session} xp={xp} />

      <main className="profile-main">

        <div className="profile-header">

          <div className="profile-avatar-container">
            <div className="profile-avatar">
              {session.user.image
                ? <Image src={session.user.image} alt="avatar" width={100} height={100} style={{ objectFit: 'cover' }} />
                : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40 }}>👤</div>
              }
            </div>
            <div className="profile-online-indicator" />
          </div>

          <div className="profile-info">
            <div className="profile-name-row">
              <h1 className="profile-name">{session.user.name}</h1>
              <span className="badge badge-online">● Online</span>
              <span className="badge badge-level">Lv.{level}</span>
            </div>

            <p className="profile-email">{session.user.email}</p>

            <div className="profile-stats-row">
              {[
                { label: `${xp} XP`, color: T.amber, lo: T.amberLo, border: 'rgba(245,158,11,0.3)', icon: '⚡' },
                { label: `${solved} Solved`, color: T.green, lo: T.greenLo, border: 'rgba(16,185,129,0.3)', icon: '✓' },
                { label: `${successRate}% Win`, color: successRate >= 60 ? T.green : successRate >= 30 ? T.amber : T.red,
                  lo: successRate >= 60 ? T.greenLo : successRate >= 30 ? T.amberLo : T.redLo,
                  border: successRate >= 60 ? 'rgba(16,185,129,0.3)' : successRate >= 30 ? 'rgba(245,158,11,0.3)' : 'rgba(239,68,68,0.3)',
                  icon: '📊' },
              ].map(({ label, color, lo, border, icon }) => (
                <span key={label} className="stat-pill" style={{ background: lo, border: `1px solid ${border}`, color }}>
                  <span style={{ fontSize: 11 }}>{icon}</span>{label}
                </span>
              ))}
            </div>
          </div>

          <Link href="/" className="profile-home-btn">
            ← Home
          </Link>
        </div>

        <div className="profile-divider" />

        <div className="profile-content-grid">

          <div className="profile-activity-card">
            <div className="profile-card-header">
              <div className="profile-tab-buttons">
                {[['activity', 'Activity'], ['badges', 'Badges']].map(([id, label]) => (
                  <button key={id} onClick={() => setActiveTab(id)} className={`profile-tab-btn ${activeTab === id ? 'active' : ''}`}>
                    {label}
                  </button>
                ))}
              </div>
              {profile?.recent?.length > 0 && activeTab === 'activity' && (
                <span className="profile-submission-count">{profile.recent.length} submissions</span>
              )}
            </div>

            {activeTab === 'activity' && (
              <div>
                {loading && (
                  <div className="profile-loading">
                    <div className="profile-spinner" />
                    <p className="profile-loading-text">Loading activity...</p>
                  </div>
                )}

                {error && <div className="profile-error">{error}</div>}

                {!loading && !error && !profile?.recent?.length && (
                  <div className="profile-empty">
                    <div className="profile-empty-icon">{'{ }'}</div>
                    <p className="profile-empty-text">No submissions yet — start solving!</p>
                    <Link href="/" style={{ textDecoration: 'none' }}>
                      <button className="profile-start-btn">
                        ⚡ Start a challenge
                      </button>
                    </Link>
                  </div>
                )}

                <div className="profile-activity-list">
                  {profile?.recent?.map((item, i) => {
                    const ok = item.status === 'accepted';
                    const diffColor = item.difficulty === 'Easy' ? T.green : item.difficulty === 'Hard' ? T.amber : T.red;
                    return (
                      <div key={item.id || i} className="profile-activity-item">
                        <div className="profile-activity-left">
                          <div className={`profile-status-icon ${ok ? '' : 'failed'}`}>
                            {ok ? '✓' : '✗'}
                          </div>
                          <div className="profile-activity-details">
                            <div className="profile-question-title">
                              {item.questionTitle}
                            </div>
                            <div className="profile-activity-meta">
                              <span className={`profile-difficulty-badge ${item.difficulty.toLowerCase()}`} style={{ color: diffColor, background: item.difficulty === 'Easy' ? T.greenLo : item.difficulty === 'Hard' ? T.amberLo : T.redLo, border: `1px solid ${diffColor}44` }}>
                                {item.difficulty}
                              </span>
                              <span className="profile-tests-info">{item.testsPassed}/{item.testsTotal} tests</span>
                            </div>
                          </div>
                        </div>

                        <div className="profile-activity-right">
                          <div className={`profile-status-badge ${ok ? '' : 'failed'}`}>
                            {ok ? 'accepted' : item.status}
                          </div>
                          <div className="profile-xp-gained">+{item.xpEarned} XP</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {activeTab === 'badges' && (
              <div className="profile-badges-grid">
                {!profile?.badges?.length
                  ? (
                    <div className="profile-empty">
                      <div className="profile-empty-icon">🏅</div>
                      <p className="profile-empty-text">No badges yet — keep solving to earn them!</p>
                    </div>
                  ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: 12 }}>
                      {profile.badges.map(b => (
                        <div key={b.key} className="profile-badge-item">
                          <div className="profile-badge-glow" />
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

          <div className="profile-sidebar">

            <div className="profile-stats-card">
              <div className="profile-stats-header" />
              <div className="profile-stats-title">Stats</div>
              <div className="profile-stats-list">
                {[
                  { label: 'Total XP', val: xp, color: T.amber },
                  { label: 'Solved', val: solved, color: T.green },
                  { label: 'Attempted', val: attempted, color: T.accentHi },
                  { label: 'Submissions', val: totalAttempts, color: T.text },
                  { label: 'Win Rate', val: `${successRate}%`, color: successRate >= 60 ? T.green : successRate >= 30 ? T.amber : T.red },
                ].map(({ label, val, color }) => (
                  <div key={label} className="profile-stat-item">
                    <span className="profile-stat-label">{label}</span>
                    <span className="profile-stat-value" style={{ color }}>{val}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="profile-level-card">
              <div className="profile-level-header" />
              <div className="profile-level-title">Level Progress</div>
              <div className="profile-level-content">
                <div className="profile-level-info">
                  <div className="profile-level-badge">
                    {level}
                  </div>
                  <div className="profile-level-details">
                    <div className="profile-level-label">Level {level}</div>
                    <div className="profile-level-xp">{levelXp} / 100 XP</div>
                  </div>
                  <div className="profile-level-next">→ Lv.{level + 1}</div>
                </div>

                <div className="profile-level-progress">
                  <div className="profile-level-fill" style={{ width: `${levelXp}%`, background: `linear-gradient(90deg, ${T.accent}, ${T.accentHi})` }} />
                </div>
                <div className="profile-level-remaining">
                  {100 - levelXp} XP to next level
                </div>

                <div className="profile-milestones">
                  {[100, 500, 1000, 2500].map(milestone => {
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

            <div style={{ display: 'flex', gap: 10 }}>
              <Link href="/" style={{ textDecoration: 'none', flex: 1 }}>
                <button className="profile-challenge-btn">
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
    <nav className="nav">
      <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 28, height: 28, borderRadius: 8, background: `linear-gradient(135deg, ${T.accent}, #6d28d9)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, boxShadow: `0 0 14px ${T.accentLo}` }}>⚡</div>
        <span style={{ fontFamily: T.display, fontSize: 16, fontWeight: 800, color: T.text, letterSpacing: -0.5 }}>CodeRunner</span>
      </Link>

      {skeleton ? (
        <div style={{ display: 'flex', gap: 10 }}>
          <div className="skeleton" style={{ width: 80, height: 28, borderRadius: 20 }} />
          <div className="skeleton" style={{ width: 36, height: 36, borderRadius: '50%' }} />
        </div>
      ) : (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span className="xp-pill">
            ⚡ {xp} XP
          </span>
          <div style={{ width: 36, height: 36, borderRadius: '50%', background: `linear-gradient(135deg, ${T.accent}, ${T.green})`, padding: 2 }}>
            <div style={{ width: '100%', height: '100%', borderRadius: '50%', background: T.surface, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {session?.user?.image
                ? <Image src={session.user.image} alt="avatar" width={32} height={32} style={{ borderRadius: '50%', objectFit: 'cover' }} />
                : <span style={{ fontFamily: T.display, fontSize: 13, fontWeight: 700, color: T.text }}>{session?.user?.name?.[0]}</span>
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