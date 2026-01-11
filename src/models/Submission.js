// src/models/Submission.js
import mongoose from 'mongoose';

const SubmissionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  questionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question',
    required: true,
  },
  code: {
    type: String,
    required: true,
  },
  language: {
    type: String,
    required: true,
    enum: ['javascript', 'python'],
  },
  status: {
    type: String,
    required: true,
    enum: ['accepted', 'wrong_answer', 'runtime_error', 'time_limit_exceeded'],
    default: 'wrong_answer',
  },
  output: {
    type: String,
    default: '',
  },
  xpEarned: {
    type: Number,
    default: 0,
  },
  testsPassed: {
    type: Number,
    default: 0,
  },
  testsTotal: {
    type: Number,
    default: 0,
  },
  submittedAt: {
    type: Date,
    default: Date.now,
  },
});

// Indexes for faster queries
SubmissionSchema.index({ userId: 1, submittedAt: -1 });
SubmissionSchema.index({ questionId: 1 });
SubmissionSchema.index({ status: 1 });

export default mongoose.models.Submission || mongoose.model('Submission', SubmissionSchema);