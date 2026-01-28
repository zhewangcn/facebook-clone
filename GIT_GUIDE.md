# Git & GitHub Guide for Facebook Clone

## ✅ Repository Successfully Created!

Your Facebook clone has been uploaded to GitHub:

**Repository URL:** https://github.com/zhewangcn/facebook-clone

## 📊 What Was Committed

- **71 files** with **5,121 lines** of code
- Complete full-stack application
- All documentation (README, guides, etc.)
- Docker configuration
- Frontend and backend source code

**Note:** `.env` files are excluded (in `.gitignore`) for security

## 🔧 Git Configuration

Your git is configured with:
- **Name:** neal
- **Email:** zhewangcn@gmail.com
- **Default Branch:** main

## 📝 Common Git Commands

### Check Status
```bash
cd /home/ubuntu/facebook
git status
```

### Add Changes
```bash
# Add specific files
git add backend/src/services/newService.ts

# Add all changes
git add .
```

### Commit Changes
```bash
git commit -m "Add new feature: user notifications"
```

### Push to GitHub
```bash
git push origin main
```

### Pull Latest Changes
```bash
git pull origin main
```

### View Commit History
```bash
git log --oneline
```

### Create a New Branch
```bash
git checkout -b feature/new-feature
```

### Switch Branches
```bash
git checkout main
```

### Merge Branch
```bash
git checkout main
git merge feature/new-feature
```

## 🚀 Workflow for Making Changes

### Example: Adding a new feature

```bash
# 1. Make your code changes
# Edit files in your editor

# 2. Check what changed
git status
git diff

# 3. Stage your changes
git add .

# 4. Commit with a descriptive message
git commit -m "Add user notifications feature

- Created notification table in database
- Added backend API endpoints
- Implemented frontend notification bell icon
- Added real-time updates with polling"

# 5. Push to GitHub
git push origin main
```

### Example: Fixing a bug

```bash
# 1. Create a bugfix branch (optional but recommended)
git checkout -b bugfix/login-error

# 2. Fix the bug and test

# 3. Commit the fix
git commit -am "Fix login error when email contains special characters"

# 4. Switch back to main and merge
git checkout main
git merge bugfix/login-error

# 5. Push to GitHub
git push origin main

# 6. Delete the bugfix branch (optional)
git branch -d bugfix/login-error
```

## 🔐 Important Security Notes

### Files Excluded from Git (in `.gitignore`):

- `node_modules/` - Dependencies (too large, can be reinstalled)
- `.env` - Environment variables with secrets
- `dist/` - Build outputs
- Log files
- OS-specific files

### ⚠️ Never commit:
- API keys or secrets
- Database passwords
- JWT secrets
- `.env` files

If you accidentally commit sensitive data:
```bash
# Remove from history (use with caution)
git rm --cached .env
git commit -m "Remove .env file from tracking"
```

## 📦 Cloning Your Repository

To clone your repository on another machine:

```bash
git clone https://github.com/zhewangcn/facebook-clone.git
cd facebook-clone

# Create .env files (they're not in the repo)
# Follow the setup instructions in README.md
```

## 🌿 Branching Strategy (Recommended)

### Main Branch
- `main` - Production-ready code
- Always keep this stable

### Feature Branches
```bash
# Create feature branch
git checkout -b feature/user-profiles

# Work on feature
# ... make changes ...

# Commit changes
git commit -m "Add user profile editing"

# Merge back to main when done
git checkout main
git merge feature/user-profiles

# Push to GitHub
git push origin main

# Delete feature branch
git branch -d feature/user-profiles
```

## 📋 Useful Git Aliases

Add these to make git easier:

```bash
git config --global alias.st status
git config --global alias.co checkout
git config --global alias.br branch
git config --global alias.ci commit
git config --global alias.unstage 'reset HEAD --'
git config --global alias.last 'log -1 HEAD'
git config --global alias.visual 'log --oneline --graph --all --decorate'
```

Now you can use:
```bash
git st          # instead of git status
git co main     # instead of git checkout main
git visual      # see a nice commit graph
```

## 🔄 Keeping Your Fork Updated

If you collaborate with others:

```bash
# Add upstream repository (if working with others)
git remote add upstream https://github.com/original/repo.git

# Fetch and merge updates
git fetch upstream
git merge upstream/main

# Push updates
git push origin main
```

## 📊 Viewing Your Repository

**GitHub Web Interface:**
- View code: https://github.com/zhewangcn/facebook-clone
- Commit history: https://github.com/zhewangcn/facebook-clone/commits/main
- Issues: https://github.com/zhewangcn/facebook-clone/issues
- Pull Requests: https://github.com/zhewangcn/facebook-clone/pulls

## 🎯 Quick Reference

| Task | Command |
|------|---------|
| See changes | `git status` |
| Add all changes | `git add .` |
| Commit | `git commit -m "message"` |
| Push to GitHub | `git push` |
| Pull from GitHub | `git pull` |
| View history | `git log --oneline` |
| Undo last commit (keep changes) | `git reset --soft HEAD~1` |
| Discard local changes | `git checkout -- filename` |
| Create branch | `git checkout -b branch-name` |
| Switch branch | `git checkout branch-name` |
| Delete branch | `git branch -d branch-name` |

## 🚨 Common Issues & Solutions

### Issue: Pushed sensitive data by accident

```bash
# Remove the file and commit
git rm --cached .env
git commit -m "Remove sensitive file"
git push origin main

# Change all secrets immediately!
```

### Issue: Merge conflicts

```bash
# Pull latest changes
git pull origin main

# Fix conflicts in your editor
# Look for <<<<<<< and >>>>>>> markers

# After fixing, add and commit
git add .
git commit -m "Resolve merge conflicts"
git push origin main
```

### Issue: Want to undo last commit

```bash
# Keep changes, undo commit
git reset --soft HEAD~1

# Discard changes and commit
git reset --hard HEAD~1
```

## 📚 Next Steps

1. ✅ Repository created and pushed
2. Share the link: https://github.com/zhewangcn/facebook-clone
3. Keep making changes and pushing updates
4. Consider adding:
   - GitHub Actions for CI/CD
   - Issue templates
   - Contributing guidelines
   - License file

## 🔗 Resources

- Git Documentation: https://git-scm.com/doc
- GitHub Guides: https://guides.github.com/
- Git Cheat Sheet: https://education.github.com/git-cheat-sheet-education.pdf

---

**Your repository is live!** 🎉

Visit: https://github.com/zhewangcn/facebook-clone
