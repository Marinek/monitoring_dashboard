import React, { useState } from 'react';

export const VmMatrixGrid = ({ vms, onSelectVm }) => {
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('all');
    const [hoveredVm, setHoveredVm] = useState(null);

    const filtered = vms.filter(vm => {
        const matchesSearch = vm.name.toLowerCase().includes(search.toLowerCase()) ||
                              (vm.ip && vm.ip.includes(search));
        const matchesStatus = filter === 'all' || vm.status === filter;
        return matchesSearch && matchesStatus;
    });

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

            <div className="flex-1 min-h-[300px] max-h-[500px] overflow-y-auto grid grid-cols-5 sm:grid-cols-10 lg:grid-cols-5 xl:grid-cols-10 gap-1.5 p-1 bg-slate-950/40 rounded border border-slate-800/80">
                {filtered.length === 0 ? (
                    <div className="col-span-full flex flex-col items-center justify-center py-10 text-slate-500 font-mono text-xs">
                        <i className="fa-solid fa-server-slash text-2xl mb-2 text-slate-600"></i>
                        <span>No Prometheus Targets Active</span>
                    </div>
                ) : (
                    filtered.map(vm => (
                        <button
                            key={vm.id}
                            onMouseEnter={() => setHoveredVm(vm)}
                            onClick={() => onSelectVm(vm)}
                            className={`relative h-9 rounded border flex flex-col items-center justify-center transition-all duration-200 p-1 ${
                                vm.status === 'healthy'
                                    ? 'bg-slate-900/80 border-slate-800 hover:border-cyan-500/60'
                                    : vm.status === 'warning'
                                    ? 'bg-amber-950/40 border-amber-600/50 hover:border-amber-400'
                                    : 'bg-red-950/60 border-red-500/80 hover:border-red-400 animate-pulse'
                            }`}
                        >
                            <span className={`w-1.5 h-1.5 rounded-full mb-0.5 ${
                                vm.status === 'healthy' ? 'bg-emerald-400' : vm.status === 'warning' ? 'bg-amber-400' : 'bg-red-500'
                            }`}></span>
                            <span className="text-[9px] font-mono font-bold text-slate-300 truncate w-full px-0.5 text-center">
                                {vm.name}
                            </span>
                        </button>
                    ))
                )}
            </div>

            <div className="mt-2 p-2 bg-slate-900/90 border border-cyan-500/30 rounded text-xs font-mono flex flex-wrap justify-between items-center shrink-0 min-h-[38px] text-slate-300">
                {hoveredVm ? (
                    <>
                        <div className="flex items-center gap-2">
                            <span className={`status-dot ${hoveredVm.status}`}></span>
                            <span className="font-bold text-cyan-300">{hoveredVm.name}</span>
                            <span className="text-slate-500">({hoveredVm.ip})</span>
                        </div>
                        <div className="flex items-center gap-4 text-[11px]">
                            <span>Role: <strong className="text-slate-200">{hoveredVm.role}</strong></span>
                            <span>Status: <strong className={hoveredVm.status === 'healthy' ? 'text-emerald-400' : 'text-red-400'}>{hoveredVm.status}</strong></span>
                        </div>
                    </>
                ) : (
                    <span className="text-slate-500 italic flex items-center gap-1.5">
                        <i className="fa-solid fa-hand-pointer text-cyan-400"></i> Hover over target node to inspect...
                    </span>
                )}
            </div>
        </div>
    );
};
