#!/bin/bash
# -----------------------------------------------------------
# Projeto 03 – Sistema Automatizado Samba no Jetson
# Autor: Gustavo Luiz Xavier Calil
# -----------------------------------------------------------
# Este script instala e configura automaticamente:
# - Samba
# - Painel Flask com PyWebView fullscreen
# - usb_watcher.py
# - Serviços systemd (usb_watcher e netwatcher)
# -----------------------------------------------------------

set -e

echo "🚀 Iniciando instalação do Projeto 03 – Sistema Automatizado Samba no Jetson"

# ==============================
# 1️⃣ Instalar dependências
# ==============================
echo "📦 Instalando dependências..."
sudo apt update -y
sudo apt install -y samba python3-pip python3-psutil python3-inotify

pip install flask qrcode[pil] pywebview

# ==============================
# 2️⃣ Criar diretórios do projeto
# ==============================
echo "📁 Criando estrutura de diretórios..."
sudo mkdir -p /opt/projeto03/app/templates
sudo mkdir -p /opt/projeto03/scripts
sudo mkdir -p /srv/shared
sudo mkdir -p /mnt/shared
sudo chmod -R 777 /srv/shared /mnt/shared

# ==============================
# 3️⃣ Criar app Flask
# ==============================
echo "🧩 Criando app Flask..."
sudo tee /opt/projeto03/app/app.py > /dev/null <<'EOF'
from flask import Flask, render_template
import qrcode, io, base64, socket, psutil, os

app = Flask(__name__)
MOUNT_BASE = "/mnt/shared"
SHARE_BASE = "/srv/shared"

def get_ip():
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    try:
        s.connect(("8.8.8.8", 80))
        ip = s.getsockname()[0]
    except:
        ip = "127.0.0.1"
    s.close()
    return ip

def get_devices():
    devices = []
    if os.path.exists(MOUNT_BASE):
        for d in os.listdir(MOUNT_BASE):
            path = os.path.join(MOUNT_BASE, d)
            if os.path.ismount(path):
                usage = psutil.disk_usage(path)
                devices.append({
                    "name": d,
                    "total_gb": round(usage.total / (1024**3), 2),
                    "used_gb": round(usage.used / (1024**3), 2),
                    "free_gb": round(usage.free / (1024**3), 2),
                })
    return devices

@app.route("/")
def dashboard():
    ip = get_ip()
    smb_path = f"\\\\{ip}\\shared"
    qr = qrcode.make(smb_path)
    buffer = io.BytesIO()
    qr.save(buffer, format="PNG")
    qr_b64 = base64.b64encode(buffer.getvalue()).decode()
    return render_template("dashboard.html", ip=ip, qr=qr_b64, devices=get_devices())

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
EOF

