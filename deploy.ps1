# Unified Penetration Testing Platform - Production Deployment Script (PowerShell)
# Author: Suman Kumar
# Version: 1.0.0

param(
    [Parameter(Position=0)]
    [ValidateSet("deploy", "stop", "restart", "logs", "status", "backup", "help")]
    [string]$Command = "deploy"
)

# Configuration
$ProjectName = "unified-pentest-platform"
$ComposeFile = "docker-compose.prod.yml"
$EnvFile = ".env.production"
$BackupDir = "./backups"
$LogDir = "./logs"

# Colors for output
$Colors = @{
    Red = [System.ConsoleColor]::Red
    Green = [System.ConsoleColor]::Green
    Yellow = [System.ConsoleColor]::Yellow
    Blue = [System.ConsoleColor]::Blue
    White = [System.ConsoleColor]::White
}

# Logging functions
function Write-ColorOutput {
    param(
        [string]$Message,
        [System.ConsoleColor]$Color = [System.ConsoleColor]::White
    )
    $currentColor = $Host.UI.RawUI.ForegroundColor
    $Host.UI.RawUI.ForegroundColor = $Color
    Write-Output $Message
    $Host.UI.RawUI.ForegroundColor = $currentColor
}

function Log-Info {
    param([string]$Message)
    Write-ColorOutput "[INFO] $Message" $Colors.Blue
}

function Log-Success {
    param([string]$Message)
    Write-ColorOutput "[SUCCESS] $Message" $Colors.Green
}

function Log-Warning {
    param([string]$Message)
    Write-ColorOutput "[WARNING] $Message" $Colors.Yellow
}

function Log-Error {
    param([string]$Message)
    Write-ColorOutput "[ERROR] $Message" $Colors.Red
}

# Check prerequisites
function Test-Prerequisites {
    Log-Info "Checking prerequisites..."
    
    # Check Docker
    try {
        $dockerVersion = docker --version
        Log-Info "Docker found: $dockerVersion"
    }
    catch {
        Log-Error "Docker is not installed or not in PATH. Please install Docker Desktop."
        exit 1
    }
    
    # Check Docker Compose
    try {
        $composeVersion = docker-compose --version
        Log-Info "Docker Compose found: $composeVersion"
    }
    catch {
        Log-Error "Docker Compose is not installed or not in PATH."
        exit 1
    }
    
    # Check if Docker is running
    try {
        docker ps | Out-Null
        Log-Success "Docker is running"
    }
    catch {
        Log-Error "Docker is not running. Please start Docker Desktop."
        exit 1
    }
    
    Log-Success "Prerequisites check passed"
}

# Create necessary directories
function New-Directories {
    Log-Info "Creating necessary directories..."
    
    $directories = @(
        $BackupDir,
        $LogDir,
        "./ssl",
        "./nginx/logs",
        "./data/tools",
        "./data/results",
        "./prometheus",
        "./fluentd/conf"
    )
    
    foreach ($dir in $directories) {
        if (!(Test-Path $dir)) {
            New-Item -ItemType Directory -Path $dir -Force | Out-Null
            Log-Info "Created directory: $dir"
        }
    }
    
    Log-Success "Directories created successfully"
}

# Check environment file
function Test-Environment {
    Log-Info "Checking environment configuration..."
    
    if (!(Test-Path $EnvFile)) {
        Log-Error "Environment file $EnvFile not found!"
        Log-Info "Creating a template environment file..."
        
        $envTemplate = @"
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
"@
        
        $envTemplate | Out-File -FilePath $EnvFile -Encoding UTF8
        
        Log-Warning "Please edit $EnvFile with your actual configuration values"
        Log-Warning "Then run this script again"
        exit 1
    }
    
    # Check for placeholder values
    $envContent = Get-Content $EnvFile -Raw
    if ($envContent -match "your_.*_here") {
        Log-Error "Environment file contains placeholder values!"
        Log-Error "Please update $EnvFile with actual configuration values"
        exit 1
    }
    
    Log-Success "Environment configuration looks good"
}

