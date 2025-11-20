#!/bin/bash
set -e

echo "🚀 RistoAI - Deploy su Aruba"
echo "================================"

# Verifica Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js non installato"
    echo "Installazione Node.js 20..."
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt-get install -y nodejs
fi

# Verifica pnpm
if ! command -v pnpm &> /dev/null; then
    echo "Installazione pnpm..."
    npm install -g pnpm
fi

# Installa dipendenze
echo "📦 Installazione dipendenze..."
pnpm install

# Build frontend
echo "🏗️ Build frontend..."
pnpm run build

# Database setup
echo "🗄️ Setup database..."
pnpm db:push

# Avvia con PM2
echo "🚀 Avvio applicazione..."
npm install -g pm2
pm2 delete ristoai 2>/dev/null || true
pm2 start pnpm --name "ristoai" -- start
pm2 save
pm2 startup

echo "✅ Deploy completato!"
echo "Server: http://localhost:3000"
