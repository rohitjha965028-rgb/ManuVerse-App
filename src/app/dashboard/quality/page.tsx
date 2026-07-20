'use client';

import { useState } from 'react';
import { ShieldCheck, CheckCircle, XCircle, AlertCircle, Plus, XCircle as CloseIcon } from 'lucide-react';

const initialInspections = [
  { id: 'QI-001', type: 'Incoming', product: 'Steel Sheets (3mm)', inspector: 'Anita Desai', result: 'PASS', defects: 0, date: '2026-07-14', batch: 'LOT-2026-0112' },
  { id: 'QI-002', type: 'In-Process', product: 'Stator Assembly', inspector: 'Kiran Rao', result: 'PASS', defects: 0, date: '2026-07-14', batch: 'BATCH-4521' },
  { id: 'QI-003', type: 'Final', product: 'Electric Motor EM-5000', inspector: 'Anita Desai', result: 'FAIL', defects: 3, date: '2026-07-13', batch: 'BATCH-4518' },
  { id: 'QI-004', type: 'Incoming', product: 'Copper Winding Wire', inspector: 'Kiran Rao', result: 'CONDITIONAL', defects: 1, date: '2026-07-13', batch: 'LOT-2026-0108' },
  { id: 'QI-005', type: 'Final', product: 'Gearbox GB-3000', inspector: 'Anita Desai', result: 'PASS', defects: 0, date: '2026-07-12', batch: 'BATCH-4515' },
  { id: 'QI-006', type: 'In-Process', product: 'Rotor Sub-Assembly', inspector: 'Kiran Rao', result: 'PASS', defects: 0, date: '2026-07-12', batch: 'BATCH-4512' },
  { id: 'QI-007', type: 'Incoming', product: 'Ball Bearings (6205)', inspector: 'Anita Desai', result: 'PASS', defects: 0, date: '2026-07-11', batch: 'LOT-2026-0101' },
  { id: 'QI-008', type: 'Final', product: 'Pump Assembly PA-200', inspector: 'Kiran Rao', result: 'FAIL', defects: 5, date: '2026-07-10', batch: 'BATCH-4508' },
];

const badgeClasses: Record<string, string> = {
  Incoming: 'badge-primary',
  'In-Process': 'badge-warning',
  Final: 'badge-accent',
};

const resultIcons: Record<string, { icon: typeof CheckCircle; color: string }> = {
  PASS: { icon: CheckCircle, color: 'var(--color-success)' },
  FAIL: { icon: XCircle, color: 'var(--color-danger)' },
  CONDITIONAL: { icon: AlertCircle, color: 'var(--color-warning)' },
};

