# DevNotes Backend

This backend provides a comprehensive REST API for the DevNotes developer learning platform.

## Features Implemented

### Phase 1: Blog & Content
- Blog post CRUD operations
- Pagination
- Category filtering
- Search support
- Slug generation
- MongoDB persistence with Mongoose
- Centralized error handling
- Request validation with Zod

### Phase 2: Authentication & User Management
- User authentication (register, login, logout)
- JWT-based authentication
- User profile management
- Password change
- User and admin roles
- Authentication middleware
- Admin authorization middleware
- Admin seed/setup
- Password hashing with bcrypt

### Phase 3: Tutorials & Video Learning
- Tutorial CRUD operations
- Lesson management
- Tutorial progress tracking
- Video learning support (external URLs)
- Search and filtering (category, difficulty, featured)
- Pagination and sorting
- User learning dashboard
- Lesson completion tracking
- Progress percentage calculation

### Phase 4: Quizzes & Assessments
- Quiz CRUD operations
- Quiz question management
- Quiz attempts and submissions
- Score calculation and grading
- Pass/fail determination
- Quiz results with explanations
- User quiz history
- Publishing system for quizzes

### Phase 5: Newsletter & Notifications
- Newsletter subscription management
- Subscription status tracking
- User notifications system
- Notification preferences
- Read/unread notification tracking
- Announcement creation (admin)
- Newsletter subscriber management (admin)

### Phase 6: AI Assistant & Learning Recommendations
- AI-powered chat assistant
- Context-aware responses (tutorial/lesson context)
- Conversation history management
- Personalized learning recommendations
- AI provider abstraction (OpenAI, Anthropic)
- Intelligent tutorial suggestions based on progress and quiz performance

### Phase 7: AI Learning Assistant
- Enhanced AI-powered chat assistant with request logging
- Content explainer with difficulty levels (beginner, intermediate, advanced)
- Progressive hinting system for guided problem solving
- Concise lesson summarizing capability
- Comprehensive administrative dashboard for AI usage and token tracking

### Phase 8: Community & Discussions
- Discussion CRUD operations with optional tutorial association and custom tags
- Paginated listing with search, sorting, tag, and tutorial filtering
- Nestable comment and reply tree structures for threaded communication
- Upvote/like support for discussions and comments with duplicate prevention
- Content reporting flow for inappropriate discussions or comments
- Admin content moderation (deleting any discussion/comment, locking/unlocking threads, managing reports)

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy the example environment file and adjust values if needed:
   ```bash
   copy .env.example .env
   ```
3. Start MongoDB locally and ensure the connection string in `.env` points to it.

4. **Seed admin account** (required for creating/editing blog posts and tutorials):
   ```bash
   npm run seed:admin
   ```
   
   This will create an admin account using the credentials from your `.env` file:
   - `ADMIN_NAME` (default: "Admin User")
   - `ADMIN_EMAIL` (default: "admin@devnotes.com")
   - `ADMIN_PASSWORD` (default: "admin123456")
   
   **⚠️ Important**: Change the default admin password after first login!
   
   **Note**: Running the seed multiple times is safe - it will not create duplicate accounts.

6. **Seed tutorial data** (optional - for development/testing):
   ```bash
   npm run seed:tutorials
   ```
   
   This will populate the database with sample tutorials and lessons.

7. **Seed quiz data** (optional - for development/testing):
   ```bash
   npm run seed:quizzes
   ```
   
   This will populate the database with sample quizzes and questions.
   **Note**: Tutorials must be seeded first.

8. Start the API:
   ```bash
   npm run dev
   ```

## AI Configuration (Phase 6)

The AI assistant feature requires configuration of an external AI provider. 

### Supported Providers

1. **OpenAI** (ChatGPT)
   - Set `AI_PROVIDER=openai`
   - Set `AI_MODEL=gpt-3.5-turbo` (or `gpt-4`)
   - Get your API key from: https://platform.openai.com/api-keys

2. **Anthropic** (Claude)
   - Set `AI_PROVIDER=anthropic`
   - Set `AI_MODEL=claude-3-sonnet-20240229` (or other Claude models)
   - Get your API key from: https://console.anthropic.com/

### Environment Variables

Add these to your `.env` file:

```env
AI_PROVIDER=openai
AI_API_KEY=your_actual_api_key_here
AI_MODEL=gpt-3.5-turbo
```

**⚠️ Important Security Notes:**
- Never commit your actual API key to version control
- Keep your API keys in `.env` (which is gitignored)
- The `.env.example` file shows the format but should never contain real keys
- AI API calls may incur costs - monitor your usage

### Development Mode

If no API key is configured, the AI service will operate in fallback mode with simple pattern-matching responses. This allows development and testing without API costs, but responses will be limited.

### AI Features

