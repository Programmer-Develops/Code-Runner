import connectToDatabase from '@/lib/mongodb';
import Submission from '@/models/Submission';
import User from '@/models/User';
import Question from '@/models/Question';

export async function POST(request) {
  try {
    const { userId, questionId, code, language, output } = await request.json();

    await connectToDatabase();

    const question = await Question.findById(questionId);
    if (!question) {
      return Response.json({ error: 'Question not found' }, { status: 404 });
    }

    // Simple validation: check if output matches expected for first test case
    const expectedOutput = question.testCases[0].expectedOutput.trim();
    const actualOutput = output.trim();
    const status = actualOutput === expectedOutput ? 'accepted' : 'wrong_answer';

    const xpEarned = status === 'accepted' ? question.xp : 0;

    // Save submission
    const submission = new Submission({
      userId,
      questionId,
      code,
      language,
      status,
      output,
      xpEarned,
    });

    await submission.save();

    // Update user XP if accepted
    if (status === 'accepted') {
      await User.findByIdAndUpdate(userId, { $inc: { xp: xpEarned } });
    }

    return Response.json({ status, xpEarned });
  } catch (error) {
    console.error('Error submitting code:', error);
    return Response.json({ error: 'Failed to submit code' }, { status: 500 });
  }
}
