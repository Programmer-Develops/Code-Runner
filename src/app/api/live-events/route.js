// src/app/api/live-events/route.js
import connectToDatabase from '@/lib/mongodb';
import Submission from '@/models/Submission';
import User from '@/models/User';
import Question from '@/models/Question';

export async function GET(request) {
  try {
    await connectToDatabase();

    // Get recent successful submissions (last 24 hours)
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const recentSubmissions = await Submission.find({
      status: 'accepted',
      submittedAt: { $gte: twentyFourHoursAgo }
    })
    .populate('userId', 'name')
    .populate('questionId', 'difficulty xp')
    .sort({ submittedAt: -1 })
    .limit(20);

    // Format the data like the mock events
    const liveEvents = await Promise.all(recentSubmissions.map(async (submission) => {
      const user = submission.userId;
      const question = submission.questionId;

      // Calculate time ago
      const now = new Date();
      const submittedAt = new Date(submission.submittedAt);
      const diffMs = now - submittedAt;
      const diffMins = Math.floor(diffMs / (1000 * 60));

      let timeAgo;
      if (diffMins < 1) {
        timeAgo = 'now';
      } else if (diffMins < 60) {
        timeAgo = `${diffMins}m ago`;
      } else {
        const diffHours = Math.floor(diffMins / 60);
        timeAgo = `${diffHours}h ago`;
      }

      return {
        type: 'solve',
        user: user.name.split(' ')[0], // First name only
        diff: question.difficulty,
        xp: submission.xpEarned,
        time: timeAgo
      };
    }));

    // If we have fewer than 5 events, add some ranking events
    if (liveEvents.length < 5) {
      // Get recent users who gained XP
      const recentUsers = await User.find({
        updatedAt: { $gte: twentyFourHoursAgo }
      })
      .sort({ updatedAt: -1 })
      .limit(5 - liveEvents.length);

      const rankEvents = recentUsers.map(user => ({
        type: 'rank',
        user: user.name.split(' ')[0],
        time: 'recently'
      }));

      liveEvents.push(...rankEvents);
    }

    // If still no events, return a default message
    if (liveEvents.length === 0) {
      return Response.json([{
        type: 'info',
        user: 'System',
        time: 'now',
        message: 'No recent activity. Be the first to solve a challenge!'
      }]);
    }

    return Response.json(liveEvents);

  } catch (error) {
    console.error('Error fetching live events:', error);
    return Response.json({ 
      message: 'Server error',
      error: error.message 
    }, { status: 500 });
  }
}