- **Chat Assistant**: Ask programming questions and get AI-powered explanations
- **Context-Aware Help**: Include tutorial/lesson context for focused answers
- **Conversation History**: Past conversations are saved and can be retrieved
- **Learning Recommendations**: AI analyzes your progress and suggests next tutorials
- **Personalized Suggestions**: Based on completed tutorials, quiz performance, and learning patterns

## Available endpoints

### Health Check
- `GET /health`

### Authentication
- `POST /api/auth/register` - Register a new user account
- `POST /api/auth/login` - Login with email and password
- `POST /api/auth/logout` - Logout current user
- `GET /api/auth/me` - Get current user profile
- `GET /api/auth/profile` - Get user profile (alias)
- `PUT /api/auth/profile` - Update user profile (name, avatar, bio)
- `PUT /api/auth/change-password` - Change user password

### Blog Posts
- `GET /api/posts` - Get all posts (public)
- `GET /api/posts/:slug` - Get single post by slug (public)
- `POST /api/posts` - Create new post (admin only)
- `PUT /api/posts/:id` - Update post (admin only)
- `DELETE /api/posts/:id` - Delete post (admin only)

### Tutorials (Phase 3)
- `GET /api/tutorials` - Get all tutorials with pagination, search, filtering (public)
  - Query params: `page`, `limit`, `category`, `difficulty`, `featured`, `search`, `sort`
- `GET /api/tutorials/:slug` - Get single tutorial by slug (public)
- `POST /api/tutorials` - Create new tutorial (admin only)
- `PATCH /api/tutorials/:id` - Update tutorial (admin only)
- `DELETE /api/tutorials/:id` - Delete tutorial (admin only)

### Lessons (Phase 3)
- `GET /api/tutorials/:tutorialId/lessons` - Get lessons for a tutorial (public)
- `POST /api/tutorials/:tutorialId/lessons` - Create lesson (admin only)
- `PATCH /api/lessons/:id` - Update lesson (admin only)
- `DELETE /api/lessons/:id` - Delete lesson (admin only)

### Tutorial Progress (Phase 3)
- `POST /api/tutorials/:id/start` - Start a tutorial (authenticated)
- `POST /api/tutorials/:tutorialId/lessons/:lessonId/complete` - Mark lesson complete (authenticated)
- `GET /api/tutorials/:id/progress` - Get user's tutorial progress (authenticated)
- `GET /api/users/me/learning` - Get user's learning dashboard (authenticated)

### Quizzes (Phase 4)
- `GET /api/quizzes` - Get all quizzes with pagination, search, filtering (public)
  - Query params: `page`, `limit`, `tutorial`, `search`
- `GET /api/quizzes/:id` - Get single quiz with questions (public, no correct answers exposed)
- `POST /api/quizzes` - Create new quiz (admin only)
- `PATCH /api/quizzes/:id` - Update quiz (admin only)
- `DELETE /api/quizzes/:id` - Delete quiz (admin only)

### Quiz Questions (Phase 4)
- `GET /api/quizzes/:quizId/questions` - Get questions for a quiz (public, no correct answers)
- `POST /api/quizzes/:quizId/questions` - Create question (admin only)
- `PATCH /api/questions/:id` - Update question (admin only)
- `DELETE /api/questions/:id` - Delete question (admin only)

### Quiz Attempts (Phase 4)
- `POST /api/quizzes/:id/start` - Start a quiz attempt (authenticated)
- `POST /api/quizzes/:id/submit` - Submit quiz answers (authenticated)
- `GET /api/quizzes/:id/results` - Get user's quiz results (authenticated)
- `GET /api/users/me/quizzes` - Get user's quiz history (authenticated)

### Newsletter (Phase 5)
- `POST /api/newsletter/subscribe` - Subscribe to newsletter (public)
- `POST /api/newsletter/unsubscribe` - Unsubscribe from newsletter (public)
- `GET /api/newsletter/status` - Get subscription status (authenticated)

### Notifications (Phase 5)
- `GET /api/notifications` - Get user notifications (authenticated)
- `GET /api/notifications/unread-count` - Get unread notification count (authenticated)
- `PATCH /api/notifications/read-all` - Mark all notifications as read (authenticated)
- `PATCH /api/notifications/:id/read` - Mark notification as read (authenticated)
- `DELETE /api/notifications/:id` - Delete notification (authenticated)

### User Notification Preferences (Phase 5)
- `GET /api/users/me/notification-preferences` - Get notification preferences (authenticated)
- `PUT /api/users/me/notification-preferences` - Update notification preferences (authenticated)

### Admin - Newsletter & Notifications (Phase 5)
- `GET /api/admin/newsletter/subscribers` - Get all newsletter subscribers (admin only)
- `DELETE /api/admin/newsletter/subscribers/:id` - Delete subscriber (admin only)
- `POST /api/admin/notifications/announcement` - Create announcement notification for all users (admin only)

