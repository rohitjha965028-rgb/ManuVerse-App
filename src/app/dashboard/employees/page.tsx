'use client';

import { useState } from 'react';
import { Users, Clock, Search, XCircle } from 'lucide-react';

const initialEmployees = [
  { code: 'EMP-001', name: 'Raj Kumar', dept: 'Production', designation: 'Sr. Machine Operator', shift: 'Morning', skills: ['CNC', 'Lathe', 'Milling'], status: 'ACTIVE', phone: '+91 98765 43210' },
  { code: 'EMP-002', name: 'Priya Singh', dept: 'Production', designation: 'Machine Operator', shift: 'Morning', skills: ['Milling', 'Grinding'], status: 'ACTIVE', phone: '+91 98765 43211' },
  { code: 'EMP-003', name: 'Amit Patel', dept: 'Production', designation: 'Machine Operator', shift: 'Afternoon', skills: ['CNC', 'Assembly'], status: 'ACTIVE', phone: '+91 98765 43212' },
  { code: 'EMP-004', name: 'Deepa Nair', dept: 'Assembly', designation: 'Assembly Line Lead', shift: 'Morning', skills: ['Assembly', 'Quality'], status: 'ACTIVE', phone: '+91 98765 43213' },
  { code: 'EMP-005', name: 'Ravi Sharma', dept: 'Production', designation: 'Machine Operator', shift: 'Night', skills: ['Press', 'Molding'], status: 'ON_LEAVE', phone: '+91 98765 43214' },
  { code: 'EMP-006', name: 'Suresh Mehta', dept: 'Maintenance', designation: 'Sr. Maintenance Tech', shift: 'Morning', skills: ['Electrical', 'Hydraulic', 'PLC'], status: 'ACTIVE', phone: '+91 98765 43215' },
  { code: 'EMP-007', name: 'Anita Desai', dept: 'Quality', designation: 'Quality Inspector', shift: 'Morning', skills: ['SPC', 'CMM', 'Visual'], status: 'ACTIVE', phone: '+91 98765 43216' },
  { code: 'EMP-008', name: 'Kiran Rao', dept: 'Quality', designation: 'Quality Inspector', shift: 'Afternoon', skills: ['Dimensional', 'Material Test'], status: 'ACTIVE', phone: '+91 98765 43217' },
  { code: 'EMP-009', name: 'Vijay Kumar', dept: 'Maintenance', designation: 'Maintenance Tech', shift: 'Afternoon', skills: ['Mechanical', 'Welding'], status: 'ACTIVE', phone: '+91 98765 43218' },
  { code: 'EMP-010', name: 'Meena Joshi', dept: 'Warehouse', designation: 'Warehouse Supervisor', shift: 'Morning', skills: ['Inventory', 'Forklift'], status: 'ACTIVE', phone: '+91 98765 43219' },
  { code: 'EMP-011', name: 'Rohit Verma', dept: 'Production', designation: 'Machine Operator', shift: 'Night', skills: ['Welding', 'Grinding'], status: 'ON_LEAVE', phone: '+91 98765 43220' },
  { code: 'EMP-012', name: 'Sneha Patil', dept: 'HR', designation: 'HR Executive', shift: 'General', skills: ['Payroll', 'Recruitment'], status: 'ACTIVE', phone: '+91 98765 43221' },
];

