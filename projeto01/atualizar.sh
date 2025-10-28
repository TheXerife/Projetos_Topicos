#!/bin/bash
cd /home/usuario/projeto01

echo "🔄 Atualizando repositório..."
git pull origin main

echo "📦 Atualizando dependências..."
pip install -r requirements.txt

echo "🚀 Iniciando servidor..."
python3 server.py
