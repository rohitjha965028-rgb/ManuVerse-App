'use client';

import { useState, useEffect } from 'react';
import {
  TrendingUp, TrendingDown, Monitor, ShieldCheck, Package,
  AlertTriangle, CheckCircle, Info, XCircle, Clock, IndianRupee,
  Users, Truck, Wrench, Activity
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';
import {
  oeeTrendData, productionData, machines as initialMachines, recentAlerts,
  downtimeReasons, inventoryByCategory
} from '../../data/mockData';

const statusColors: Record<string, string> = {
  RUNNING: 'var(--color-success)',
  IDLE: 'var(--color-warning)',
  DOWN: 'var(--color-danger)',
  MAINTENANCE: 'var(--color-accent)',
};

const alertIcons: Record<string, typeof AlertTriangle> = {
  error: XCircle,
  warning: AlertTriangle,
  success: CheckCircle,
  info: Info,
};

const alertColors: Record<string, string> = {
  error: 'var(--color-danger)',
  warning: 'var(--color-warning)',
  success: 'var(--color-success)',
  info: 'var(--color-primary)',
};

export default function DashboardPage() {
  const [machinesList, setMachinesList] = useState(initialMachines);
  const [productionToday, setProductionToday] = useState(12847);
  const [oeeVal, setOeeVal] = useState(84.2);
  const [selectedMachine, setSelectedMachine] = useState<typeof initialMachines[0] | null>(null);

  // Live telemetry simulation to make it feel alive (human logic code)
  useEffect(() => {
    const interval = setInterval(() => {
      // randomly increment production today
      setProductionToday(prev => prev + (Math.random() > 0.3 ? 1 : 0));
      
      // fluctuate OEE slightly
      setOeeVal(prev => {
        const delta = (Math.random() - 0.5) * 0.1;
        return parseFloat((prev + delta).toFixed(1));
      });

      // fluctuate machines OEE slightly
      setMachinesList(prev => prev.map(m => {
        if (m.status === 'RUNNING') {
          const delta = Math.floor((Math.random() - 0.5) * 2);
          const nextOee = Math.min(100, Math.max(70, m.oee + delta));
          return { ...m, oee: nextOee };
        }
        return m;
      }));
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const kpis = [
    {
      title: 'OVERALL OEE', value: `${oeeVal}%`, subtitle: 'vs 85% target',
      trend: '+2.1%', trendUp: true, colorClass: 'success',
      icon: Activity, progress: oeeVal,
    },
    {
      title: 'PRODUCTION TODAY', value: productionToday.toLocaleString(), subtitle: 'of 15,000 units',
      trend: '+5.3%', trendUp: true, colorClass: 'primary',
      icon: Package, progress: (productionToday / 15000) * 100,
    },
    {
      title: 'QUALITY RATE', value: '97.8%', subtitle: 'Excellent',
      trend: '+0.4%', trendUp: true, colorClass: 'success',
      icon: ShieldCheck, progress: 97.8,
    },
    {
      title: 'ACTIVE MACHINES',
      value: `${machinesList.filter(m => m.status === 'RUNNING').length} / ${machinesList.length}`,
      subtitle: 'Running',
      trend: '', trendUp: true, colorClass: 'accent',
      icon: Monitor, progress: (machinesList.filter(m => m.status === 'RUNNING').length / machinesList.length) * 100,
    },
  ];

  const quickStats = [
    { label: 'Pending Orders', value: '23', icon: Package, color: 'var(--color-primary)' },
    { label: 'On-time Delivery', value: '94.5%', icon: Truck, color: 'var(--color-success)' },
    { label: 'Maintenance Pending', value: '5', icon: Wrench, color: 'var(--color-warning)' },
    { label: 'Employees Present', value: '142 / 165', icon: Users, color: 'var(--color-accent)' },
    { label: 'Revenue (Month)', value: '₹8.75 Cr', icon: IndianRupee, color: 'var(--color-success)' },
    { label: 'Revenue Change', value: '+10.5%', icon: TrendingUp, color: 'var(--color-success)' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* KPI Cards Row */}
      <div className="grid-stats">
        {kpis.map((kpi, i) => {
          const Icon = kpi.icon;
          return (
            <div key={i} className="stat-card" style={{ cursor: 'default' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <span className="stat-card-label">{kpi.title}</span>
                <div className={`stat-card-icon ${kpi.colorClass}`}>
                  <Icon size={18} />
                </div>
              </div>
              <div className="stat-card-value" style={{ margin: '8px 0' }}>{kpi.value}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {kpi.trend && (
                  <span className={`stat-card-trend ${kpi.trendUp ? 'up' : 'down'}`}>
                    {kpi.trendUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                    {kpi.trend}
                  </span>
                )}
                <span style={{ fontSize: '13px', color: 'var(--color-text-tertiary)' }}>{kpi.subtitle}</span>
              </div>
              {/* Progress bar */}
              <div className="progress-bar" style={{ marginTop: '16px' }}>
                <div 
                  className={`progress-bar-fill ${kpi.progress >= 85 ? 'success' : kpi.progress >= 70 ? 'warning' : 'danger'}`} 
                  style={{ width: `${kpi.progress}%` }} 
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid-2" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))' }}>
        {/* OEE Trend Chart */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">OEE Trend (7 Days)</h3>
          </div>
          <div className="card-body">
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={oeeTrendData}>
                <defs>
                  <linearGradient id="oeeGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="day" tick={{ fill: 'var(--color-text-secondary)', fontSize: 12 }} axisLine={{ stroke: 'var(--color-divider)' }} />
                <YAxis tick={{ fill: 'var(--color-text-secondary)', fontSize: 12 }} axisLine={{ stroke: 'var(--color-divider)' }} domain={[60, 100]} />
                <Tooltip contentStyle={{ background: 'var(--color-surface-alt)', border: 'var(--glass-border)', borderRadius: '8px', color: 'var(--color-text-primary)' }} />
                <Area type="monotone" dataKey="oee" stroke="var(--color-primary)" fill="url(#oeeGrad)" strokeWidth={2} />
                <Area type="monotone" dataKey="availability" stroke="var(--color-success)" fill="none" strokeWidth={1.5} strokeDasharray="4 4" />
                <Area type="monotone" dataKey="performance" stroke="var(--color-warning)" fill="none" strokeWidth={1.5} strokeDasharray="4 4" />
                <Area type="monotone" dataKey="quality" stroke="var(--color-accent)" fill="none" strokeWidth={1.5} strokeDasharray="4 4" />
              </AreaChart>
            </ResponsiveContainer>
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', marginTop: '12px' }}>
              {[{ label: 'OEE', color: 'var(--color-primary)' }, { label: 'Availability', color: 'var(--color-success)' }, { label: 'Performance', color: 'var(--color-warning)' }, { label: 'Quality', color: 'var(--color-accent)' }].map(l => (
                <span key={l.label} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--color-text-secondary)' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: l.color }} />{l.label}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Production vs Target */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Production vs Target</h3>
          </div>
          <div className="card-body">
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={productionData} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="day" tick={{ fill: 'var(--color-text-secondary)', fontSize: 12 }} axisLine={{ stroke: 'var(--color-divider)' }} />
                <YAxis tick={{ fill: 'var(--color-text-secondary)', fontSize: 12 }} axisLine={{ stroke: 'var(--color-divider)' }} />
                <Tooltip contentStyle={{ background: 'var(--color-surface-alt)', border: 'var(--glass-border)', borderRadius: '8px', color: 'var(--color-text-primary)' }} />
                <Bar dataKey="planned" fill="rgba(255,255,255,0.1)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="actual" fill="var(--color-primary)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', marginTop: '12px' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--color-text-secondary)' }}><span style={{ width: '8px', height: '8px', borderRadius: '2px', background: 'rgba(255,255,255,0.15)' }} />Planned</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--color-text-secondary)' }}><span style={{ width: '8px', height: '8px', borderRadius: '2px', background: 'var(--color-primary)' }} />Actual</span>
            </div>
          </div>
        </div>
      </div>

      {/* Machine Status + Alerts + Quick Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '20px' }}>
        {/* Machine Status Grid */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Machine Status (Click for Diagnostics)</h3>
          </div>
          <div className="card-body">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '10px' }}>
              {machinesList.map((m) => (
                <div 
                  key={m.id} 
                  onClick={() => setSelectedMachine(m)}
                  style={{
                    padding: '12px', 
                    borderRadius: '10px', 
                    background: 'rgba(255,255,255,0.03)',
                    border: `1px solid ${statusColors[m.status]}33`, 
                    transition: 'all 0.2s',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                    <span className={`status-dot ${m.status.toLowerCase()}`} />
                    <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{m.name}</span>
                  </div>
                  <div style={{ fontSize: '11px', color: statusColors[m.status], fontWeight: 600, marginBottom: '4px' }}>{m.status}</div>
                  {m.oee > 0 && <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--color-text-primary)' }}>{m.oee}%</div>}
                  <div style={{ fontSize: '10px', color: 'var(--color-text-tertiary)', marginTop: '2px' }}>{m.currentJob}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Alerts */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Recent Alerts</h3>
          </div>
          <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {recentAlerts.map((alert) => {
              const Icon = alertIcons[alert.type];
              return (
                <div key={alert.id} style={{
                  padding: '12px', 
                  borderRadius: '10px', 
                  background: 'rgba(255,255,255,0.02)',
                  borderLeft: `3px solid ${alertColors[alert.type]}`,
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <Icon size={14} color={alertColors[alert.type]} />
                    <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text-primary)' }}>{alert.title}</span>
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--color-text-tertiary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Clock size={10} /> {alert.timeAgo}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Quick Stats</h3>
          </div>
          <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {quickStats.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1 }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: `${stat.color}15`, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Icon size={16} color={stat.color} />
                    </div>
                    <span style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>{stat.label}</span>
                  </div>
                  <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-text-primary)' }}>{stat.value}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Row: Downtime + Inventory Pie */}
      <div className="grid-2">
        {/* Downtime Pareto */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Top Downtime Reasons</h3>
          </div>
          <div className="card-body">
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={downtimeReasons} layout="vertical" barSize={16}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis type="number" tick={{ fill: 'var(--color-text-secondary)', fontSize: 12 }} axisLine={{ stroke: 'var(--color-divider)' }} />
                <YAxis type="category" dataKey="reason" tick={{ fill: 'var(--color-text-secondary)', fontSize: 11 }} width={120} axisLine={{ stroke: 'var(--color-divider)' }} />
                <Tooltip contentStyle={{ background: 'var(--color-surface-alt)', border: 'var(--glass-border)', borderRadius: '8px', color: 'var(--color-text-primary)' }} />
                <Bar dataKey="minutes" fill="var(--color-danger)" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Inventory by Category */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Inventory Distribution</h3>
          </div>
          <div className="card-body">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={inventoryByCategory} cx="50%" cy="50%" innerRadius={55} outerRadius={85} dataKey="value" paddingAngle={4}>
                    {inventoryByCategory.map((entry, i) => (
                      <Cell key={i} fill={entry.color} stroke="none" />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ background: 'var(--color-surface-alt)', border: 'var(--glass-border)', borderRadius: '8px', color: 'var(--color-text-primary)' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', justifyContent: 'center', marginTop: '8px' }}>
              {inventoryByCategory.map((cat, i) => (
                <span key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--color-text-secondary)' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: cat.color }} />{cat.name} ({cat.value}%)
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Machine Diagnostic Telemetry Modal */}
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
              maxWidth: '480px',
              padding: '24px',
              boxShadow: 'var(--shadow-xl)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 className="card-title" style={{ fontSize: '18px' }}>Diagnostics: {selectedMachine.name}</h3>
              <button 
                onClick={() => setSelectedMachine(null)}
                style={{ background: 'none', border: 'none', color: 'var(--color-text-secondary)', cursor: 'pointer' }}
              >
                <XCircle size={20} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--color-divider)', paddingBottom: '8px' }}>
                <span style={{ color: 'var(--color-text-secondary)' }}>Machine ID</span>
                <span className="cell-mono" style={{ fontWeight: 600 }}>{selectedMachine.id}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--color-divider)', paddingBottom: '8px' }}>
                <span style={{ color: 'var(--color-text-secondary)' }}>Status</span>
                <span style={{ color: statusColors[selectedMachine.status], fontWeight: 700 }}>{selectedMachine.status}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--color-divider)', paddingBottom: '8px' }}>
                <span style={{ color: 'var(--color-text-secondary)' }}>Active Job</span>
                <span style={{ color: 'var(--color-primary-light)', fontWeight: 600 }}>{selectedMachine.currentJob}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--color-divider)', paddingBottom: '8px' }}>
                <span style={{ color: 'var(--color-text-secondary)' }}>Operating Temp</span>
                <span>{selectedMachine.status === 'RUNNING' ? '68.4 °C' : selectedMachine.status === 'MAINTENANCE' ? '28.1 °C' : '22.5 °C'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--color-divider)', paddingBottom: '8px' }}>
                <span style={{ color: 'var(--color-text-secondary)' }}>Power Consumption</span>
                <span>{selectedMachine.status === 'RUNNING' ? '12.4 kW' : '0.1 kW'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px' }}>
                <span style={{ color: 'var(--color-text-secondary)' }}>Overall OEE</span>
                <span style={{ fontWeight: 700, color: 'var(--color-primary)' }}>{selectedMachine.oee > 0 ? `${selectedMachine.oee}%` : '—'}</span>
              </div>
            </div>

            <button
              className="btn btn-secondary"
              style={{ width: '100%', marginTop: '20px' }}
              onClick={() => setSelectedMachine(null)}
            >
              Close Diagnostics
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
