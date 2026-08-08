import React, { useState, useEffect, useRef } from 'react';

export function TopologyPanel({ vms = [], summary }) {
  const [activeTab, setActiveTab] = useState('mesh'); // mesh, map, stream
  const canvasRef = useRef(null);

  // Tab 1: Animated 2D Canvas Topology Mesh
  useEffect(() => {
    if (activeTab !== 'mesh') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let animId;
    let particles = [];

    const resize = () => {
      if (canvas) {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
      }
    };
    resize();
    window.addEventListener('resize', resize);

    // Initialize particles for connected nodes
    for (let i = 0; i < 20; i++) {
      particles.push({
        progress: Math.random(),
        speed: 0.003 + Math.random() * 0.005,
        targetIdx: i % Math.max(1, vms.length)
      });
    }

    const render = () => {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const radius = Math.min(canvas.width, canvas.height) * 0.35;

      // Draw Central Prometheus Node
      ctx.beginPath();
      ctx.arc(centerX, centerY, 22, 0, Math.PI * 2);
      ctx.fillStyle = '#06b6d4';
      ctx.shadowColor = '#06b6d4';
      ctx.shadowBlur = 15;
      ctx.fill();
      ctx.shadowBlur = 0;

      ctx.fillStyle = '#09101f';
      ctx.font = 'bold 10px Orbitron, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('PROM', centerX, centerY);

      // Orbiting Targets
      const targetNodes = vms.length > 0 ? vms : [
        { id: 1, name: 'local-node', status: 'healthy' },
        { id: 2, name: 'node-exporter', status: 'healthy' }
      ];

      const angleStep = (Math.PI * 2) / targetNodes.length;

      const nodePositions = targetNodes.map((vm, index) => {
        const angle = index * angleStep - Math.PI / 2;
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;
        return { x, y, vm };
      });

      // Draw Connection Lines & Nodes
      nodePositions.forEach(({ x, y, vm }) => {
        const isHealthy = vm.status === 'healthy';
        const lineColor = isHealthy ? 'rgba(6, 182, 212, 0.25)' : 'rgba(239, 68, 68, 0.4)';

        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(x, y);
        ctx.strokeStyle = lineColor;
        ctx.lineWidth = 1.5;
        ctx.setLineDash([4, 4]);
        ctx.stroke();
        ctx.setLineDash([]);

        // Target Node Circle
        ctx.beginPath();
        ctx.arc(x, y, 12, 0, Math.PI * 2);
        ctx.fillStyle = isHealthy ? '#0284c7' : '#ef4444';
        ctx.shadowColor = isHealthy ? '#0284c7' : '#ef4444';
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;

        ctx.fillStyle = '#ffffff';
        ctx.font = '9px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.fillText(vm.name.substring(0, 12), x, y + 16);
      });

      // Animate Flow Particles
      particles.forEach((p) => {
        p.progress += p.speed;
        if (p.progress > 1) p.progress = 0;

        const targetPos = nodePositions[p.targetIdx % nodePositions.length];
        if (targetPos) {
          const px = centerX + (targetPos.x - centerX) * p.progress;
          const py = centerY + (targetPos.y - centerY) * p.progress;

          ctx.beginPath();
          ctx.arc(px, py, 3, 0, Math.PI * 2);
          ctx.fillStyle = '#38bdf8';
          ctx.shadowColor = '#38bdf8';
          ctx.shadowBlur = 6;
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resize);
      if (animId) cancelAnimationFrame(animId);
    };
  }, [activeTab, vms]);

  return (
    <div className="cyber-panel rounded-lg p-3 flex flex-col h-[380px] shrink-0 relative overflow-hidden">
      {/* Header & Tabs */}
      <div className="flex items-center justify-between mb-2 pb-2 border-b border-cyan-900/40 shrink-0">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400 cyber-glow animate-pulse"></span>
          <h2 className="font-orbitron text-xs font-bold text-slate-200 tracking-wider uppercase">
            Cluster Intelligence
          </h2>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-1 bg-slate-950/80 p-0.5 rounded border border-slate-800 text-[11px] font-mono">
          <button
            onClick={() => setActiveTab('mesh')}
            className={`px-2 py-0.5 rounded transition ${
              activeTab === 'mesh'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <i className="fa-solid fa-network-wire mr-1"></i>Topology
          </button>
          <button
            onClick={() => setActiveTab('map')}
            className={`px-2 py-0.5 rounded transition ${
              activeTab === 'map'
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <i className="fa-solid fa-sitemap mr-1"></i>System Map
          </button>
          <button
            onClick={() => setActiveTab('stream')}
            className={`px-2 py-0.5 rounded transition ${
              activeTab === 'stream'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <i className="fa-solid fa-[#000] fa-list-ol mr-1"></i>Events
          </button>
        </div>
      </div>

      {/* Tab 1: Topology Mesh Canvas */}
      {activeTab === 'mesh' && (
        <div className="relative flex-1 bg-slate-950/60 rounded border border-slate-800/80 overflow-hidden flex items-center justify-center">
          <canvas ref={canvasRef} className="w-full h-full" />
          <div className="absolute top-2 left-2 bg-slate-900/90 border border-cyan-500/30 px-2 py-1 rounded text-[10px] font-mono text-cyan-300 pointer-events-none">
            <i className="fa-solid fa-circle-nodes mr-1"></i>Prometheus Mesh Active ({vms.length} Targets)
          </div>
        </div>
      )}

      {/* Tab 2: System Architecture Map */}
      {activeTab === 'map' && (
        <div className="flex-1 bg-slate-950/60 rounded border border-slate-800/80 p-3 overflow-y-auto font-mono text-xs space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <div className="p-2 bg-slate-900/90 border border-cyan-500/40 rounded flex items-center gap-2">
              <i className="fa-solid fa-database text-cyan-400 text-lg"></i>
              <div>
                <div className="font-bold text-white text-[11px]">Prometheus TSDB</div>
                <div className="text-[10px] text-emerald-400">15s Scrape Interval</div>
              </div>
            </div>
            <div className="p-2 bg-slate-900/90 border border-purple-500/40 rounded flex items-center gap-2">
              <i className="fa-solid fa-server text-purple-400 text-lg"></i>
              <div>
                <div className="font-bold text-white text-[11px]">Node Exporter</div>
                <div className="text-[10px] text-purple-300">{vms.length} Active Agents</div>
              </div>
            </div>
            <div className="p-2 bg-slate-900/90 border border-indigo-500/40 rounded flex items-center gap-2">
              <i className="fa-solid fa-[#000] fa-cube text-indigo-400 text-lg"></i>
              <div>
                <div className="font-bold text-white text-[11px]">Spring Boot REST</div>
                <div className="text-[10px] text-indigo-300">Port 8080 Active</div>
              </div>
            </div>
            <div className="p-2 bg-slate-900/90 border border-amber-500/40 rounded flex items-center gap-2">
              <i className="fa-solid fa-bell text-amber-400 text-lg"></i>
              <div>
                <div className="font-bold text-white text-[11px]">Alert Engine</div>
                <div className="text-[10px] text-amber-300">Rule Evaluation ON</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Realtime Telemetry Event Stream */}
      {activeTab === 'stream' && (
        <div className="flex-1 bg-slate-950/60 rounded border border-slate-800/80 p-2 overflow-y-auto font-mono text-[11px] space-y-1.5 text-slate-300">
          <div className="flex items-center justify-between text-[10px] text-slate-500 pb-1 border-b border-slate-800">
            <span>TIMESTAMP</span>
            <span>EVENT LOG</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-slate-500 text-[10px]">{new Date().toLocaleTimeString()}</span>
            <span className="text-emerald-400">[SCRAPE_OK]</span>
            <span className="text-slate-300 truncate">Polled Prometheus targets successfully</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-slate-500 text-[10px]">{new Date().toLocaleTimeString()}</span>
            <span className="text-cyan-400">[RULE_EVAL]</span>
            <span className="text-slate-300 truncate">Evaluated alert rules (HostHighCpuLoad, MemoryPressure)</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-slate-500 text-[10px]">{new Date().toLocaleTimeString()}</span>
            <span className="text-indigo-400">[METRIC_SYNC]</span>
            <span className="text-slate-300 truncate">Synced CPU, Memory and Network metrics</span>
          </div>
        </div>
      )}
    </div>
  );
}
