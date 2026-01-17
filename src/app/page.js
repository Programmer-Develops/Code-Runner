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
      <div className="flex min-h-screen items-center justify-center bg-gray-950">
        <div className="bg-gray-900 p-10 rounded-xl shadow-2xl border border-gray-700 text-center w-full max-w-md">
          <h1 className="text-4xl font-bold text-white mb-6">Code Runner</h1>
          <p className="text-gray-400 mb-8 text-lg">
            Sign in to start solving coding challenges!
          </p>
          <button
            onClick={() => signIn('google')}
            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-medium rounded-lg hover:from-blue-700 hover:to-blue-600 transition-all duration-300 shadow-lg hover:shadow-blue-500/30"
          >
            Sign in with Google
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-6">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            Code Runner
          </h1>
          <div className="flex items-center gap-6 flex-wrap">
            <span className="text-gray-300">
              Welcome, <span className="font-semibold text-white">{session.user.name}</span>
            </span>
            <span className="bg-gray-800 px-4 py-1.5 rounded-full text-sm font-medium">
              XP: <span className="text-yellow-400">{session.user.xp || 0}</span>
            </span>
            <button
              onClick={() => signOut()}
              className="px-5 py-2.5 bg-red-600/90 hover:bg-red-700 
                       text-white rounded-lg transition-colors duration-200 font-medium"
            >
              Sign Out
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Start Challenge Card */}
          <div className="bg-gray-900 border border-gray-700 rounded-xl p-8 shadow-xl">
            <h2 className="text-3xl font-bold text-white mb-8">Start a Challenge</h2>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Difficulty
                </label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  className="w-full p-3.5 bg-gray-800 border border-gray-700 rounded-lg 
                           text-white focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 
                           outline-none transition-all"
                >
                  <option value="Easy">Easy (5-20 XP)</option>
                  <option value="Hard">Hard (21-60 XP)</option>
                  <option value="Extreme">Extreme (61-110 XP)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Language
                </label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full p-3.5 bg-gray-800 border border-gray-700 rounded-lg 
                           text-white focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 
                           outline-none transition-all"
                >
                  <option value="python">Python</option>
                  <option value="javascript">JavaScript | under testing</option>
                </select>
              </div>

              <button
                onClick={startChallenge}
                className="w-full py-4 mt-4 bg-gradient-to-r from-green-600 to-emerald-600 
                         hover:from-green-700 hover:to-emerald-700 
                         text-white font-medium rounded-lg transition-all duration-300 
                         shadow-lg hover:shadow-green-500/30 text-lg"
              >
                Start Challenge →
              </button>
            </div>
          </div>

          {/* Leaderboard */}
          <Leaderboard data={leaderboard} />
        </div>
      </div>
    </div>
  );
}