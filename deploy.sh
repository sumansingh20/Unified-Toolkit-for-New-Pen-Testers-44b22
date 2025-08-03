#!/bin/bash

# Unified Penetration Testing Platform - Production Deployment Script
# Author: Suman Kumar
# Version: 1.0.0

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_NAME="unified-pentest-platform"
COMPOSE_FILE="docker-compose.prod.yml"
ENV_FILE=".env.production"
BACKUP_DIR="./backups"
LOG_DIR="./logs"

# Functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check prerequisites
check_prerequisites() {
    log_info "Checking prerequisites..."
    
    # Check Docker
    if ! command -v docker &> /dev/null; then
        log_error "Docker is not installed. Please install Docker first."
        exit 1
    fi
    
    # Check Docker Compose
    if ! command -v docker-compose &> /dev/null; then
        log_error "Docker Compose is not installed. Please install Docker Compose first."
        exit 1
    fi
    
    # Check if running as root on Linux
    if [[ "$OSTYPE" == "linux-gnu"* ]] && [[ $EUID -eq 0 ]]; then
        log_warning "Running as root. Consider using a non-root user with Docker group membership."
    fi
    
    log_success "Prerequisites check passed"
}

# Create necessary directories
create_directories() {
    log_info "Creating necessary directories..."
    
    mkdir -p "$BACKUP_DIR"
    mkdir -p "$LOG_DIR"
    mkdir -p "./ssl"
    mkdir -p "./nginx/logs"
    mkdir -p "./data/tools"
    mkdir -p "./data/results"
    mkdir -p "./prometheus"
    mkdir -p "./fluentd/conf"
    
    # Set proper permissions
    chmod 755 "$BACKUP_DIR" "$LOG_DIR" "./ssl" "./nginx/logs"
    chmod 700 "./data/tools" "./data/results"
    
    log_success "Directories created successfully"
}

# Check environment file
check_environment() {
    log_info "Checking environment configuration..."
    
    if [[ ! -f "$ENV_FILE" ]]; then
        log_error "Environment file $ENV_FILE not found!"
        log_info "Creating a template environment file..."
        
        cat > "$ENV_FILE" << 'EOF'
# Production Environment Configuration
NODE_ENV=production

# Email Configuration (Required)
EMAIL_APP_PASSWORD=your_gmail_app_password_here

# Twilio Configuration (Required for SMS)
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token

# reCAPTCHA Configuration (Required)
RECAPTCHA_SITE_KEY=your_recaptcha_site_key
RECAPTCHA_SECRET_KEY=your_recaptcha_secret_key

# Domain Configuration
DOMAIN=pentest.unified-platform.com
EOF
        
        log_warning "Please edit $ENV_FILE with your actual configuration values"
        log_warning "Then run this script again"
        exit 1
    fi
    
    # Check for placeholder values
    if grep -q "your_.*_here" "$ENV_FILE"; then
        log_error "Environment file contains placeholder values!"
        log_error "Please update $ENV_FILE with actual configuration values"
        exit 1
    fi
    
    log_success "Environment configuration looks good"
}

# Generate SSL certificates (self-signed for development)
generate_ssl_certificates() {
    log_info "Checking SSL certificates..."
    
    if [[ ! -f "./ssl/unified-platform.crt" ]] || [[ ! -f "./ssl/unified-platform.key" ]]; then
        log_warning "SSL certificates not found. Generating self-signed certificates..."
        log_warning "For production, please replace with valid SSL certificates"
        
        openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
            -keyout "./ssl/unified-platform.key" \
            -out "./ssl/unified-platform.crt" \
            -subj "/C=US/ST=State/L=City/O=Organization/CN=pentest.unified-platform.com"
        
        chmod 600 "./ssl/unified-platform.key"
        chmod 644 "./ssl/unified-platform.crt"
        
        log_success "Self-signed SSL certificates generated"
    else
        log_success "SSL certificates found"
    fi
}

