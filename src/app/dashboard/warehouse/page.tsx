'use client';

import { useState } from 'react';
import { MapPin, Package, XCircle } from 'lucide-react';

const initialZones = [
  { name: 'Receiving Area', color: '#3b82f6', capacity: 100, used: 35, items: 12, desc: 'Inbound dock + QA inspection' },
  { name: 'Raw Material Zone', color: '#8b5cf6', capacity: 500, used: 380, items: 45, desc: 'Bulk & climate-controlled storage' },
  { name: 'WIP Staging', color: '#f59e0b', capacity: 200, used: 120, items: 18, desc: 'In-process goods staging area' },
  { name: 'Finished Goods', color: '#10b981', capacity: 400, used: 280, items: 22, desc: 'Ready for dispatch' },
  { name: 'Spare Parts Store', color: '#ec4899', capacity: 150, used: 95, items: 35, desc: 'Maintenance spare parts' },
  { name: 'Quarantine Area', color: '#ef4444', capacity: 50, used: 8, items: 3, desc: 'Rejected / suspected items' },
];

export default function WarehousePage() {
  const [zones, setZones] = useState(initialZones);
  const [selectedZone, setSelectedZone] = useState<typeof initialZones[0] | null>(null);
  const [adjustVal, setAdjustVal] = useState('10');

  const totalCapacity = zones.reduce((sum, z) => sum + z.capacity, 0);
  const totalUsed = zones.reduce((sum, z) => sum + z.used, 0);
  const occupiedPct = ((totalUsed / totalCapacity) * 100).toFixed(1);

  const handleAdjustStock = (add: boolean) => {
    if (!selectedZone) return;
    const value = parseInt(adjustVal) || 0;
    
    const updated = zones.map(z => {
      if (z.name === selectedZone.name) {
        const nextUsed = add 
          ? Math.min(z.capacity, z.used + value)
          : Math.max(0, z.used - value);
        return { ...z, used: nextUsed };
      }
      return z;
    });

    setZones(updated);
    const refreshed = updated.find(z => z.name === selectedZone.name);
    if (refreshed) setSelectedZone(refreshed);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--color-text-primary)', margin: 0 }}>Warehouse Management</h2>
          <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', margin: '4px 0 0' }}>Zone inventory monitoring, storage capacity layout, and material flow</p>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid-4">
        <div className="stat-card">
          <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)', textTransform: 'uppercase', fontWeight: 600, marginBottom: '4px' }}>Total Storage Slots</div>
          <div className="stat-card-value">{totalCapacity}</div>
        </div>
        <div className="stat-card">
          <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)', textTransform: 'uppercase', fontWeight: 600, marginBottom: '4px' }}>Occupancy Rate</div>
          <div className="stat-card-value" style={{ color: parseFloat(occupiedPct) > 80 ? 'var(--color-danger)' : 'var(--color-warning)' }}>
            {occupiedPct}%
          </div>
        </div>
        <div className="stat-card">
          <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)', textTransform: 'uppercase', fontWeight: 600, marginBottom: '4px' }}>Pending GRNs</div>
          <div className="stat-card-value" style={{ color: 'var(--color-primary-light)' }}>4</div>
        </div>
        <div className="stat-card">
          <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)', textTransform: 'uppercase', fontWeight: 600, marginBottom: '4px' }}>Dispatches Today</div>
          <div className="stat-card-value" style={{ color: 'var(--color-success)' }}>7</div>
        </div>
      </div>

      {/* Zone Layout Cards */}
      <div className="grid-cards" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))' }}>
        {zones.map(z => { 
          const pct = Math.round((z.used / z.capacity) * 100); 
          return (
            <div 
              key={z.name} 
              className="card" 
              style={{ borderTop: `3px solid ${z.color}`, cursor: 'pointer' }}
              onClick={() => setSelectedZone(z)}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <div>
                  <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--color-text-primary)' }}>{z.name}</div>
                  <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginTop: '2px' }}>{z.desc}</div>
                </div>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: `${z.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <MapPin size={18} color={z.color} />
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: 'var(--color-text-secondary)', marginBottom: '8px' }}>
                <span>{z.used} / {z.capacity} slots occupied</span>
                <span style={{ fontWeight: 600, color: pct > 80 ? 'var(--color-danger)' : 'var(--color-text-primary)' }}>{pct}%</span>
              </div>
              <div className="progress-bar">
                <div 
                  className="progress-bar-fill" 
                  style={{ width: `${pct}%`, background: pct > 80 ? 'var(--color-danger)' : z.color }} 
                />
              </div>
              <div style={{ marginTop: '12px', fontSize: '13px', color: 'var(--color-text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Package size={14} /> 
                <span>{z.items} item types stored</span>
              </div>
            </div>
          ); 
        })}
      </div>

      {/* Adjust Zone Capacity Modal */}
      {selectedZone && (
        <div
          onClick={() => setSelectedZone(null)}
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
                <h3 className="card-title" style={{ fontSize: '18px' }}>Adjust Storage occupancy</h3>
                <span style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>{selectedZone.name}</span>
              </div>
              <button 
                onClick={() => setSelectedZone(null)}
                style={{ background: 'none', border: 'none', color: 'var(--color-text-secondary)', cursor: 'pointer' }}
              >
                <XCircle size={20} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--color-divider)', paddingBottom: '8px' }}>
                <span style={{ color: 'var(--color-text-secondary)' }}>Total Storage Capacity</span>
                <span style={{ fontWeight: 600 }}>{selectedZone.capacity} Slots</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--color-divider)', paddingBottom: '8px' }}>
                <span style={{ color: 'var(--color-text-secondary)' }}>Currently Occupied</span>
                <span style={{ fontWeight: 600 }}>{selectedZone.used} Slots</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px' }}>
                <span style={{ color: 'var(--color-text-secondary)' }}>Available Slots</span>
                <span style={{ fontWeight: 600, color: 'var(--color-success)' }}>{selectedZone.capacity - selectedZone.used} Slots</span>
              </div>

              <div className="form-group" style={{ marginTop: '10px' }}>
                <label className="form-label">Slots to Adjust</label>
                <input 
                  type="number"
                  className="form-input"
                  value={adjustVal}
                  onChange={e => setAdjustVal(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
                <button 
                  onClick={() => handleAdjustStock(false)} 
                  className="btn btn-secondary" 
                  style={{ flex: 1 }}
                >
                  Retrieve Items
                </button>
                <button 
                  onClick={() => handleAdjustStock(true)} 
                  className="btn btn-primary" 
                  style={{ flex: 1 }}
                >
                  Store Items
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
