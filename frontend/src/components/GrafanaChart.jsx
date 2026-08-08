import React, { useState, useEffect, useRef } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export const GrafanaChart = ({ vms }) => {
    const [history, setHistory] = useState([]);
    const maxPoints = 12;

    // Build chart data from real VM data history
    useEffect(() => {
        if (!vms) return;

        const now = new Date();
        const timeLabel = now.toISOString().substring(11, 16);

        setHistory(prev => {
            const newPoint = {
                time: timeLabel,
                targetCount: vms.length,
                healthyCount: vms.filter(v => v.status === 'healthy').length,
                criticalCount: vms.filter(v => v.status === 'critical').length,
            };
            const updated = [...prev, newPoint];
            return updated.length > maxPoints ? updated.slice(-maxPoints) : updated;
        });
    }, [vms]);

    const labels = history.map(h => h.time);

    const hasData = history.length > 0 && history.some(h => h.targetCount > 0);

    const data = {
        labels,
        datasets: [
            {
                fill: true,
                label: 'Total Targets',
                data: history.map(h => h.targetCount),
                borderColor: '#00f0ff',
                backgroundColor: 'rgba(0, 240, 255, 0.15)',
                tension: 0.4
            },
            {
                fill: true,
                label: 'Healthy Targets',
                data: history.map(h => h.healthyCount),
                borderColor: '#10b981',
                backgroundColor: 'rgba(16, 185, 129, 0.15)',
                tension: 0.4
            },
            {
                fill: true,
                label: 'Critical Targets',
                data: history.map(h => h.criticalCount),
                borderColor: '#ef4444',
                backgroundColor: 'rgba(239, 68, 68, 0.15)',
                tension: 0.4
            }
        ]
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false
            }
        },
        scales: {
            x: {
                grid: { color: 'rgba(255, 255, 255, 0.05)' },
                ticks: { color: '#64748b', font: { family: 'Share Tech Mono', size: 10 } }
            },
            y: {
                beginAtZero: true,
                grid: { color: 'rgba(255, 255, 255, 0.05)' },
                ticks: {
                    color: '#64748b',
                    font: { family: 'Share Tech Mono', size: 10 },
                    stepSize: 1,
                    precision: 0
                }
            }
        }
    };

    return (
        <div className="cyber-panel rounded-lg p-3 flex flex-col h-1/2 min-h-0">
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                    <i className="fa-solid fa-chart-line text-cyan-400"></i>
                    <h2 className="font-orbitron text-sm font-bold text-slate-200 tracking-wide">
                        PROMETHEUS TARGET HISTORY
                    </h2>
                </div>
                <div className="flex items-center gap-3 text-xs font-mono">
                    <span className="text-cyan-400 flex items-center gap-1"><span className="w-3 h-0.5 bg-cyan-400 inline-block"></span> Total</span>
                    <span className="text-emerald-400 flex items-center gap-1"><span className="w-3 h-0.5 bg-emerald-400 inline-block"></span> Healthy</span>
                    <span className="text-red-400 flex items-center gap-1"><span className="w-3 h-0.5 bg-red-400 inline-block"></span> Critical</span>
                </div>
            </div>
            <div className="relative flex-1 w-full min-h-[160px]">
                {!hasData && history.length < 2 ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500 font-mono text-xs">
                        <i className="fa-solid fa-chart-line text-3xl mb-3 text-slate-600"></i>
                        <span>Waiting for Prometheus data...</span>
                        <span className="text-[10px] text-slate-600 mt-1">Data points will appear as targets are polled</span>
                    </div>
                ) : (
                    <Line options={options} data={data} />
                )}
            </div>
        </div>
    );
};
