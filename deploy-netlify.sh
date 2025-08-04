#!/bin/bash

# Netlify Deployment Script for Unified Toolkit
# This script prepares and deploys the project to Netlify

echo "🚀 Starting Netlify deployment preparation..."

# Check if required tools are installed
check_dependencies() {
    echo "📋 Checking dependencies..."
    
    if ! command -v git &> /dev/null; then
        echo "❌ Git is not installed. Please install Git first."
        exit 1
    fi
    
    if ! command -v node &> /dev/null; then
        echo "❌ Node.js is not installed. Please install Node.js first."
        exit 1
    fi
    
    if ! command -v pnpm &> /dev/null; then
        echo "⚠️  pnpm not found. Installing pnpm..."
        npm install -g pnpm
    fi
    
    echo "✅ All dependencies are available."
}

# Install project dependencies
install_dependencies() {
    echo "📦 Installing project dependencies..."
    pnpm install
    
    if [ $? -ne 0 ]; then
        echo "❌ Failed to install dependencies."
        exit 1
    fi
    
    echo "✅ Dependencies installed successfully."
}

# Build the project
build_project() {
    echo "🔨 Building the project..."
    pnpm build
    
    if [ $? -ne 0 ]; then
        echo "❌ Build failed. Please check the error messages above."
        exit 1
    fi
    
    echo "✅ Project built successfully."
}

# Prepare for Git deployment
prepare_git() {
    echo "📝 Preparing Git repository..."
    
    # Add all files
    git add .
    
    # Check if there are changes to commit
    if git diff --staged --quiet; then
        echo "ℹ️  No changes to commit."
    else
        echo "💾 Committing changes..."
        git commit -m "Prepare for Netlify deployment - $(date '+%Y-%m-%d %H:%M:%S')"
        
        echo "🚀 Pushing to GitHub..."
        git push origin main
        
        if [ $? -ne 0 ]; then
            echo "❌ Failed to push to GitHub. Please check your git configuration."
            exit 1
        fi
        
        echo "✅ Changes pushed to GitHub successfully."
    fi
}

# Display Netlify deployment instructions
show_netlify_instructions() {
    echo ""
    echo "🎉 Project is ready for Netlify deployment!"
    echo ""
    echo "📋 Next steps:"
    echo "1. Go to https://app.netlify.com/"
    echo "2. Click 'Add new site' → 'Import an existing project'"
    echo "3. Connect your GitHub account and select this repository"
    echo "4. Configure build settings:"
    echo "   - Build command: pnpm build"
    echo "   - Publish directory: .next"
    echo "5. Set environment variables (see .env.netlify file)"
    echo "6. Deploy your site!"
    echo ""
    echo "🔗 Your site will be available at: https://random-name.netlify.app"
    echo "💡 You can customize the domain in Netlify site settings"
    echo ""
}

# Main execution
main() {
    echo "🚀 Unified Toolkit - Netlify Deployment Preparation"
    echo "=================================================="
    echo ""
    
    check_dependencies
    install_dependencies
    build_project
    prepare_git
    show_netlify_instructions
    
    echo "🎉 Deployment preparation completed successfully!"
}

# Run the main function
main
