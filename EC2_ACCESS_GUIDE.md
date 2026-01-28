# EC2 Access Guide

## Your EC2 Public IP
**3.140.197.239**

## Application URLs

Access your Facebook clone at:
- **Frontend**: http://3.140.197.239:5173
- **Backend API**: http://3.140.197.239:3000/api/v1
- **Health Check**: http://3.140.197.239:3000/health

## ⚠️ Security Group Configuration Required

Before you can access the application, you need to configure your EC2 Security Group to allow incoming traffic on these ports:

### Required Inbound Rules

| Port | Protocol | Source | Description |
|------|----------|--------|-------------|
| 5173 | TCP | 0.0.0.0/0 | Frontend (Vite dev server) |
| 3000 | TCP | 0.0.0.0/0 | Backend API |
| 80 | TCP | 0.0.0.0/0 | Nginx (optional) |
| 22 | TCP | Your IP | SSH (should already exist) |

### How to Add Security Group Rules (AWS Console):

1. **Go to EC2 Console**:
   - Navigate to https://console.aws.amazon.com/ec2/

2. **Find Your Instance**:
   - Click on "Instances" in the left sidebar
   - Find your instance (IP: 3.140.197.239)

3. **Edit Security Group**:
   - Click on your instance
   - Scroll down to "Security" tab
   - Click on the Security Group link (e.g., "sg-xxxxx")

4. **Add Inbound Rules**:
   - Click "Edit inbound rules"
   - Click "Add rule" for each port:

     **Rule 1 - Frontend:**
     - Type: Custom TCP
     - Port: 5173
     - Source: Anywhere-IPv4 (0.0.0.0/0)
     - Description: Facebook Clone Frontend

     **Rule 2 - Backend:**
     - Type: Custom TCP
     - Port: 3000
     - Source: Anywhere-IPv4 (0.0.0.0/0)
     - Description: Facebook Clone Backend API

     **Rule 3 - Nginx (Optional):**
     - Type: HTTP
     - Port: 80
     - Source: Anywhere-IPv4 (0.0.0.0/0)
     - Description: Facebook Clone Nginx

5. **Save Rules**:
   - Click "Save rules"

### How to Add Security Group Rules (AWS CLI):

```bash
# Get your security group ID
SECURITY_GROUP_ID=$(aws ec2 describe-instances \
  --filters "Name=ip-address,Values=3.140.197.239" \
  --query "Reservations[0].Instances[0].SecurityGroups[0].GroupId" \
  --output text)

# Add rule for port 5173 (Frontend)
aws ec2 authorize-security-group-ingress \
  --group-id $SECURITY_GROUP_ID \
  --protocol tcp \
  --port 5173 \
  --cidr 0.0.0.0/0

# Add rule for port 3000 (Backend)
aws ec2 authorize-security-group-ingress \
  --group-id $SECURITY_GROUP_ID \
  --protocol tcp \
  --port 3000 \
  --cidr 0.0.0.0/0

# Add rule for port 80 (Nginx - optional)
aws ec2 authorize-security-group-ingress \
  --group-id $SECURITY_GROUP_ID \
  --protocol tcp \
  --port 80 \
  --cidr 0.0.0.0/0
```

## Testing Access

### 1. Test Backend API (from your local machine):

```bash
curl http://3.140.197.239:3000/health
```

Expected response: `{"status":"ok"}`

### 2. Open Frontend (in your browser):

Navigate to: **http://3.140.197.239:5173**

You should see the Facebook Clone login/register page.

### 3. Test on EC2 Instance:

```bash
# Test backend
curl http://localhost:3000/health

# Test frontend (should return HTML)
curl -I http://localhost:5173
```

## Configuration Changes Made

The following files were updated to use your public IP:

1. **backend/.env**:
   - Changed `CORS_ORIGIN` from `http://localhost:5173` to `http://3.140.197.239:5173`

2. **frontend/.env**:
   - Changed `VITE_API_URL` from `http://localhost:3000/api/v1` to `http://3.140.197.239:3000/api/v1`

3. **docker-compose.yml**:
   - Updated environment variables to match

## Security Considerations

⚠️ **Important Security Notes:**

1. **Development Mode**: This configuration is for development/testing only

2. **Production Deployment**: For production, you should:
   - Use HTTPS (SSL/TLS certificates)
   - Restrict security group rules to specific IPs
   - Use environment variables for sensitive data
   - Set up proper domain names
   - Use AWS Application Load Balancer
   - Enable AWS WAF for protection
   - Change JWT_SECRET to a strong random value

3. **Firewall**: Opening ports to 0.0.0.0/0 means anyone can access your application
   - For better security, restrict to your IP only during development
   - Example: Use "My IP" in AWS Console instead of "Anywhere"

## Alternative: SSH Tunneling (More Secure)

If you don't want to open ports publicly, you can use SSH tunneling:

```bash
# On your local machine
ssh -L 5173:localhost:5173 -L 3000:localhost:3000 ubuntu@3.140.197.239

# Then access:
# Frontend: http://localhost:5173
# Backend: http://localhost:3000
```

This keeps ports closed but allows you to access via SSH tunnel.

## Troubleshooting

### Can't access from browser?

1. **Check security group rules are added**
2. **Verify containers are running**:
   ```bash
   sudo docker ps
   ```

3. **Check backend logs**:
   ```bash
   sudo docker logs facebook_backend
   ```

4. **Check frontend logs**:
   ```bash
   sudo docker logs facebook_frontend
   ```

5. **Verify CORS settings**:
   ```bash
   curl -I http://3.140.197.239:3000/health
   ```

### Connection timeout?

- Security group rules not added
- Ports not listening: `sudo netstat -tlnp | grep -E '(3000|5173)'`

### CORS errors in browser console?

- Check backend logs for CORS configuration
- Verify CORS_ORIGIN matches frontend URL
- Restart containers: `sudo docker compose restart`

## Next Steps

1. ✅ Configure security group rules
2. ✅ Access http://3.140.197.239:5173 in your browser
3. ✅ Register a new account
4. ✅ Start testing the application

## Quick Commands

```bash
# View all logs
sudo docker compose logs -f

# Restart services
sudo docker compose restart

# Stop all services
sudo docker compose down

# View running containers
sudo docker ps

# Access database
sudo docker exec -it facebook_db psql -U postgres -d facebook
```

---

**Your application is configured for external access!**

Once you configure the security group rules, access it at:
**http://3.140.197.239:5173**