export default function QualityPage() {
  const [inspections, setInspections] = useState(initialInspections);
  const [showModal, setShowModal] = useState(false);
  const [newInsp, setNewInsp] = useState({
    type: 'Incoming',
    product: '',
    inspector: '',
    result: 'PASS',
    defects: '0',
    batch: '',
  });

  const passRate = ((inspections.filter(i => i.result === 'PASS').length / inspections.length) * 100).toFixed(1);

  const stats = [
    { label: 'Total Inspections', value: inspections.length.toString(), colorClass: 'primary' },
    { label: 'Pass Rate', value: `${passRate}%`, colorClass: 'success' },
    { label: 'Failed', value: inspections.filter(i => i.result === 'FAIL').length.toString(), colorClass: 'danger' },
    { label: 'Pending NCRs', value: inspections.filter(i => i.result === 'FAIL').length.toString(), colorClass: 'warning' },
  ];

  const handleCreateInspection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newInsp.product || !newInsp.inspector || !newInsp.batch) return;

    const generatedId = `QI-0${inspections.length + 1}`;
    const inspObj = {
      id: generatedId,
      type: newInsp.type,
      product: newInsp.product,
      inspector: newInsp.inspector,
      result: newInsp.result,
      defects: parseInt(newInsp.defects) || 0,
      date: new Date().toISOString().split('T')[0],
      batch: newInsp.batch.toUpperCase(),
    };

    setInspections([inspObj, ...inspections]);
    setShowModal(false);
    setNewInsp({
      type: 'Incoming',
      product: '',
      inspector: '',
      result: 'PASS',
      defects: '0',
      batch: '',
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--color-text-primary)', margin: 0 }}>Quality Assurance</h2>
          <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', margin: '4px 0 0' }}>Inspection management, Non-Conformance Reports (NCR) tracking, and SPC monitors</p>
        </div>
        <button 
          onClick={() => setShowModal(true)} 
          className="btn btn-primary"
        >
          <Plus size={16} /> Log Inspection
        </button>
      </div>

      {/* KPI Stats */}
      <div className="grid-4">
        {stats.map((s, i) => (
          <div key={i} className="stat-card">
            <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)', textTransform: 'uppercase', fontWeight: 600, marginBottom: '4px' }}>{s.label}</div>
            <div className={`stat-card-value ${s.colorClass}`}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Inspection Table */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Inspection Records</h3>
        </div>
        <div className="card-body">
          <div className="data-table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  {['Inspection #', 'Type', 'Product', 'Inspector', 'Result', 'Defects', 'Date', 'Batch/Lot'].map(h => (
                    <th key={h}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {inspections.map((insp, i) => { 
                  const ri = resultIcons[insp.result]; 
                  const Icon = ri.icon; 
                  return (
                    <tr key={insp.id} style={{ background: insp.result === 'FAIL' ? 'rgba(239,68,68,0.04)' : undefined }}>
                      <td className="cell-mono" style={{ color: 'var(--color-primary-light)', fontWeight: 600 }}>{insp.id}</td>
                      <td><span className={`badge ${badgeClasses[insp.type]}`}>{insp.type}</span></td>
                      <td style={{ fontWeight: 600 }}>{insp.product}</td>
                      <td>{insp.inspector}</td>
                      <td>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: ri.color, fontWeight: 600, fontSize: '13px' }}>
                          <Icon size={14} />{insp.result}
                        </span>
                      </td>
                      <td style={{ color: insp.defects > 0 ? 'var(--color-danger)' : 'var(--color-text-secondary)', fontWeight: 600 }}>{insp.defects}</td>
                      <td>{insp.date}</td>
                      <td className="cell-mono" style={{ color: 'var(--color-text-tertiary)' }}>{insp.batch}</td>
                    </tr>
                  ); 
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Log Inspection Modal */}
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
              <h3 className="card-title" style={{ fontSize: '18px' }}>Log New Quality Inspection</h3>
              <button 
                onClick={() => setShowModal(false)}
                style={{ background: 'none', border: 'none', color: 'var(--color-text-secondary)', cursor: 'pointer' }}
              >
                <CloseIcon size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateInspection} className="login-form" style={{ gap: '16px' }}>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Inspection Type</label>
                  <select 
                    className="form-select"
                    value={newInsp.type}
                    onChange={e => setNewInsp({ ...newInsp, type: e.target.value })}
                  >
                    <option>Incoming</option>
                    <option>In-Process</option>
                    <option>Final</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Inspection Result</label>
                  <select 
                    className="form-select"
                    value={newInsp.result}
                    onChange={e => setNewInsp({ ...newInsp, result: e.target.value })}
                  >
                    <option>PASS</option>
                    <option>FAIL</option>
                    <option>CONDITIONAL</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label form-label-required">Product Name</label>
                <input 
                  type="text" 
                  required 
                  className="form-input" 
                  placeholder="e.g. Stator Assembly"
                  value={newInsp.product}
                  onChange={e => setNewInsp({ ...newInsp, product: e.target.value })}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label form-label-required">Inspector Name</label>
                  <input 
                    type="text" 
                    required 
                    className="form-input" 
                    placeholder="e.g. Anita Desai"
                    value={newInsp.inspector}
                    onChange={e => setNewInsp({ ...newInsp, inspector: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Defects Count</label>
                  <input 
                    type="number" 
                    className="form-input" 
                    value={newInsp.defects}
                    onChange={e => setNewInsp({ ...newInsp, defects: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label form-label-required">Batch / Lot Number</label>
                <input 
                  type="text" 
                  required 
                  className="form-input" 
                  placeholder="e.g. BATCH-4522"
                  value={newInsp.batch}
                  onChange={e => setNewInsp({ ...newInsp, batch: e.target.value })}
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
                  Save Quality Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
