'use client';

import { useState } from 'react';
import { Building2, Star, Plus, XCircle } from 'lucide-react';

const initialSuppliers = [
  { code: 'SUP-001', name: 'Tata Steel Ltd.', contact: 'Vikram Mehta', email: 'vikram@tatasteel.com', phone: '+91 22 6665 8282', rating: 4.5, category: 'Raw Materials', leadTime: 7, terms: 'Net 30', status: 'Active' },
  { code: 'SUP-002', name: 'Hindalco Industries', contact: 'Pradeep Kumar', email: 'pradeep@hindalco.com', phone: '+91 22 6691 7000', rating: 4.2, category: 'Raw Materials', leadTime: 10, terms: 'Net 45', status: 'Active' },
  { code: 'SUP-003', name: 'SKF India Ltd.', contact: 'Rajesh Singhania', email: 'rajesh@skf.com', phone: '+91 20 2792 1100', rating: 4.8, category: 'Components', leadTime: 5, terms: 'Net 30', status: 'Active' },
  { code: 'SUP-004', name: 'Castrol India', contact: 'Neha Sharma', email: 'neha@castrol.com', phone: '+91 22 2499 4999', rating: 3.9, category: 'Consumables', leadTime: 3, terms: 'Net 15', status: 'Active' },
  { code: 'SUP-005', name: 'Siemens India', contact: 'Thomas Mueller', email: 'thomas@siemens.com', phone: '+91 22 3967 7000', rating: 4.7, category: 'Electrical', leadTime: 14, terms: 'Net 60', status: 'Active' },
  { code: 'SUP-006', name: 'Polycab Wires', contact: 'Aman Gupta', email: 'aman@polycab.com', phone: '+91 22 6612 1234', rating: 4.0, category: 'Electrical', leadTime: 4, terms: 'Net 30', status: 'Active' },
  { code: 'SUP-007', name: 'Gujarat Fluorochemicals', contact: 'Ritu Patel', email: 'ritu@gfl.co.in', phone: '+91 79 2656 4000', rating: 3.5, category: 'Chemicals', leadTime: 12, terms: 'Net 30', status: 'Inactive' },
  { code: 'SUP-008', name: 'Sundaram Fasteners', contact: 'Kannan S.', email: 'kannan@sunfast.com', phone: '+91 44 2834 4000', rating: 4.6, category: 'Components', leadTime: 6, terms: 'Net 30', status: 'Active' },
];

