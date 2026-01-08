'use client';

export default function Leaderboard({ data }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-bold mb-4">Top Coders</h3>
      <div className="space-y-2">
        {data.map((user, index) => (
          <div key={user._id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
            <div className="flex items-center gap-3">
              <span className="font-bold text-lg">{index + 1}.</span>
              <img src={user.image} alt={user.name} className="w-8 h-8 rounded-full" />
              <span>{user.name}</span>
            </div>
            <span className="font-bold">{user.xp} XP</span>
          </div>
        ))}
      </div>
    </div>
  );
}
