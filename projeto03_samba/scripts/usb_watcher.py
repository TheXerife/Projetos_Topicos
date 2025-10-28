#!/usr/bin/env python3
"""
Script: usb_watcher.py
Função: Detecta dispositivos USB, monta automaticamente e compartilha via Samba.
"""

import os, subprocess, time, psutil

MOUNT_BASE = "/mnt/shared"
SHARE_BASE = "/srv/shared"

def mount_device(device):
    name = os.path.basename(device)
    mount_point = os.path.join(MOUNT_BASE, name)
    os.makedirs(mount_point, exist_ok=True)

    # Monta o dispositivo
    subprocess.run(["mount", device, mount_point], stderr=subprocess.DEVNULL)

    # Cria link simbólico para o Samba
    os.makedirs(SHARE_BASE, exist_ok=True)
    link_path = os.path.join(SHARE_BASE, name)
    if not os.path.exists(link_path):
        os.symlink(mount_point, link_path, target_is_directory=True)

    # Reinicia o Samba para aplicar
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
        # Lista dispositivos montáveis
        current = set(
            d.device for d in psutil.disk_partitions(all=False)
            if d.device.startswith("/dev/sd")
        )

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
