# 🛡️ Unified Toolkit for New Pen-Testers

[![Next.js](https://img.shields.io/badge/Next.js-14.2.18-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-7.0-green)](https://www.mongodb.com/)
[![Docker](https://img.shields.io/badge/Docker-Ready-blue)](https://www.docker.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A comprehensive, enterprise-grade cybersecurity learning platform that unifies essential penetration testing tools with modern authentication, real-time scanning capabilities, and an intuitive web interface. Designed specifically for aspiring penetration testers and cybersecurity professionals who need a centralized platform to learn, practice, and master security testing methodologies.

## 🎯 Project Vision

This platform bridges the gap between theoretical cybersecurity knowledge and practical application by providing:

- **Unified Interface**: All essential penetration testing tools accessible through a single, modern web application
- **Educational Focus**: Structured learning path for new penetration testers with guided tutorials and best practices
- **Enterprise Security**: Production-ready authentication and authorization systems
- **Real-World Simulation**: Realistic testing environment that mirrors professional penetration testing workflows
- **Community Building**: Collaborative features for sharing knowledge and learning from peers

## 🏗️ System Architecture

### High-Level Architecture

```mermaid
graph TB
    A[Client Browser] -->|HTTPS| B[Nginx Reverse Proxy]
    B --> C[Next.js Application]
    C --> D[Authentication Middleware]
    C --> E[API Routes]
    C --> F[Security Tools Engine]
    
    D --> G[JWT Token Service]
    D --> H[2FA Service]
    
    E --> I[MongoDB Database]
    E --> J[Rate Limiter]
    
    F --> K[Nmap Service]
    F --> L[Subdomain Service]
    F --> M[Vulnerability Scanner]
    F --> N[DNS Tools]
    
    H --> O[Email Service]
    H --> P[SMS Service]
    
    I --> Q[User Collection]
    I --> R[Scan Logs Collection]
    I --> S[OTP Collection]
```

### Technology Stack Deep Dive

#### Frontend Layer
- **Next.js 14** with App Router for modern React development
- **TypeScript** for type safety and better developer experience
- **Tailwind CSS** for utility-first styling and responsive design
- **shadcn/ui** for consistent, accessible UI components
- **Framer Motion** for smooth animations and transitions
- **React Hook Form** for efficient form handling and validation

#### Backend Layer
- **Next.js API Routes** for serverless function architecture
- **Node.js Runtime** optimized for security tool execution
- **JWT Authentication** with refresh token rotation
- **bcrypt** for secure password hashing (12 rounds)
- **Rate Limiting** using sliding window algorithm
- **Input Sanitization** with comprehensive validation layers

#### Database Layer
- **MongoDB 7.0** for flexible document storage
- **Mongoose ODM** for schema definition and data modeling
- **Connection Pooling** for optimal performance
- **Indexing Strategy** for fast query execution
- **Data Encryption** at rest and in transit

#### Security Tools Integration
- **Native CLI Wrapping** for direct tool execution
- **Sandboxed Execution** with resource limits
- **Output Parsing** with real-time streaming
- **Error Handling** with graceful degradation
- **Timeout Management** to prevent hanging processes

## ✨ Features Deep Dive

### 🔐 Complete Authentication System

Our authentication system implements enterprise-grade security standards:

- **Multi-Factor Registration**: Email, phone number, and username verification
- **Secure Login**: reCAPTCHA v3 integration with risk assessment scoring
- **Two-Factor Authentication (2FA)**: 
  - Email-based OTP with HTML templates
  - SMS integration via Twilio API
  - Time-based OTP with 5-minute expiration
  - Rate limiting (3 attempts per 15 minutes)
- **Password Security**:
  - bcrypt hashing with 12 salt rounds
  - Password strength validation (8+ chars, mixed case, numbers, symbols)
  - Secure password reset flow with OTP verification
- **Session Management**:
  - JWT access tokens (15-minute expiration)
  - Refresh tokens (7-day expiration with rotation)
  - Automatic token refresh on API calls
  - Secure HttpOnly cookie storage

### 🧰 Integrated Security Tools

#### Network Discovery & Enumeration

**Port Scanner (Nmap Integration)**
- **Scan Types**: TCP Connect, SYN Stealth, UDP, Ping sweeps
- **Port Ranges**: Custom ranges, top ports, all ports (1-65535)
- **Service Detection**: Version detection with OS fingerprinting
- **Output Formats**: XML, JSON, and human-readable formats
- **Performance**: Aggressive, normal, and polite timing templates
- **Safety Features**: Target validation, scan logging, rate limiting

**Subdomain Enumeration**
- **Multiple Sources**: Certificate transparency logs, DNS records, search engines
- **Tools Integrated**: Sublist3r, AssetFinder, DNSRecon
- **Passive Discovery**: Non-intrusive subdomain enumeration
- **Active Verification**: DNS resolution validation
- **Wildcard Detection**: Automatic wildcard domain filtering
- **Output Processing**: Deduplication and sorting

#### Web Application Security

**Vulnerability Scanner**
- **Nikto Integration**: Web server vulnerability assessment
- **Nuclei Templates**: 3000+ community-driven vulnerability templates
- **Custom Checks**: SQL injection, XSS, directory traversal detection
- **SSL/TLS Analysis**: Certificate validation and cipher suite testing
- **HTTP Security Headers**: HSTS, CSP, X-Frame-Options analysis
- **Authentication Testing**: Login form and session management testing

**HTTP Analysis Tools**
- **Header Inspection**: Security headers analysis and recommendations
- **Response Analysis**: Status codes, content types, server fingerprinting
- **Cookie Security**: HttpOnly, Secure, SameSite attribute validation
- **CORS Testing**: Cross-origin resource sharing configuration analysis
- **Redirect Chains**: URL redirection analysis and open redirect detection

#### Information Gathering

**WHOIS & DNS Tools**
- **Domain Information**: Registration details, nameservers, contact information
- **DNS Record Analysis**: A, AAAA, MX, TXT, NS, SOA records
- **DNS Zone Transfers**: AXFR attempt and analysis
- **Reverse DNS**: PTR record lookups
- **DNS Security**: DNSSEC validation
- **Geolocation**: IP address geographical mapping

### 🖥️ Modern Web Interface

#### User Experience Design

**Terminal-Style Output**
- **Real-time Streaming**: Live command output with WebSocket connections
- **Syntax Highlighting**: Color-coded output for different tool types
- **Typing Animation**: Realistic terminal typing simulation
- **Command History**: Persistent history across sessions
- **Copy Functionality**: One-click copy to clipboard
- **Export Options**: Save results as TXT, JSON, or PDF

**Responsive Design**
- **Mobile-First**: Optimized for mobile devices and tablets
- **Dark/Light Themes**: System preference detection with manual override
- **Accessibility**: WCAG 2.1 AA compliance with screen reader support
- **Progressive Enhancement**: Works without JavaScript for core features
- **Performance**: Lazy loading, code splitting, and image optimization

#### Interactive Features

**Tool Configuration**
- **Guided Setup**: Step-by-step tool configuration wizards
- **Preset Profiles**: Common scan configurations for different scenarios
- **Custom Parameters**: Advanced users can modify tool-specific options
- **Validation**: Real-time input validation with helpful error messages
- **Save/Load**: Save favorite configurations for repeated use

**Results Management**
- **Search & Filter**: Full-text search across scan results
- **Comparison**: Side-by-side comparison of multiple scans
- **Sharing**: Secure sharing with team members via encrypted links
- **Notifications**: Email alerts for completed scans
- **Integration**: Export to popular penetration testing frameworks

### 🛡️ Security Features & Implementation

#### Defense in Depth Strategy

**Input Validation & Sanitization**
- **Multi-layer Validation**: Client-side, server-side, and database-level validation
- **Command Injection Prevention**: Whitelist-based input filtering with regex patterns
- **SQL Injection Protection**: Parameterized queries with Mongoose ODM
- **XSS Prevention**: Content Security Policy (CSP) with nonce-based script execution
- **Path Traversal Protection**: Sandboxed file system access with chroot jail
- **File Upload Security**: MIME type validation, size limits, virus scanning

**Authentication & Authorization**
- **Zero Trust Architecture**: Every request authenticated and authorized
- **Role-Based Access Control (RBAC)**: Admin, user, and guest permission levels
- **Session Security**: 
  - Secure cookie flags (HttpOnly, Secure, SameSite)
  - Session invalidation on suspicious activity
  - Concurrent session limiting
  - IP address validation
- **Brute Force Protection**: 
  - Account lockout after failed attempts
  - Progressive delays (exponential backoff)
  - CAPTCHA challenges for suspicious behavior
  - Geolocation-based risk assessment

**API Security**
- **Rate Limiting**: 
  - Sliding window algorithm with Redis backing
  - Per-user and per-IP rate limits
  - Different limits for authenticated vs anonymous users
  - Burst allowance for legitimate high-frequency usage
- **Request Validation**:
  - JSON schema validation for all payloads
  - Request size limits (10MB default)
  - Content-Type enforcement
  - Custom header validation
- **Response Security**:
  - Security headers (HSTS, X-Frame-Options, X-Content-Type-Options)
  - Error message sanitization
  - Information disclosure prevention
  - CORS policy enforcement

#### Network & Infrastructure Security

**Container Security**
- **Minimal Base Images**: Alpine Linux with only essential packages
- **Non-root Execution**: All processes run as unprivileged users
- **Resource Limits**: CPU, memory, and disk I/O constraints
- **Network Segmentation**: Isolated container networks with controlled communication
- **Secret Management**: External secret stores (HashiCorp Vault, Docker Secrets)
- **Image Scanning**: Automated vulnerability scanning with Trivy/Clair

**Production Deployment Security**
- **SSL/TLS Configuration**: 
  - TLS 1.3 minimum with strong cipher suites
  - HSTS with preload and includeSubDomains
  - Certificate transparency monitoring
  - OCSP stapling for certificate validation
- **Reverse Proxy Security**:
  - Nginx with security modules (ModSecurity WAF)
  - Request filtering and size limits
  - DoS protection with rate limiting
  - Gzip bomb protection
- **Database Security**:
  - MongoDB authentication with X.509 certificates
  - Network encryption with TLS
  - Field-level encryption for sensitive data
  - Regular security audits and monitoring

## 🚀 Advanced Installation & Configuration

### Development Environment Setup

#### Prerequisites Deep Dive

**System Requirements**
- **Operating System**: Linux (Ubuntu 20.04+ recommended), macOS 10.15+, Windows 10+ with WSL2
- **Hardware**: 8GB RAM minimum (16GB recommended), 20GB free disk space
- **Network**: Unrestricted internet access for tool downloads and updates
- **Permissions**: Sudo/administrator access for security tool installation

**Node.js Environment**
```bash
# Install Node.js 18+ using nvm (recommended)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc
nvm install 18
nvm use 18

# Verify installation
node --version  # Should output v18.x.x
npm --version   # Should output 9.x.x or higher
```

**Database Setup Options**

*Option 1: Local MongoDB Installation*
```bash
# Ubuntu/Debian
wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org

# Start and enable MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod

# macOS using Homebrew
brew tap mongodb/brew
brew install mongodb-community@7.0
brew services start mongodb/brew/mongodb-community
```

*Option 2: MongoDB Atlas (Cloud)*
```bash
# Create free cluster at https://cloud.mongodb.com
# Get connection string and add to .env file
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/unified-toolkit?retryWrites=true&w=majority
```

#### Security Tools Installation

**Core Tools Installation Script**
```bash
#!/bin/bash
# tools-install.sh - Automated security tools installation

# Update package manager
sudo apt-get update && sudo apt-get upgrade -y

# Install system dependencies
sudo apt-get install -y curl wget git python3 python3-pip golang-go

# Install Nmap
sudo apt-get install -y nmap

# Install Python-based tools
pip3 install --user sublist3r dnspython requests

# Install Go-based tools
go install github.com/tomnomnom/assetfinder@latest
go install github.com/projectdiscovery/nuclei/v2/cmd/nuclei@latest

# Install Nikto
sudo apt-get install -y nikto

# Update Nuclei templates
nuclei -update-templates

# Verify installations
echo "Verifying tool installations..."
nmap --version
sublist3r --help > /dev/null && echo "Sublist3r: OK"
assetfinder --help > /dev/null && echo "AssetFinder: OK"
nuclei --version
nikto -Version

echo "All tools installed successfully!"
```

**Docker-based Tool Installation**
```bash
# Alternative: Use Docker containers for tools
docker pull nmap/nmap
docker pull projectdiscovery/nuclei
docker pull hahwul/dalfox

# Create tool wrapper scripts
cat > /usr/local/bin/nmap-docker << 'EOF'
#!/bin/bash
docker run --rm -it nmap/nmap "$@"
EOF

chmod +x /usr/local/bin/nmap-docker
```

### � Production Deployment Strategies

#### Kubernetes Deployment

**Complete Kubernetes Configuration**
```yaml
# k8s-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: unified-toolkit
  labels:
    app: unified-toolkit
spec:
  replicas: 3
  selector:
    matchLabels:
      app: unified-toolkit
  template:
    metadata:
      labels:
        app: unified-toolkit
    spec:
      securityContext:
        runAsNonRoot: true
        runAsUser: 1000
        fsGroup: 1000
      containers:
      - name: unified-toolkit
        image: unified-toolkit:latest
        ports:
        - containerPort: 3000
        env:
        - name: NODE_ENV
          value: "production"
        - name: MONGODB_URI
          valueFrom:
            secretKeyRef:
              name: mongo-secret
              key: uri
        resources:
          requests:
            memory: "512Mi"
            cpu: "250m"
          limits:
            memory: "1Gi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /api/health
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 30
        readinessProbe:
          httpGet:
            path: /api/ready
            port: 3000
          initialDelaySeconds: 5
          periodSeconds: 10
        securityContext:
          allowPrivilegeEscalation: false
          readOnlyRootFilesystem: true
          capabilities:
            drop:
            - ALL

---
apiVersion: v1
kind: Service
metadata:
  name: unified-toolkit-service
spec:
  selector:
    app: unified-toolkit
  ports:
  - protocol: TCP
    port: 80
    targetPort: 3000
  type: LoadBalancer

---
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: unified-toolkit-ingress
  annotations:
    kubernetes.io/ingress.class: nginx
    cert-manager.io/cluster-issuer: letsencrypt-prod
    nginx.ingress.kubernetes.io/ssl-redirect: "true"
    nginx.ingress.kubernetes.io/force-ssl-redirect: "true"
spec:
  tls:
  - hosts:
    - pentesting.yourdomain.com
    secretName: unified-toolkit-tls
  rules:
  - host: pentesting.yourdomain.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: unified-toolkit-service
            port:
              number: 80
```

#### Docker Swarm Configuration

**Production Docker Compose with Swarm**
```yaml
# docker-compose.prod.yml
version: '3.8'

services:
  app:
    image: unified-toolkit:latest
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    secrets:
      - mongodb_uri
      - jwt_secret
    deploy:
      replicas: 3
      restart_policy:
        condition: on-failure
        delay: 5s
        max_attempts: 3
      update_config:
        parallelism: 1
        delay: 30s
        failure_action: rollback
      resources:
        limits:
          cpus: '0.5'
          memory: 1G
        reservations:
          cpus: '0.25'
          memory: 512M
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 60s

  mongodb:
    image: mongo:7.0
    ports:
      - "27017:27017"
    environment:
      MONGO_INITDB_ROOT_USERNAME_FILE: /run/secrets/mongo_root_username
      MONGO_INITDB_ROOT_PASSWORD_FILE: /run/secrets/mongo_root_password
    secrets:
      - mongo_root_username
      - mongo_root_password
    volumes:
      - mongodb_data:/data/db
      - ./mongo-init.js:/docker-entrypoint-initdb.d/mongo-init.js:ro
    deploy:
      replicas: 1
      restart_policy:
        condition: on-failure
      placement:
        constraints:
          - node.role == manager

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.prod.conf:/etc/nginx/nginx.conf:ro
      - ./ssl-certs:/etc/nginx/ssl:ro
    deploy:
      replicas: 2
      restart_policy:
        condition: on-failure

  redis:
    image: redis:7-alpine
    command: redis-server --requirepass ${REDIS_PASSWORD}
    deploy:
      replicas: 1
      restart_policy:
        condition: on-failure

secrets:
  mongodb_uri:
    external: true
  jwt_secret:
    external: true
  mongo_root_username:
    external: true
  mongo_root_password:
    external: true

volumes:
  mongodb_data:
    driver: local
```

### 📊 Monitoring & Observability

#### Application Performance Monitoring

**Prometheus Metrics Collection**
```javascript
// lib/monitoring/metrics.js
const promClient = require('prom-client');

// Create a Registry
const register = new promClient.Registry();

// Add default metrics
promClient.collectDefaultMetrics({ register });

// Custom application metrics
const httpRequestDuration = new promClient.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status'],
  buckets: [0.1, 0.5, 1, 2, 5, 10]
});

const activeScans = new promClient.Gauge({
  name: 'active_security_scans',
  help: 'Number of currently active security scans'
});

const scanDuration = new promClient.Histogram({
  name: 'security_scan_duration_seconds',
  help: 'Duration of security scans in seconds',
  labelNames: ['tool', 'target_type'],
  buckets: [5, 10, 30, 60, 120, 300, 600]
});

const failedScans = new promClient.Counter({
  name: 'failed_security_scans_total',
  help: 'Total number of failed security scans',
  labelNames: ['tool', 'error_type']
});

register.registerMetric(httpRequestDuration);
register.registerMetric(activeScans);
register.registerMetric(scanDuration);
register.registerMetric(failedScans);

module.exports = {
  register,
  httpRequestDuration,
  activeScans,
  scanDuration,
  failedScans
};
```

**Grafana Dashboard Configuration**
```json
{
  "dashboard": {
    "title": "Unified Toolkit Monitoring",
    "panels": [
      {
        "title": "HTTP Request Rate",
        "type": "graph",
        "targets": [
          {
            "expr": "rate(http_requests_total[5m])",
            "legendFormat": "{{method}} {{route}}"
          }
        ]
      },
      {
        "title": "Active Security Scans",
        "type": "stat",
        "targets": [
          {
            "expr": "active_security_scans",
            "legendFormat": "Active Scans"
          }
        ]
      },
      {
        "title": "Scan Success Rate",
        "type": "stat",
        "targets": [
          {
            "expr": "rate(successful_scans_total[5m]) / rate(total_scans_total[5m]) * 100",
            "legendFormat": "Success Rate %"
          }
        ]
      },
      {
        "title": "Error Rate by Tool",
        "type": "table",
        "targets": [
          {
            "expr": "rate(failed_security_scans_total[5m]) by (tool)",
            "legendFormat": "{{tool}}"
          }
        ]
      }
    ]
  }
}
```

#### Logging Strategy

**Structured Logging with Winston**
```javascript
// lib/logging/logger.js
const winston = require('winston');
const { ElasticsearchTransport } = require('winston-elasticsearch');

const esTransport = new ElasticsearchTransport({
  level: 'info',
  clientOpts: { node: process.env.ELASTICSEARCH_URL },
  index: 'unified-toolkit-logs'
});

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json(),
    winston.format.printf(({ timestamp, level, message, ...meta }) => {
      return JSON.stringify({
        timestamp,
        level,
        message,
        service: 'unified-toolkit',
        environment: process.env.NODE_ENV,
        ...meta
      });
    })
  ),
  defaultMeta: {
    service: 'unified-toolkit',
    version: process.env.npm_package_version
  },
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    }),
    new winston.transports.File({ 
      filename: 'logs/error.log', 
      level: 'error' 
    }),
    new winston.transports.File({ 
      filename: 'logs/combined.log' 
    })
  ]
});

// Add Elasticsearch transport in production
if (process.env.NODE_ENV === 'production') {
  logger.add(esTransport);
}

module.exports = logger;
```

### 🔧 Advanced Configuration & Tuning

#### Performance Optimization

**Database Query Optimization**
```javascript
// lib/models/optimized-queries.js
const mongoose = require('mongoose');

// Optimized user lookup with lean queries
async function findUserOptimized(userId) {
  return await User.findById(userId)
    .lean() // Returns plain JS object instead of Mongoose document
    .select('username email preferences') // Only select needed fields
    .exec();
}

// Aggregation pipeline for scan statistics
async function getScanStatistics(userId, days = 30) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  
  return await ScanLog.aggregate([
    {
      $match: {
        userId: new mongoose.Types.ObjectId(userId),
        createdAt: { $gte: startDate }
      }
    },
    {
      $group: {
        _id: {
          tool: '$tool',
          date: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }
        },
        count: { $sum: 1 },
        avgDuration: { $avg: '$duration' },
        successCount: {
          $sum: { $cond: [{ $eq: ['$status', 'success'] }, 1, 0] }
        }
      }
    },
    {
      $sort: { '_id.date': -1 }
    }
  ]);
}

// Efficient pagination with cursor-based approach
async function paginateScans(userId, cursor, limit = 20) {
  const query = { userId };
  if (cursor) {
    query._id = { $lt: cursor };
  }
  
  return await ScanLog.find(query)
    .sort({ _id: -1 })
    .limit(limit)
    .lean()
    .exec();
}
```

**Caching Strategy with Redis**
```javascript
// lib/cache/redis-cache.js
const Redis = require('ioredis');
const logger = require('../logging/logger');

class CacheManager {
  constructor() {
    this.redis = new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: process.env.REDIS_PORT || 6379,
      password: process.env.REDIS_PASSWORD,
      retryDelayOnFailover: 100,
      enableReadyCheck: false,
      maxRetriesPerRequest: null,
    });

    this.redis.on('error', (err) => {
      logger.error('Redis connection error:', err);
    });
  }

  async get(key) {
    try {
      const value = await this.redis.get(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      logger.error('Cache get error:', error);
      return null;
    }
  }

  async set(key, value, ttl = 3600) {
    try {
      await this.redis.setex(key, ttl, JSON.stringify(value));
      return true;
    } catch (error) {
      logger.error('Cache set error:', error);
      return false;
    }
  }

  async del(key) {
    try {
      await this.redis.del(key);
      return true;
    } catch (error) {
      logger.error('Cache delete error:', error);
      return false;
    }
  }

  // Cache scan results with automatic expiration
  async cacheScanResult(scanId, result, duration = 7200) {
    const key = `scan:${scanId}`;
    return await this.set(key, {
      result,
      timestamp: Date.now(),
      ttl: duration
    }, duration);
  }

  // Implement rate limiting with sliding window
  async isRateLimited(identifier, limit, window) {
    const key = `rate_limit:${identifier}`;
    const now = Date.now();
    const pipeline = this.redis.pipeline();
    
    // Remove old entries
    pipeline.zremrangebyscore(key, 0, now - window * 1000);
    
    // Count current entries
    pipeline.zcard(key);
    
    // Add current request
    pipeline.zadd(key, now, now);
    
    // Set expiration
    pipeline.expire(key, window);
    
    const results = await pipeline.exec();
    const currentCount = results[1][1];
    
    return currentCount >= limit;
  }
}

module.exports = new CacheManager();
```

### Installation

1. **Clone the repository**
\`\`\`bash
git clone https://github.com/sumansingh20/Unified-Toolkit-for-New-Pen-Testers.git
cd Unified-Toolkit-for-New-Pen-Testers
\`\`\`

2. **Install dependencies**
\`\`\`bash
npm install
\`\`\`

3. **Set up environment variables**
\`\`\`bash
cp .env.template .env
# Edit .env with your configuration
\`\`\`

4. **Install security tools** (Linux/macOS)
\`\`\`bash
# Install nmap
sudo apt-get install nmap  # Ubuntu/Debian
brew install nmap          # macOS

# Install other tools
pip3 install sublist3r
go install github.com/tomnomnom/assetfinder@latest
\`\`\`

5. **Start MongoDB**
\`\`\`bash
# Using Docker
docker run -d -p 27017:27017 --name mongodb mongo:7.0

# Or use your local MongoDB installation
\`\`\`

6. **Run the development server**
\`\`\`bash
npm run dev
\`\`\`

7. **Open your browser**
Navigate to `http://localhost:3000`

### 🐳 Docker Deployment

1. **Using Docker Compose**
\`\`\`bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
\`\`\`

2. **Manual Docker Build**
\`\`\`bash
# Build the image
docker build -t unified-toolkit .

# Run the container
docker run -p 3000:3000 --env-file .env unified-toolkit
\`\`\`

## 📁 Project Structure

\`\`\`
unified-toolkit/
├── app/                          # Next.js App Router pages
│   ├── api/                      # API routes
│   │   ├── auth/                 # Authentication endpoints
│   │   └── tools/                # Security tool endpoints
│   ├── dashboard/                # Main dashboard
│   ├── tools/                    # Individual tool pages
│   ├── login/                    # Authentication pages
│   ├── register/
│   ├── verify-otp/
│   ├── forgot-password/
│   └── reset-password/
├── components/                   # Reusable React components
│   ├── ui/                       # shadcn/ui components
│   ├── TerminalOutput.tsx        # CLI-style output component
│   └── ToolForm.tsx              # Tool input form component
├── contexts/                     # React contexts
│   └── AuthContext.tsx           # Authentication context
├── hooks/                        # Custom React hooks
│   └── useApi.ts                 # API call hook
├── lib/                          # Utility libraries
│   ├── models/                   # MongoDB models
│   ├── utils/                    # Utility functions
│   ├── middleware/               # API middleware
│   └── mongodb.ts                # Database connection
├── docker-compose.yml            # Docker services configuration
├── Dockerfile                    # Container build instructions
├── nginx.conf                    # Nginx configuration
└── README.md                     # This file
\`\`\`

## 🔧 Configuration

### Environment Variables

Create a `.env` file based on `.env.template`:

\`\`\`env
# Database
MONGODB_URI=mongodb://localhost:27017/Unified-Toolkit-for-New-Pen-Testers

# JWT Secrets
JWT_SECRET=your-super-secret-jwt-key-here
JWT_REFRESH_SECRET=your-refresh-secret-here

# Email Configuration (Gmail example)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# SMS Configuration (Twilio)
TWILIO_ACCOUNT_SID=your-twilio-account-sid
TWILIO_AUTH_TOKEN=your-twilio-auth-token
TWILIO_PHONE_NUMBER=+1234567890

# reCAPTCHA
RECAPTCHA_SITE_KEY=your-recaptcha-site-key
RECAPTCHA_SECRET_KEY=your-recaptcha-secret-key
\`\`\`

### Security Tools Setup

The application requires the following tools to be installed:

- **nmap** - Network port scanner
- **sublist3r** - Subdomain enumeration
- **assetfinder** - Alternative subdomain finder
- **nikto** - Web vulnerability scanner
- **nuclei** - Modern vulnerability scanner
- **whois** - Domain information lookup
- **dig** - DNS lookup utility
- **curl** - HTTP client

## 🛠️ API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/verify-otp` - OTP verification
- `POST /api/auth/forgot-password` - Password reset request
- `POST /api/auth/reset-password` - Password reset with OTP

### Security Tools
- `POST /api/tools/nmap` - Port scanning
- `POST /api/tools/subdomain` - Subdomain enumeration
- `POST /api/tools/vuln-scan` - Vulnerability scanning
- `POST /api/tools/whois` - WHOIS lookup
- `POST /api/tools/dns` - DNS information
- `POST /api/tools/http-headers` - HTTP header analysis

## 🔒 Security Considerations

### Input Validation
- All user inputs are sanitized and validated
- Command injection prevention through input filtering
- SQL injection prevention with parameterized queries

### Authentication Security
- Passwords hashed with bcrypt (12 rounds)
- JWT tokens with short expiration times
- Refresh token rotation
- 2FA with OTP expiration and attempt limits

### API Security
- Rate limiting on all endpoints
- CORS protection
- Security headers (HSTS, CSP, etc.)
- Request size limits

### Network Security
- Nginx reverse proxy with rate limiting
- SSL/TLS encryption in production
- Firewall rules for container isolation

## 📊 Usage Examples

### Port Scanning
\`\`\`bash
# Example: Scan common ports on a target
Target: example.com
Output: Open ports 22, 80, 443 with service detection
\`\`\`

### Subdomain Enumeration
\`\`\`bash
# Example: Find subdomains for a domain
Domain: example.com
Output: List of discovered subdomains (www, mail, ftp, etc.)
\`\`\`

### Vulnerability Scanning
\`\`\`bash
# Example: Scan a web application
URL: https://example.com
Output: Potential vulnerabilities and security issues
\`\`\`

## 🎯 Learning Objectives

This platform is designed to help new penetration testers:

1. **Understand Tool Integration** - Learn how security tools work together
2. **Practice Safe Testing** - Use tools in a controlled environment
3. **Develop Methodology** - Build systematic testing approaches
4. **Learn Security Concepts** - Understand vulnerabilities and mitigations
5. **Build Professional Skills** - Work with enterprise-grade authentication

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**
   \`\`\`bash
   git checkout -b feature/amazing-feature
   \`\`\`
3. **Make your changes**
4. **Add tests** if applicable
5. **Commit your changes**
   \`\`\`bash
   git commit -m 'Add amazing feature'
   \`\`\`
6. **Push to the branch**
   \`\`\`bash
   git push origin feature/amazing-feature
   \`\`\`
7. **Open a Pull Request**

### Development Guidelines
- Follow TypeScript best practices
- Use ESLint and Prettier for code formatting
- Write meaningful commit messages
- Add documentation for new features
- Ensure security best practices

## 🐛 Comprehensive Troubleshooting Guide

### Common Installation Issues

#### Node.js and Dependencies

**Issue: npm install fails with permission errors**
```bash
# Solution 1: Use npm with user directory
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
source ~/.bashrc

# Solution 2: Use nvm (recommended)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install node
nvm use node
```

**Issue: TypeScript compilation errors**
```bash
# Clear Next.js cache
rm -rf .next
npm run build

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Check TypeScript configuration
npx tsc --noEmit
```

#### Database Connection Issues

**MongoDB Connection Troubleshooting**
```bash
# Check MongoDB status
sudo systemctl status mongod

# View MongoDB logs
sudo journalctl -u mongod -f

# Test connection manually
mongo --eval "db.adminCommand('ismaster')"

# Check network connectivity
telnet localhost 27017
```

**Common MongoDB Errors and Solutions**
```javascript
// Error: MongoNetworkError: failed to connect to server
// Solution: Check if MongoDB is running and accessible
const mongoose = require('mongoose');

async function testConnection() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000
    });
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    
    // Detailed error handling
    if (error.name === 'MongoNetworkError') {
      console.log('Check if MongoDB is running on the specified host/port');
    } else if (error.name === 'MongoAuthenticationError') {
      console.log('Check your MongoDB credentials');
    }
  }
}
```

#### Security Tools Installation Issues

**Nmap Installation Problems**
```bash
# Ubuntu/Debian - if package not found
sudo apt-get update
sudo apt-get install software-properties-common
sudo add-apt-repository universe
sudo apt-get update
sudo apt-get install nmap