export default function EmployeesPage() {
  const [employees, setEmployees] = useState(initialEmployees);
  const [search, setSearch] = useState('');
  const [selectedEmp, setSelectedEmp] = useState<typeof initialEmployees[0] | null>(null);

  const present = employees.filter(e => e.status === 'ACTIVE').length;
  const onLeave = employees.filter(e => e.status === 'ON_LEAVE').length;

  const filtered = employees.filter(e => 
    e.name.toLowerCase().includes(search.toLowerCase()) || 
    e.dept.toLowerCase().includes(search.toLowerCase()) ||
    e.code.toLowerCase().includes(search.toLowerCase())
  );

  const handleUpdateShiftStatus = (code: string, shift: string, status: string) => {
    const updated = employees.map(e => {
      if (e.code === code) {
        return { ...e, shift, status };
      }
      return e;
    });
    setEmployees(updated);
    if (selectedEmp && selectedEmp.code === code) {
      const match = updated.find(e => e.code === code);
      if (match) setSelectedEmp(match);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--color-text-primary)', margin: 0 }}>Employee & Shift Management</h2>
          <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', margin: '4px 0 0' }}>Workforce scheduling, attendance tracking, and skills matrix</p>
        </div>
        <div className="header-search" style={{ minWidth: '220px' }}>
          <Search size={16} color="var(--color-text-secondary)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
          <input 
            value={search} 
            onChange={e => setSearch(e.target.value)} 
            placeholder="Search employees..." 
            className="form-input"
            style={{ paddingLeft: '36px' }}
          />
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid-4">
        <div className="stat-card">
          <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)', textTransform: 'uppercase', fontWeight: 600, marginBottom: '4px' }}>Total Employees</div>
          <div className="stat-card-value">{employees.length}</div>
        </div>
        <div className="stat-card">
          <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)', textTransform: 'uppercase', fontWeight: 600, marginBottom: '4px' }}>Present Today</div>
          <div className="stat-card-value" style={{ color: 'var(--color-success)' }}>{present}</div>
        </div>
        <div className="stat-card">
          <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)', textTransform: 'uppercase', fontWeight: 600, marginBottom: '4px' }}>On Leave</div>
          <div className="stat-card-value" style={{ color: 'var(--color-warning)' }}>{onLeave}</div>
        </div>
        <div className="stat-card" style={{ flexDirection: 'row', alignItems: 'center', gap: '12px' }}>
          <div className="stat-card-icon primary"><Clock size={20} /></div>
          <div>
            <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)', textTransform: 'uppercase', fontWeight: 600 }}>Active Shift</div>
            <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-primary-light)' }}>Morning (06:00 - 14:00)</div>
          </div>
        </div>
      </div>

      {/* Employees Table */}
      <div className="data-table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              {['Emp Code', 'Name', 'Department', 'Designation', 'Shift', 'Skills', 'Status', 'Phone', 'Action'].map(h => (
                <th key={h}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length > 0 ? (
              filtered.map(e => (
                <tr key={e.code}>
                  <td className="cell-mono" style={{ color: 'var(--color-primary-light)', fontWeight: 600 }}>{e.code}</td>
                  <td style={{ fontWeight: 600 }}>{e.name}</td>
                  <td>{e.dept}</td>
                  <td>{e.designation}</td>
                  <td>{e.shift}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                      {e.skills.map(s => (
                        <span key={s} className="badge badge-primary" style={{ fontSize: '10px', padding: '1px 6px' }}>{s}</span>
                      ))}
                    </div>
                  </td>
                  <td>
                    <span className={`badge ${e.status === 'ACTIVE' ? 'badge-success' : 'badge-warning'}`}>
                      <span className={`status-dot ${e.status.toLowerCase()}`} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
                      {e.status === 'ACTIVE' ? 'Active' : 'On Leave'}
                    </span>
                  </td>
                  <td className="cell-mono" style={{ color: 'var(--color-text-tertiary)' }}>{e.phone}</td>
                  <td>
                    <button 
                      onClick={() => setSelectedEmp(e)}
                      className="btn btn-secondary btn-sm"
                    >
                      Edit Shift
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={9} style={{ textAlign: 'center', color: 'var(--color-text-tertiary)' }}>No employees found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Edit Shift Modal */}
      {selectedEmp && (
        <div
          onClick={() => setSelectedEmp(null)}
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
              maxWidth: '440px',
              padding: '24px',
              boxShadow: 'var(--shadow-xl)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <h3 className="card-title" style={{ fontSize: '18px' }}>Manage Staff Shift</h3>
                <span className="cell-mono" style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>{selectedEmp.code} - {selectedEmp.name}</span>
              </div>
              <button 
                onClick={() => setSelectedEmp(null)}
                style={{ background: 'none', border: 'none', color: 'var(--color-text-secondary)', cursor: 'pointer' }}
              >
                <XCircle size={20} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label">Shift Scheduling</label>
                <select 
                  className="form-select"
                  defaultValue={selectedEmp.shift}
                  onChange={(e) => handleUpdateShiftStatus(selectedEmp.code, e.target.value, selectedEmp.status)}
                >
                  <option>Morning</option>
                  <option>Afternoon</option>
                  <option>Night</option>
                  <option>General</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Attendance Status</label>
                <select 
                  className="form-select"
                  defaultValue={selectedEmp.status}
                  onChange={(e) => handleUpdateShiftStatus(selectedEmp.code, selectedEmp.shift, e.target.value)}
                >
                  <option value="ACTIVE">Active / Checked In</option>
                  <option value="ON_LEAVE">On Leave</option>
                </select>
              </div>

              <div style={{ borderTop: '1px solid var(--color-divider)', paddingTop: '14px', marginTop: '10px' }}>
                <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginBottom: '8px' }}>Employee Qualifications</div>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {selectedEmp.skills.map(s => (
                    <span key={s} className="badge badge-outline">{s}</span>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                <button 
                  onClick={() => setSelectedEmp(null)}
                  className="btn btn-primary" 
                  style={{ flex: 1 }}
                >
                  Confirm Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
