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
    borderRadius: 6,
    cursor: 'pointer',
};