# macOS - if Homebrew fails
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
brew install nmap

# Windows with WSL2
wsl --install -d Ubuntu
# Then follow Ubuntu instructions
```

**Python Tools Installation Issues**
```bash
# If pip3 not found
sudo apt-get install python3-pip

# If sublist3r installation fails
pip3 install --user --upgrade pip
pip3 install --user sublist3r

# For permission issues
python3 -m pip install --user sublist3r

# Virtual environment approach (recommended)
python3 -m venv pentesting-tools
source pentesting-tools/bin/activate
pip install sublist3r dnspython requests
```

### Runtime Issues

#### Application Startup Problems

**Port Already in Use**
```bash
# Find process using port 3000
lsof -i :3000
netstat -tulpn | grep 3000

# Kill process
sudo kill -9 <process_id>

# Use different port
PORT=3001 npm run dev
```

**Environment Variables Not Loading**
```bash
# Check .env file exists and has correct format
cat .env | grep -v '^#' | grep '='

# Validate required variables
node -e "console.log(Object.keys(process.env).filter(k => k.includes('MONGO')))"

# Debug environment loading
node -e "require('dotenv').config(); console.log(process.env.MONGODB_URI)"
```

#### API and Authentication Issues

**JWT Token Issues**
```javascript
// Debug JWT tokens
const jwt = require('jsonwebtoken');

