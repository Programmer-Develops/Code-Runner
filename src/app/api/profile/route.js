import connectToDatabase from "@/lib/mongodb";
import User from "@/models/User";
import Submission from "@/models/Submission";
import Question from "@/models/Question";

export async function GET(request) {
  try {
    const url = new URL(request.url);
    const userId = url.searchParams.get("userId");

    if (!userId) {
      return Response.json(
        { error: "Missing userId query parameter" },
        { status: 400 },
      );
    }

    await connectToDatabase();

    const user = await User.findById(userId).select("name email image xp");
    if (!user)
      return Response.json({ error: "User not found" }, { status: 404 });

    const submissions = await Submission.find({ userId })
      .sort({ submittedAt: -1 })
      .limit(200)
      .populate("questionId", "title difficulty xp");

    const totalAttempts = submissions.length;
    const uniqueQuestionsAttempted = new Set(
      submissions.map((s) => s.questionId?._id?.toString()),
    ).size;

    const acceptedSubmissions = submissions.filter(
      (s) => s.status === "accepted",
    );
    const uniqueSolvedQuestions = new Set(
      acceptedSubmissions.map((s) => s.questionId?._id?.toString()),
    ).size;

    const recent = submissions.map((s) => ({
      id: s._id,
      questionId: s.questionId?._id,
      questionTitle: s.questionId?.title || "Unknown Question",
      difficulty: s.questionId?.difficulty || "Unknown",
      xpEarned: s.xpEarned || 0,
      status: s.status,
      testsPassed: s.testsPassed,
      testsTotal: s.testsTotal,
      submittedAt: s.submittedAt,
    }));

    const badges = [];

    // XP based badges
    if (user.xp >= 1000)
      badges.push({
        key: "elite",
        name: "Elite",
        emoji: "💎",
        desc: "1000+ XP",
      });
    if (user.xp >= 500)
      badges.push({ key: "gold", name: "Gold", emoji: "🥇", desc: "500+ XP" });
    if (user.xp >= 200)
      badges.push({
        key: "silver",
        name: "Silver",
        emoji: "🥈",
        desc: "200+ XP",
      });
    if (user.xp >= 50)
      badges.push({
        key: "bronze",
        name: "Bronze",
        emoji: "🥉",
        desc: "50+ XP",
      });

    // Achievement badges
    if (uniqueSolvedQuestions >= 1)
      badges.push({
        key: "first_solve",
        name: "First Solve",
        emoji: "✨",
        desc: "Solved your first problem",
      });

    if (uniqueSolvedQuestions >= 10)
      badges.push({
        key: "problem_solver",
        name: "Problem Solver",
        emoji: "🔥",
        desc: "Solved 10 problems",
      });

    if (uniqueSolvedQuestions >= 50)
      badges.push({
        key: "expert",
        name: "Expert Solver",
        emoji: "🧠",
        desc: "Solved 50 problems",
      });

    const stats = {
      totalAttempts,
      uniqueQuestionsAttempted,
      uniqueSolvedQuestions,
      xp: user.xp,
    };

    // Use Question model to provide question stats and recommendations
    const totalQuestions = await Question.countDocuments();
    const difficultyAgg = await Question.aggregate([
      { $group: { _id: "$difficulty", count: { $sum: 1 } } },
    ]);
    const difficultyCounts = {};
    difficultyAgg.forEach((d) => {
      difficultyCounts[d._id || "Unknown"] = d.count;
    });

    // Recommend a few questions the user hasn't attempted yet
    const attemptedIds = Array.from(
      new Set(submissions.map((s) => s.questionId?._id).filter(Boolean)),
    ).map((id) => id.toString());
    const recommended = await Question.find(
      attemptedIds.length ? { _id: { $nin: attemptedIds } } : {},
    )
      .select("title difficulty xp")
      .limit(5)
      .lean();

    const questionStats = { totalQuestions, difficultyCounts };

    return Response.json({
      user,
      stats,
      recent,
      badges,
      questionStats,
      recommended,
    });
  } catch (error) {
    console.error("Profile API error:", error);
    return Response.json({ error: "Failed to fetch profile" }, { status: 500 });
  }
}
