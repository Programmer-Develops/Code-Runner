'use client';

import { useEffect, useState } from 'react';
import { useSession, signIn } from 'next-auth/react';
import Image from 'next/image';

export default function ProfilePage() {
  const { data: session } = useSession();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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

  if (!session) {
    return (
      <div style={{ padding: '2rem' }}>
        <h2>Profile</h2>
        <p>Please sign in to view your profile.</p>
        <button onClick={() => signIn()} style={buttonStyle}>Sign in</button>
      </div>
    );
  }

  return (
    
    <div style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
        <div style={{ width: 96, height: 96, borderRadius: 12, overflow: 'hidden', background: '#f3f3f3' }}>
          {session.user.image ? (
            <Image src={session.user.image} alt="avatar" width={96} height={96} />
          ) : (
            <div style={{ width: '100%', height: '100%', display: 'grid', placeItems: 'center' }}>👤</div>
          )}
        </div>
        <div>
          <h1 style={{ margin: 0 }}>{session.user.name}</h1>
          <p style={{ margin: 0, color: 'var(--muted)' }}>{session.user.email}</p>
          <div style={{ marginTop: 8 }}>
            <strong>XP:</strong> {profile?.stats?.xp ?? session.user.xp ?? 0}
          </div>
        </div>
      </div>

      <hr style={{ margin: '1.5rem 0' }} />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '1.5rem' }}>
        <main style={{ background: 'var(--card-background)', color: 'var(--card-foreground)', padding: '1rem', borderRadius: 8 }}>
          <h2 style={{ marginTop: 0 }}>Activity</h2>

          {loading && <p>Loading recent activity...</p>}
          {error && <p style={{ color: 'red' }}>{error}</p>}

          {!loading && profile?.recent?.length === 0 && <p>No activity yet. Start solving problems to see activity here!</p>}

          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {profile?.recent?.map((item) => (
              <li key={item.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: '1px solid var(--border)' }}>
                <div>
                  <div style={{ fontWeight: 600 }}>{item.questionTitle}</div>
                  <div style={{ color: 'var(--muted)' }}>{item.difficulty} • {item.testsPassed}/{item.testsTotal} tests</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 700 }}>{item.status === 'accepted' ? '✅ Accepted' : item.status}</div>
                  <div style={{ color: 'var(--muted)' }}>{item.xpEarned} XP</div>
                </div>
              </li>
            ))}
          </ul>
        </main>

        <aside style={{ background: 'var(--card-background)', color: 'var(--card-foreground)', padding: '1rem', borderRadius: 8 }}>
          <h3 style={{ marginTop: 0 }}>Stats</h3>
          <div style={{ display: 'grid', gap: 8 }}>
            <Stat label="XP" value={profile?.stats?.xp ?? session.user.xp ?? 0} />
            <Stat label="Problems Solved" value={profile?.stats?.uniqueSolvedQuestions ?? 0} />
            <Stat label="Problems Attempted" value={profile?.stats?.uniqueQuestionsAttempted ?? 0} />
            <Stat label="Total Attempts" value={profile?.stats?.totalAttempts ?? 0} />
          </div>

          <hr style={{ margin: '1rem 0' }} />

          <h3 style={{ margin: '0 0 8px 0' }}>Badges</h3>
          {profile?.badges?.length === 0 && <p>No badges yet — keep solving to earn badges!</p>}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {profile?.badges?.map(b => (
              <div key={b.key} style={{ padding: '0.5rem 0.6rem', borderRadius: 8, background: 'var(--badge-bg)', minWidth: 120, textAlign: 'center', boxShadow: 'inset 0 -1px 0 rgba(0,0,0,0.02)' }}>
                <div style={{ fontSize: 20 }}>{b.emoji}</div>
                <div style={{ fontWeight: 600 }}>{b.name}</div>
                <div style={{ color: 'var(--muted)', fontSize: 12 }}>{b.desc}</div>
              </div>
            ))}
          </div>
        </aside>
      </div>

    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0' }}>
      <div style={{ color: 'var(--muted)' }}>{label}</div>
      <div style={{ fontWeight: 700 }}>{value}</div>
    </div>
  );
}

const buttonStyle = {
    padding: '0.5rem 0.9rem',
    background: '#0070f3',
    color:'#fff',
    border: 'none',
    borderRadius:6,
    cursur:"pointer"
    // borderRadius:6,
    // cursur:"pointer"
    // color: '#fff',
};