# Create monitoring configuration
create_monitoring_config() {
    log_info "Creating monitoring configuration..."
    
    # Prometheus configuration
    cat > "./prometheus/prometheus.yml" << 'EOF'
global:
  scrape_interval: 15s
  evaluation_interval: 15s

scrape_configs:
  - job_name: 'unified-pentest-app'
    static_configs:
      - targets: ['app:3000']
    scrape_interval: 30s
    metrics_path: '/api/metrics'

  - job_name: 'nginx'
    static_configs:
      - targets: ['nginx:80']
    scrape_interval: 30s

  - job_name: 'mongodb'
    static_configs:
      - targets: ['mongodb:27017']
    scrape_interval: 60s

  - job_name: 'redis'
    static_configs:
      - targets: ['redis:6379']
    scrape_interval: 60s
EOF

    # Fluentd configuration
    cat > "./fluentd/conf/fluent.conf" << 'EOF'
<source>
  @type tail
  path /var/log/unified-pentest/*.log
  pos_file /var/log/fluentd/unified-pentest.log.pos
  tag unified.pentest.*
  format json
</source>

<match unified.pentest.**>
  @type file
  path /var/log/fluentd/unified-pentest
  time_slice_format %Y%m%d
  time_slice_wait 10m
  time_format %Y%m%dT%H%M%S%z
  compress gzip
</match>
EOF
    
    log_success "Monitoring configuration created"
}

# Backup existing data
backup_data() {
    if docker-compose -f "$COMPOSE_FILE" ps | grep -q "mongodb"; then
        log_info "Creating backup of existing data..."
        
        BACKUP_FILE="$BACKUP_DIR/backup-$(date +%Y%m%d-%H%M%S).tar.gz"
        
        docker-compose -f "$COMPOSE_FILE" exec -T mongodb mongodump --archive | gzip > "$BACKUP_FILE"
        
        log_success "Backup created: $BACKUP_FILE"
    fi
}

# Deploy the application
deploy_application() {
    log_info "Deploying the application..."
    
    # Stop existing containers
    log_info "Stopping existing containers..."
    docker-compose -f "$COMPOSE_FILE" down
    
    # Pull latest images
    log_info "Pulling latest images..."
    docker-compose -f "$COMPOSE_FILE" pull
    
    # Build and start containers
    log_info "Building and starting containers..."
    docker-compose -f "$COMPOSE_FILE" up -d --build
    
    # Wait for services to be ready
    log_info "Waiting for services to be ready..."
    sleep 30
    
    # Check service health
    check_service_health
    
    log_success "Application deployed successfully!"
}

# Check service health
check_service_health() {
    log_info "Checking service health..."
    
    # Check if containers are running
    if ! docker-compose -f "$COMPOSE_FILE" ps | grep -q "Up"; then
        log_error "Some containers are not running!"
        docker-compose -f "$COMPOSE_FILE" ps
        exit 1
    fi
    
    # Check application health endpoint
    log_info "Checking application health endpoint..."
    for i in {1..10}; do
        if curl -f http://localhost:3000/api/health &> /dev/null; then
            log_success "Application is healthy"
            break
        fi
        
        if [[ $i -eq 10 ]]; then
            log_error "Application health check failed after 10 attempts"
            log_info "Container logs:"
            docker-compose -f "$COMPOSE_FILE" logs app
            exit 1
        fi
        
        log_info "Waiting for application to be ready... ($i/10)"
        sleep 10
    done
}

# Show deployment information
show_deployment_info() {
    log_success "=== Deployment Complete ==="
    echo
    log_info "Application URLs:"
    echo "  HTTP:  http://localhost"
    echo "  HTTPS: https://localhost"
    echo "  Metrics: http://localhost:9090 (Prometheus)"
    echo
    log_info "Service Status:"
    docker-compose -f "$COMPOSE_FILE" ps
    echo
    log_info "To view logs:"
    echo "  docker-compose -f $COMPOSE_FILE logs -f"
    echo
    log_info "To stop the application:"
    echo "  docker-compose -f $COMPOSE_FILE down"
    echo
    log_warning "Important Notes:"
    echo "  - This deployment uses self-signed SSL certificates"
    echo "  - Replace with valid certificates for production use"
    echo "  - Update DNS records to point to this server"
    echo "  - Configure firewall rules as needed"
    echo "  - Regular backups are stored in $BACKUP_DIR"
}

# Main deployment flow
main() {
    log_info "Starting production deployment of $PROJECT_NAME"
    echo
    
    check_prerequisites
    create_directories
    check_environment
    generate_ssl_certificates
    create_monitoring_config
    backup_data
    deploy_application
    show_deployment_info
    
    log_success "Production deployment completed successfully!"
}

# Handle script arguments
case "${1:-deploy}" in
    "deploy")
        main
        ;;
    "stop")
        log_info "Stopping all services..."
        docker-compose -f "$COMPOSE_FILE" down
        log_success "All services stopped"
        ;;
    "restart")
        log_info "Restarting all services..."
        docker-compose -f "$COMPOSE_FILE" restart
        log_success "All services restarted"
        ;;
    "logs")
        docker-compose -f "$COMPOSE_FILE" logs -f
        ;;
    "status")
        docker-compose -f "$COMPOSE_FILE" ps
        ;;
    "backup")
        backup_data
        ;;
    "help")
        echo "Usage: $0 [command]"
        echo
        echo "Commands:"
        echo "  deploy   - Deploy the application (default)"
        echo "  stop     - Stop all services"
        echo "  restart  - Restart all services"
        echo "  logs     - Show and follow logs"
        echo "  status   - Show service status"
        echo "  backup   - Create a backup of the database"
        echo "  help     - Show this help message"
        ;;
    *)
        log_error "Unknown command: $1"
        echo "Use '$0 help' for usage information"
        exit 1
        ;;
esac