# ==============================
# 4️⃣ Criar HTML do painel
# ==============================
sudo tee /opt/projeto03/app/templates/dashboard.html > /dev/null <<'EOF'
<!DOCTYPE html>
<html lang="pt-br">
<head>
  <meta charset="UTF-8">
  <title>Painel Samba Jetson</title>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css">
  <style>
    body { background: #121212; color: #fff; text-align: center; padding-top: 40px; }
    .card { background: #1e1e1e; border-radius: 20px; padding: 20px; width: 70%; margin: auto; box-shadow: 0 0 15px rgba(0,0,0,0.4); }
    img { margin-top: 10px; width: 220px; border: 5px solid #2a2a2a; border-radius: 10px; }
    table { width: 100%; color: #fff; margin-top: 20px; text-align: left; }
    th, td { padding: 8px 15px; border-bottom: 1px solid #333; }
  </style>
</head>
<body>
  <div class="card">
    <h2>📡 Painel Samba Jetson</h2>
    <p>IP do Equipamento: <b>{{ ip }}</b></p>
    <p>Compartilhamento: <b>\\{{ ip }}\shared</b></p>
    <img src="data:image/png;base64,{{ qr }}" alt="QR Code">
    <p>Escaneie o código para abrir a pasta na rede</p>
    <hr>
    <h4>💾 Dispositivos Conectados</h4>
    {% if devices %}
      <table>
        <tr><th>Nome</th><th>Total</th><th>Usado</th><th>Disponível</th></tr>
        {% for d in devices %}
          <tr>
            <td>{{ d.name }}</td>
            <td>{{ d.total_gb }} GB</td>
            <td>{{ d.used_gb }} GB</td>
            <td>{{ d.free_gb }} GB</td>
          </tr>
        {% endfor %}
      </table>
    {% else %}
      <p>💤 Nenhum dispositivo USB conectado</p>
    {% endif %}
  </div>
</body>
</html>
EOF

# ==============================
# 5️⃣ Criar script USB Watcher
# ==============================
echo "🔍 Criando usb_watcher.py..."
sudo tee /opt/projeto03/scripts/usb_watcher.py > /dev/null <<'EOF'
#!/usr/bin/env python3
import os, subprocess, time, psutil

MOUNT_BASE = "/mnt/shared"
SHARE_BASE = "/srv/shared"

def mount_device(device):
    name = os.path.basename(device)
    mount_point = os.path.join(MOUNT_BASE, name)
    os.makedirs(mount_point, exist_ok=True)
    subprocess.run(["mount", device, mount_point], stderr=subprocess.DEVNULL)
    os.makedirs(SHARE_BASE, exist_ok=True)
    link_path = os.path.join(SHARE_BASE, name)
    if not os.path.exists(link_path):
        os.symlink(mount_point, link_path, target_is_directory=True)
    subprocess.run(["systemctl", "restart", "smbd"])
    print(f"✅ Montado e compartilhado: {mount_point}")

def unmount_device(device):
    name = os.path.basename(device)
    mount_point = os.path.join(MOUNT_BASE, name)
    link_path = os.path.join(SHARE_BASE, name)
    subprocess.run(["umount", mount_point], stderr=subprocess.DEVNULL)
    if os.path.islink(link_path):
        os.unlink(link_path)
    subprocess.run(["systemctl", "restart", "smbd"])
    print(f"❌ Dispositivo removido: {name}")

def main():
    print("🔍 Monitorando dispositivos USB...")
    known = set()
    while True:
        current = set(d.device for d in psutil.disk_partitions(all=False) if d.device.startswith("/dev/sd"))
        added = current - known
        removed = known - current
        for dev in added:
            mount_device(dev)
        for dev in removed:
            unmount_device(dev)
        known = current
        time.sleep(3)

if __name__ == "__main__":
    os.makedirs(MOUNT_BASE, exist_ok=True)
    os.makedirs(SHARE_BASE, exist_ok=True)
    main()
EOF

sudo chmod +x /opt/projeto03/scripts/usb_watcher.py

# ==============================
# 6️⃣ Criar launcher com PyWebView
# ==============================
echo "🖥️ Criando launcher.py (PyWebView fullscreen)..."
sudo tee /opt/projeto03/app/launcher.py > /dev/null <<'EOF'
#!/usr/bin/env python3
import webview
import threading
import subprocess
import time
import socket

def get_ip():
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    try:
        s.connect(("8.8.8.8", 80))
        ip = s.getsockname()[0]
    except:
        ip = "127.0.0.1"
    s.close()
    return ip

def start_flask():
    subprocess.Popen(["python3", "/opt/projeto03/app/app.py"])

def main():
    threading.Thread(target=start_flask, daemon=True).start()
    time.sleep(3)
    ip = get_ip()
    url = f"http://{ip}:5000"
    print(f"🌐 Abrindo painel em {url}")
    webview.create_window("Painel Samba Jetson", url, fullscreen=True, confirm_close=False)
    webview.start()

if __name__ == "__main__":
    main()
EOF

sudo chmod +x /opt/projeto03/app/launcher.py

# ==============================
# 7️⃣ Configurar Samba
# ==============================
echo "⚙️ Configurando Samba..."
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

sudo systemctl restart smbd
sudo systemctl enable smbd

# ==============================
# 8️⃣ Criar serviços systemd
# ==============================
echo "🧠 Criando serviços systemd..."

sudo tee /etc/systemd/system/usb_watcher.service > /dev/null <<'EOF'
[Unit]
Description=USB Auto-Mount and Samba Share Watcher
After=network.target

[Service]
ExecStart=/usr/bin/python3 /opt/projeto03/scripts/usb_watcher.py
Restart=always
User=root

[Install]
WantedBy=multi-user.target
EOF

sudo tee /etc/systemd/system/netwatcher.service > /dev/null <<'EOF'
[Unit]
Description=Painel Samba Jetson (Flask + PyWebView)
After=network-online.target
Wants=network-online.target

[Service]
ExecStart=/usr/bin/python3 /opt/projeto03/app/launcher.py
Restart=always
User=jetson
WorkingDirectory=/opt/projeto03/app
Environment=DISPLAY=:0
Environment=XAUTHORITY=/home/jetson/.Xauthority

[Install]
WantedBy=multi-user.target
EOF

# ==============================
# 9️⃣ Ativar serviços
# ==============================
sudo systemctl daemon-reload
sudo systemctl enable usb_watcher.service netwatcher.service
sudo systemctl start usb_watcher.service netwatcher.service

# ==============================
# 🔟 Finalização
# ==============================
IP=$(hostname -I | awk '{print $1}')
echo "✅ Instalação concluída!"
echo "🌐 Painel acessível em: http://$IP:5000"
echo "📂 Acesse pela rede: \\\\$IP\\shared"
echo "🖥️ O painel abrirá automaticamente em tela cheia no próximo boot."