# Generate SSL certificates (self-signed for development)
function New-SSLCertificates {
    Log-Info "Checking SSL certificates..."
    
    if (!(Test-Path "./ssl/unified-platform.crt") -or !(Test-Path "./ssl/unified-platform.key")) {
        Log-Warning "SSL certificates not found. Generating self-signed certificates..."
        Log-Warning "For production, please replace with valid SSL certificates"
        
        # Check if OpenSSL is available
        try {
            openssl version | Out-Null
            
            & openssl req -x509 -nodes -days 365 -newkey rsa:2048 `
                -keyout "./ssl/unified-platform.key" `
                -out "./ssl/unified-platform.crt" `
                -subj "/C=US/ST=State/L=City/O=Organization/CN=pentest.unified-platform.com"
            
            Log-Success "Self-signed SSL certificates generated"
        }
        catch {
            Log-Warning "OpenSSL not found. Please install OpenSSL or manually provide SSL certificates"
            Log-Info "Creating placeholder certificate files..."
            
            "# Placeholder certificate file" | Out-File -FilePath "./ssl/unified-platform.crt" -Encoding UTF8
            "# Placeholder key file" | Out-File -FilePath "./ssl/unified-platform.key" -Encoding UTF8
        }
    }
    else {
        Log-Success "SSL certificates found"
    }
}

# Create monitoring configuration
function New-MonitoringConfig {
    Log-Info "Creating monitoring configuration..."
    
    # Prometheus configuration
    $prometheusConfig = @"
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
"@
    
    $prometheusConfig | Out-File -FilePath "./prometheus/prometheus.yml" -Encoding UTF8
    
    # Fluentd configuration
    $fluentdConfig = @"
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
"@
    
    $fluentdConfig | Out-File -FilePath "./fluentd/conf/fluent.conf" -Encoding UTF8
    
    Log-Success "Monitoring configuration created"
}

# Backup existing data
function Backup-Data {
    $runningContainers = docker-compose -f $ComposeFile ps --services --filter "status=running"
    if ($runningContainers -contains "mongodb") {
        Log-Info "Creating backup of existing data..."
        
        $timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
        $backupFile = "$BackupDir/backup-$timestamp.archive"
        
        try {
            docker-compose -f $ComposeFile exec -T mongodb mongodump --archive > $backupFile
            Log-Success "Backup created: $backupFile"
        }
        catch {
            Log-Warning "Backup creation failed: $_"
        }
    }
}

# Deploy the application
function Deploy-Application {
    Log-Info "Deploying the application..."
    
    # Stop existing containers
    Log-Info "Stopping existing containers..."
    docker-compose -f $ComposeFile down
    
    # Pull latest images
    Log-Info "Pulling latest images..."
    docker-compose -f $ComposeFile pull
    
    # Build and start containers
    Log-Info "Building and starting containers..."
    docker-compose -f $ComposeFile up -d --build
    
    # Wait for services to be ready
    Log-Info "Waiting for services to be ready..."
    Start-Sleep -Seconds 30
    
    # Check service health
    Test-ServiceHealth
    
    Log-Success "Application deployed successfully!"
}

# Check service health
function Test-ServiceHealth {
    Log-Info "Checking service health..."
    
    # Check if containers are running
    $containerStatus = docker-compose -f $ComposeFile ps
    $runningContainers = $containerStatus | Select-String "Up"
    
    if (!$runningContainers) {
        Log-Error "Some containers are not running!"
        Write-Output $containerStatus
        exit 1
    }
    
    # Check application health endpoint
    Log-Info "Checking application health endpoint..."
    $maxAttempts = 10
    $attempt = 1
    
    do {
        try {
            $response = Invoke-WebRequest -Uri "http://localhost:3000/api/health" -TimeoutSec 5
            if ($response.StatusCode -eq 200) {
                Log-Success "Application is healthy"
                return
            }
        }
        catch {
            # Continue to next attempt
        }
        
        if ($attempt -eq $maxAttempts) {
            Log-Error "Application health check failed after $maxAttempts attempts"
            Log-Info "Container logs:"
            docker-compose -f $ComposeFile logs app
            exit 1
        }
        
        Log-Info "Waiting for application to be ready... ($attempt/$maxAttempts)"
        Start-Sleep -Seconds 10
        $attempt++
    } while ($attempt -le $maxAttempts)
}

# Show deployment information
function Show-DeploymentInfo {
    Log-Success "=== Deployment Complete ==="
    Write-Output ""
    Log-Info "Application URLs:"
    Write-Output "  HTTP:  http://localhost"
    Write-Output "  HTTPS: https://localhost"
    Write-Output "  Metrics: http://localhost:9090 (Prometheus)"
    Write-Output ""
    Log-Info "Service Status:"
    docker-compose -f $ComposeFile ps
    Write-Output ""
    Log-Info "To view logs:"
    Write-Output "  docker-compose -f $ComposeFile logs -f"
    Write-Output ""
    Log-Info "To stop the application:"
    Write-Output "  docker-compose -f $ComposeFile down"
    Write-Output ""
    Log-Warning "Important Notes:"
    Write-Output "  - This deployment uses self-signed SSL certificates"
    Write-Output "  - Replace with valid certificates for production use"
    Write-Output "  - Update DNS records to point to this server"
    Write-Output "  - Configure firewall rules as needed"
    Write-Output "  - Regular backups are stored in $BackupDir"
}

# Main deployment function
function Start-Deployment {
    Log-Info "Starting production deployment of $ProjectName"
    Write-Output ""
    
    Test-Prerequisites
    New-Directories
    Test-Environment
    New-SSLCertificates
    New-MonitoringConfig
    Backup-Data
    Deploy-Application
    Show-DeploymentInfo
    
    Log-Success "Production deployment completed successfully!"
}

# Handle script commands
switch ($Command) {
    "deploy" {
        Start-Deployment
    }
    "stop" {
        Log-Info "Stopping all services..."
        docker-compose -f $ComposeFile down
        Log-Success "All services stopped"
    }
    "restart" {
        Log-Info "Restarting all services..."
        docker-compose -f $ComposeFile restart
        Log-Success "All services restarted"
    }
    "logs" {
        docker-compose -f $ComposeFile logs -f
    }
    "status" {
        docker-compose -f $ComposeFile ps
    }
    "backup" {
        Backup-Data
    }
    "help" {
        Write-Output "Usage: .\deploy.ps1 [command]"
        Write-Output ""
        Write-Output "Commands:"
        Write-Output "  deploy   - Deploy the application (default)"
        Write-Output "  stop     - Stop all services"
        Write-Output "  restart  - Restart all services"
        Write-Output "  logs     - Show and follow logs"
        Write-Output "  status   - Show service status"
        Write-Output "  backup   - Create a backup of the database"
        Write-Output "  help     - Show this help message"
        Write-Output ""
        Write-Output "Examples:"
        Write-Output "  .\deploy.ps1"
        Write-Output "  .\deploy.ps1 deploy"
        Write-Output "  .\deploy.ps1 stop"
        Write-Output "  .\deploy.ps1 logs"
    }
    default {
        Log-Error "Unknown command: $Command"
        Write-Output "Use '.\deploy.ps1 help' for usage information"
        exit 1
    }
}
