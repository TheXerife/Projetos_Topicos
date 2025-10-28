import psutil, subprocess

def get_system_status():
    # CPU e memória
    cpu = psutil.cpu_percent(interval=1)
    ram = psutil.virtual_memory().percent
    disk = psutil.disk_usage('/').percent

    # Temperatura (Jetson)
    try:
        temp = subprocess.getoutput("cat /sys/devices/virtual/thermal/thermal_zone0/temp")
        temp_c = round(int(temp) / 1000, 1)
    except:
        temp_c = None

    # GPU (usando tegrastats)
    try:
        gpu_out = subprocess.getoutput("tegrastats --logfile /tmp/gpu.log --count 1 | grep -oP 'GR3D_FREQ \K[0-9]+'")
        gpu = gpu_out.strip() or "N/A"
    except:
        gpu = "N/A"

    uptime = subprocess.getoutput("uptime -p")

    return {
        "cpu": cpu,
        "ram": ram,
        "disk": disk,
        "temp": temp_c,
        "gpu": gpu,
        "uptime": uptime
    }
