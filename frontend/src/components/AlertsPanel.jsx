import React, { useState } from 'react';

export function AlertsPanel({ alerts = [], onRefresh }) {
  const [filter, setFilter] = useState('ALL'); // ALL, ACTIVE, ACKNOWLEDGED
  const [acknowledgingId, setAcknowledgingId] = useState(null);

  const handleAcknowledge = async (id) => {
    setAcknowledgingId(id);
    try {
      let res;
      try {
        res = await fetch(`/api/alerts/${id}/acknowledge`, { method: 'POST' });
      } catch (err) {
        res = await fetch(`http://localhost:8080/api/alerts/${id}/acknowledge`, { method: 'POST' });
      }
      if (res && res.ok) {
        if (onRefresh) onRefresh();
      }
    } catch (e) {
      console.error('Failed to acknowledge alert', e);
    } finally {
      setAcknowledgingId(null);
    }
  };

  const filteredAlerts = alerts.filter(alert => {
    if (filter === 'ACTIVE') return alert.status !== 'ACKNOWLEDGED';
    if (filter === 'ACKNOWLEDGED') return alert.status === 'ACKNOWLEDGED';
    return true;
  });

  const activeCount = alerts.filter(a => a.status !== 'ACKNOWLEDGED').length;
  const ackedCount = alerts.filter(a => a.status === 'ACKNOWLEDGED').length;

  return (
    <div className="cyber-panel rounded-lg p-3 flex flex-col h-full min-h-0">
      <div className="flex justify-between items-center pb-2 border-b border-cyan-900/40 shrink-0">
        <div className="flex items-center gap-2">
          <i className="fa-solid fa-bell text-amber-400"></i>
          <h2 className="font-orbitron text-sm font-semibold text-white tracking-wide">
            ALERT MANAGEMENT
          </h2>
          <span className="bg-amber-500/20 text-amber-300 text-xs px-2 py-0.5 rounded font-mono border border-amber-500/30">
            {activeCount} Active
          </span>
        </div>

        {/* Filter buttons */}
        <div className="flex items-center gap-1 bg-slate-900/60 p-1 rounded border border-slate-800 text-xs font-mono">
          <button
            onClick={() => setFilter('ALL')}
            className={`px-2 py-0.5 rounded transition-all ${
              filter === 'ALL'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            All ({alerts.length})
          </button>
          <button
            onClick={() => setFilter('ACTIVE')}
            className={`px-2 py-0.5 rounded transition-all ${
              filter === 'ACTIVE'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Active ({activeCount})
          </button>
          <button
            onClick={() => setFilter('ACKNOWLEDGED')}
            className={`px-2 py-0.5 rounded transition-all ${
              filter === 'ACKNOWLEDGED'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Erledigt ({ackedCount})
          </button>
        </div>
      </div>

      {/* Alert List */}
      <div className="flex-1 overflow-y-auto mt-2 pr-1 space-y-2 font-mono text-xs">
        {filteredAlerts.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-32 text-slate-500">
            <i className="fa-solid fa-circle-check text-2xl mb-1 text-emerald-500/40"></i>
            <span>Keine Alerts in dieser Kategorie</span>
          </div>
        ) : (
          filteredAlerts.map((alert) => {
            const isAcked = alert.status === 'ACKNOWLEDGED';
            const severityColor = alert.severity === 'critical' 
              ? 'border-red-500/50 bg-red-950/20 text-red-300' 
              : 'border-amber-500/50 bg-amber-950/20 text-amber-300';

            return (
              <div
                key={alert.id || alert.title}
                className={`p-2.5 rounded border transition-all ${
                  isAcked 
                    ? 'border-slate-800 bg-slate-900/30 opacity-60' 
                    : severityColor
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`px-1.5 py-0.2 rounded text-[10px] uppercase font-bold ${
                        alert.severity === 'critical' ? 'bg-red-500/30 text-red-200' : 'bg-amber-500/30 text-amber-200'
                      }`}>
                        {alert.severity || 'warning'}
                      </span>
                      <span className="font-bold text-white truncate">
                        {alert.title || alert.alertname}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        [{alert.alertname}]
                      </span>
                    </div>

                    <p className="text-slate-300 mt-1 text-[11px] leading-tight">
                      {alert.description}
                    </p>

                    <div className="flex items-center gap-3 mt-2 text-[10px] text-slate-400 flex-wrap">
                      {alert.labels?.instance && (
                        <span><i className="fa-solid fa-server mr-1"></i>{alert.labels.instance}</span>
                      )}
                      {alert.activeAt && (
                        <span><i className="fa-regular fa-clock mr-1"></i>{new Date(alert.activeAt).toLocaleTimeString()}</span>
                      )}
                      {isAcked && alert.acknowledgedAt && (
                        <span className="text-emerald-400">
                          <i className="fa-solid fa-check mr-1"></i>Erledigt um {new Date(alert.acknowledgedAt).toLocaleTimeString()}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Action Button */}
                  <div>
                    {!isAcked ? (
                      <button
                        onClick={() => handleAcknowledge(alert.id)}
                        disabled={acknowledgingId === alert.id}
                        className="px-2.5 py-1 rounded bg-emerald-600/30 hover:bg-emerald-600/50 border border-emerald-500/50 text-emerald-200 font-bold transition-all flex items-center gap-1"
                      >
                        <i className="fa-solid fa-check text-xs"></i>
                        <span>{acknowledgingId === alert.id ? 'Wird erledigt...' : 'Erledigen'}</span>
                      </button>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-800/50">
                        <i className="fa-solid fa-check-double text-xs"></i>
                        <span>Erledigt</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
