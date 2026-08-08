import React, { useState, useEffect } from 'react';
import { FiberCanvas } from './components/FiberCanvas';
import { Header } from './components/Header';
import { GrafanaChart } from './components/GrafanaChart';
import { VmMatrixGrid } from './components/VmMatrixGrid';
import { AlertsPanel } from './components/AlertsPanel';
import { TopologyPanel } from './components/TopologyPanel';

export default function App() {
  const [timeRange, setTimeRange] = useState('5m');
  const [summary, setSummary] = useState(null);
  const [vms, setVms] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [selectedVm, setSelectedVm] = useState(null);

  const fetchData = async () => {
    try {
      let summaryRes, vmsRes, alertsRes;
      try {
        const res = await fetch('/api/metrics/summary');
        if (!res.ok) throw new Error('Proxy error');
        summaryRes = await res.json();
        vmsRes = await fetch('/api/vms').then(r => r.json());
        alertsRes = await fetch('/api/alerts').then(r => r.json());
      } catch (proxyErr) {
        // Fallback directly to Spring Boot backend port 8080
        summaryRes = await fetch('http://localhost:8080/api/metrics/summary').then(r => r.json());
        vmsRes = await fetch('http://localhost:8080/api/vms').then(r => r.json());
        alertsRes = await fetch('http://localhost:8080/api/alerts').then(r => r.json());
      }
      setSummary(summaryRes);
      setVms(vmsRes);
      setAlerts(alertsRes);
    } catch (e) {
      console.error('Failed to fetch backend metrics', e);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, [timeRange]);

  const onlineVms = summary?.onlineVms ?? summary?.nodesOnline ?? 0;
  const totalVms = summary?.totalVms ?? summary?.totalNodes ?? 0;
  const clusterPods = summary?.clusterPods ?? totalVms;
  const avgCpuPercent = summary?.avgCpuPercent ?? 0;
  const meshTrafficGbps = summary?.meshTrafficGbps ?? 0;

  const activeAlerts = alerts.filter(a => a.status !== 'ACKNOWLEDGED');

  return (
    <div className="scanlines text-slate-200 min-h-screen">
      <FiberCanvas />

      <div className="relative z-10 flex flex-col h-screen max-h-screen overflow-hidden p-3 gap-3">
        <Header timeRange={timeRange} setTimeRange={setTimeRange} onRefresh={fetchData} summary={summary} vmCount={vms.length} />

        {/* KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 shrink-0">
          <div className="cyber-panel rounded-lg p-2.5 flex flex-col justify-between">
            <div className="flex justify-between items-center text-xs text-slate-400 font-mono">
              <span>VM STATUS</span>
              <i className="fa-solid fa-server text-cyan-400"></i>
            </div>
            <div className="my-1 flex items-baseline gap-2">
              <span className="font-orbitron text-2xl font-bold text-white text-glow">
                {onlineVms}
              </span>
              <span className="text-xs text-slate-400 font-mono">/ {totalVms} Online</span>
            </div>
            <div className="w-full bg-slate-800/80 rounded-full h-1.5 overflow-hidden flex">
              <div className="bg-emerald-500 h-full" style={{ width: `${totalVms > 0 ? (onlineVms * 100 / totalVms) : 0}%` }}></div>
            </div>
          </div>

          <div className="cyber-panel rounded-lg p-2.5 flex flex-col justify-between">
            <div className="flex justify-between items-center text-xs text-slate-400 font-mono">
              <span>CLUSTER TARGETS</span>
              <i className="fa-solid fa-cubes text-purple-400"></i>
            </div>
            <div className="my-1 flex items-baseline gap-2">
              <span className="font-orbitron text-2xl font-bold text-white text-glow-purple">
                {clusterPods}
              </span>
              <span className="text-xs text-emerald-400 font-mono">Active</span>
            </div>
            <div className="text-[10px] text-slate-400 font-mono flex justify-between">
              <span>{totalVms} Prometheus Targets</span>
              <span className="text-purple-300">Live TSDB</span>
            </div>
          </div>

          <div className="cyber-panel rounded-lg p-2.5 flex flex-col justify-between">
            <div className="flex justify-between items-center text-xs text-slate-400 font-mono">
              <span>AVG CPU LOAD</span>
              <i className="fa-solid fa-microchip text-blue-400"></i>
            </div>
            <div className="my-1 flex items-baseline justify-between">
              <span className="font-orbitron text-2xl font-bold text-cyan-300">
                {avgCpuPercent}%
              </span>
              <span className="text-[10px] font-mono text-cyan-400/80">Active</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-500 to-cyan-400 h-full" style={{ width: `${avgCpuPercent}%` }}></div>
            </div>
          </div>

          <div className="cyber-panel rounded-lg p-2.5 flex flex-col justify-between">
            <div className="flex justify-between items-center text-xs text-slate-400 font-mono">
              <span>RAM USAGE</span>
              <i className="fa-solid fa-memory text-indigo-400"></i>
            </div>
            <div className="my-1 flex items-baseline justify-between">
              <span className="font-orbitron text-2xl font-bold text-indigo-300">
                {summary?.ramUsageGb ?? 0.0} GB
              </span>
              <span className="text-[10px] font-mono text-slate-400">Live</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
              <div className="bg-gradient-to-r from-indigo-500 to-purple-400 h-full" style={{ width: `${Math.min(100, ((summary?.ramUsageGb ?? 0) / 16) * 100)}%` }}></div>
            </div>
          </div>

          <div className="cyber-panel rounded-lg p-2.5 flex flex-col justify-between">
            <div className="flex justify-between items-center text-xs text-slate-400 font-mono">
              <span>MESH TRAFFIC</span>
              <i className="fa-solid fa-bolt text-cyan-400 animate-pulse"></i>
            </div>
            <div className="my-1 flex items-baseline gap-2">
              <span className="font-orbitron text-2xl font-bold text-cyan-400">
                {meshTrafficGbps}
              </span>
              <span className="text-xs text-slate-400 font-mono">Gbps</span>
            </div>
            <div className="text-[10px] text-cyan-300/70 font-mono flex justify-between">
              <span>Latency</span>
              <span className="text-emerald-400">Live</span>
            </div>
          </div>

          <div className="cyber-panel rounded-lg p-2.5 flex flex-col justify-between">
            <div className="flex justify-between items-center text-xs text-slate-400 font-mono">
              <span>ACTIVE ALERTS</span>
              <i className="fa-solid fa-triangle-exclamation text-amber-400"></i>
            </div>
            <div className="my-1 flex items-center justify-between">
              <span className="font-orbitron text-2xl font-bold text-amber-400">
                {activeAlerts.length}
              </span>
            </div>
            <div className="text-[10px] text-slate-400 font-mono truncate">
              Status: <span className={activeAlerts.length === 0 ? 'text-emerald-400' : 'text-amber-400'}>{activeAlerts.length === 0 ? 'No Active Alerts' : `${activeAlerts.length} Active`}</span>
            </div>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 flex-1 min-h-0">
          <div className="lg:col-span-4 flex flex-col gap-3 min-h-0">
            <TopologyPanel vms={vms} summary={summary} />
            <GrafanaChart vms={vms} />
          </div>
          <div className="lg:col-span-4 flex flex-col gap-3 min-h-0">
            <VmMatrixGrid vms={vms} alerts={alerts} selectedVm={selectedVm} onSelectVm={setSelectedVm} />
          </div>
          <div className="lg:col-span-4 flex flex-col gap-3 min-h-0">
            <AlertsPanel alerts={alerts} onRefresh={fetchData} />
          </div>
        </div>
      </div>
    </div>
  );
}

