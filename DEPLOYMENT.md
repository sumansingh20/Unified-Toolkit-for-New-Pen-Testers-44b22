# Production Deployment Guide

## Unified Penetration Testing Platform - Production Setup

This guide provides comprehensive instructions for deploying the Unified Penetration Testing Platform in a production environment.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Server Requirements](#server-requirements)
3. [Initial Setup](#initial-setup)
4. [Configuration](#configuration)
5. [SSL Certificate Setup](#ssl-certificate-setup)
6. [Deployment](#deployment)
7. [Post-Deployment](#post-deployment)
8. [Monitoring](#monitoring)
9. [Backup & Recovery](#backup--recovery)
10. [Security Considerations](#security-considerations)
11. [Troubleshooting](#troubleshooting)

## Prerequisites

### Software Requirements

- **Docker Engine**: Version 20.10.0 or higher
- **Docker Compose**: Version 2.0.0 or higher
- **Git**: For cloning the repository
- **OpenSSL**: For SSL certificate generation (if needed)
- **curl**: For health checks and testing

### System Requirements

#### Minimum Requirements
- **CPU**: 4 cores
- **RAM**: 8 GB
- **Storage**: 50 GB SSD
- **Network**: 100 Mbps

#### Recommended Requirements
- **CPU**: 8 cores
- **RAM**: 16 GB
- **Storage**: 100 GB SSD
- **Network**: 1 Gbps

## Server Requirements

### Operating System Support
- Ubuntu 20.04 LTS or higher
- CentOS 8 or higher
- RHEL 8 or higher
- Debian 11 or higher
- Windows Server 2019 or higher (with Docker Desktop)

### Network Configuration
- **Ports Required**:
  - 80 (HTTP)
  - 443 (HTTPS)
  - 22 (SSH)
  - 9090 (Prometheus - Optional)

### Firewall Rules
```bash
# Ubuntu/Debian with ufw
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 22/tcp
sudo ufw allow 9090/tcp  # Optional: Prometheus

# CentOS/RHEL with firewalld
sudo firewall-cmd --permanent --add-port=80/tcp
sudo firewall-cmd --permanent --add-port=443/tcp
sudo firewall-cmd --permanent --add-port=22/tcp
sudo firewall-cmd --permanent --add-port=9090/tcp  # Optional
sudo firewall-cmd --reload
```

## Initial Setup

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/unified-pentest-platform.git
cd unified-pentest-platform
```

### 2. Install Docker (Ubuntu/Debian)
```bash
# Update package index
sudo apt-get update

# Install prerequisites
sudo apt-get install -y \
    apt-transport-https \
    ca-certificates \
    curl \
    gnupg \
    lsb-release

# Add Docker GPG key
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

# Add Docker repository
echo \
  "deb [arch=amd64 signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Install Docker
sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# Add user to docker group
sudo usermod -aG docker $USER

# Start and enable Docker
sudo systemctl start docker
sudo systemctl enable docker

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/v2.12.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

### 3. Install Docker (CentOS/RHEL)
```bash
# Remove old versions
sudo yum remove docker docker-client docker-client-latest docker-common docker-latest docker-latest-logrotate docker-logrotate docker-engine

# Install yum-utils
sudo yum install -y yum-utils

# Add Docker repository
sudo yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo

# Install Docker
sudo yum install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# Start and enable Docker
sudo systemctl start docker
sudo systemctl enable docker

# Add user to docker group
sudo usermod -aG docker $USER

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/v2.12.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

## Configuration

### 1. Environment Configuration

Create and configure the production environment file:

```bash
cp .env.production.template .env.production
```

Edit `.env.production` with your actual values:

```env
# Production Environment Configuration
NODE_ENV=production

# Database Configuration
MONGODB_URI=mongodb://unified_admin:YourSecurePassword@mongodb:27017/unified-toolkit?authSource=admin

# JWT Configuration
JWT_SECRET=YourSecureJWTSecret
JWT_REFRESH_SECRET=YourSecureRefreshSecret

# Email Configuration (Gmail)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-app-email@gmail.com
EMAIL_PASS=your-app-password

# Twilio Configuration
TWILIO_ACCOUNT_SID=your-twilio-account-sid
TWILIO_AUTH_TOKEN=your-twilio-auth-token
TWILIO_PHONE_NUMBER=+1234567890

# reCAPTCHA Configuration
RECAPTCHA_SITE_KEY=your-recaptcha-site-key
RECAPTCHA_SECRET_KEY=your-recaptcha-secret-key

# Application URLs
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=YourNextAuthSecret

# Redis Configuration
REDIS_URL=redis://:YourRedisPassword@redis:6379

# Rate Limiting
RATE_LIMIT_MAX_REQUESTS=100

# Logging
LOG_LEVEL=info

# Tools Configuration
TOOLS_TIMEOUT=300
```

### 2. Domain Configuration

Update the domain in the following files:
- `nginx/nginx.prod.conf`: Replace `pentest.unified-platform.com` with your domain
- `docker-compose.prod.yml`: Update NEXTAUTH_URL with your domain

## SSL Certificate Setup

### Option 1: Let's Encrypt (Recommended for Production)

```bash
# Install Certbot
sudo apt-get install -y certbot

# Obtain SSL certificate
sudo certbot certonly --standalone -d your-domain.com

# Copy certificates to ssl directory
sudo cp /etc/letsencrypt/live/your-domain.com/fullchain.pem ./ssl/unified-platform.crt
sudo cp /etc/letsencrypt/live/your-domain.com/privkey.pem ./ssl/unified-platform.key
sudo chown $USER:$USER ./ssl/*
```

### Option 2: Self-Signed Certificates (Development/Testing)

```bash
# Generate self-signed certificate
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout ./ssl/unified-platform.key \
    -out ./ssl/unified-platform.crt \
    -subj "/C=US/ST=State/L=City/O=Organization/CN=your-domain.com"

# Set proper permissions
chmod 600 ./ssl/unified-platform.key
chmod 644 ./ssl/unified-platform.crt
```

### Option 3: Commercial SSL Certificate

1. Purchase an SSL certificate from a trusted CA
2. Copy the certificate files to:
   - Certificate: `./ssl/unified-platform.crt`
   - Private Key: `./ssl/unified-platform.key`
3. Set proper permissions:
   ```bash
   chmod 600 ./ssl/unified-platform.key
   chmod 644 ./ssl/unified-platform.crt
   ```

## Deployment

### Linux/macOS Deployment

```bash
# Make deployment script executable
chmod +x deploy.sh

# Deploy the application
./deploy.sh deploy

# Check status
./deploy.sh status

# View logs
./deploy.sh logs
```

### Windows Deployment

```powershell
# Set execution policy (if needed)
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# Deploy the application
.\deploy.ps1 deploy

# Check status
.\deploy.ps1 status

# View logs
.\deploy.ps1 logs
```

### Manual Deployment

```bash
# Stop existing containers
docker-compose -f docker-compose.prod.yml down

# Pull latest images
docker-compose -f docker-compose.prod.yml pull

# Build and start containers
docker-compose -f docker-compose.prod.yml up -d --build

# Check container status
docker-compose -f docker-compose.prod.yml ps

# Check logs
docker-compose -f docker-compose.prod.yml logs -f
```

## Post-Deployment

### 1. Verify Deployment

```bash
# Check if all containers are running
docker-compose -f docker-compose.prod.yml ps

# Test HTTP endpoint
curl -I http://localhost

# Test HTTPS endpoint (ignore SSL warnings for self-signed)
curl -I -k https://localhost

# Test API health endpoint
curl http://localhost/api/health
```

### 2. Create Admin User

Visit `https://your-domain.com/register` and create the first admin user.

### 3. Configure DNS

Update your DNS records to point to your server:
```
A    your-domain.com        YOUR_SERVER_IP
A    www.your-domain.com    YOUR_SERVER_IP
```

### 4. Configure Email Templates

Customize email templates in the admin panel:
- Welcome emails
- Password reset emails
- OTP verification emails

## Monitoring

### 1. Prometheus Metrics

Access Prometheus at `http://your-domain.com:9090`

Key metrics to monitor:
- Application response time
- Request count
- Error rate
- Database connections
- Memory usage
- CPU usage

### 2. Application Logs

```bash
# View application logs
docker-compose -f docker-compose.prod.yml logs app

# View nginx logs
docker-compose -f docker-compose.prod.yml logs nginx

# View database logs
docker-compose -f docker-compose.prod.yml logs mongodb

# Follow logs in real-time
docker-compose -f docker-compose.prod.yml logs -f
```

### 3. Health Checks

Set up external monitoring to check:
- `https://your-domain.com/api/health`
- `https://your-domain.com/health`

### 4. Log Rotation

Configure log rotation for Docker logs:

```bash
# Create docker daemon configuration
sudo mkdir -p /etc/docker
sudo tee /etc/docker/daemon.json > /dev/null <<EOF
{
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "10m",
    "max-file": "3"
  }
}
EOF

# Restart Docker
sudo systemctl restart docker
```

## Backup & Recovery

### 1. Database Backup

```bash
# Create backup manually
docker-compose -f docker-compose.prod.yml exec mongodb mongodump --archive=/backups/backup-$(date +%Y%m%d-%H%M%S).archive

# Automated daily backup (add to crontab)
echo "0 2 * * * cd /path/to/your/app && ./deploy.sh backup" | crontab -
```

### 2. Complete System Backup

```bash
# Backup all data volumes
docker run --rm -v unified-pentest-platform_mongodb_data_prod:/data -v $(pwd)/backups:/backup alpine tar czf /backup/mongodb-$(date +%Y%m%d).tar.gz -C /data .

# Backup SSL certificates and configuration
tar czf backups/config-$(date +%Y%m%d).tar.gz ssl/ nginx/ .env.production
```

### 3. Recovery

```bash
# Restore database
docker-compose -f docker-compose.prod.yml exec -T mongodb mongorestore --archive < backups/backup-20241201-020000.archive

# Restore data volumes
docker run --rm -v unified-pentest-platform_mongodb_data_prod:/data -v $(pwd)/backups:/backup alpine tar xzf /backup/mongodb-20241201.tar.gz -C /data
```

## Security Considerations

### 1. System Security

```bash
# Update system packages
sudo apt-get update && sudo apt-get upgrade -y

# Configure automatic security updates
sudo apt-get install -y unattended-upgrades
sudo dpkg-reconfigure unattended-upgrades

# Configure fail2ban
sudo apt-get install -y fail2ban
sudo systemctl enable fail2ban
sudo systemctl start fail2ban
```

### 2. Docker Security

```bash
# Run Docker rootless (optional but recommended)
dockerd-rootless-setuptool.sh install

# Use Docker secrets for sensitive data
echo "your-secret" | docker secret create my-secret -
```

### 3. Application Security

- Change all default passwords
- Use strong JWT secrets
- Configure rate limiting
- Enable HTTPS only
- Regular security updates
- Monitor logs for suspicious activity

### 4. Network Security

```bash
# Configure iptables (basic example)
sudo iptables -A INPUT -p tcp --dport 22 -j ACCEPT
sudo iptables -A INPUT -p tcp --dport 80 -j ACCEPT
sudo iptables -A INPUT -p tcp --dport 443 -j ACCEPT
sudo iptables -A INPUT -j DROP

# Save iptables rules
sudo iptables-save > /etc/iptables/rules.v4
```

## Troubleshooting

### Common Issues

#### 1. Container Won't Start

```bash
# Check container logs
docker-compose -f docker-compose.prod.yml logs [service-name]

# Check container resource usage
docker stats

# Check disk space
df -h
```

#### 2. Database Connection Issues

```bash
# Test MongoDB connection
docker-compose -f docker-compose.prod.yml exec mongodb mongo -u unified_admin -p

# Check MongoDB logs
docker-compose -f docker-compose.prod.yml logs mongodb
```

#### 3. SSL Certificate Issues

```bash
# Test SSL certificate
openssl x509 -in ./ssl/unified-platform.crt -text -noout

# Check certificate expiration
openssl x509 -in ./ssl/unified-platform.crt -enddate -noout
```

#### 4. Performance Issues

```bash
# Check resource usage
docker stats

# Monitor system resources
htop

# Check nginx access patterns
docker-compose -f docker-compose.prod.yml logs nginx | grep -E "HTTP/[0-9.]+ [4-5][0-9][0-9]"
```

### Log Analysis

```bash
# Find errors in application logs
docker-compose -f docker-compose.prod.yml logs app | grep -i error

# Monitor request patterns
docker-compose -f docker-compose.prod.yml logs nginx | awk '{print $1}' | sort | uniq -c | sort -nr

# Check for brute force attempts
docker-compose -f docker-compose.prod.yml logs nginx | grep -E " 401 | 403 "
```

### Performance Tuning

#### Database Optimization

```javascript
// MongoDB indexes for better performance
db.users.createIndex({ email: 1 }, { unique: true })
db.users.createIndex({ createdAt: 1 })
db.scanlogs.createIndex({ userId: 1, createdAt: -1 })
db.scanlogs.createIndex({ tool: 1, createdAt: -1 })
db.otps.createIndex({ email: 1, expiresAt: 1 })
```

#### Nginx Optimization

Update `nginx/nginx.prod.conf` for high traffic:

```nginx
worker_processes auto;
worker_connections 4096;

http {
    # Enable caching
    proxy_cache_path /var/cache/nginx levels=1:2 keys_zone=app_cache:10m max_size=100m inactive=60m;
    
    # Add to location block
    proxy_cache app_cache;
    proxy_cache_valid 200 5m;
    proxy_cache_use_stale error timeout updating http_500 http_502 http_503 http_504;
}
```

## Maintenance

### Regular Tasks

1. **Weekly**:
   - Check disk space
   - Review logs for errors
   - Verify backups

2. **Monthly**:
   - Update system packages
   - Review security logs
   - Performance analysis
   - SSL certificate check

3. **Quarterly**:
   - Security audit
   - Dependency updates
   - Capacity planning

### Updates and Upgrades

```bash
# Update application
git pull origin main
docker-compose -f docker-compose.prod.yml build --no-cache
docker-compose -f docker-compose.prod.yml up -d

# Update Docker images
docker-compose -f docker-compose.prod.yml pull
docker-compose -f docker-compose.prod.yml up -d
```

## Support

For additional support:
- Check the main README.md for detailed documentation
- Review application logs for specific errors
- Consult Docker and nginx documentation
- Contact system administrator

---

**Note**: This guide provides a comprehensive production deployment setup. Always test deployments in a staging environment before applying to production.
