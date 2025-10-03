#!/bin/bash

echo "===================================="
echo "  Owner Portal - Starting Dev Server"
echo "===================================="
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
    echo ""
fi

# Check if .env exists
if [ ! -f ".env" ]; then
    echo ""
    echo "WARNING: .env file not found!"
    echo "Please copy .env.example to .env and configure your API endpoints"
    echo ""
    read -p "Press enter to continue..."
fi

echo "Starting development server..."
echo "The app will open at http://localhost:3000"
echo ""
npm run dev


