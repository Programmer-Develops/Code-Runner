// src/app/api/submit/route.js
import connectToDatabase from '@/lib/mongodb';
import Submission from '@/models/Submission';
import User from '@/models/User';
import Question from '@/models/Question';

export async function POST(request) {
  try {
    const { userId, questionId, code, language, testResults, passed } = await request.json();

    // Validate required fields
    if (!userId || !questionId || !code || !language) {
      return Response.json({ 
        message: 'Missing required fields',
        error: 'userId, questionId, code, and language are required' 
      }, { status: 400 });
    }

    await connectToDatabase();

    // Find the question
    const question = await Question.findById(questionId);
    if (!question) {
      return Response.json({ 
        message: 'Question not found',
        error: 'Invalid question ID' 
      }, { status: 404 });
    }

    // Validate test results
    if (!testResults || !Array.isArray(testResults) || testResults.length === 0) {
      return Response.json({ 
        message: 'No test results provided',
        error: 'Please run tests before submitting' 
      }, { status: 400 });
    }

    // Calculate status based on test results
    const totalTests = question.testCases?.length || 0;
    const passedTests = testResults.filter(r => r.passed).length;
    const allPassed = passed || (passedTests === totalTests && totalTests > 0);

    let status;
    let xpEarned = 0;

    if (allPassed) {
      status = 'accepted';
      xpEarned = question.xp;
    } else if (passedTests > 0) {
      status = 'wrong_answer';
      // Partial XP (optional - you can remove this if you want all-or-nothing)
      xpEarned = Math.floor((passedTests / totalTests) * question.xp * 0.5);
    } else {
      status = 'wrong_answer';
      xpEarned = 0;
    }

    // Create output summary
    const outputSummary = testResults.map((result, idx) => ({
      testCase: idx + 1,
      passed: result.passed,
      input: result.input,
      expected: result.expected,
      actual: result.actual
    }));

    // Save submission
    const submission = new Submission({
      userId,
      questionId,
      code,
      language,
      status,
      output: JSON.stringify(outputSummary), // Store test results as JSON
      xpEarned,
      testsPassed: passedTests,
      testsTotal: totalTests,
      submittedAt: new Date()
    });

    await submission.save();

    // Update user XP
    if (xpEarned > 0) {
      await User.findByIdAndUpdate(
        userId, 
        { $inc: { xp: xpEarned } },
        { new: true }
      );
    }

    return Response.json({ 
      status: allPassed ? 'Accepted' : 'Wrong Answer',
      xpEarned,
      testsPassed: passedTests,
      testsTotal: totalTests,
      message: allPassed 
        ? `Perfect! All ${totalTests} test cases passed!` 
        : `${passedTests}/${totalTests} test cases passed`
    }, { status: 200 });

  } catch (error) {
    console.error('Error submitting code:', error);
    
    // Return detailed error for debugging
    return Response.json({ 
      message: 'Server error',
      error: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { status: 500 });
  }
}