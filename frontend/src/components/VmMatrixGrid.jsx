import React, { useState } from 'react';

export const VmMatrixGrid = ({ vms, alerts = [], selectedVm, onSelectVm }) => {
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('all');

    const filtered = vms.filter(vm => {
        const matchesSearch = vm.name.toLowerCase().includes(search.toLowerCase()) ||
                              (vm.instance && vm.instance.toLowerCase().includes(search.toLowerCase())) ||
                              (vm.ip && vm.ip.includes(search));
        const matchesStatus = filter === 'all' || vm.status === filter;
        return matchesSearch && matchesStatus;
    });

    const activeVm = selectedVm || (vms.length > 0 ? vms[0] : null);

    // Filter active alerts for the currently selected VM / target
    const nodeAlerts = activeVm ? alerts.filter(a => {
        if (a.status === 'ACKNOWLEDGED') return false;
        const inst = a.labels?.instance || '';
        const host = a.labels?.host || '';
        return (inst && activeVm.instance && inst.includes(activeVm.instance.split(':')[0])) ||
               (host && activeVm.name && host.includes(activeVm.name)) ||
               (a.labels?.alertname && activeVm.status !== 'healthy');
    }) : [];

    return (
        <div className="cyber-panel rounded-lg p-3 flex flex-col h-full min-h-0">
            <div className="flex items-center justify-between mb-2 shrink-0">
                <div className="flex items-center gap-2">
                    <i className="fa-solid fa-border-all text-cyan-400"></i>
                    <h2 className="font-orbitron text-sm font-bold text-slate-200 tracking-wide">
                        PROMETHEUS TARGET MATRIX ({vms.length})
                    </h2>
                </div>
                <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="bg-slate-900 border border-slate-700 text-slate-300 font-mono text-xs rounded px-2 py-1 focus:outline-none focus:border-cyan-500"
                >
                    <option value="all">All States ({vms.length})</option>
                    <option value="healthy">Healthy ({vms.filter(v => v.status === 'healthy').length})</option>
                    <option value="warning">Warning ({vms.filter(v => v.status === 'warning').length})</option>
                    <option value="critical">Critical ({vms.filter(v => v.status === 'critical').length})</option>
                </select>
            </div>

            <div className="mb-2 shrink-0">
                <div className="relative">
                    <i className="fa-solid fa-magnifying-glass absolute left-2.5 top-2.5 text-slate-500 text-xs"></i>
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Filter by target name or IP..."
                        className="w-full bg-slate-950/80 border border-slate-800 rounded pl-8 pr-3 py-1.5 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-500 transition"
                    />
                </div>
            </div>

            {/* Grid with larger square buttons */}
            <div className="flex-1 min-h-[200px] max-h-[360px] overflow-y-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4 gap-2.5 p-2 bg-slate-950/40 rounded border border-slate-800/80">
                {filtered.length === 0 ? (
                    <div className="col-span-full flex flex-col items-center justify-center py-10 text-slate-500 font-mono text-xs">
                        <i className="fa-solid fa-server-slash text-2xl mb-2 text-slate-600"></i>
                        <span>No Prometheus Targets Active</span>
                    </div>
                ) : (
                    filtered.map(vm => {
                        const isSelected = activeVm && activeVm.id === vm.id;
                        return (
                            <button
                                key={vm.id}
                                onClick={() => onSelectVm(vm)}
                                className={`relative h-16 rounded-lg border-2 flex flex-col items-center justify-center transition-all duration-200 p-2 text-center group ${
                                    isSelected 
                                        ? 'border-cyan-400 bg-cyan-950/40 shadow-lg shadow-cyan-500/20 scale-[1.02]' 
                                        : vm.status === 'healthy'
                                        ? 'bg-slate-900/90 border-slate-800 hover:border-slate-600'
                                        : vm.status === 'warning'
                                        ? 'bg-amber-950/50 border-amber-600/60 hover:border-amber-400'
                                        : 'bg-red-950/70 border-red-500/80 hover:border-red-400 animate-pulse'
                                }`}
                            >
                                <div className="flex items-center gap-1.5 mb-1">
                                    <span className={`w-2.5 h-2.5 rounded-full ${
                                        vm.status === 'healthy' ? 'bg-emerald-400 shadow-sm shadow-emerald-400' : vm.status === 'warning' ? 'bg-amber-400' : 'bg-red-500'
                                    }`}></span>
                                    <span className="text-xs font-mono font-bold text-white truncate max-w-[110px]">
                                        {vm.name}
                                    </span>
                                </div>

                                <span className="text-[10px] font-mono text-slate-400 truncate w-full">
                                    {vm.instance || vm.ip}
                                </span>
                            </button>
                        );
                    })
                )}
            </div>

            {/* Click Inspector Details Card */}
            <div className="mt-3 p-3 bg-slate-900/95 border border-cyan-500/40 rounded-lg text-xs font-mono shrink-0 text-slate-200">
                {activeVm ? (
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center justify-between pb-1 border-b border-slate-800">
                            <div className="flex items-center gap-2">
                                <i className="fa-solid fa-server text-cyan-400"></i>
                                <span className="font-bold text-sm text-cyan-300 font-orbitron">{activeVm.name}</span>
                                <span className="text-[11px] text-slate-400">({activeVm.instance})</span>
                            </div>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                activeVm.status === 'healthy' ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/40' :
                                activeVm.status === 'warning' ? 'bg-amber-950/80 text-amber-300 border border-amber-500/40' :
                                'bg-red-950/80 text-red-300 border border-red-500/40'
                            }`}>
                                {activeVm.status}
                            </span>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-[11px]">
                            <div>
                                <span className="text-slate-500">Instance / Endpoint:</span>{' '}
                                <strong className="text-slate-200">{activeVm.instance || activeVm.ip || 'N/A'}</strong>
                            </div>
                            <div>
                                <span className="text-slate-500">Job / Role:</span>{' '}
                                <strong className="text-purple-300">{activeVm.role || activeVm.k8sNode || 'node-exporter'}</strong>
                            </div>
                            <div>
                                <span className="text-slate-500">OS / Kernel:</span>{' '}
                                <strong className="text-slate-200">{activeVm.os || 'Linux'}</strong>
                            </div>
                            <div>
                                <span className="text-slate-500">Node ID:</span>{' '}
                                <strong className="text-cyan-300">#{activeVm.id}</strong>
                            </div>
                        </div>

                        {/* Node Active Alerts Section */}
                        {nodeAlerts.length > 0 ? (
                            <div className="mt-2 pt-2 border-t border-slate-800">
                                <div className="text-amber-400 font-bold mb-1.5 flex items-center gap-1.5">
                                    <i className="fa-solid fa-triangle-exclamation"></i>
                                    <span>Active Alerts ({nodeAlerts.length}):</span>
                                </div>
                                <div className="space-y-1.5">
                                    {nodeAlerts.map(alert => (
                                        <div key={alert.id || alert.title} className="p-2 rounded bg-amber-950/40 border border-amber-500/40 text-[11px]">
                                            <div className="flex items-center justify-between font-bold text-amber-200">
                                                <span>{alert.title || alert.alertname}</span>
                                                <span className="uppercase text-[9px] bg-amber-500/20 px-1 py-0.2 rounded border border-amber-500/30">
                                                    {alert.severity}
                                                </span>
                                            </div>
                                            <div className="text-slate-300 mt-0.5 text-[10px]">
                                                {alert.description}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="mt-1 text-[10px] text-emerald-400/80 flex items-center gap-1">
                                <i className="fa-solid fa-check-circle"></i>
                                <span>No active alerts for this target node</span>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="text-slate-500 italic flex items-center justify-center py-2 gap-2">
                        <i className="fa-solid fa-pointer text-cyan-400"></i>
                        <span>Click on a target square to view node details...</span>
                    </div>
                )}
            </div>
        </div>
    );
};
