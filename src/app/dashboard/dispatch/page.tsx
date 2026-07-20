'use client';

import { useState } from 'react';
import { Truck, CheckCircle, Plus, XCircle } from 'lucide-react';

const initialDispatches = [
  { id: 'DSP-001', order: 'ORD-2026-103', customer: 'Ashok Leyland', vehicle: 'TN 07 AB 1234', transporter: 'Blue Dart Logistics', date: '2026-07-09', status: 'DELIVERED', pod: true },
  { id: 'DSP-002', order: 'ORD-2026-105', customer: 'Kirloskar Brothers', vehicle: 'MH 12 CD 5678', transporter: 'Gati Ltd.', date: '2026-07-04', status: 'DELIVERED', pod: true },
  { id: 'DSP-003', order: 'ORD-2026-101', customer: 'Tata Motors Ltd.', vehicle: 'GJ 05 EF 9012', transporter: 'Delhivery', date: '2026-07-14', status: 'IN_TRANSIT', pod: false },
  { id: 'DSP-004', order: 'ORD-2026-106', customer: 'L&T Heavy Engineering', vehicle: '—', transporter: '—', date: '2026-07-18', status: 'PENDING', pod: false },
  { id: 'DSP-005', order: 'ORD-2026-102', customer: 'Mahindra & Mahindra', vehicle: '—', transporter: '—', date: '2026-07-20', status: 'PENDING', pod: false },
];

const badgeClasses: Record<string, string> = {
  PENDING: 'badge-default',
  IN_TRANSIT: 'badge-primary',
  DELIVERED: 'badge-success',
};

export default function DispatchPage() {
  const [dispatches, setDispatches] = useState(initialDispatches);
  const [showModal, setShowModal] = useState(false);
  const [newDispatch, setNewDispatch] = useState({
    order: '',
    customer: '',
    vehicle: '',
    transporter: '',
  });

  const handleCreateDispatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDispatch.order || !newDispatch.customer) return;

    const generatedId = `DSP-0${dispatches.length + 1}`;
    const dispatchObj = {
      id: generatedId,
      order: newDispatch.order.toUpperCase(),
      customer: newDispatch.customer,
      vehicle: newDispatch.vehicle || '—',
      transporter: newDispatch.transporter || '—',
      date: new Date().toISOString().split('T')[0],
      status: newDispatch.vehicle ? 'IN_TRANSIT' : 'PENDING',
      pod: false,
    };

    setDispatches([dispatchObj, ...dispatches]);
    setShowModal(false);
    setNewDispatch({
      order: '',
      customer: '',
      vehicle: '',
      transporter: '',
    });
  };

  const handleVerifyPOD = (id: string) => {
    setDispatches(dispatches.map(d => {
      if (d.id === id) {
        return {
          ...d,
          status: 'DELIVERED',
          pod: true
        };
      }
      return d;
    }));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--color-text-primary)', margin: 0 }}>Dispatch Management</h2>
          <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', margin: '4px 0 0' }}>Shipment tracking, vehicle dispatch logistics, and delivery validation</p>
        </div>
        <button 
          onClick={() => setShowModal(true)} 
          className="btn btn-primary"
        >
          <Plus size={16} /> New Dispatch
        </button>
      </div>

      {/* KPI Stats */}
      <div className="grid-4">
        <div className="stat-card">
          <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)', textTransform: 'uppercase', fontWeight: 600, marginBottom: '4px' }}>Total Dispatches</div>
          <div className="stat-card-value">{dispatches.length}</div>
        </div>
        <div className="stat-card">
          <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)', textTransform: 'uppercase', fontWeight: 600, marginBottom: '4px' }}>In Transit</div>
          <div className="stat-card-value" style={{ color: 'var(--color-primary-light)' }}>{dispatches.filter(d => d.status === 'IN_TRANSIT').length}</div>
        </div>
        <div className="stat-card">
          <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)', textTransform: 'uppercase', fontWeight: 600, marginBottom: '4px' }}>Delivered</div>
          <div className="stat-card-value" style={{ color: 'var(--color-success)' }}>{dispatches.filter(d => d.status === 'DELIVERED').length}</div>
        </div>
        <div className="stat-card">
          <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)', textTransform: 'uppercase', fontWeight: 600, marginBottom: '4px' }}>On-Time Rate</div>
          <div className="stat-card-value" style={{ color: 'var(--color-success)' }}>94.5%</div>
        </div>
      </div>

      {/* Dispatch Table */}
      <div className="data-table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              {['Dispatch #', 'Order #', 'Customer', 'Vehicle ID', 'Transporter Agency', 'Logistics Date', 'Status', 'Proof of Delivery (POD)'].map(h => (
                <th key={h}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {dispatches.map(d => (
              <tr key={d.id}>
                <td className="cell-mono" style={{ color: 'var(--color-primary-light)', fontWeight: 600 }}>{d.id}</td>
                <td className="cell-mono">{d.order}</td>
                <td style={{ fontWeight: 600 }}>{d.customer}</td>
                <td className="cell-mono">{d.vehicle}</td>
                <td>{d.transporter}</td>
                <td>{d.date}</td>
                <td>
                  <span className={`badge ${badgeClasses[d.status]}`}>
                    {d.status === 'IN_TRANSIT' && <Truck size={12} style={{ marginRight: 4 }} />}
                    {d.status.replace('_', ' ')}
                  </span>
                </td>
                <td>
                  {d.pod ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-success)', fontWeight: 600, fontSize: '13px' }}>
                      <CheckCircle size={16} /> Verified
                    </div>
                  ) : d.status === 'IN_TRANSIT' ? (
                    <button 
                      onClick={() => handleVerifyPOD(d.id)}
                      className="btn btn-secondary btn-sm"
                      style={{ padding: '2px 8px', fontSize: '11px' }}
                    >
                      Receive Delivery
                    </button>
                  ) : (
                    <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>Waiting for Transit</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Create Dispatch Modal */}
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
              maxWidth: '480px',
              padding: '24px',
              boxShadow: 'var(--shadow-xl)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 className="card-title" style={{ fontSize: '18px' }}>Log New Shipment Dispatch</h3>
              <button 
                onClick={() => setShowModal(false)}
                style={{ background: 'none', border: 'none', color: 'var(--color-text-secondary)', cursor: 'pointer' }}
              >
                <XCircle size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateDispatch} className="login-form" style={{ gap: '16px' }}>
              <div className="form-group">
                <label className="form-label form-label-required">Order ID</label>
                <input 
                  type="text" 
                  required 
                  className="form-input" 
                  placeholder="e.g. ORD-2026-109"
                  value={newDispatch.order}
                  onChange={e => setNewDispatch({ ...newDispatch, order: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label form-label-required">Customer Name</label>
                <input 
                  type="text" 
                  required 
                  className="form-input" 
                  placeholder="e.g. Tata Motors Ltd."
                  value={newDispatch.customer}
                  onChange={e => setNewDispatch({ ...newDispatch, customer: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Vehicle Registration ID (Leave empty for Pending status)</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="e.g. MH 12 PQ 9999"
                  value={newDispatch.vehicle}
                  onChange={e => setNewDispatch({ ...newDispatch, vehicle: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Transporter Company</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="e.g. Blue Dart Logistics"
                  value={newDispatch.transporter}
                  onChange={e => setNewDispatch({ ...newDispatch, transporter: e.target.value })}
                />
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
                  Confirm Dispatch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
