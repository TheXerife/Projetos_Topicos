#!/bin/bash
# -----------------------------------------------------------
# Script: configura_samba.sh
# Função: Instala e configura automaticamente o Samba
#          para o Projeto 03 – Sistema Automatizado Samba no Jetson
# -----------------------------------------------------------

set -e  # para o script em caso de erro

echo "🔧 Iniciando configuração automática do Samba..."

# 1️⃣ Instalar o Samba se não estiver instalado
if ! dpkg -s samba &>/dev/null; then
  echo "📦 Instalando Samba..."
  sudo apt update -y
  sudo apt install samba -y
else
  echo "✅ Samba já está instalado."
fi

# 2️⃣ Criar diretórios de compartilhamento
echo "📁 Criando diretórios..."
sudo mkdir -p /srv/shared
sudo chmod -R 777 /srv/shared

# 3️⃣ Fazer backup do smb.conf original (por segurança)
if [ ! -f /etc/samba/smb.conf.bkp ]; then
  echo "💾 Fazendo backup de /etc/samba/smb.conf..."
  sudo cp /etc/samba/smb.conf /etc/samba/smb.conf.bkp
fi

# 4️⃣ Escrever nova configuração do Samba
echo "🧩 Aplicando nova configuração..."
sudo tee /etc/samba/smb.conf > /dev/null <<'EOF'
[global]
   workgroup = WORKGROUP
   server string = Jetson Samba Server
   map to guest = Bad User
   dns proxy = no

[shared]
   path = /srv/shared
   browseable = yes
   writable = yes
   guest ok = yes
   create mask = 0777
   directory mask = 0777
EOF

# 5️⃣ Reiniciar o serviço Samba
echo "♻️ Reiniciando serviço smbd..."
sudo systemctl restart smbd
sudo systemctl enable smbd

# 6️⃣ Testar se o serviço está ativo
if systemctl is-active --quiet smbd; then
  echo "✅ Samba configurado e rodando com sucesso!"
  echo "🌐 Agora você pode acessar via rede em:"
  IP=$(hostname -I | awk '{print $1}')
  echo "➡️  \\\\$IP\\shared"
else
  echo "❌ Algo deu errado, verifique o status do Samba:"
  echo "    sudo systemctl status smbd"
fi
