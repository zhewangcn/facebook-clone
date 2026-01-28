# Facebook Clone

A full-stack social media application built with React, TypeScript, Express, and PostgreSQL. Features user authentication, posts, friend connections, and a timeline feed.

## Features

- User registration and authentication with JWT
- Create, view, and delete posts
- Friend system (send, accept, reject friend requests)
- Timeline feed showing posts from user and friends
- User profiles with post history
- User search functionality
- Responsive design with Tailwind CSS

## Tech Stack

### Frontend
- React 18
- TypeScript
- Vite
- React Router
- React Query (TanStack Query)
- Axios
- Tailwind CSS

### Backend
- Node.js
- Express
- TypeScript
- PostgreSQL
- JWT authentication
- bcrypt for password hashing

### DevOps
- Docker & Docker Compose
- Nginx reverse proxy

## Prerequisites

- Docker and Docker Compose installed
- Git (optional)

## Getting Started

### 1. Clone or navigate to the project

```bash
cd /home/ubuntu/facebook
```

### 2. Start the application with Docker Compose

```bash
docker-compose up --build
```

This will start all services:
- PostgreSQL database (port 5432)
- Backend API (port 3000)
- Frontend (port 5173)
- Nginx reverse proxy (port 80)

### 3. Access the application

- Frontend: http://localhost:5173
- Backend API: http://localhost:3000/api/v1
- Nginx proxy: http://localhost

### 4. Create your first account

1. Navigate to http://localhost:5173
2. Click "Register here"
3. Fill in the registration form
4. You'll be automatically logged in and redirected to the timeline

## Project Structure

```
facebook/
├── database/
│   └── init.sql                 # Database schema
├── backend/
│   ├── src/
│   │   ├── config/             # Database and environment config
│   │   ├── middleware/         # Auth, validation, error handling
│   │   ├── routes/             # API route definitions
│   │   ├── services/           # Business logic
│   │   ├── utils/              # JWT and password utilities
│   │   └── types/              # TypeScript type definitions
│   ├── package.json
│   ├── tsconfig.json
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── api/                # API client and endpoints
│   │   ├── components/         # React components
│   │   ├── contexts/           # React context (Auth)
│   │   ├── hooks/              # Custom React hooks
│   │   ├── pages/              # Page components
│   │   └── styles/             # Tailwind CSS
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   └── Dockerfile
├── nginx/
│   └── default.conf            # Nginx configuration
└── docker-compose.yml
```

## API Endpoints

### Authentication (`/api/v1/auth`)
- `POST /register` - Register new user
- `POST /login` - Login user
- `GET /me` - Get current user (protected)

### Posts (`/api/v1/posts`)
- `POST /` - Create post (protected)
- `GET /timeline` - Get timeline feed (protected)
- `GET /user/:userId` - Get user's posts (protected)
- `DELETE /:id` - Delete post (protected)

### Friends (`/api/v1/friends`)
- `POST /request/:userId` - Send friend request (protected)
- `PUT /accept/:friendshipId` - Accept friend request (protected)
- `PUT /reject/:friendshipId` - Reject friend request (protected)
- `GET /` - Get friends list (protected)
- `GET /requests` - Get pending requests (protected)

### Users (`/api/v1/users`)
- `GET /:id` - Get user profile (protected)
- `GET /search?q=` - Search users (protected)
- `PUT /` - Update user profile (protected)

## Testing the Application

### Manual Testing Flow

1. **Register 3 users:**
   - Alice (alice@example.com)
   - Bob (bob@example.com)
   - Charlie (charlie@example.com)

2. **Friend relationships:**
   - Login as Alice
   - Go to Friends → Find Friends
   - Search "bob" and send friend request
   - Logout, login as Bob
   - Go to Friends → Friend Requests
   - Accept Alice's request

3. **Create posts:**
   - As Alice: Create a post
   - As Bob: Create a post
   - As Charlie: Create a post

4. **Verify timeline:**
   - Login as Alice → Should see Alice's and Bob's posts
   - Login as Bob → Should see Bob's and Alice's posts
   - Login as Charlie → Should only see Charlie's posts

### Database Access

Access PostgreSQL directly:

```bash
docker exec -it facebook_db psql -U postgres -d facebook
```

Useful queries:

```sql
-- View all users
SELECT id, username, email, first_name, last_name FROM users;

-- View all posts with authors
SELECT p.id, u.username, p.content, p.created_at
FROM posts p
JOIN users u ON p.user_id = u.id
ORDER BY p.created_at DESC;

-- View friendships
SELECT
  u1.username AS user1,
  u2.username AS user2,
  f.status
FROM friendships f
JOIN users u1 ON f.user_id_1 = u1.id
JOIN users u2 ON f.user_id_2 = u2.id;
```

## Development

### Backend Development

```bash
cd backend
npm install
npm run dev
```

### Frontend Development

```bash
cd frontend
npm install
npm run dev
```

### Environment Variables

#### Backend (.env)
```
NODE_ENV=development
PORT=3000
DATABASE_URL=postgresql://postgres:postgres@postgres:5432/facebook
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d
BCRYPT_ROUNDS=10
CORS_ORIGIN=http://localhost:5173
```

#### Frontend (.env)
```
VITE_API_URL=http://localhost:3000/api/v1
```

## Security Features

- Password hashing with bcrypt (10 salt rounds)
- JWT token-based authentication
- Parameterized SQL queries (SQL injection prevention)
- CORS configuration
- Helmet.js security headers
- Input validation
- Authorization checks for resource ownership

## Stopping the Application

```bash
docker-compose down
```

To remove volumes (database data):

```bash
docker-compose down -v
```

## Troubleshooting

### Database connection issues
- Ensure PostgreSQL container is running: `docker ps`
- Check logs: `docker-compose logs postgres`

### Frontend can't connect to backend
- Verify backend is running: `curl http://localhost:3000/health`
- Check CORS settings in backend/.env

### Port conflicts
- Check if ports 80, 3000, 5173, or 5432 are already in use
- Modify ports in docker-compose.yml if needed

## License

MIT
