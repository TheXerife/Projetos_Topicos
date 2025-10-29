import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Zap,
  Globe,
  Wifi,
  Activity,
  Gauge,
  Network,
  Cpu,
  HardDrive,
  Loader2,
  RefreshCw,
} from "lucide-react";

interface DiagnosticResult {
  type: string;
  data: Record<string, unknown>;
  loading: boolean;
  timestamp: Date;
}

export default function Diagnostics() {
  const [results, setResults] = useState<Record<string, DiagnosticResult>>({});
  const [autoRefresh, setAutoRefresh] = useState(false);

  // tRPC queries
  const publicIP = trpc.diagnostics.getPublicIP.useQuery(undefined, {
    enabled: false,
  });
  const localIP = trpc.diagnostics.getLocalIP.useQuery(undefined, {
    enabled: false,
  });
  const ping = trpc.diagnostics.ping.useQuery(undefined, {
    enabled: false,
  });
  const traceroute = trpc.diagnostics.traceroute.useQuery(undefined, {
    enabled: false,
  });
  const cpu = trpc.diagnostics.getCPU.useQuery(undefined, {
    enabled: false,
  });
  const memory = trpc.diagnostics.getMemory.useQuery(undefined, {
    enabled: false,
  });
  const gpu = trpc.diagnostics.getGPU.useQuery(undefined, {
    enabled: false,
  });
  const networkInterfaces = trpc.diagnostics.getNetworkInterfaces.useQuery(
    undefined,
    { enabled: false }
  );
  const speedTest = trpc.diagnostics.speedTest.useQuery(undefined, {
    enabled: false,
  });

  const handleTest = async (
    testName: string,
    query: ReturnType<typeof trpc.diagnostics.getPublicIP.useQuery>
  ) => {
    setResults((prev) => ({
      ...prev,
      [testName]: {
        type: testName,
        data: {},
        loading: true,
        timestamp: new Date(),
      },
    }));

    await query.refetch();
  };

  // Update results when queries complete
  useEffect(() => {
    if (publicIP.data) {
      setResults((prev) => ({
        ...prev,
        publicIP: {
          type: "publicIP",
          data: publicIP.data,
          loading: false,
          timestamp: new Date(),
        },
      }));
    }
  }, [publicIP.data]);

  useEffect(() => {
    if (localIP.data) {
      setResults((prev) => ({
        ...prev,
        localIP: {
          type: "localIP",
          data: localIP.data,
          loading: false,
          timestamp: new Date(),
        },
      }));
    }
  }, [localIP.data]);

  useEffect(() => {
    if (ping.data) {
      setResults((prev) => ({
        ...prev,
        ping: {
          type: "ping",
          data: ping.data,
          loading: false,
          timestamp: new Date(),
        },
      }));
    }
  }, [ping.data]);

  useEffect(() => {
    if (traceroute.data) {
      setResults((prev) => ({
        ...prev,
        traceroute: {
          type: "traceroute",
          data: traceroute.data,
          loading: false,
          timestamp: new Date(),
        },
      }));
    }
  }, [traceroute.data]);

  useEffect(() => {
    if (cpu.data) {
      setResults((prev) => ({
        ...prev,
        cpu: {
          type: "cpu",
          data: cpu.data,
          loading: false,
          timestamp: new Date(),
        },
      }));
    }
  }, [cpu.data]);

  useEffect(() => {
    if (memory.data) {
      setResults((prev) => ({
        ...prev,
        memory: {
          type: "memory",
          data: memory.data,
          loading: false,
          timestamp: new Date(),
        },
      }));
    }
  }, [memory.data]);

  useEffect(() => {
    if (gpu.data) {
      setResults((prev) => ({
        ...prev,
        gpu: {
          type: "gpu",
          data: gpu.data,
          loading: false,
          timestamp: new Date(),
        },
      }));
    }
  }, [gpu.data]);

  useEffect(() => {
    if (networkInterfaces.data) {
      setResults((prev) => ({
        ...prev,
        networkInterfaces: {
          type: "networkInterfaces",
          data: networkInterfaces.data,
          loading: false,
          timestamp: new Date(),
        },
      }));
    }
  }, [networkInterfaces.data]);

  useEffect(() => {
    if (speedTest.data) {
      setResults((prev) => ({
        ...prev,
        speedTest: {
          type: "speedTest",
          data: speedTest.data,
          loading: false,
          timestamp: new Date(),
        },
      }));
    }
  }, [speedTest.data]);

  // Auto-refresh logic
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      cpu.refetch();
      memory.refetch();
      gpu.refetch();
    }, 2000);

    return () => clearInterval(interval);
  }, [autoRefresh, cpu, memory, gpu]);

  const renderResult = (result: DiagnosticResult) => {
    if (result.loading) {
      return <Loader2 className="animate-spin w-5 h-5" />;
    }

    switch (result.type) {
      case "publicIP":
        return <div className="text-sm font-mono">{String(result.data.ip)}</div>;
      case "localIP":
        return <div className="text-sm font-mono">{String(result.data.ip)}</div>;
      case "ping":
        return (
          <div className="text-sm space-y-1">
            <div>Avg: {String(result.data.avg)}ms</div>
            <div>Min: {String(result.data.min)}ms | Max: {String(result.data.max)}ms</div>
            <div>Loss: {String(result.data.loss)}%</div>
          </div>
        );
      case "traceroute":
        return (
          <div className="text-xs space-y-1 max-h-40 overflow-y-auto">
            {(result.data.hops as Array<{ hop: number; ip: string; time: number }>)?.map(
              (hop) => (
                <div key={hop.hop}>
                  Hop {hop.hop}: {hop.ip} ({hop.time}ms)
                </div>
              )
            )}
          </div>
        );
      case "cpu":
        return (
          <div className="text-sm space-y-1">
            <div>Usage: {String(result.data.usage)}%</div>
            <div>Cores: {String(result.data.cores)}</div>
            <div className="text-xs text-gray-500">{String(result.data.model)}</div>
          </div>
        );
      case "memory":
        return (
          <div className="text-sm space-y-1">
            <div>Usage: {String(result.data.percentage)}%</div>
            <div>
              {String(result.data.used)}MB / {String(result.data.total)}MB
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div
                className="bg-blue-500 h-2 rounded-full"
                style={{ width: `${String(result.data.percentage)}%` }}
              />
            </div>
          </div>
        );
      case "gpu":
        return (
          <div className="text-sm space-y-1">
            {result.data.available ? (
              <>
                <div>Usage: {String(result.data.usage)}%</div>
                <div>Memory: {String(result.data.memory)}%</div>
                <div>Temp: {String(result.data.temperature)}°C</div>
              </>
            ) : (
              <div className="text-gray-500">GPU not available</div>
            )}
          </div>
        );
      case "networkInterfaces":
        return (
          <div className="text-xs space-y-1 max-h-40 overflow-y-auto">
            {(result.data.interfaces as Array<{ name: string; ip: string; mac: string; family: string }>)?.map(
              (iface, idx) => (
                <div key={idx} className="border-b pb-1">
                  <div className="font-mono">{iface.name}</div>
                  <div className="text-gray-600">{iface.ip}</div>
                </div>
              )
            )}
          </div>
        );
      case "speedTest":
        return (
          <div className="text-sm space-y-1">
            <div>Download: {String(result.data.downloadSpeed)} Mbps</div>
            <div>Upload: {String(result.data.uploadSpeed)} Mbps</div>
          </div>
        );
      default:
        return <div className="text-xs text-gray-500">No data</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-2 flex items-center gap-3">
            <Network className="w-10 h-10 text-blue-400" />
            Network Diagnostics
          </h1>
          <p className="text-gray-400">
            Real-time network and system monitoring tools
          </p>
        </div>

        {/* Auto-refresh toggle */}
        <div className="mb-6 flex items-center gap-3">
          <Button
            onClick={() => setAutoRefresh(!autoRefresh)}
            variant={autoRefresh ? "default" : "outline"}
            className="gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            {autoRefresh ? "Auto-refresh ON" : "Auto-refresh OFF"}
          </Button>
          <span className="text-sm text-gray-400">
            (Updates CPU, Memory, GPU every 2s)
          </span>
        </div>

        {/* Diagnostic Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {/* Speed Test */}
          <Card className="bg-slate-800 border-slate-700 p-6 hover:border-blue-400 transition cursor-pointer">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Zap className="w-6 h-6 text-yellow-400" />
                <h3 className="text-lg font-semibold">Speed Test</h3>
              </div>
            </div>
            <Button
              onClick={() => handleTest("speedTest", speedTest)}
              className="w-full mb-4"
              disabled={speedTest.isLoading}
            >
              {speedTest.isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Testing...
                </>
              ) : (
                "Run Test"
              )}
            </Button>
            {results.speedTest && (
              <div className="bg-slate-700 rounded p-3">
                {renderResult(results.speedTest)}
              </div>
            )}
          </Card>

          {/* Public IP */}
          <Card className="bg-slate-800 border-slate-700 p-6 hover:border-green-400 transition cursor-pointer">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Globe className="w-6 h-6 text-green-400" />
                <h3 className="text-lg font-semibold">Public IP</h3>
              </div>
            </div>
            <Button
              onClick={() => handleTest("publicIP", publicIP)}
              className="w-full mb-4"
              disabled={publicIP.isLoading}
            >
              {publicIP.isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Fetching...
                </>
              ) : (
                "Check IP"
              )}
            </Button>
            {results.publicIP && (
              <div className="bg-slate-700 rounded p-3">
                {renderResult(results.publicIP)}
              </div>
            )}
          </Card>

          {/* Local IP */}
          <Card className="bg-slate-800 border-slate-700 p-6 hover:border-purple-400 transition cursor-pointer">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Wifi className="w-6 h-6 text-purple-400" />
                <h3 className="text-lg font-semibold">Local IP</h3>
              </div>
            </div>
            <Button
              onClick={() => handleTest("localIP", localIP)}
              className="w-full mb-4"
              disabled={localIP.isLoading}
            >
              {localIP.isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Fetching...
                </>
              ) : (
                "Get Local IP"
              )}
            </Button>
            {results.localIP && (
              <div className="bg-slate-700 rounded p-3">
                {renderResult(results.localIP)}
              </div>
            )}
          </Card>

          {/* Ping */}
          <Card className="bg-slate-800 border-slate-700 p-6 hover:border-red-400 transition cursor-pointer">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Activity className="w-6 h-6 text-red-400" />
                <h3 className="text-lg font-semibold">Latency</h3>
              </div>
            </div>
            <Button
              onClick={() => handleTest("ping", ping)}
              className="w-full mb-4"
              disabled={ping.isLoading}
            >
              {ping.isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Pinging...
                </>
              ) : (
                "Test Latency"
              )}
            </Button>
            {results.ping && (
              <div className="bg-slate-700 rounded p-3">
                {renderResult(results.ping)}
              </div>
            )}
          </Card>

          {/* Traceroute */}
          <Card className="bg-slate-800 border-slate-700 p-6 hover:border-orange-400 transition cursor-pointer">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Gauge className="w-6 h-6 text-orange-400" />
                <h3 className="text-lg font-semibold">Traceroute</h3>
              </div>
            </div>
            <Button
              onClick={() => handleTest("traceroute", traceroute)}
              className="w-full mb-4"
              disabled={traceroute.isLoading}
            >
              {traceroute.isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Tracing...
                </>
              ) : (
                "Run Traceroute"
              )}
            </Button>
            {results.traceroute && (
              <div className="bg-slate-700 rounded p-3">
                {renderResult(results.traceroute)}
              </div>
            )}
          </Card>

          {/* CPU */}
          <Card className="bg-slate-800 border-slate-700 p-6 hover:border-cyan-400 transition cursor-pointer">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Cpu className="w-6 h-6 text-cyan-400" />
                <h3 className="text-lg font-semibold">CPU Status</h3>
              </div>
            </div>
            <Button
              onClick={() => handleTest("cpu", cpu)}
              className="w-full mb-4"
              disabled={cpu.isLoading}
            >
              {cpu.isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Reading...
                </>
              ) : (
                "Check CPU"
              )}
            </Button>
            {results.cpu && (
              <div className="bg-slate-700 rounded p-3">
                {renderResult(results.cpu)}
              </div>
            )}
          </Card>

          {/* Memory */}
          <Card className="bg-slate-800 border-slate-700 p-6 hover:border-pink-400 transition cursor-pointer">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <HardDrive className="w-6 h-6 text-pink-400" />
                <h3 className="text-lg font-semibold">Memory</h3>
              </div>
            </div>
            <Button
              onClick={() => handleTest("memory", memory)}
              className="w-full mb-4"
              disabled={memory.isLoading}
            >
              {memory.isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Reading...
                </>
              ) : (
                "Check Memory"
              )}
            </Button>
            {results.memory && (
              <div className="bg-slate-700 rounded p-3">
                {renderResult(results.memory)}
              </div>
            )}
          </Card>

          {/* GPU */}
          <Card className="bg-slate-800 border-slate-700 p-6 hover:border-indigo-400 transition cursor-pointer">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Zap className="w-6 h-6 text-indigo-400" />
                <h3 className="text-lg font-semibold">GPU Status</h3>
              </div>
            </div>
            <Button
              onClick={() => handleTest("gpu", gpu)}
              className="w-full mb-4"
              disabled={gpu.isLoading}
            >
              {gpu.isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Reading...
                </>
              ) : (
                "Check GPU"
              )}
            </Button>
            {results.gpu && (
              <div className="bg-slate-700 rounded p-3">
                {renderResult(results.gpu)}
              </div>
            )}
          </Card>

          {/* Network Interfaces */}
          <Card className="bg-slate-800 border-slate-700 p-6 hover:border-lime-400 transition cursor-pointer">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Network className="w-6 h-6 text-lime-400" />
                <h3 className="text-lg font-semibold">Network Info</h3>
              </div>
            </div>
            <Button
              onClick={() => handleTest("networkInterfaces", networkInterfaces)}
              className="w-full mb-4"
              disabled={networkInterfaces.isLoading}
            >
              {networkInterfaces.isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Reading...
                </>
              ) : (
                "Show Interfaces"
              )}
            </Button>
            {results.networkInterfaces && (
              <div className="bg-slate-700 rounded p-3">
                {renderResult(results.networkInterfaces)}
              </div>
            )}
          </Card>
        </div>

        {/* Footer */}
        <div className="text-center text-gray-500 text-sm">
          <p>Network Diagnostics & System Monitor • Developed for IFMT</p>
        </div>
      </div>
    </div>
  );
}
