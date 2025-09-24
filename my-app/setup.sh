#!/bin/bash

echo "🏦 Bank Statement Converter Setup"
echo "================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v) detected"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Create .env.local if it doesn't exist
if [ ! -f .env.local ]; then
    echo "🔧 Creating .env.local file..."
    cat > .env.local << EOF
# Database
DATABASE_URL="file:./dev.db"

# JWT Secret (change this in production)
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production-$(date +%s)"

# Next.js
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-nextauth-secret-key-$(date +%s)"
EOF
    echo "✅ .env.local created"
else
    echo "✅ .env.local already exists"
fi

# Create uploads directory
if [ ! -d uploads ]; then
    echo "📁 Creating uploads directory..."
    mkdir uploads
    echo "✅ uploads directory created"
else
    echo "✅ uploads directory already exists"
fi

# Generate Prisma client
echo "🗄️ Setting up database..."
npx prisma generate

# Push database schema
npx prisma db push

echo "✅ Database setup complete"

echo ""
echo "🎉 Setup complete! You can now start the development server:"
echo "   npm run dev"
echo ""
echo "The application will be available at http://localhost:3000"
echo ""
echo "📚 For more information, see SETUP.md"
