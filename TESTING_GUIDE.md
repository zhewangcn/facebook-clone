# Facebook Clone - Testing Guide

## Quick Start

### 1. Start all services

```bash
cd /home/ubuntu/facebook
docker compose up --build
```

Wait for all services to start. You should see:
- PostgreSQL ready to accept connections
- Backend server running on port 3000
- Frontend dev server running on port 5173
- Nginx proxy running on port 80

### 2. Verify Services

Open multiple terminal windows and run:

```bash
# Check all containers are running
docker ps

# Check backend health
curl http://localhost:3000/health

# Check database
docker exec -it facebook_db psql -U postgres -d facebook -c "\dt"
```

## End-to-End Testing Scenario

### Scenario: Three Users with Friend Relationships

This test validates the complete friend system and timeline functionality.

### Step 1: Register Three Users

1. Open http://localhost:5173 in your browser
2. Click "Register here"
3. Register User A (Alice):
   - Username: `alice`
   - Email: `alice@example.com`
   - Password: `password123`
   - First Name: `Alice`
   - Last Name: `Smith`
4. Logout (click Logout button in header)
5. Register User B (Bob):
   - Username: `bob`
   - Email: `bob@example.com`
   - Password: `password123`
   - First Name: `Bob`
   - Last Name: `Jones`
6. Logout
7. Register User C (Charlie):
   - Username: `charlie`
   - Email: `charlie@example.com`
   - Password: `password123`
   - First Name: `Charlie`
   - Last Name: `Brown`

### Step 2: Create Friend Relationships

**Alice and Bob become friends:**

1. Login as Alice (alice@example.com / password123)
2. Navigate to "Friends" page
3. Click "Find Friends" tab
4. Search for "bob"
5. Click "Add Friend" next to Bob Jones
6. Verify "Friend request sent!" message
7. Logout

8. Login as Bob (bob@example.com / password123)
9. Navigate to "Friends" page
10. Click "Friend Requests" tab
11. Verify Alice's friend request appears
12. Click "Accept"
13. Click "My Friends" tab
14. Verify Alice appears in friends list
15. Logout

16. Login as Alice
17. Go to Friends → My Friends
18. Verify Bob appears in friends list

**Leave Charlie without friends** (for timeline isolation testing)

### Step 3: Create Posts

**Alice creates a post:**
1. Login as Alice
2. Go to Timeline
3. In "Create Post" box, enter: "Hello from Alice! This is my first post."
4. Click "Post"
5. Verify post appears in timeline immediately

**Bob creates a post:**
1. Logout, login as Bob
2. Go to Timeline
3. Create post: "Bob here! Excited to be on this platform."
4. Verify post appears

**Charlie creates a post:**
1. Logout, login as Charlie
2. Go to Timeline
3. Create post: "Charlie's post - I have no friends yet!"
4. Verify post appears

### Step 4: Verify Timeline Functionality

**Test 1: Alice's Timeline**
1. Login as Alice
2. Go to Timeline
3. **Expected:** See TWO posts:
   - Alice's post: "Hello from Alice!..."
   - Bob's post: "Bob here!..."
4. **Should NOT see:** Charlie's post (not friends)
5. Verify posts are ordered by newest first

**Test 2: Bob's Timeline**
1. Login as Bob
2. Go to Timeline
3. **Expected:** See TWO posts:
   - Bob's post
   - Alice's post
4. **Should NOT see:** Charlie's post (not friends)

**Test 3: Charlie's Timeline (Isolation Test)**
1. Login as Charlie
2. Go to Timeline
3. **Expected:** See ONLY ONE post:
   - Charlie's own post
4. **Should NOT see:** Alice's or Bob's posts (not friends with anyone)
5. **This confirms:** Timeline only shows your posts + friends' posts

### Step 5: Profile Page Testing

**View Friend's Profile:**
1. Login as Alice
2. Go to Timeline
3. Click on Bob's name in his post
4. **Expected:**
   - See Bob's profile page
   - See "Friends" badge (you are friends)
   - See only Bob's posts
   - Can navigate back to Timeline

**View Non-Friend's Profile:**
1. While logged in as Alice
2. Go to Friends → Find Friends
3. Search for "charlie"
4. Click on Charlie's name/profile
5. **Expected:**
   - See Charlie's profile
   - See "Add Friend" button (not friends yet)
   - See only Charlie's posts

