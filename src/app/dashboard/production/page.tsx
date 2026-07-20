'use client';

import { useState } from 'react';
import { Factory, Plus, Search, Clock, CheckCircle2, FileText, XCircle } from 'lucide-react';

const initialPlans = [
  { id: 'PP-2026-001', product: 'Electric Motor EM-5000', qty: 500, start: '2026-07-01', end: '2026-07-10', status: 'COMPLETED', progress: 100, line: 'Line A', priority: 'HIGH' },
  { id: 'PP-2026-002', product: 'Gearbox GB-3000', qty: 300, start: '2026-07-05', end: '2026-07-15', status: 'IN_PROGRESS', progress: 68, line: 'Line B', priority: 'HIGH' },
  { id: 'PP-2026-003', product: 'Pump Assembly PA-200', qty: 200, start: '2026-07-08', end: '2026-07-18', status: 'IN_PROGRESS', progress: 42, line: 'Line A', priority: 'MEDIUM' },
  { id: 'PP-2026-004', product: 'Servo Motor SM-100', qty: 150, start: '2026-07-12', end: '2026-07-20', status: 'APPROVED', progress: 0, line: 'Line C', priority: 'MEDIUM' },
  { id: 'PP-2026-005', product: 'Hydraulic Cylinder HC-50', qty: 400, start: '2026-07-14', end: '2026-07-25', status: 'DRAFT', progress: 0, line: 'Line B', priority: 'LOW' },
  { id: 'PP-2026-006', product: 'Control Panel CP-800', qty: 100, start: '2026-07-15', end: '2026-07-22', status: 'APPROVED', progress: 0, line: 'Line A', priority: 'HIGH' },
];

const initialWorkOrders = [
  { id: 'WO-2026-042', product: 'Electric Motor EM-5000', machine: 'CNC Mill #1', operator: 'Raj Kumar', planned: 100, completed: 92, status: 'IN_PROGRESS', priority: 'HIGH' },
  { id: 'WO-2026-043', product: 'Gearbox GB-3000', machine: 'CNC Mill #2', operator: 'Priya Singh', planned: 80, completed: 80, status: 'COMPLETED', priority: 'HIGH' },
  { id: 'WO-2026-044', product: 'Pump Assembly PA-200', machine: 'Lathe #2', operator: 'Amit Patel', planned: 50, completed: 35, status: 'IN_PROGRESS', priority: 'MEDIUM' },
  { id: 'WO-2026-045', product: 'Electric Motor EM-5000', machine: 'Assembly #1', operator: 'Deepa Nair', planned: 120, completed: 0, status: 'PLANNED', priority: 'HIGH' },
  { id: 'WO-2026-046', product: 'Servo Motor SM-100', machine: 'Press #2', operator: 'Ravi Sharma', planned: 60, completed: 45, status: 'IN_PROGRESS', priority: 'MEDIUM' },
];

const badgeClasses: Record<string, string> = {
  DRAFT: 'badge-default',
  APPROVED: 'badge-primary',
  IN_PROGRESS: 'badge-warning',
  COMPLETED: 'badge-success',
  PLANNED: 'badge-accent',
  LOW: 'badge-default',
  MEDIUM: 'badge-primary',
  HIGH: 'badge-warning',
  CRITICAL: 'badge-danger',
};

