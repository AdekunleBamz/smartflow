#!/bin/bash

# SmartFlow Quick Start Script
# Run this script to get SmartFlow up and running

set -e

echo "🚀 SmartFlow - Smart Money Tracking on Base Chain"
echo "=================================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ from https://nodejs.org"
    exit 1
fi

echo "✅ Node.js $(node -v) detected"
echo ""

# Check if in smartflow directory
if [ ! -f "package.json" ]; then
    echo "❌ package.json not found. Please run this script from the smartflow directory."
    exit 1
fi

echo "📦 Installing dependencies..."
npm install

echo ""
echo "📝 Setting up environment variables..."

if [ ! -f ".env.local" ]; then
    echo "Creating .env.local..."
    cat > .env.local << 'EOF'
# Get your API key from https://app.nansen.ai/settings/api
NEXT_PUBLIC_NANSEN_API_KEY=your_api_key_here

# Base chain RPC endpoint
NEXT_PUBLIC_BASE_RPC_URL=https://mainnet.base.org

# Your deployment domain (for Farcaster manifest)
NEXT_PUBLIC_APP_DOMAIN=smartflow.com
EOF
    echo "⚠️  .env.local created. Please update it with your actual API keys."
else
    echo "✅ .env.local already exists"
fi

echo ""
echo "🎨 Building Tailwind CSS..."
npm run build:css 2>/dev/null || true

echo ""
echo "✨ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Update .env.local with your Nansen API key"
echo "2. Run 'npm run dev' to start the development server"
echo "3. Open http://localhost:3000 in your browser"
echo ""
echo "Happy trading! 🚀"
