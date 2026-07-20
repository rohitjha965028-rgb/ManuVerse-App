'use client';

import { useState } from 'react';
import { Wrench, Clock, CheckCircle2, AlertTriangle, Plus, XCircle, Search } from 'lucide-react';

const initialOrders = [
  { id: 'MWO-001', machine: 'Press #1', type: 'Emergency', priority: 'CRITICAL', desc: 'Hydraulic pressure failure - production halted', assignedTo: 'Suresh Mehta', status: 'IN_PROGRESS', date: '2026-07-14', downtime: 4.5 },
  { id: 'MWO-002', machine: 'CNC Mill #1', type: 'Preventive', priority: 'MEDIUM', desc: 'Scheduled spindle bearing replacement', assignedTo: 'Ramesh Gupta', status: 'SCHEDULED', date: '2026-07-16', downtime: 0 },
  { id: 'MWO-003', machine: 'Welder #2', type: 'Corrective', priority: 'HIGH', desc: 'Electrode feed mechanism malfunction', assignedTo: 'Vijay Kumar', status: 'IN_PROGRESS', date: '2026-07-13', downtime: 3.2 },
  { id: 'MWO-004', machine: 'Grinder #1', type: 'Preventive', priority: 'LOW', desc: 'Monthly lubrication and belt inspection', assignedTo: 'Suresh Mehta', status: 'COMPLETED', date: '2026-07-10', downtime: 1.5 },
  { id: 'MWO-005', machine: 'Assembly #1', type: 'Preventive', priority: 'MEDIUM', desc: 'Conveyor alignment and calibration', assignedTo: 'Arvind Joshi', status: 'SCHEDULED', date: '2026-07-18', downtime: 0 },
  { id: 'MWO-006', machine: 'Packaging #1', type: 'Corrective', priority: 'HIGH', desc: 'Sealing unit temperature sensor fault', assignedTo: 'Ramesh Gupta', status: 'OPEN', date: '2026-07-14', downtime: 2.0 },
  { id: 'MWO-007', machine: 'Lathe #1', type: 'Preventive', priority: 'LOW', desc: 'Coolant system flush and refill', assignedTo: 'Vijay Kumar', status: 'COMPLETED', date: '2026-07-08', downtime: 1.0 },
];

const badgeClasses: Record<string, string> = {
  Preventive: 'badge-primary',
  Corrective: 'badge-warning',
  Emergency: 'badge-danger',
  LOW: 'badge-default',
  MEDIUM: 'badge-primary',
  HIGH: 'badge-warning',
  CRITICAL: 'badge-danger',
  OPEN: 'badge-warning',
  IN_PROGRESS: 'badge-primary',
  COMPLETED: 'badge-success',
  SCHEDULED: 'badge-accent',
};

