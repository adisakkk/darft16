#!/bin/bash

echo "🚀 Setting up FormFlow PDF Application..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo "❌ PostgreSQL is not installed. Please install PostgreSQL first."
    exit 1
fi

echo "✅ Prerequisites check passed"

# Install dependencies
echo "📦 Installing npm dependencies..."
npm install

# Create environment file
if [ ! -f .env.local ]; then
    echo "📝 Creating environment file..."
    cp .env.example .env.local
    echo "⚠️  Please update .env.local with your database configuration"
fi

# Create upload directories
echo "📁 Creating upload directories..."
mkdir -p uploads/templates
mkdir -p uploads/generated

# Generate database schema
echo "🗄️  Setting up database schema..."
npm run db:generate

echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Update .env.local with your PostgreSQL connection string"
echo "2. Run 'npm run db:push' to create database tables"
echo "3. Run 'npm run dev' to start the development server"
echo "4. Open http://localhost:3000 in your browser"
echo ""
echo "For more information, see README.md"