function Stars({ rating }: { rating: number }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
      {[1, 2, 3, 4, 5].map(n => (
        <Star 
          key={n} 
          size={13} 
          fill={n <= Math.round(rating) ? '#f59e0b' : 'none'} 
          color={n <= Math.round(rating) ? '#f59e0b' : '#4b5563'} 
        />
      ))}
      <span style={{ marginLeft: '6px', fontSize: '12px', color: 'var(--color-text-secondary)', fontWeight: 600 }}>{rating}</span>
    </div>
  );
}

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState(initialSuppliers);
  const [showModal, setShowModal] = useState(false);
  const [newSupplier, setNewSupplier] = useState({
    name: '',
    contact: '',
    email: '',
    phone: '',
    category: 'Raw Materials',
    rating: '4.0',
    leadTime: '',
    terms: 'Net 30',
  });

  const avg = (suppliers.reduce((s, v) => s + v.rating, 0) / suppliers.length).toFixed(1);

  const handleRegisterSupplier = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSupplier.name || !newSupplier.contact || !newSupplier.email) return;

    const generatedCode = `SUP-0${100 + suppliers.length + 1}`;
    const supplierObj = {
      code: generatedCode,
      name: newSupplier.name,
      contact: newSupplier.contact,
      email: newSupplier.email,
      phone: newSupplier.phone || '—',
      rating: parseFloat(newSupplier.rating) || 4.0,
      category: newSupplier.category,
      leadTime: parseInt(newSupplier.leadTime) || 7,
      terms: newSupplier.terms,
      status: 'Active',
    };

    setSuppliers([...suppliers, supplierObj]);
    setShowModal(false);
    setNewSupplier({
      name: '',
      contact: '',
      email: '',
      phone: '',
      category: 'Raw Materials',
      rating: '4.0',
      leadTime: '',
      terms: 'Net 30',
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--color-text-primary)', margin: 0 }}>Supplier Management</h2>
          <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', margin: '4px 0 0' }}>Vendor performance tracking, ratings, and procurement partnerships</p>
        </div>
        <button 
          onClick={() => setShowModal(true)} 
          className="btn btn-primary"
        >
          <Plus size={16} /> Register Supplier
        </button>
      </div>

      {/* KPI Stats */}
      <div className="grid-4">
        <div className="stat-card">
          <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)', textTransform: 'uppercase', fontWeight: 600, marginBottom: '4px' }}>Total Suppliers</div>
          <div className="stat-card-value">{suppliers.length}</div>
        </div>
        <div className="stat-card">
          <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)', textTransform: 'uppercase', fontWeight: 600, marginBottom: '4px' }}>Active Partner</div>
          <div className="stat-card-value" style={{ color: 'var(--color-success)' }}>{suppliers.filter(s => s.status === 'Active').length}</div>
        </div>
        <div className="stat-card">
          <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)', textTransform: 'uppercase', fontWeight: 600, marginBottom: '4px' }}>Avg Rating</div>
          <div className="stat-card-value" style={{ color: 'var(--color-warning)' }}>{avg} ★</div>
        </div>
        <div className="stat-card">
          <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)', textTransform: 'uppercase', fontWeight: 600, marginBottom: '4px' }}>Pending POs</div>
          <div className="stat-card-value" style={{ color: 'var(--color-primary-light)' }}>12</div>
        </div>
      </div>

      {/* Suppliers Table */}
      <div className="data-table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              {['Code', 'Company', 'Contact Person', 'Email Address', 'Performance Rating', 'Category', 'Lead Time', 'Payment Terms', 'Status'].map(h => (
                <th key={h}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {suppliers.map(s => (
              <tr key={s.code}>
                <td className="cell-mono" style={{ color: 'var(--color-primary-light)', fontWeight: 600 }}>{s.code}</td>
                <td style={{ fontWeight: 600 }}>{s.name}</td>
                <td>{s.contact}</td>
                <td className="cell-mono" style={{ color: 'var(--color-text-tertiary)', fontSize: '12px' }}>{s.email}</td>
                <td><Stars rating={s.rating} /></td>
                <td><span className="badge badge-primary">{s.category}</span></td>
                <td>{s.leadTime} days</td>
                <td>{s.terms}</td>
                <td>
                  <span className={`badge ${s.status === 'Active' ? 'badge-success' : 'badge-default'}`}>
                    <span className={`status-dot ${s.status === 'Active' ? 'running' : 'offline'}`} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
                    {s.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Register Supplier Modal */}
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
              <h3 className="card-title" style={{ fontSize: '18px' }}>Register New Supplier</h3>
              <button 
                onClick={() => setShowModal(false)}
                style={{ background: 'none', border: 'none', color: 'var(--color-text-secondary)', cursor: 'pointer' }}
              >
                <XCircle size={20} />
              </button>
            </div>

            <form onSubmit={handleRegisterSupplier} className="login-form" style={{ gap: '14px' }}>
              <div className="form-group">
                <label className="form-label form-label-required">Company Name</label>
                <input 
                  type="text" 
                  required 
                  className="form-input" 
                  placeholder="e.g. Tata Steel Ltd."
                  value={newSupplier.name}
                  onChange={e => setNewSupplier({ ...newSupplier, name: e.target.value })}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label form-label-required">Contact Person</label>
                  <input 
                    type="text" 
                    required 
                    className="form-input" 
                    placeholder="Full name"
                    value={newSupplier.contact}
                    onChange={e => setNewSupplier({ ...newSupplier, contact: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select 
                    className="form-select"
                    value={newSupplier.category}
                    onChange={e => setNewSupplier({ ...newSupplier, category: e.target.value })}
                  >
                    <option>Raw Materials</option>
                    <option>Components</option>
                    <option>Consumables</option>
                    <option>Electrical</option>
                    <option>Chemicals</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label form-label-required">Email Address</label>
                  <input 
                    type="email" 
                    required 
                    className="form-input" 
                    placeholder="email@company.com"
                    value={newSupplier.email}
                    onChange={e => setNewSupplier({ ...newSupplier, email: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="+91 XXXXX XXXXX"
                    value={newSupplier.phone}
                    onChange={e => setNewSupplier({ ...newSupplier, phone: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Lead Time (days)</label>
                  <input 
                    type="number" 
                    className="form-input" 
                    placeholder="e.g. 7"
                    value={newSupplier.leadTime}
                    onChange={e => setNewSupplier({ ...newSupplier, leadTime: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Payment Terms</label>
                  <select 
                    className="form-select"
                    value={newSupplier.terms}
                    onChange={e => setNewSupplier({ ...newSupplier, terms: e.target.value })}
                  >
                    <option>Net 15</option>
                    <option>Net 30</option>
                    <option>Net 45</option>
                    <option>Net 60</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Initial Rating (1-5)</label>
                <input 
                  type="number" 
                  step="0.1" 
                  min="1" 
                  max="5" 
                  className="form-input" 
                  value={newSupplier.rating}
                  onChange={e => setNewSupplier({ ...newSupplier, rating: e.target.value })}
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
                  Register
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