### Step 6: Post Management

**Delete Own Post:**
1. Login as Alice
2. Go to Timeline
3. Find Alice's post
4. Click "Delete" button
5. Confirm deletion
6. **Expected:** Post disappears from timeline

**Verify Deletion Propagates:**
1. Logout, login as Bob
2. Go to Timeline
3. **Expected:** Alice's post should NOT appear (it was deleted)

### Step 7: Additional Friend Request Testing

**Alice and Charlie become friends:**
1. Login as Alice
2. Go to Friends → Find Friends
3. Search for "charlie"
4. Click "Add Friend"
5. Logout

6. Login as Charlie
7. Go to Friends → Friend Requests
8. Accept Alice's request
9. Go to Timeline
10. **Expected:** Now see TWO posts:
    - Charlie's post
    - Bob's post (because Alice and Bob are friends, and you can now see Alice's friends' posts? NO - should still only see own + direct friends)
11. **Correction:** Should see Charlie's post + Alice's posts (once Alice creates new ones)

### Step 8: Search Functionality

1. Login as any user
2. Go to Friends → Find Friends
3. Test searches:
   - Search "ali" → Should find Alice
   - Search "Smith" → Should find Alice (searches first/last name)
   - Search "bob" → Should find Bob
   - Search "xyz" → Should find no results

## API Testing with cURL

### Register a User

```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123",
    "firstName": "Test",
    "lastName": "User"
  }'
```

Expected response:
```json
{
  "status": "success",
  "data": {
    "user": { ... },
    "token": "eyJhbGc..."
  }
}
```

### Login

```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

Save the token from the response!

### Create a Post

```bash
TOKEN="your_token_here"

curl -X POST http://localhost:3000/api/v1/posts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "content": "My first post via API!"
  }'
```

### Get Timeline

```bash
curl http://localhost:3000/api/v1/posts/timeline \
  -H "Authorization: Bearer $TOKEN"
```

### Send Friend Request

```bash
# Replace USER_ID with the target user's ID
curl -X POST http://localhost:3000/api/v1/friends/request/2 \
  -H "Authorization: Bearer $TOKEN"
```

### Get Friend Requests

```bash
curl http://localhost:3000/api/v1/friends/requests \
  -H "Authorization: Bearer $TOKEN"
```

### Accept Friend Request

```bash
# Replace FRIENDSHIP_ID with the friendship ID from friend requests
curl -X PUT http://localhost:3000/api/v1/friends/accept/1 \
  -H "Authorization: Bearer $TOKEN"
```

### Search Users

```bash
curl "http://localhost:3000/api/v1/users/search?q=alice" \
  -H "Authorization: Bearer $TOKEN"
```

## Database Verification

### Connect to Database

```bash
docker exec -it facebook_db psql -U postgres -d facebook
```

### Useful Queries

**View all users:**
```sql
SELECT id, username, email, first_name, last_name, created_at FROM users;
```

**View all posts with authors:**
```sql
SELECT
  p.id,
  u.username,
  u.first_name || ' ' || u.last_name as author_name,
  p.content,
  p.created_at
FROM posts p
JOIN users u ON p.user_id = u.id
ORDER BY p.created_at DESC;
```

**View all friendships:**
```sql
SELECT
  f.id as friendship_id,
  u1.username as user1,
  u2.username as user2,
  f.status,
  ur.username as requester,
  f.created_at
FROM friendships f
JOIN users u1 ON f.user_id_1 = u1.id
JOIN users u2 ON f.user_id_2 = u2.id
JOIN users ur ON f.requester_id = ur.id
ORDER BY f.created_at DESC;
```

**Test timeline query for specific user:**
```sql
-- Replace user_id = 1 with actual user ID
SELECT p.*, u.username, u.first_name, u.last_name
FROM posts p
JOIN users u ON p.user_id = u.id
WHERE p.user_id IN (
  SELECT 1  -- The user's own ID
  UNION
  SELECT CASE WHEN f.user_id_1 = 1 THEN f.user_id_2 ELSE f.user_id_1 END
  FROM friendships f
  WHERE (f.user_id_1 = 1 OR f.user_id_2 = 1) AND f.status = 'accepted'
)
ORDER BY p.created_at DESC;
```

**View indexes:**
```sql
SELECT
  tablename,
  indexname,
  indexdef
