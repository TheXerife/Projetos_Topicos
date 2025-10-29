import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Network, ArrowRight } from "lucide-react";
import { APP_LOGO, APP_TITLE } from "@/const";
import { useLocation } from "wouter";

export default function Home() {
  const [, navigate] = useLocation();
  const { user, isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Header */}
      <header className="border-b border-slate-700 bg-slate-900/50 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {APP_LOGO && <img src={APP_LOGO} alt={APP_TITLE} className="w-8 h-8" />}
            <h1 className="text-2xl font-bold">{APP_TITLE}</h1>
          </div>
          {isAuthenticated && user && (
            <div className="text-sm text-gray-400">
              Welcome, <span className="text-white font-semibold">{user.name}</span>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 md:px-8 py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Left: Hero Text */}
          <div className="space-y-6">
            <div className="space-y-4">
              <h2 className="text-5xl md:text-6xl font-bold leading-tight">
                Network Diagnostics & System Monitor
              </h2>
              <p className="text-xl text-gray-400 leading-relaxed">
                Comprehensive tools for real-time network analysis and system performance monitoring. Built for IFMT network infrastructure projects.
              </p>
            </div>

            {/* Features List */}
            <div className="space-y-3 pt-4">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-blue-400 rounded-full" />
                <span>Speed test and bandwidth analysis</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-400 rounded-full" />
                <span>IP detection and network information</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-purple-400 rounded-full" />
                <span>Latency testing and traceroute</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-pink-400 rounded-full" />
                <span>Real-time CPU, GPU, and memory monitoring</span>
              </div>
            </div>

            {/* CTA Button */}
            <div className="pt-8">
              <Button
                onClick={() => navigate("/diagnostics")}
                size="lg"
                className="gap-2 text-lg px-8 py-6 bg-blue-600 hover:bg-blue-700"
              >
                Launch Diagnostics
                <ArrowRight className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Right: Icon/Illustration */}
          <div className="hidden md:flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-3xl blur-3xl opacity-20" />
              <div className="relative bg-slate-800 border border-slate-700 rounded-3xl p-12 flex items-center justify-center">
                <Network className="w-32 h-32 text-blue-400 opacity-50" />
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-700 bg-slate-900/50 mt-20">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 text-center text-gray-500 text-sm">
          <p>Network Diagnostics & System Monitor • Developed for IFMT</p>
        </div>
      </footer>
    </div>
  );
}