function debugToken(token) {
  try {
    const decoded = jwt.decode(token, { complete: true });
    console.log('Token header:', decoded.header);
    console.log('Token payload:', decoded.payload);
    console.log('Token expires:', new Date(decoded.payload.exp * 1000));
  } catch (error) {
    console.error('Invalid token:', error.message);
  }
}

// Test token verification
function verifyToken(token, secret) {
  try {
    const verified = jwt.verify(token, secret);
    console.log('Token valid:', verified);
  } catch (error) {
    console.error('Token verification failed:', error.message);
  }
}
```

**Email/SMS Service Issues**
```javascript
// Test email configuration
const nodemailer = require('nodemailer');

async function testEmail() {
  const transporter = nodemailer.createTransporter({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  try {
    await transporter.verify();
    console.log('Email server connection successful');
  } catch (error) {
    console.error('Email server error:', error);
  }
}

// Test SMS (Twilio) configuration
const twilio = require('twilio');

function testSMS() {
  try {
    const client = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );
    
    client.accounts(process.env.TWILIO_ACCOUNT_SID)
      .fetch()
      .then(account => console.log('Twilio connection successful:', account.friendlyName))
      .catch(error => console.error('Twilio error:', error));
  } catch (error) {
    console.error('Twilio configuration error:', error);
  }
}
```

### Performance Issues

#### Slow Scan Performance

**Optimize Nmap Scans**
```bash
# Fast scan for initial discovery
nmap -T4 -F target.com

# Optimize for large networks
nmap -T4 --min-parallelism 50 --max-parallelism 100 target.com

# Skip DNS resolution for speed
nmap -n target.com

# Use specific scan types for faster results
nmap -sS -T4 target.com  # SYN scan (fastest)
```

**Database Performance Optimization**
```javascript
// Add indexes for frequently queried fields
db.users.createIndex({ "email": 1 })
db.users.createIndex({ "username": 1 })
db.scanLogs.createIndex({ "userId": 1, "createdAt": -1 })
db.scanLogs.createIndex({ "tool": 1, "status": 1 })

// Optimize queries with explain()
db.scanLogs.find({ userId: ObjectId("...") }).explain("executionStats")

// Use aggregation for complex queries
db.scanLogs.aggregate([
  { $match: { userId: ObjectId("...") } },
  { $group: { _id: "$tool", count: { $sum: 1 } } }
])
```

## 📚 Educational Resources & Learning Path

### Beginner's Learning Path

#### Phase 1: Foundation (Weeks 1-2)
1. **Networking Fundamentals**
   - TCP/IP protocol suite
   - OSI model and common ports
   - DNS and DHCP basics
   - Network topologies and architecture

2. **Web Technologies**
   - HTTP/HTTPS protocols
   - Web server architecture
   - Common web vulnerabilities (OWASP Top 10)
   - Browser security mechanisms

3. **Linux Command Line**
   - Basic commands and file system navigation
   - Process management and system monitoring
   - Package management and software installation
   - Text processing and automation with scripts

#### Phase 2: Tool Mastery (Weeks 3-6)
1. **Network Scanning**
   - Nmap comprehensive usage
   - Port scanning techniques and timing
   - Service detection and OS fingerprinting
   - NSE scripts for advanced discovery

2. **Web Application Testing**
   - Burp Suite fundamentals
   - Nikto vulnerability scanning
   - Directory enumeration with gobuster/dirb
   - SQL injection and XSS testing

3. **Information Gathering**
   - OSINT techniques and tools
   - Subdomain enumeration strategies
   - Social engineering reconnaissance
   - Metadata analysis and digital forensics

#### Phase 3: Advanced Techniques (Weeks 7-12)
1. **Exploitation Frameworks**
   - Metasploit introduction and usage
   - Custom payload creation
   - Post-exploitation techniques
   - Privilege escalation methods

2. **Wireless Security**
   - WiFi security assessment
   - WPA/WPA2 attacks and defenses
   - Bluetooth and other wireless protocols
   - Radio frequency analysis

3. **Reporting and Documentation**
   - Professional report writing
   - Risk assessment methodologies
   - Executive summary creation
   - Remediation recommendations

### Hands-on Labs and Exercises

#### Lab 1: Network Discovery
```bash
# Objective: Discover live hosts and open ports on a target network
# Target: 192.168.1.0/24 (use your local network for practice)

# Step 1: Host discovery
nmap -sn 192.168.1.0/24

# Step 2: Port scanning
nmap -sS -T4 -p 1-1000 <discovered_hosts>

# Step 3: Service detection
nmap -sV -p <open_ports> <target_host>

# Step 4: OS fingerprinting
nmap -O <target_host>

# Expected outcome: Complete network map with services and OS information
```

#### Lab 2: Web Application Reconnaissance
```bash
# Objective: Gather information about a web application
# Target: http://testphp.vulnweb.com (safe testing target)

# Step 1: HTTP header analysis
curl -I http://testphp.vulnweb.com

# Step 2: Directory enumeration
dirb http://testphp.vulnweb.com /usr/share/dirb/wordlists/common.txt

# Step 3: Subdomain discovery
sublist3r -d vulnweb.com

# Step 4: Vulnerability scanning
nikto -h http://testphp.vulnweb.com

# Expected outcome: Complete web application profile with potential vulnerabilities
```

#### Lab 3: Vulnerability Assessment
```bash
# Objective: Perform comprehensive vulnerability assessment
# Target: Metasploitable 2 VM (downloadable test environment)

# Step 1: Initial scan
nmap -sV -sC 192.168.1.100

# Step 2: Vulnerability identification
nmap --script vuln 192.168.1.100

# Step 3: Service-specific testing
nmap --script smtp-* 192.168.1.100 -p 25
nmap --script ssh-* 192.168.1.100 -p 22

# Step 4: Web service testing
nikto -h http://192.168.1.100

# Expected outcome: Detailed vulnerability report with exploitation recommendations
```

### Practice Environments

#### Safe Testing Platforms
1. **VulnHub VMs**: Download vulnerable virtual machines
2. **HackTheBox**: Online penetration testing platform
3. **TryHackMe**: Guided cybersecurity challenges
4. **OverTheWire**: Wargames for security learning
5. **DVWA**: Deliberately Vulnerable Web Application
6. **Metasploitable**: Intentionally vulnerable Linux distribution

#### Local Lab Setup
```bash
# Install VirtualBox or VMware
# Download vulnerable VMs:
# - Metasploitable 2
# - DVWA
# - bWAPP
# - VulnHub machines

# Network configuration for isolated testing
# Create host-only network in VirtualBox
# Assign static IPs to VMs
# Configure firewall rules for containment
```

## 🤝 Community & Contribution Guidelines

### Contributing to the Project

#### Development Workflow
1. **Fork and Clone**
   ```bash
   git clone https://github.com/sumansingh20/Unified-Toolkit-for-New-Pen-Testers.git
   cd Unified-Toolkit-for-New-Pen-Testers
   git remote add upstream https://github.com/sumansingh20/Unified-Toolkit-for-New-Pen-Testers.git
   ```

2. **Create Feature Branch**
   ```bash
   git checkout -b feature/amazing-new-tool
   git push -u origin feature/amazing-new-tool
   ```

3. **Development Standards**
   - Follow ESLint and Prettier configurations
   - Write comprehensive tests for new features
   - Update documentation for API changes
   - Follow semantic commit message conventions

4. **Pull Request Process**
   - Ensure all tests pass
   - Update README if necessary
   - Add screenshots for UI changes
   - Request review from maintainers

#### Code Review Guidelines
- **Security First**: All code changes reviewed for security implications
- **Performance Impact**: Consider impact on scanning performance
- **User Experience**: Maintain consistent UI/UX patterns
- **Documentation**: Code should be self-documenting with clear comments
- **Testing**: Minimum 80% code coverage for new features

### Community Support

#### Getting Help
1. **Documentation**: Check this README and inline documentation
2. **GitHub Issues**: Search existing issues before creating new ones
3. **Discussions**: Use GitHub Discussions for general questions
4. **Discord Community**: Real-time chat and collaboration
5. **Stack Overflow**: Tag questions with 'unified-toolkit'

#### Reporting Security Issues
```
For security vulnerabilities, please email: security@unified-toolkit.com
Include:
- Detailed description of the vulnerability
- Steps to reproduce
- Potential impact assessment
- Suggested mitigation (if any)

Do not create public GitHub issues for security vulnerabilities.
```

### Code of Conduct

#### Our Standards
- **Respectful Communication**: Treat all community members with respect
- **Constructive Feedback**: Provide helpful and actionable feedback
- **Educational Focus**: Remember this is a learning platform
- **Legal Compliance**: Only use tools for authorized testing
- **Ethical Hacking**: Follow responsible disclosure principles

#### Enforcement
- Warning for minor violations
- Temporary ban for repeated violations
- Permanent ban for severe violations
- Appeal process available via email

## 🌟 Project Roadmap & Future Vision

### Short-term Goals (Next 3 months)
- [ ] Advanced OSINT tools integration
- [ ] Real-time collaboration features
- [ ] Mobile application for iOS/Android
- [ ] Enhanced reporting with PDF export
- [ ] Integration with popular CI/CD pipelines

### Medium-term Goals (3-12 months)
- [ ] Machine learning for vulnerability prioritization
- [ ] Integration with major cloud platforms (AWS, Azure, GCP)
- [ ] Advanced payload generation and encoding
- [ ] Team management and role-based access
- [ ] Integration with ticketing systems (Jira, ServiceNow)

### Long-term Vision (1+ years)
- [ ] AI-powered security assessment recommendations
- [ ] Blockchain-based audit trail and reporting
- [ ] Virtual reality interface for network visualization
- [ ] Integration with threat intelligence feeds
- [ ] Automated compliance reporting (SOC 2, ISO 27001)

---

## 📄 Legal Disclaimer

**IMPORTANT**: This tool is designed for educational purposes and authorized security testing only. Users are responsible for:

- Obtaining proper authorization before testing any systems
- Complying with all applicable laws and regulations
- Using the tool in accordance with ethical hacking principles
- Respecting the privacy and security of others

The developers and contributors of this project are not responsible for any misuse of the tool or any damages resulting from its use.

## 📞 Contact & Support

- **Email**: support@unified-toolkit.com
- **GitHub**: https://github.com/sumansingh20/Unified-Toolkit-for-New-Pen-Testers
- **Discord**: https://discord.gg/unified-toolkit
- **Twitter**: @UnifiedToolkit

---

**Built with Suman❤️ for the cybersecurity community**

*"Security is not a product, but a process." - Bruce Schneier*
