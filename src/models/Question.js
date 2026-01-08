import mongoose from 'mongoose';

const QuestionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Hard', 'Extreme'],
    required: true,
  },
  xp: {
    type: Number,
    required: true,
  },
  testCases: [{
    input: String,
    expectedOutput: String,
  }],
  language: {
    type: String,
    enum: ['javascript', 'python'],
    required: true,
  },
}, {
  timestamps: true,
});

export default mongoose.models.Question || mongoose.model('Question', QuestionSchema);
