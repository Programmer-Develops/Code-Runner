import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';

export async function GET() {
  try {
    await connectToDatabase();

    const leaderboard = await User.find({})
      .sort({ xp: -1 })
      .limit(10)
      .select('name xp image');

    return Response.json(leaderboard);
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return Response.json({ error: 'Failed to fetch leaderboard' }, { status: 500 });
  }
}
