'use client';

import { useState, useEffect } from 'react';
import { Monitor, Thermometer, Activity, Zap, Grid3X3, List, XCircle, Settings, Play, Pause, AlertOctagon, Wrench } from 'lucide-react';
import { machines as initialMachines } from '../../../data/mockData';

const statusColors: Record<string, string> = {
  RUNNING: 'var(--color-success)',
  IDLE: 'var(--color-warning)',
  DOWN: 'var(--color-danger)',
  MAINTENANCE: 'var(--color-accent)',
};

const badgeClasses: Record<string, string> = {
  RUNNING: 'badge-success',
  IDLE: 'badge-warning',
  DOWN: 'badge-danger',
  MAINTENANCE: 'badge-accent',
};

const statusLabels: Record<string, string> = { 
  RUNNING: 'Running', 
  IDLE: 'Idle', 
  DOWN: 'Down', 
  MAINTENANCE: 'Maintenance' 
};

export default function MachinesPage() {
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [filter, setFilter] = useState('ALL');
  const [machines, setMachines] = useState(initialMachines);
  const [selectedMachine, setSelectedMachine] = useState<typeof initialMachines[0] | null>(null);

  // Live telemetry metrics mock that fluctuate slightly to feel alive
  const [telemetry, setTelemetry] = useState({
    temp: 68.4,
    power: 12.8,
    speed: 1520,
  });

  useEffect(() => {
    if (!selectedMachine) return;
    
    // Set initial mock base telemetry depending on selected machine status
    let baseTemp = 22.4;
    let basePower = 0.1;
    let baseSpeed = 0;
    
    if (selectedMachine.status === 'RUNNING') {
      baseTemp = 68.4;
      basePower = 12.8;
      baseSpeed = 1520;
    } else if (selectedMachine.status === 'MAINTENANCE') {
      baseTemp = 34.2;
      basePower = 1.2;
      baseSpeed = 120;
    } else if (selectedMachine.status === 'IDLE') {
      baseTemp = 42.1;
      basePower = 0.8;
      baseSpeed = 0;
    }
    
    setTelemetry({ temp: baseTemp, power: basePower, speed: baseSpeed });

    const interval = setInterval(() => {
      setTelemetry(prev => {
        if (selectedMachine.status !== 'RUNNING') return prev;
        return {
          temp: parseFloat((prev.temp + (Math.random() - 0.5) * 1.5).toFixed(1)),
          power: parseFloat((prev.power + (Math.random() - 0.5) * 0.4).toFixed(1)),
          speed: Math.floor(prev.speed + (Math.random() - 0.5) * 20),
        };
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [selectedMachine]);

  const counts = { 
    ALL: machines.length, 
    RUNNING: machines.filter(m => m.status === 'RUNNING').length, 
    IDLE: machines.filter(m => m.status === 'IDLE').length, 
    DOWN: machines.filter(m => m.status === 'DOWN').length, 
    MAINTENANCE: machines.filter(m => m.status === 'MAINTENANCE').length 
  };
  
  const filtered = filter === 'ALL' ? machines : machines.filter(m => m.status === filter);

  const handleUpdateStatus = (machineId: string, newStatus: typeof initialMachines[0]['status']) => {
    const updated = machines.map(m => {
      if (m.id === machineId) {
        const currentJob = newStatus === 'RUNNING' ? `JOB-${Math.floor(4500 + Math.random() * 99)}` : '—';
        const oee = newStatus === 'RUNNING' ? Math.floor(75 + Math.random() * 20) : 0;
        return { ...m, status: newStatus, currentJob, oee };
      }
      return m;
    });
    setMachines(updated);
    
    // Update active modal machine context if open
    if (selectedMachine && selectedMachine.id === machineId) {
      const target = updated.find(m => m.id === machineId);
      if (target) setSelectedMachine(target);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--color-text-primary)', margin: 0 }}>Machine Monitoring</h2>
          <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', margin: '4px 0 0' }}>Real-time status and diagnostics of all factory machines</p>
        </div>
        <div style={{ display: 'flex', gap: '4px', background: 'rgba(255,255,255,0.04)', borderRadius: '10px', padding: '4px' }}>
          <button 
            onClick={() => setView('grid')} 
            style={{ padding: '8px 12px', borderRadius: '8px', border: 'none', background: view === 'grid' ? 'rgba(59,130,246,0.15)' : 'transparent', color: view === 'grid' ? 'var(--color-primary-light)' : 'var(--color-text-secondary)', cursor: 'pointer' }}
          >
            <Grid3X3 size={18} />
          </button>
          <button 
            onClick={() => setView('list')} 
            style={{ padding: '8px 12px', borderRadius: '8px', border: 'none', background: view === 'list' ? 'rgba(59,130,246,0.15)' : 'transparent', color: view === 'list' ? 'var(--color-primary-light)' : 'var(--color-text-secondary)', cursor: 'pointer' }}
          >
            <List size={18} />
          </button>
        </div>
      </div>

      {/* Status Summary Buttons */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '12px' }}>
        {Object.entries(counts).map(([status, count]) => (
          <button 
            key={status} 
            onClick={() => setFilter(status)} 
            className="card"
            style={{ 
              padding: '16px', 
              cursor: 'pointer', 
              textAlign: 'left',
              borderColor: filter === status ? (status === 'ALL' ? 'var(--color-primary)' : statusColors[status]) : 'rgba(255,255,255,0.06)',
            }}
          >
            <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.5px', marginBottom: '4px' }}>
              {status === 'ALL' ? 'All Machines' : statusLabels[status]}
            </div>
            <div style={{ fontSize: '28px', fontWeight: 700, color: status === 'ALL' ? 'var(--color-text-primary)' : statusColors[status] }}>
              {count}
            </div>
          </button>
        ))}
      </div>

      {/* Machine Grid/List */}
      {view === 'grid' ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
          {filtered.map(m => (
            <div 
              key={m.id} 
              className="card" 
              style={{ borderTop: `3px solid ${statusColors[m.status]}`, cursor: 'pointer' }}
              onClick={() => setSelectedMachine(m)}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <div>
                  <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--color-text-primary)' }}>{m.name}</div>
                  <div className="cell-mono" style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginTop: '2px' }}>{m.id}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span className={`status-dot ${m.status.toLowerCase()}`} />
                  <span style={{ fontSize: '12px', fontWeight: 600, color: statusColors[m.status] }}>{statusLabels[m.status]}</span>
                </div>
              </div>
              {m.oee > 0 && (
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)', marginBottom: '6px' }}>OEE</div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                    <span style={{ fontSize: '36px', fontWeight: 800, color: m.oee >= 85 ? 'var(--color-success)' : m.oee >= 70 ? 'var(--color-warning)' : 'var(--color-danger)', fontFamily: 'var(--font-heading)' }}>{m.oee}</span>
                    <span style={{ fontSize: '16px', color: 'var(--color-text-tertiary)' }}>%</span>
                  </div>
                </div>
              )}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--color-text-secondary)' }}>Current Job</span>
                  <span style={{ color: m.currentJob !== '—' ? 'var(--color-primary-light)' : 'var(--color-text-muted)', fontWeight: 600 }}>{m.currentJob}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="data-table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                {['ID', 'Machine', 'Status', 'OEE', 'Current Job', 'Actions'].map(h => (
                  <th key={h}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(m => (
                <tr key={m.id}>
                  <td className="cell-mono">{m.id}</td>
                  <td style={{ fontWeight: 600 }} onClick={() => setSelectedMachine(m)}>{m.name}</td>
                  <td>
                    <span className={`badge ${badgeClasses[m.status]}`}>
                      <span className={`status-dot ${m.status.toLowerCase()}`} style={{ marginRight: 6, verticalAlign: 'middle' }} />
                      {statusLabels[m.status]}
                    </span>
                  </td>
                  <td style={{ fontWeight: 700 }}>{m.oee > 0 ? `${m.oee}%` : '—'}</td>
                  <td style={{ color: m.currentJob !== '—' ? 'var(--color-primary-light)' : 'var(--color-text-muted)', fontWeight: 600 }}>{m.currentJob}</td>
                  <td>
                    <button 
                      onClick={(e) => { e.stopPropagation(); setSelectedMachine(m); }}
                      className="btn btn-secondary btn-sm"
                    >
                      Diagnostics
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Machine Details / Diagnostics Modal */}
      {selectedMachine && (
        <div
          onClick={() => setSelectedMachine(null)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.6)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="card"
            style={{
              width: '100%',
              maxWidth: '500px',
              padding: '24px',
              boxShadow: 'var(--shadow-xl)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <h3 className="card-title" style={{ fontSize: '18px' }}>Diagnostics & Control</h3>
                <span className="cell-mono" style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>{selectedMachine.id} - {selectedMachine.name}</span>
              </div>
              <button 
                onClick={() => setSelectedMachine(null)}
                style={{ background: 'none', border: 'none', color: 'var(--color-text-secondary)', cursor: 'pointer' }}
              >
                <XCircle size={20} />
              </button>
            </div>

            {/* Diagnostic stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '24px' }}>
              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: '8px', border: '1px solid var(--color-border)', textAlign: 'center' }}>
                <Thermometer size={18} color="var(--color-primary)" style={{ margin: '0 auto 6px' }} />
                <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)', textTransform: 'uppercase' }}>Temp</div>
                <div style={{ fontSize: '16px', fontWeight: 700, marginTop: '2px' }}>{telemetry.temp} °C</div>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: '8px', border: '1px solid var(--color-border)', textAlign: 'center' }}>
                <Zap size={18} color="var(--color-warning)" style={{ margin: '0 auto 6px' }} />
                <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)', textTransform: 'uppercase' }}>Power</div>
                <div style={{ fontSize: '16px', fontWeight: 700, marginTop: '2px' }}>{telemetry.power} kW</div>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: '8px', border: '1px solid var(--color-border)', textAlign: 'center' }}>
                <Activity size={18} color="var(--color-success)" style={{ margin: '0 auto 6px' }} />
                <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)', textTransform: 'uppercase' }}>RPM</div>
                <div style={{ fontSize: '16px', fontWeight: 700, marginTop: '2px' }}>{telemetry.speed}</div>
              </div>
            </div>

            {/* Diagnostics checklist */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--color-divider)', paddingBottom: '8px' }}>
                <span style={{ color: 'var(--color-text-secondary)' }}>Current Job</span>
                <span style={{ color: 'var(--color-primary-light)', fontWeight: 600 }}>{selectedMachine.currentJob}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--color-divider)', paddingBottom: '8px' }}>
                <span style={{ color: 'var(--color-text-secondary)' }}>OEE Score</span>
                <span style={{ fontWeight: 700, color: selectedMachine.oee >= 85 ? 'var(--color-success)' : selectedMachine.oee > 0 ? 'var(--color-warning)' : 'var(--color-text-muted)' }}>
                  {selectedMachine.oee > 0 ? `${selectedMachine.oee}%` : '—'}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px' }}>
                <span style={{ color: 'var(--color-text-secondary)' }}>Current Operator</span>
                <span>{selectedMachine.status === 'RUNNING' ? 'Rajesh Kumar' : '—'}</span>
              </div>
            </div>

            {/* Controller Action buttons */}
            <h4 style={{ fontSize: '13px', color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '12px', fontWeight: 600 }}>Manual Override Controls</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
              <button 
                onClick={() => handleUpdateStatus(selectedMachine.id, 'RUNNING')} 
                className="btn btn-secondary btn-sm"
                style={{ 
                  color: selectedMachine.status === 'RUNNING' ? 'var(--color-success)' : undefined,
                  background: selectedMachine.status === 'RUNNING' ? 'rgba(16,185,129,0.1)' : undefined, 
                  borderColor: selectedMachine.status === 'RUNNING' ? 'rgba(16,185,129,0.3)' : undefined,
                }}
              >
                <Play size={14} /> Start Machine
              </button>
              <button 
                onClick={() => handleUpdateStatus(selectedMachine.id, 'IDLE')} 
                className="btn btn-secondary btn-sm"
                style={{ 
                  color: selectedMachine.status === 'IDLE' ? 'var(--color-warning)' : undefined,
                  background: selectedMachine.status === 'IDLE' ? 'rgba(245,158,11,0.1)' : undefined, 
                  borderColor: selectedMachine.status === 'IDLE' ? 'rgba(245,158,11,0.3)' : undefined,
                }}
              >
                <Pause size={14} /> Idle State
              </button>
              <button 
                onClick={() => handleUpdateStatus(selectedMachine.id, 'DOWN')} 
                className="btn btn-secondary btn-sm"
                style={{ 
                  color: selectedMachine.status === 'DOWN' ? 'var(--color-danger)' : undefined,
                  background: selectedMachine.status === 'DOWN' ? 'rgba(239,68,68,0.1)' : undefined, 
                  borderColor: selectedMachine.status === 'DOWN' ? 'rgba(239,68,68,0.3)' : undefined,
                }}
              >
                <AlertOctagon size={14} /> Emergency Stop
              </button>
              <button 
                onClick={() => handleUpdateStatus(selectedMachine.id, 'MAINTENANCE')} 
                className="btn btn-secondary btn-sm"
                style={{ 
                  color: selectedMachine.status === 'MAINTENANCE' ? 'var(--color-accent)' : undefined,
                  background: selectedMachine.status === 'MAINTENANCE' ? 'rgba(139,92,246,0.1)' : undefined, 
                  borderColor: selectedMachine.status === 'MAINTENANCE' ? 'rgba(139,92,246,0.3)' : undefined,
                }}
              >
                <Wrench size={14} /> Trigger Service
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
