#!/bin/bash
echo "🚀 Instalando Jetson Interactive Panel..."
sudo apt update
sudo apt install -y python3-pip python3-flask python3-tk
pip install -r requirements.txt

echo "✅ Dependências instaladas!"
echo "Para iniciar, execute:  python3 app.py"
