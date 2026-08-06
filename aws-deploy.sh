#!/bin/bash
set -e

echo "=================================================="
echo "🚀 Kings 24x7 AWS EC2 One-Click Deployment Script"
echo "=================================================="

# 1. Build Admin Production Assets
echo "📦 Building Admin Portal production bundle..."
cd admin
npm install
npm run build
cd ..

# 2. Build Frontend Production Assets
echo "📦 Building Frontend Web App production bundle..."
cd frontend
npm install
npm run build
cd ..

# 3. Check Docker & Docker Compose
if ! command -v docker &> /dev/null; then
    echo "⚠️ Docker not found. Installing Docker..."
    sudo apt-get update && sudo apt-get install -y docker.io docker-compose
    sudo systemctl enable --now docker
    sudo usermod -aG docker $USER
fi

# 4. Spin up Docker Containers
echo "🐳 Starting Docker containers (Spring Boot Backend + Nginx)..."
docker-compose down || true
docker-compose up -d --build

echo "=================================================="
echo "✅ Deployment Successful!"
echo "🌐 Frontend: http://localhost (or EC2 Public IP / Domain)"
echo "🔐 Admin:    http://localhost/admin (or EC2 Public IP/admin)"
echo "⚙️ Backend:  http://localhost:8080/api"
echo "=================================================="