### AI Assistant (Phase 6)
- `POST /api/ai/chat` - Send a message to the AI assistant (authenticated)
- `GET /api/ai/conversations` - Get user's conversation history (authenticated)
- `GET /api/ai/conversations/:id` - Get specific conversation (authenticated)
- `DELETE /api/ai/conversations/:id` - Delete conversation (authenticated)
- `GET /api/ai/recommendations` - Get personalized learning recommendations (authenticated)

### AI Learning Assistant (Phase 7)
- `POST /api/ai/explain` - Get a learner-friendly explanation for a concept or code snippet (authenticated)
- `POST /api/ai/hint` - Get a guided hint without getting the complete answer directly (authenticated)
- `POST /api/ai/summarize` - Get a concise summary of lesson content (authenticated)
- `GET /api/admin/ai/usage` - Get aggregate AI usage and token tracking reports (admin only)

### Community Discussions (Phase 8)
- `GET /api/discussions` - List discussions with pagination, search, tutorial, tag filtering (public)
- `GET /api/discussions/:id` - Retrieve discussion details with nested comments/replies tree (public)
- `POST /api/discussions` - Create a new discussion thread (authenticated)
- `PATCH /api/discussions/:id` - Update discussion title, content, or tags (owner/admin only)
- `DELETE /api/discussions/:id` - Delete discussion and cascade comments (owner/admin only)
- `POST /api/discussions/:id/like` - Like/upvote a discussion (authenticated)
- `DELETE /api/discussions/:id/like` - Remove a like/upvote from a discussion (authenticated)
- `PATCH /api/discussions/:id/lock` - Lock/unlock comments on a discussion (admin only)
- `GET /api/discussions/:discussionId/comments` - List comments for a discussion (public)
- `POST /api/discussions/:discussionId/comments` - Create comment or reply (authenticated)
- `PATCH /api/comments/:id` - Edit comment content (owner/admin only)
- `DELETE /api/comments/:id` - Delete comment and cascade replies (owner/admin only)
- `POST /api/comments/:id/like` - Like/upvote a comment (authenticated)
- `DELETE /api/comments/:id/like` - Remove a like/upvote from a comment (authenticated)
- `POST /api/reports` - Submit report for inappropriate content (authenticated)
- `GET /api/admin/reports` - List reports (admin only)
- `PATCH /api/admin/reports/:id` - Resolve/update report status (admin only)

## Example requests

### Register a new user:
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","password":"password123"}'
```

### Login:
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@devnotes.com","password":"admin123456"}'
```

### Create a post (requires admin authentication):
```bash
curl -X POST http://localhost:5000/api/posts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"title":"My Post","description":"A short description","content":"Detailed post content","category":"React","author":"DevNotes","readTime":"4 min read","published":true}'
```

### Get tutorials with filtering:
```bash
curl "http://localhost:5000/api/tutorials?category=React&difficulty=Beginner"
```

### Get tutorial by slug:
```bash
curl http://localhost:5000/api/tutorials/getting-started-with-react
```

### Get tutorial lessons:
```bash
curl http://localhost:5000/api/tutorials/TUTORIAL_ID/lessons
```

### Start a tutorial (requires authentication):
```bash
curl -X POST http://localhost:5000/api/tutorials/TUTORIAL_ID/start \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Mark lesson complete (requires authentication):
```bash
curl -X POST http://localhost:5000/api/tutorials/TUTORIAL_ID/lessons/LESSON_ID/complete \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Get quizzes for a tutorial:
```bash
curl "http://localhost:5000/api/quizzes?tutorial=TUTORIAL_ID"
```

### Start a quiz (requires authentication):
```bash
curl -X POST http://localhost:5000/api/quizzes/QUIZ_ID/start \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Submit quiz (requires authentication):
```bash
curl -X POST http://localhost:5000/api/quizzes/QUIZ_ID/submit \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"attemptId":"ATTEMPT_ID","answers":[{"question":"QUESTION_ID","answer":"Your Answer"}]}'
```

### Subscribe to newsletter:
```bash
curl -X POST http://localhost:5000/api/newsletter/subscribe \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","name":"John Doe"}'
```

### Get notifications (requires authentication):
```bash
curl http://localhost:5000/api/notifications \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Update notification preferences (requires authentication):
```bash
curl -X PUT http://localhost:5000/api/users/me/notification-preferences \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"newsletter":true,"newPosts":true,"newTutorials":false,"quizResults":true,"achievements":true}'
```

### Create announcement (requires admin authentication):
```bash
curl -X POST http://localhost:5000/api/admin/notifications/announcement \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_JWT_TOKEN" \
  -d '{"title":"Important Update","message":"Check out our new features!"}'
```

### Chat with AI assistant (requires authentication):
```bash
curl -X POST http://localhost:5000/api/ai/chat \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"message":"Explain React props to me"}'
```

