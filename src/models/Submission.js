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
    enum: ['javascript', 'python'],
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'wrong_answer', 'error'],
    default: 'pending',
  },
  output: {
    type: String,
  },
  xpEarned: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

export default mongoose.models.Submission || mongoose.model('Submission', SubmissionSchema);