export default function ProductionPage() {
  const [tab, setTab] = useState<'plans' | 'orders'>('plans');
  const [search, setSearch] = useState('');
  const [plans, setPlans] = useState(initialPlans);
  const [workOrders, setWorkOrders] = useState(initialWorkOrders);
  
  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [newPlan, setNewPlan] = useState({
    product: '',
    qty: '',
    start: '',
    end: '',
    priority: 'MEDIUM',
    line: 'Line A',
  });

  const stats = [
    { label: 'Total Plans', value: plans.length.toString(), icon: FileText, colorClass: 'primary' },
    { label: 'In Progress', value: plans.filter(p => p.status === 'IN_PROGRESS').length.toString(), icon: Clock, colorClass: 'warning' },
    { label: 'Completed', value: plans.filter(p => p.status === 'COMPLETED').length.toString(), icon: CheckCircle2, colorClass: 'success' },
    { label: 'Efficiency', value: '86.4%', icon: Factory, colorClass: 'accent' },
  ];

  const filteredPlans = plans.filter(p => 
    p.product.toLowerCase().includes(search.toLowerCase()) ||
    p.id.toLowerCase().includes(search.toLowerCase())
  );

  const filteredOrders = workOrders.filter(w => 
    w.product.toLowerCase().includes(search.toLowerCase()) ||
    w.id.toLowerCase().includes(search.toLowerCase()) ||
    w.machine.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreatePlan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlan.product || !newPlan.qty) return;

    const generatedId = `PP-2026-0${plans.length + 1}`;
    const planObject = {
      id: generatedId,
      product: newPlan.product,
      qty: parseInt(newPlan.qty) || 100,
      start: newPlan.start || new Date().toISOString().split('T')[0],
      end: newPlan.end || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: 'APPROVED',
      progress: 0,
      line: newPlan.line,
      priority: newPlan.priority,
    };

    setPlans([planObject, ...plans]);
    setShowModal(false);
    setNewPlan({
      product: '',
      qty: '',
      start: '',
      end: '',
      priority: 'MEDIUM',
      line: 'Line A',
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--color-text-primary)', margin: 0 }}>Production Planning & Execution</h2>
          <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', margin: '4px 0 0' }}>Manage production plans, work orders, and shop floor operations</p>
        </div>
        <button 
          onClick={() => setShowModal(true)} 
          className="btn btn-primary"
        >
          <Plus size={16} /> Create Plan
        </button>
      </div>

      {/* Stats row */}
      <div className="grid-4">
        {stats.map((s, i) => { 
          const Icon = s.icon; 
          return (
            <div key={i} className="stat-card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div className={`stat-card-icon ${s.colorClass}`}><Icon size={20} /></div>
                <div>
                  <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 600 }}>{s.label}</div>
                  <div className="stat-card-value" style={{ fontSize: '24px' }}>{s.value}</div>
                </div>
              </div>
            </div>
          ); 
        })}
      </div>

      {/* Tabs and search filters */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', background: 'rgba(255,255,255,0.04)', borderRadius: '10px', padding: '4px' }}>
          {(['plans', 'orders'] as const).map(t => (
            <button 
              key={t} 
              onClick={() => setTab(t)} 
              style={{ 
                padding: '8px 20px', 
                borderRadius: '8px', 
                border: 'none', 
                background: tab === t ? 'rgba(59,130,246,0.15)' : 'transparent', 
                color: tab === t ? 'var(--color-primary-light)' : 'var(--color-text-secondary)', 
                fontSize: '14px', 
                fontWeight: 600, 
                cursor: 'pointer', 
                transition: 'all 0.2s' 
              }}
            >
              {t === 'plans' ? 'Production Plans' : 'Work Orders'}
            </button>
          ))}
        </div>
        <div style={{ flex: 1 }} />
        <div className="header-search" style={{ minWidth: '240px' }}>
          <Search size={16} color="var(--color-text-secondary)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
          <input 
            value={search} 
            onChange={e => setSearch(e.target.value)} 
            placeholder="Search items..." 
            className="form-input"
            style={{ paddingLeft: '36px' }}
          />
        </div>
      </div>

      {/* Data Table */}
      <div className="data-table-wrapper">
        {tab === 'plans' ? (
          <table className="data-table">
            <thead>
              <tr>
                {['Plan #', 'Product', 'Quantity', 'Start', 'End', 'Status', 'Progress', 'Line', 'Priority'].map(h => (
                  <th key={h}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredPlans.length > 0 ? (
                filteredPlans.map(p => (
                  <tr key={p.id}>
                    <td style={{ color: 'var(--color-primary-light)', fontWeight: 600 }}>{p.id}</td>
                    <td style={{ fontWeight: 500 }}>{p.product}</td>
                    <td>{p.qty.toLocaleString()}</td>
                    <td>{p.start}</td>
                    <td>{p.end}</td>
                    <td><span className={`badge ${badgeClasses[p.status]}`}>{p.status.replace('_', ' ')}</span></td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div className="progress-bar" style={{ width: '80px' }}>
                          <div 
                            className={`progress-bar-fill ${p.progress === 100 ? 'success' : 'primary'}`} 
                            style={{ width: `${p.progress}%` }} 
                          />
                        </div>
                        <span style={{ fontSize: '12px', color: 'var(--color-text-secondary)', minWidth: '35px' }}>{p.progress}%</span>
                      </div>
                    </td>
                    <td>{p.line}</td>
                    <td><span className={`badge ${badgeClasses[p.priority]}`}>{p.priority}</span></td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={9} style={{ textAlign: 'center', color: 'var(--color-text-tertiary)' }}>No production plans found.</td>
                </tr>
              )}
            </tbody>
          </table>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                {['WO #', 'Product', 'Machine', 'Operator', 'Planned', 'Completed', 'Status', 'Priority'].map(h => (
                  <th key={h}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length > 0 ? (
                filteredOrders.map(wo => (
                  <tr key={wo.id}>
                    <td style={{ color: 'var(--color-primary-light)', fontWeight: 600 }}>{wo.id}</td>
                    <td style={{ fontWeight: 500 }}>{wo.product}</td>
                    <td>{wo.machine}</td>
                    <td>{wo.operator}</td>
                    <td>{wo.planned}</td>
                    <td>{wo.completed}</td>
                    <td><span className={`badge ${badgeClasses[wo.status]}`}>{wo.status.replace('_', ' ')}</span></td>
                    <td><span className={`badge ${badgeClasses[wo.priority]}`}>{wo.priority}</span></td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', color: 'var(--color-text-tertiary)' }}>No work orders found.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Create Plan Modal */}
      {showModal && (
        <div
          onClick={() => setShowModal(false)}
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
              <h3 className="card-title" style={{ fontSize: '18px' }}>Create New Production Plan</h3>
              <button 
                onClick={() => setShowModal(false)}
                style={{ background: 'none', border: 'none', color: 'var(--color-text-secondary)', cursor: 'pointer' }}
              >
                <XCircle size={20} />
              </button>
            </div>

            <form onSubmit={handleCreatePlan} className="login-form" style={{ gap: '16px' }}>
              <div className="form-group">
                <label className="form-label form-label-required">Product Name</label>
                <input 
                  type="text" 
                  required 
                  className="form-input" 
                  placeholder="e.g. Electric Motor EM-5000"
                  value={newPlan.product}
                  onChange={e => setNewPlan({ ...newPlan, product: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label form-label-required">Target Quantity</label>
                <input 
                  type="number" 
                  required 
                  className="form-input" 
                  placeholder="e.g. 250"
                  value={newPlan.qty}
                  onChange={e => setNewPlan({ ...newPlan, qty: e.target.value })}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Start Date</label>
                  <input 
                    type="date" 
                    className="form-input" 
                    value={newPlan.start}
                    onChange={e => setNewPlan({ ...newPlan, start: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">End Date</label>
                  <input 
                    type="date" 
                    className="form-input" 
                    value={newPlan.end}
                    onChange={e => setNewPlan({ ...newPlan, end: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Production Line</label>
                  <select 
                    className="form-select"
                    value={newPlan.line}
                    onChange={e => setNewPlan({ ...newPlan, line: e.target.value })}
                  >
                    <option>Line A</option>
                    <option>Line B</option>
                    <option>Line C</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Priority</label>
                  <select 
                    className="form-select"
                    value={newPlan.priority}
                    onChange={e => setNewPlan({ ...newPlan, priority: e.target.value })}
                  >
                    <option>LOW</option>
                    <option>MEDIUM</option>
                    <option>HIGH</option>
                    <option>CRITICAL</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)} 
                  className="btn btn-secondary" 
                  style={{ flex: 1 }}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary" 
                  style={{ flex: 1 }}
                >
                  Save Plan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
