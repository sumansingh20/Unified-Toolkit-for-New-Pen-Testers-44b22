# 🛡️ Unified Toolkit for New Pen-Testers

A comprehensive full-stack cybersecurity learning platform that integrates essential penetration testing tools with enterprise-grade authentication and a modern web interface.

## ✨ Features

### 🔐 Complete Authentication System
- **User Registration** with email, phone, and username
- **Secure Login** with reCAPTCHA protection
- **Two-Factor Authentication (2FA)** via email and SMS
- **Password Reset** with OTP verification
- **JWT-based** session management with refresh tokens
- **bcrypt** password hashing

### 🧰 Integrated Security Tools
- **Port Scanner** - Nmap integration for network discovery
- **Subdomain Enumeration** - Sublist3r and AssetFinder
- **Vulnerability Scanner** - Nikto and Nuclei integration
- **WHOIS Lookup** - Domain registration information
- **DNS Information** - DNS records and zone data
- **HTTP Headers** - Response header analysis

### 🖥️ Modern Web Interface
- **CLI-style Terminal** output with typing animation
- **Copy to Clipboard** functionality
- **Export Results** as text files
- **Responsive Design** with Tailwind CSS
- **Real-time Loading** states and progress indicators
- **Toast Notifications** for user feedback

### 🛡️ Security Features
- **Input Sanitization** and validation
- **Rate Limiting** on API endpoints
- **CORS Protection** and security headers
- **Command Injection** prevention
- **Session Management** with secure tokens
- **Environment Variable** protection

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB
- Docker (optional)

### Installation

1. **Clone the repository**
\`\`\`bash
git clone https://github.com/sumansingh20/Unified-Toolkit-for-New-Pen-Testers.git
cd unified-toolkit
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

## 🐛 Troubleshooting

### Common Issues

**MongoDB Connection Error**
\`\`\`bash
# Check if MongoDB is running
docker ps | grep mongo

# Restart MongoDB container
docker-compose restart mongodb
\`\`\`

**Security Tools Not Found**
\`\`\`bash
# Install missing tools
sudo apt-get update
sudo apt-get install nmap nikto
pip3 install sublist3r
\`\`\`

**Email/SMS Not Working**
- Verify SMTP credentials in `.env`
- Check Twilio account settings
- Ensure firewall allows outbound connections

**reCAPTCHA Issues**
- Verify site key and secret key
- Check domain configuration in Google reCAPTCHA console
- Ensure localhost is added for development

## 📈 Performance Optimization

### Database Optimization
- Indexes on frequently queried fields
- Connection pooling with MongoDB
- Query optimization for large datasets

### Frontend Optimization
- Code splitting with Next.js
- Image optimization
- Lazy loading of components
- Caching strategies

### Security Tool Performance
- Command timeouts to prevent hanging
- Resource limits for tool execution
- Concurrent request handling

## 🔮 Future Enhancements

### Planned Features
- **OSINT Tools** - Social media and email reconnaissance
- **Report Generation** - PDF export of scan results
- **Scan History** - Persistent storage of previous scans
- **Team Collaboration** - Multi-user workspaces
- **Custom Tool Integration** - Plugin system for additional tools
- **Learning Modules** - Interactive tutorials and guides

### Technical Improvements
- **Kubernetes Deployment** - Container orchestration
- **Redis Caching** - Performance optimization
- **WebSocket Integration** - Real-time scan updates
- **GraphQL API** - More efficient data fetching
- **Progressive Web App** - Offline capabilities

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Next.js Team** - For the amazing React framework
- **shadcn/ui** - For the beautiful UI components
- **Security Tool Authors** - Nmap, Nikto, Sublist3r, and others
- **MongoDB Team** - For the robust database solution
- **Vercel** - For hosting and deployment platform

## 📞 Support

If you encounter any issues or have questions:

1. **Check the documentation** above
2. **Search existing issues** on GitHub
3. **Create a new issue** with detailed information
4. **Join our community** discussions

## 🌟 Star History

If you find this project helpful, please consider giving it a star on GitHub!

---

**Built with Suman❤️ for the cybersecurity community**

*Remember: This tool is for educational purposes and authorized testing only. Always obtain proper permission before testing any systems you don't own.*
