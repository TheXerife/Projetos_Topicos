import { exec } from "child_process";
import { promisify } from "util";
import os from "os";

const execAsync = promisify(exec);

/**
 * Get public IP address
 */
export async function getPublicIP(): Promise<string> {
  try {
    const { stdout } = await execAsync(
      "curl -s https://api.ipify.org?format=json | jq -r '.ip'"
    );
    return stdout.trim();
  } catch (error) {
    return "Unable to fetch IP";
  }
}

/**
 * Get local IP address
 */
export function getLocalIP(): string {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    const iface = interfaces[name];
    if (!iface) continue;
    for (const addr of iface) {
      if (addr.family === "IPv4" && !addr.internal) {
        return addr.address;
      }
    }
  }
  return "127.0.0.1";
}

/**
 * Ping a host and measure latency
 */
export async function ping(host: string = "8.8.8.8"): Promise<{
  min: number;
  avg: number;
  max: number;
  loss: number;
}> {
  try {
    const { stdout } = await execAsync(`ping -c 4 ${host}`, { timeout: 10000 });
    const lines = stdout.split("\n");
    const statsLine = lines.find((line) => line.includes("min/avg/max"));

    if (statsLine) {
      const match = statsLine.match(/min\/avg\/max[\/stddev]*\s*=\s*([\d.]+)\/([\d.]+)\/([\d.]+)/);
      if (match) {
        const lossLine = lines.find((line) => line.includes("packet loss"));
        const loss = lossLine ? parseFloat(lossLine.match(/(\d+(?:\.\d+)?)%/)?.[1] || "0") : 0;

        return {
          min: parseFloat(match[1]),
          avg: parseFloat(match[2]),
          max: parseFloat(match[3]),
          loss,
        };
      }
    }
    return { min: 0, avg: 0, max: 0, loss: 100 };
  } catch (error) {
    return { min: 0, avg: 0, max: 0, loss: 100 };
  }
}

/**
 * Traceroute to a host
 */
export async function traceroute(host: string = "8.8.8.8"): Promise<
  Array<{
    hop: number;
    ip: string;
    time: number;
  }>
> {
  try {
    const { stdout } = await execAsync(`traceroute -m 15 ${host}`, { timeout: 30000 });
    const lines = stdout.split("\n");
    const hops: Array<{ hop: number; ip: string; time: number }> = [];

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i];
      if (!line.trim()) continue;

      const match = line.match(/^\s*(\d+)\s+([^\s]+)\s+\(([\d.]+)\)\s+([\d.]+)\s*ms/);
      if (match) {
        hops.push({
          hop: parseInt(match[1]),
          ip: match[3],
          time: parseFloat(match[4]),
        });
      } else {
        const timeoutMatch = line.match(/^\s*(\d+)\s+\*/);
        if (timeoutMatch) {
          hops.push({
            hop: parseInt(timeoutMatch[1]),
            ip: "*",
            time: 0,
          });
        }
      }
    }

    return hops;
  } catch (error) {
    return [];
  }
}

/**
 * Get CPU usage
 */
export function getCPUUsage(): {
  cores: number;
  usage: number;
  model: string;
} {
  const cpus = os.cpus();
  const model = cpus[0]?.model || "Unknown";
  const cores = cpus.length;

  let totalIdle = 0;
  let totalTick = 0;

  cpus.forEach((cpu) => {
    for (const type in cpu.times) {
      totalTick += cpu.times[type as keyof typeof cpu.times];
    }
    totalIdle += cpu.times.idle;
  });

  const idle = totalIdle / cpus.length;
  const total = totalTick / cpus.length;
  const usage = 100 - ~~((idle / total) * 100);

  return {
    cores,
    usage: Math.max(0, Math.min(100, usage)),
    model,
  };
}

/**
 * Get memory usage
 */
export function getMemoryUsage(): {
  total: number;
  used: number;
  free: number;
  percentage: number;
} {
  const total = os.totalmem();
  const free = os.freemem();
  const used = total - free;
  const percentage = (used / total) * 100;

  return {
    total: Math.round(total / (1024 * 1024)), // MB
    used: Math.round(used / (1024 * 1024)), // MB
    free: Math.round(free / (1024 * 1024)), // MB
    percentage: Math.round(percentage * 100) / 100,
  };
}

/**
 * Get GPU usage (NVIDIA only - requires nvidia-smi)
 */
export async function getGPUUsage(): Promise<{
  available: boolean;
  usage: number;
  memory: number;
  temperature: number;
}> {
  try {
    const { stdout } = await execAsync(
      "nvidia-smi --query-gpu=utilization.gpu,utilization.memory,temperature.gpu --format=csv,noheader,nounits",
      { timeout: 5000 }
    );
    const [gpuUsage, memUsage, temp] = stdout.trim().split(",").map((v) => parseFloat(v.trim()));

    return {
      available: true,
      usage: gpuUsage || 0,
      memory: memUsage || 0,
      temperature: temp || 0,
    };
  } catch (error) {
    return {
      available: false,
      usage: 0,
      memory: 0,
      temperature: 0,
    };
  }
}

/**
 * Get network interfaces information
 */
export function getNetworkInterfaces(): Array<{
  name: string;
  ip: string;
  mac: string;
  family: string;
}> {
  const interfaces = os.networkInterfaces();
  const result: Array<{
    name: string;
    ip: string;
    mac: string;
    family: string;
  }> = [];

  for (const [name, addrs] of Object.entries(interfaces)) {
    if (!addrs) continue;
    for (const addr of addrs) {
      result.push({
        name,
        ip: addr.address,
        mac: addr.mac,
        family: addr.family,
      });
    }
  }

  return result;
}

/**
 * Perform a simple speed test (download speed from a test file)
 */
export async function speedTest(): Promise<{
  downloadSpeed: number; // Mbps
  uploadSpeed: number; // Mbps
}> {
  try {
    // Simple test: download a 1MB file and measure speed
    const testUrl = "https://speed.cloudflare.com/__down?bytes=10000000";
    const startTime = Date.now();

    const { stdout } = await execAsync(
      `curl -w "%{speed_download}" -o /dev/null -s "${testUrl}"`,
      { timeout: 30000 }
    );

    const speedBytesPerSec = parseFloat(stdout.trim());
    const speedMbps = (speedBytesPerSec * 8) / (1000 * 1000);

    return {
      downloadSpeed: Math.round(speedMbps * 100) / 100,
      uploadSpeed: 0, // Upload test would require a server endpoint
    };
  } catch (error) {
    return {
      downloadSpeed: 0,
      uploadSpeed: 0,
    };
  }
}