export default function MaintenancePage() {
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [orders, setOrders] = useState(initialOrders);
  const [showModal, setShowModal] = useState(false);
  const [newOrder, setNewOrder] = useState({
    machine: '',
    type: 'Preventive',
    priority: 'MEDIUM',
    desc: '',
    assignedTo: '',
    date: '',
    downtime: '',
  });

  const filters = ['All', 'Preventive', 'Corrective', 'Emergency'];
  const filtered = orders.filter(o => 
    (filter === 'All' || o.type === filter) &&
    (o.machine.toLowerCase().includes(search.toLowerCase()) || 
     o.desc.toLowerCase().includes(search.toLowerCase()) ||
     o.assignedTo.toLowerCase().includes(search.toLowerCase()))
  );

  const stats = [
    { label: 'Total Work Orders', value: orders.length.toString(), icon: Wrench, colorClass: 'primary' },
    { label: 'Open / Pending', value: orders.filter(o => o.status === 'OPEN' || o.status === 'SCHEDULED').length.toString(), icon: Clock, colorClass: 'warning' },
    { label: 'In Progress', value: orders.filter(o => o.status === 'IN_PROGRESS').length.toString(), icon: AlertTriangle, colorClass: 'accent' },
    { label: 'Completed', value: orders.filter(o => o.status === 'COMPLETED').length.toString(), icon: CheckCircle2, colorClass: 'success' },
  ];

  const handleCreateOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOrder.machine || !newOrder.desc || !newOrder.assignedTo) return;

    const generatedId = `MWO-0${orders.length + 1}`;
    const orderObj = {
      id: generatedId,
      machine: newOrder.machine,
      type: newOrder.type,
      priority: newOrder.priority,
      desc: newOrder.desc,
      assignedTo: newOrder.assignedTo,
      status: 'OPEN',
      date: newOrder.date || new Date().toISOString().split('T')[0],
      downtime: parseFloat(newOrder.downtime) || 0,
    };

    setOrders([orderObj, ...orders]);
    setShowModal(false);
    setNewOrder({
      machine: '',
      type: 'Preventive',
      priority: 'MEDIUM',
      desc: '',
      assignedTo: '',
      date: '',
      downtime: '',
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--color-text-primary)', margin: 0 }}>Maintenance Management</h2>
          <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', margin: '4px 0 0' }}>Preventive, corrective, and emergency maintenance tracking</p>
        </div>
        <button 
          onClick={() => setShowModal(true)} 
          className="btn btn-primary"
        >
          <Plus size={16} /> Schedule Maintenance
        </button>
      </div>

      {/* KPI Stats */}
      <div className="grid-4">
        {stats.map((s, i) => { 
          const Icon = s.icon; 
          return (
            <div key={i} className="stat-card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div className={`stat-card-icon ${s.colorClass}`}><Icon size={20} /></div>
                <div>
                  <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)', textTransform: 'uppercase', fontWeight: 600 }}>{s.label}</div>
                  <div className="stat-card-value" style={{ fontSize: '24px' }}>{s.value}</div>
                </div>
              </div>
            </div>
          ); 
        })}
      </div>

      {/* Filters and Search */}
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {filters.map(f => (
            <button 
              key={f} 
              onClick={() => setFilter(f)} 
              style={{ 
                padding: '6px 16px', 
                borderRadius: '20px', 
                border: '1px solid', 
                borderColor: filter === f ? 'var(--color-primary)' : 'rgba(255,255,255,0.1)', 
                background: filter === f ? 'rgba(59,130,246,0.15)' : 'transparent', 
                color: filter === f ? 'var(--color-primary-light)' : 'var(--color-text-secondary)', 
                fontSize: '13px', 
                fontWeight: 500, 
                cursor: 'pointer' 
              }}
            >
              {f}
            </button>
          ))}
        </div>
        <div style={{ flex: 1 }} />
        <div className="header-search" style={{ minWidth: '220px' }}>
          <Search size={16} color="var(--color-text-secondary)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
          <input 
            value={search} 
            onChange={e => setSearch(e.target.value)} 
            placeholder="Search logs..." 
            className="form-input"
            style={{ paddingLeft: '36px' }}
          />
        </div>
      </div>

      {/* Work Orders Table */}
      <div className="data-table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              {['MWO #', 'Machine', 'Type', 'Priority', 'Description', 'Assigned To', 'Status', 'Date', 'Est. Downtime (hrs)'].map(h => (
                <th key={h}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length > 0 ? (
              filtered.map(o => (
                <tr key={o.id}>
                  <td className="cell-mono" style={{ color: 'var(--color-primary-light)', fontWeight: 600 }}>{o.id}</td>
                  <td style={{ fontWeight: 600 }}>{o.machine}</td>
                  <td><span className={`badge ${badgeClasses[o.type]}`}>{o.type}</span></td>
                  <td><span className={`badge ${badgeClasses[o.priority]}`}>{o.priority}</span></td>
                  <td style={{ maxWidth: '250px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{o.desc}</td>
                  <td>{o.assignedTo}</td>
                  <td><span className={`badge ${badgeClasses[o.status]}`}>{o.status.replace('_', ' ')}</span></td>
                  <td>{o.date}</td>
                  <td style={{ color: o.downtime > 3 ? 'var(--color-danger)' : 'var(--color-text-primary)', fontWeight: 600 }}>{o.downtime || '—'}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={9} style={{ textAlign: 'center', color: 'var(--color-text-tertiary)' }}>No work orders found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Schedule Maintenance Modal */}
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
              <h3 className="card-title" style={{ fontSize: '18px' }}>Schedule Maintenance Work Order</h3>
              <button 
                onClick={() => setShowModal(false)}
                style={{ background: 'none', border: 'none', color: 'var(--color-text-secondary)', cursor: 'pointer' }}
              >
                <XCircle size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateOrder} className="login-form" style={{ gap: '14px' }}>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label form-label-required">Machine / Asset</label>
                  <input 
                    type="text" 
                    required 
                    className="form-input" 
                    placeholder="e.g. CNC Mill #2"
                    value={newOrder.machine}
                    onChange={e => setNewOrder({ ...newOrder, machine: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Type</label>
                  <select 
                    className="form-select"
                    value={newOrder.type}
                    onChange={e => setNewOrder({ ...newOrder, type: e.target.value })}
                  >
                    <option>Preventive</option>
                    <option>Corrective</option>
                    <option>Emergency</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label form-label-required">Issue Description</label>
                <textarea 
                  required 
                  className="form-textarea" 
                  placeholder="Provide brief explanation of the maintenance needed"
                  value={newOrder.desc}
                  onChange={e => setNewOrder({ ...newOrder, desc: e.target.value })}
                  style={{ minHeight: '80px' }}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label form-label-required">Assigned Engineer</label>
                  <input 
                    type="text" 
                    required 
                    className="form-input" 
                    placeholder="Operator name"
                    value={newOrder.assignedTo}
                    onChange={e => setNewOrder({ ...newOrder, assignedTo: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Priority</label>
                  <select 
                    className="form-select"
                    value={newOrder.priority}
                    onChange={e => setNewOrder({ ...newOrder, priority: e.target.value })}
                  >
                    <option>LOW</option>
                    <option>MEDIUM</option>
                    <option>HIGH</option>
                    <option>CRITICAL</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Scheduled Date</label>
                  <input 
                    type="date" 
                    className="form-input" 
                    value={newOrder.date}
                    onChange={e => setNewOrder({ ...newOrder, date: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Est. Downtime (hours)</label>
                  <input 
                    type="number" 
                    step="0.5" 
                    className="form-input" 
                    placeholder="e.g. 2"
                    value={newOrder.downtime}
                    onChange={e => setNewOrder({ ...newOrder, downtime: e.target.value })}
                  />
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
                  Schedule Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