### Chat with tutorial context (requires authentication):
```bash
curl -X POST http://localhost:5000/api/ai/chat \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"message":"Can you explain this lesson?","tutorialId":"TUTORIAL_ID","lessonId":"LESSON_ID"}'
```

### Get learning recommendations (requires authentication):
```bash
curl http://localhost:5000/api/ai/recommendations \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Get conversation history (requires authentication):
```bash
curl http://localhost:5000/api/ai/conversations \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Explain programming content (requires authentication):
```bash
curl -X POST http://localhost:5000/api/ai/explain \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"content":"React state allows components to remember information.","context":"React fundamentals","level":"beginner"}'
```

### Get progressive hint (requires authentication):
```bash
curl -X POST http://localhost:5000/api/ai/hint \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"question":"How do I use useState?","context":"React fundamentals"}'
```

### Summarize lesson content (requires authentication):
```bash
curl -X POST http://localhost:5000/api/ai/summarize \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"content":"React is a JavaScript library. It works with state, props, and lifecycle methods."}'
```

### Get AI usage tracking reports (requires admin authentication):
```bash
curl "http://localhost:5000/api/admin/ai/usage?startDate=2026-08-01" \
  -H "Authorization: Bearer YOUR_ADMIN_JWT_TOKEN"
```

### Create discussion (requires authentication):
```bash
curl -X POST http://localhost:5000/api/discussions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"title":"How does React state work?","content":"I'\''m having trouble understanding state.","tags":["react","state"]}'
```

### List discussions with filtering:
```bash
curl "http://localhost:5000/api/discussions?tag=react&sort=popular"
```

### Create comment/reply (requires authentication):
```bash
curl -X POST http://localhost:5000/api/discussions/DISCUSSION_ID/comments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"content":"Here is another explanation...","parentComment":"PARENT_COMMENT_ID"}'
```

### Like a comment (requires authentication):
```bash
curl -X POST http://localhost:5000/api/comments/COMMENT_ID/like \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Report content (requires authentication):
```bash
curl -X POST http://localhost:5000/api/reports \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"targetType":"discussion","targetId":"DISCUSSION_ID","reason":"spam","description":"This appears to be spam."}'
```

### Get reports (requires admin authentication):
```bash
curl http://localhost:5000/api/admin/reports?status=pending \
  -H "Authorization: Bearer YOUR_ADMIN_JWT_TOKEN"
```

## Admin Seeding

The admin seed script (`npm run seed:admin`) will:
- Create an admin account if one doesn't exist
- Skip creation if an admin with the same email already exists
- Promote an existing user to admin if they have the same email but wrong role
- Use environment variables for credentials (safe for production)

This ensures:
- No duplicate admin accounts
- Idempotent seeding (safe to run multiple times)
- Secure password management via environment variables

## Tutorial Seeding

The tutorial seed script (`npm run seed:tutorials`) will:
- Clear existing tutorials and lessons
- Create 5 sample tutorials with lessons
- Populate realistic tutorial data for development/testing
- Safe to run multiple times

Sample tutorials include:
- Getting Started with React (Beginner, 6 lessons)
- TypeScript for Beginners (Beginner, 6 lessons)
- Tailwind CSS Fundamentals (Beginner, 6 lessons)
- Node.js and Express Backend Development (Intermediate, 6 lessons)
- Advanced React Patterns (Advanced, 6 lessons)

## Database Models

### Phase 1: Blog
- BlogPost

### Phase 2: Authentication
- User

### Phase 3: Tutorials & Learning
- Tutorial
- Lesson
- TutorialProgress

### Phase 4: Quizzes & Assessments
- Quiz
- QuizQuestion
- QuizAttempt

### Phase 5: Newsletter & Notifications
- NewsletterSubscriber
- Notification
- User (extended with notificationPreferences)

### Phase 6: AI Assistant & Learning Recommendations
- AIConversation

### Phase 7: AI Learning Assistant
- AIUsage

### Phase 8: Community & Discussions
- Discussion
- Comment
- Report

## Known Issues

### Phase 2 Issue - POST /api/posts Authentication
During Phase 2 manual testing, the following behavior was observed:
- Admin login → SUCCESS
- GET /api/users/me with admin JWT → SUCCESS
- Admin role correctly returned → admin
- **POST /api/posts with same JWT → Authentication required**

This issue has been preserved during Phase 3 implementation and requires investigation.

## Development Notes

- All passwords are hashed using bcrypt
- JWT tokens expire after 7 days
- All endpoints follow consistent response format: `{ success, data }` or `{ success, message }`
- Database indexes are created for optimal query performance
- Tutorial progress is tracked per user with unique compound index (user + tutorial)
- Lessons are always returned in ascending order
- Progress percentage calculation: (completedLessons / totalLessons) × 100