FROM pg_indexes
WHERE schemaname = 'public'
ORDER BY tablename, indexname;
```

**Check database size:**
```sql
SELECT
  pg_database.datname,
  pg_size_pretty(pg_database_size(pg_database.datname)) AS size
FROM pg_database
WHERE datname = 'facebook';
```

## Expected Results Summary

### Timeline Visibility Rules

1. **User sees their own posts** - Always
2. **User sees friends' posts** - Only if friendship status = 'accepted'
3. **User does NOT see non-friends' posts** - Even if they can view the profile
4. **Posts ordered by created_at DESC** - Newest first

### Friend System Rules

1. **Friend request creates friendship** with status = 'pending'
2. **Only recipient can accept/reject** - Requester cannot
3. **Friendship is bidirectional** - user_id_1 < user_id_2 (normalized)
4. **Duplicate requests prevented** - Unique constraint on (user_id_1, user_id_2)
5. **Cannot friend yourself** - Validation in service layer

### Security Validations

1. **JWT required** - All protected routes need valid token
2. **Cannot delete others' posts** - Ownership check in service
3. **Cannot accept own friend request** - Logic prevents this
4. **SQL injection protected** - Parameterized queries throughout
5. **Password hashed** - Never stored in plain text

## Common Issues and Solutions

### Issue: Frontend can't connect to backend
**Solution:**
```bash
# Check backend is running
curl http://localhost:3000/health

# Check CORS settings in backend/.env
# Should have: CORS_ORIGIN=http://localhost:5173
```

### Issue: Database connection refused
**Solution:**
```bash
# Check postgres container
docker ps | grep postgres

# Check postgres logs
docker logs facebook_db

# Verify connection string in backend/.env
```

### Issue: Friend request not appearing
**Solution:**
1. Check network tab in browser dev tools
2. Verify response status (should be 201)
3. Query database directly:
```sql
SELECT * FROM friendships ORDER BY created_at DESC LIMIT 5;
```

### Issue: Timeline shows all posts (not just friends)
**Solution:**
1. Verify friendship exists and status = 'accepted'
2. Test timeline query directly in database
3. Check browser console for errors

### Issue: Cannot login after registration
**Solution:**
1. Check if user was created: `SELECT * FROM users WHERE email = 'user@example.com';`
2. Verify JWT_SECRET is set in backend/.env
3. Check browser console for errors
4. Clear localStorage and try again

## Performance Testing

### Timeline Query Performance

Test with many users and posts:

```sql
-- Create test data
INSERT INTO users (username, email, password_hash, first_name, last_name)
SELECT
  'user' || i,
  'user' || i || '@example.com',
  '$2b$10$abcdefghijklmnopqrstuvwxyz',  -- dummy hash
  'User',
  '' || i
FROM generate_series(1, 100) i;

-- Create test posts
INSERT INTO posts (user_id, content)
SELECT
  (random() * 99 + 1)::int,
  'Test post ' || i
FROM generate_series(1, 1000) i;

-- Benchmark timeline query
EXPLAIN ANALYZE
SELECT p.*, u.username, u.first_name, u.last_name
FROM posts p
JOIN users u ON p.user_id = u.id
WHERE p.user_id IN (
  SELECT 1
  UNION
  SELECT CASE WHEN f.user_id_1 = 1 THEN f.user_id_2 ELSE f.user_id_1 END
  FROM friendships f
  WHERE (f.user_id_1 = 1 OR f.user_id_2 = 1) AND f.status = 'accepted'
)
ORDER BY p.created_at DESC
LIMIT 20;
```

Expected: Query should use indexes and complete in <10ms

## Success Criteria Checklist

- [ ] All Docker containers start successfully
- [ ] Can register a new user
- [ ] Can login with registered credentials
- [ ] Can create a post
- [ ] Post appears in timeline immediately
- [ ] Can send friend request
- [ ] Friend request appears for recipient
- [ ] Can accept friend request
- [ ] Friend appears in friends list for both users
- [ ] Timeline shows posts from user + friends only
- [ ] Timeline does NOT show posts from non-friends
- [ ] Can delete own posts
- [ ] Cannot delete others' posts
- [ ] Can search for users
- [ ] Can view user profiles
- [ ] Responsive design works on mobile/desktop
- [ ] Error messages display correctly
- [ ] Logout works and redirects to login

All features implemented and ready for testing!
