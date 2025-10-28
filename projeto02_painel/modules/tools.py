import subprocess, base64, qrcode
from io import BytesIO
from flask import send_file

def ping_host(host):
    if not host:
        return "Host não informado."
    res = subprocess.getoutput(f"ping -c 4 {host}")
    return res

def encode_base64(text):
    return base64.b64encode(text.encode()).decode()

def decode_base64(encoded):
    try:
        return base64.b64decode(encoded).decode()
    except:
        return "Erro ao decodificar."

def generate_qr(text):
    img = qrcode.make(text)
    buf = BytesIO()
    img.save(buf, 'PNG')
    buf.seek(0)
    return send_file(buf, mimetype='image/png')
