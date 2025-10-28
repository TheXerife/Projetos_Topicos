"""
Painel Flask – Exibe IP, QR único e status dos dispositivos.
"""
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

    devices = get_devices()
    return render_template("dashboard.html", ip=ip, qr=qr_b64, devices=devices)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
