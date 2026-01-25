# Code Runner

A dynamic, AI-powered coding challenge platform that generates unique problems in real-time, providing an engaging and adaptive learning experience for developers.

## Problem Description

Traditional coding platforms often rely on static question banks, which students eventually memorize or find repetitive. Furthermore, beginners often struggle with "tutorial hell," where they follow instructions but fail to apply logic independently. There is a lack of platforms that provide an infinite stream of unique, difficulty-adjusted challenges that adapt to a user's skill level while maintaining a competitive, engaging environment.

## Objectives

- **Making Learning Interactive**: Build a real-time global leaderboard that motivates students to practice consistently.
- **Seamless Code Execution**: Provide a browser-based code execution environment (IDE) that removes the friction of local setup for learners.

## Proposed Solution

A Full-Stack web application that integrates AI for intelligent problem generation. The interface consists of a Home page and a dual-pane dashboard featuring a markdown-rendered problem statement on the left and a full-featured code editor on the right. When a user selects a difficulty, the system prompts AI to generate a problem, test cases, and a starter function. User code is sent to a secure backend sandbox where it is tested against AI-generated cases. Successful submissions update the user's MongoDB profile with XP points (5-20 for Easy, 21-60 for Hard, 61-110 for Extreme), which are reflected on a site-wide Leaderboard.

## Tech Stack

