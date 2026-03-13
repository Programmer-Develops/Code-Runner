'use client'

import { useEffect, useState } from "react"
import { useSession, signIn } from "react"
import Image from 'next/image'

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
        <div style={{ padding: "2rem" }}>
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
        </div>
    )
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
    color: '#fff',
    border: 'none',
    borderRadius:6,
    cursur: "pointer" 
    
};