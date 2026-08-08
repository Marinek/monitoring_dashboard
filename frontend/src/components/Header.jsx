import React, { useState, useEffect } from 'react';

export const Header = ({ timeRange, setTimeRange, onRefresh, summary, vmCount }) => {
    const [timeStr, setTimeStr] = useState('00:00:00 UTC');

    useEffect(() => {
        const timer = setInterval(() => {
            const now = new Date();
            setTimeStr(now.toISOString().substring(11, 19) + ' UTC');
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const totalTargets = summary?.totalVms ?? 0;
    const onlineTargets = summary?.onlineVms ?? 0;

    return (
        <header className="cyber-panel rounded-lg px-4 py-2.5 flex flex-wrap items-center justify-between shrink-0 gap-3">
            <div className="flex items-center gap-3">
                <div className="relative flex items-center justify-center w-10 h-10 rounded-lg bg-blue-950/60 border border-cyan-500/40 text-cyan-400 cyber-glow">
                    <i className="fa-solid fa-cubes-stacked text-xl"></i>
                </div>
                <div>
                    <div className="flex items-center gap-2">
                        <h1 className="font-orbitron font-extrabold text-lg tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400">
                            KUBIMETRICS
                        </h1>
                        <span className="px-2 py-0.5 text-[10px] font-mono tracking-widest uppercase bg-cyan-950/80 text-cyan-300 border border-cyan-500/30 rounded-full">
                            PROD-CLUSTER-01
                        </span>
                    </div>
                    <p className="text-xs text-slate-400 font-mono flex items-center gap-2">
                        <span><i className="fa-solid fa-network-wire text-cyan-400 text-[10px]"></i> {totalTargets} PROMETHEUS TARGETS</span>
                        <span className="text-slate-600">•</span>
                        <span><i className="fa-solid fa-microchip text-indigo-400 text-[10px]"></i> {onlineTargets} ONLINE</span>
                    </p>
                </div>
            </div>

            <div className="flex items-center gap-3">
                <div className="flex items-center bg-slate-900/80 border border-slate-700/60 rounded-md p-1 font-mono text-xs">
                    {['5m', '15m', '1h', '24h'].map((range) => (
                        <button
                            key={range}
                            onClick={() => setTimeRange(range)}
                            className={`px-2.5 py-1 rounded transition ${
                                timeRange === range
                                    ? 'bg-blue-600/40 text-cyan-300 border border-cyan-500/30 font-semibold shadow'
                                    : 'text-slate-400 hover:text-cyan-300'
                            }`}
                        >
                            {range}
                        </button>
                    ))}
                    <span className="text-slate-600 px-1">|</span>
                    <button onClick={onRefresh} className="px-2 text-cyan-400 hover:text-white">
                        <i className="fa-solid fa-rotate text-xs"></i>
                    </button>
                </div>

                <div className="flex items-center gap-2 bg-slate-900/80 border border-slate-700/60 rounded-md px-3 py-1 text-xs">
                    <span className={`status-dot ${totalTargets > 0 ? 'healthy' : 'critical'} animate-pulse`}></span>
                    <span className={`font-mono font-bold ${totalTargets > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                        {totalTargets > 0 ? 'SYSTEM OPERATIONAL' : 'NO TARGETS'}
                    </span>
                </div>

                <div className="font-mono text-xs text-slate-400 hidden lg:block border-l border-slate-800 pl-3">
                    <span className="text-cyan-300 font-bold">{timeStr}</span>
                </div>
            </div>
        </header>
    );
};