- **Frontend**: Next.js 16, React 19, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: MongoDB with Mongoose
- **Authentication**: NextAuth.js with Google OAuth
- **AI**: Google Gemini AI for problem generation
- **Code Editor**: Monaco Editor (VS Code's editor)
- **Code Execution**: Server-side sandbox for Python and JavaScript
- **Styling**: Tailwind CSS with custom gradients

## Project Structure

```
coderunner/
 src/
    app/
       api/
          auth/[...nextauth]/
             route.js          # NextAuth configuration
          execute/
             route.js          # Code execution endpoint
          leaderboard/
             route.js          # Leaderboard data endpoint
          questions/
             route.js          # AI question generation
          submit/
              route.js          # Submission handling
       question/
          page.js               # Challenge interface
       globals.css               # Global styles
       layout.js                 # Root layout with providers
       page.js                   # Home page
    components/
       CodeEditor.js             # Monaco editor component
       Leaderboard.js            # Leaderboard display
       SessionProvider.js        # NextAuth session provider
    lib/
       mongodb.js                # Database connection
    models/
        Question.js               # Question schema
        Submission.js             # Submission schema
        User.js                   # User schema
 package.json                      # Dependencies and scripts
 next.config.mjs                  # Next.js configuration
 tailwind.config.mjs              # Tailwind configuration
 postcss.config.mjs               # PostCSS configuration
 jsconfig.json                    # JavaScript configuration
 eslint.config.mjs                # ESLint configuration
```

## Workflow

### 1. User Authentication
- Users sign in using Google OAuth via NextAuth.js
- Upon first sign-in, a user profile is created in MongoDB with initial XP of 0
- Session includes user ID and current XP for real-time updates

### 2. Home Page
- Displays global leaderboard (top 10 users by XP)
- Shows current user's XP and name
- Allows selection of difficulty (Easy/Hard/Extreme) and language (Python/JavaScript)
- "Start Challenge" button redirects to /question with selected parameters

### 3. Challenge Generation
- /api/questions endpoint receives difficulty and language
- Uses Google Gemini AI to generate:
  - Problem title and description
  - 3 test cases with input/output pairs
- Assigns random XP value based on difficulty:
  - Easy: 5-20 XP
  - Hard: 21-60 XP
  - Extreme: 61-110 XP
- Saves question to MongoDB and returns to frontend

### 4. Coding Interface
- Dual-pane layout: problem description (left), code editor (right)
- Monaco Editor provides syntax highlighting and IntelliSense
- Pre-populated code template based on selected language
- Real-time code editing with dark theme

### 5. Code Execution
- "Run Tests" button sends code to /api/execute
- Server-side execution in isolated environment:
  - Python: Uses python subprocess
  - JavaScript: Uses 
ode subprocess
- Executes code against each test case input
- Returns output for comparison with expected results
- Displays results in tabbed interface (Test Cases/Results)

### 6. Submission
- "Submit" button sends code and test results to /api/submit
- Validates all test cases pass for full XP reward
- Creates submission record in MongoDB
- Updates user XP if successful
- Shows success/failure message with XP earned

### 7. Leaderboard Updates
- /api/leaderboard fetches top 10 users sorted by XP
- Real-time updates on home page
- Displays user avatars, names, and XP scores

## Database Models

### User
`javascript
{
  name: String,
  email: String (unique),
  image: String,
  xp: Number (default: 0)
}
`

### Question
`javascript
{
  title: String,
  description: String,
  difficulty: String (Easy/Hard/Extreme),
  xp: Number,
  testCases: [{
    input: String,
    expectedOutput: String
  }],
  language: String (javascript/python)
}
`

### Submission
`javascript
{
  userId: ObjectId (ref: User),
  questionId: ObjectId (ref: Question),
  code: String,
  language: String,
  status: String (accepted/wrong_answer/runtime_error/time_limit_exceeded),
  output: String,
  xpEarned: Number,
  testsPassed: Number,
  testsTotal: Number,
  submittedAt: Date
}
`

## API Endpoints

### POST /api/questions
Generates AI-powered coding questions.
- **Input**: { difficulty, language }
- **Output**: Question object with test cases

### POST /api/execute
Executes user code against test inputs.
- **Input**: { code, language, input }
- **Output**: { status, output }

### POST /api/submit
Handles code submissions and XP updates.
- **Input**: { userId, questionId, code, language, testResults, passed }
- **Output**: { status, xpEarned, testsPassed, testsTotal, message }

### GET /api/leaderboard
Retrieves top 10 users by XP.
- **Output**: Array of user objects with name, xp, image

### /api/auth/[...nextauth]
NextAuth.js authentication routes for Google OAuth.

## Environment Variables

Create a .env.local file with:

`env
# Database
MONGODB_URI=mongodb://localhost:27017/coderunner

# Authentication
NEXTAUTH_SECRET=your-secret-key
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# AI
GEMINI_API_KEY=your-gemini-api-key
`

## Installation & Setup

1. **Clone the repository**
   `ash
   git clone <repository-url>
   cd coderunner
   `

2. **Install dependencies**
   `ash
   npm install
   `

3. **Set up environment variables**
   - Copy .env.example to .env.local
   - Fill in your MongoDB URI, Google OAuth credentials, and Gemini API key

4. **Start MongoDB**
   - Ensure MongoDB is running locally or use a cloud service like MongoDB Atlas

5. **Run the development server**
   `ash
   npm run dev
   `

6. **Open your browser**
   - Navigate to http://localhost:3000

## Build & Deployment

### Development
`ash
npm run dev      # Start development server
npm run lint     # Run ESLint
`

### Production
`ash
npm run build    # Build for production
npm run start    # Start production server
`

## Features

- **AI-Generated Problems**: Infinite unique challenges using Google Gemini AI
- **Real-time Leaderboard**: Global ranking system with XP rewards
- **Multi-language Support**: Python and JavaScript execution
- **Secure Code Execution**: Server-side sandboxing prevents malicious code
- **Responsive Design**: Works on desktop and mobile devices
- **Dark Theme**: Modern UI with Tailwind CSS
- **Authentication**: Google OAuth integration
- **Progress Tracking**: XP system for gamification

## Security Considerations

- Code execution is sandboxed on the server
- Input validation for all API endpoints
- Secure environment variable handling
- NextAuth.js for secure authentication
- MongoDB connection with proper error handling

## Future Enhancements

- Additional programming languages (Java, C++, etc.)
- Code quality analysis and suggestions
- Collaborative coding challenges
- Time-based competitions
- Achievement system and badges
- Detailed submission history and analytics
- Mobile app companion

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.
