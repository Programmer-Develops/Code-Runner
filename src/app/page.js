'use client';

import { useSession, signIn, signOut } from 'next-auth/react';
import { useEffect, useState } from 'react';
import Leaderboard from '@/components/Leaderboard';

const fetchLeaderboard = async () => {
  try {
    const response = await fetch('/api/leaderboard');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return [];
  }
};

export default function Home() {
  const { data: session } = useSession();
  const [leaderboard, setLeaderboard] = useState([]);
  const [difficulty, setDifficulty] = useState('Easy');
  const [language, setLanguage] = useState('python');

  useEffect(() => {
    const loadLeaderboard = async () => {
      const data = await fetchLeaderboard();
      setLeaderboard(data);
    };
    loadLeaderboard();
  }, []);

  const startChallenge = () => {
    window.location.href = `/question?difficulty=${difficulty}&language=${language}`;
  };

  if (!session) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <h1 className="text-3xl font-bold mb-4">Welcome to Code Runner</h1>
          <p className="mb-6">Sign in to start solving coding challenges!</p>
          <button
            onClick={() => signIn('google')}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Sign in with Google
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Code Runner</h1>
          <div className="flex items-center gap-4">
            <span>Welcome, {session.user.name}!</span>
            <span className="font-bold">XP: {session.user.xp || 0}</span>
            <button
              onClick={() => signOut()}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Sign Out
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">Start a Challenge</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Difficulty:</label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="w-full p-2 border rounded"
              >
                <option value="Easy">Easy (5-20 XP)</option>
                <option value="Hard">Hard (21-60 XP)</option>
                <option value="Extreme">Extreme (61-110 XP)</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Language:</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full p-2 border rounded"
              >
                <option value="python">Python</option>                
                <option value="javascript">JavaScript | testing</option>
              </select>
            </div>
            <button
              onClick={startChallenge}
              className="w-full px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600"
            >
              Start Challenge
            </button>
          </div>

          <Leaderboard data={leaderboard} />
        </div>
      </div>
    </div>
  );
}
