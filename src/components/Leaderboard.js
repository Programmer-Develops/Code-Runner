'use client';

import Image from 'next/image';   // changed from <img/> to 'next/image'

export default function Leaderboard({ data }) {
  return (
    <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 md:p-8 shadow-xl">
      <h3 className="text-2xl md:text-3xl font-bold text-white mb-6 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
        Top Coders
      </h3>

      {data.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          No rankings yet. Be the first to climb the leaderboard!
        </div>
      ) : (
        <div className="space-y-3">
          {data.map((user, index) => (
            <div
              key={user._id}
              className={`flex items-center justify-between p-4 rounded-lg transition-all duration-200
                ${index === 0 
                  ? 'bg-gradient-to-r from-yellow-500/20 to-amber-500/10 border border-yellow-500/30' 
                  : 'bg-gray-800/50 hover:bg-gray-700/70 border border-gray-700'}`}
            >
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-700 font-bold text-lg text-gray-300">
                  {index + 1}
                </div>

                <div className="flex items-center gap-3">
                  {user.image ? (
                    <div className="relative w-10 h-10">  {/* wrapper div for fixed size */}
                      <Image
                        src={user.image}
                        alt={user.name || 'User'}
                        fill                // fills the parent div
                        className="rounded-full object-cover border-2 border-gray-600"
                        sizes="40px"         // exact size hint
                        priority={index === 0} // optional: load top user faster
                      />
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-gray-400 font-semibold">
                      {user.name?.[0]?.toUpperCase() || '?'}
                    </div>
                  )}

                  <span className="font-medium text-gray-100 truncate max-w-[180px] md:max-w-[260px]">
                    {user.name || 'Anonymous'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="font-bold text-lg text-yellow-400">
                  {user.xp?.toLocaleString() || 0}
                </span>
                <span className="text-sm text-gray-500">XP</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}