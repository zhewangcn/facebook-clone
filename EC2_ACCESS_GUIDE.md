# EC2 Access Guide

## Finding Your EC2 Public IP

To find your EC2 instance's public IP address:

**Option 1 - AWS Console:**
1. Go to EC2 Console: https://console.aws.amazon.com/ec2/
2. Click "Instances" in the left sidebar
3. Find your instance
4. Look for "Public IPv4 address" in the details

**Option 2 - From EC2 Instance (SSH):**
```bash
curl -s ifconfig.me
```

**Option 3 - AWS CLI:**
```bash
aws ec2 describe-instances --instance-ids YOUR_INSTANCE_ID --query 'Reservations[0].Instances[0].PublicIpAddress'
```

Once you have your IP, replace `YOUR_EC2_PUBLIC_IP` throughout this guide.

## Your EC2 Public IP
**YOUR_EC2_PUBLIC_IP** (Replace this with your actual IP)

## Application URLs

Access your Facebook clone at:
- **Frontend**: http://YOUR_EC2_PUBLIC_IP:5173
- **Backend API**: http://YOUR_EC2_PUBLIC_IP:3000/api/v1
- **Health Check**: http://YOUR_EC2_PUBLIC_IP:3000/health

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
   - Find your instance (IP: YOUR_EC2_PUBLIC_IP)

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
  --filters "Name=ip-address,Values=YOUR_EC2_PUBLIC_IP" \
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
curl http://YOUR_EC2_PUBLIC_IP:3000/health
```

Expected response: `{"status":"ok"}`

### 2. Open Frontend (in your browser):

Navigate to: **http://YOUR_EC2_PUBLIC_IP:5173**

You should see the Facebook Clone login/register page.

### 3. Test on EC2 Instance:

```bash
# Test backend
curl http://localhost:3000/health

# Test frontend (should return HTML)
curl -I http://localhost:5173
```

## Configuration for EC2 Deployment

To make the application accessible via your EC2 public IP, you need to update these files:

### 1. Update `backend/.env`

```bash
# Change CORS_ORIGIN to your EC2 IP
CORS_ORIGIN=http://YOUR_EC2_PUBLIC_IP:5173
```

### 2. Update `frontend/.env`

```bash
# Change VITE_API_URL to your EC2 IP
VITE_API_URL=http://YOUR_EC2_PUBLIC_IP:3000/api/v1
```

### 3. Update `docker-compose.yml`

In the backend service environment:
```yaml
CORS_ORIGIN: http://YOUR_EC2_PUBLIC_IP:5173
```

In the frontend service environment:
```yaml
VITE_API_URL: http://YOUR_EC2_PUBLIC_IP:3000/api/v1
```

### 4. Restart containers after changes:

```bash
docker compose down
docker compose up -d
```

**Note:** The `.env` files are not in the git repository (they're in `.gitignore` for security). You'll need to create them manually on your EC2 instance.

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
ssh -L 5173:localhost:5173 -L 3000:localhost:3000 ubuntu@YOUR_EC2_PUBLIC_IP

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
   curl -I http://YOUR_EC2_PUBLIC_IP:3000/health
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
2. ✅ Access http://YOUR_EC2_PUBLIC_IP:5173 in your browser
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
**http://YOUR_EC2_PUBLIC_IP:5173**
