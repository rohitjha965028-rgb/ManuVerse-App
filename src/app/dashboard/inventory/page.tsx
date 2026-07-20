'use client';

import { useState } from 'react';
import { Package, AlertTriangle, IndianRupee, Search, Plus, XCircle } from 'lucide-react';

const initialItems = [
  { code: 'RM-001', name: 'Steel Sheets (3mm)', cat: 'Raw Material', stock: 2500, rop: 1000, max: 5000, unit: 'Sheets', cost: 450, abc: 'A', loc: 'Zone A / R1-S2' },
  { code: 'RM-002', name: 'Copper Winding Wire', cat: 'Raw Material', stock: 180, rop: 200, max: 800, unit: 'kg', cost: 890, abc: 'A', loc: 'Zone A / R2-S1' },
  { code: 'RM-003', name: 'Ball Bearings (6205)', cat: 'Raw Material', stock: 3200, rop: 500, max: 5000, unit: 'Pcs', cost: 125, abc: 'B', loc: 'Zone B / R3-S4' },
  { code: 'RM-004', name: 'Aluminum Ingots', cat: 'Raw Material', stock: 450, rop: 300, max: 1200, unit: 'kg', cost: 240, abc: 'A', loc: 'Zone A / R1-S3' },
  { code: 'WIP-001', name: 'Stator Assembly', cat: 'WIP', stock: 85, rop: 50, max: 200, unit: 'Pcs', cost: 2200, abc: 'A', loc: 'WIP Zone / Bay 1' },
  { code: 'WIP-002', name: 'Rotor Sub-Assembly', cat: 'WIP', stock: 120, rop: 40, max: 250, unit: 'Pcs', cost: 1800, abc: 'A', loc: 'WIP Zone / Bay 2' },
  { code: 'FG-001', name: 'Electric Motor EM-5000', cat: 'Finished Goods', stock: 340, rop: 100, max: 600, unit: 'Units', cost: 8500, abc: 'A', loc: 'FG Zone / Rack 1' },
  { code: 'FG-002', name: 'Gearbox GB-3000', cat: 'Finished Goods', stock: 75, rop: 80, max: 300, unit: 'Units', cost: 12000, abc: 'A', loc: 'FG Zone / Rack 2' },
  { code: 'SP-001', name: 'Hydraulic Oil (ISO 68)', cat: 'Spare Parts', stock: 200, rop: 100, max: 500, unit: 'Litres', cost: 320, abc: 'B', loc: 'Spare Store / S1' },
  { code: 'SP-002', name: 'V-Belts (B-type)', cat: 'Spare Parts', stock: 45, rop: 30, max: 100, unit: 'Pcs', cost: 180, abc: 'C', loc: 'Spare Store / S3' },
  { code: 'RM-005', name: 'Insulation Paper', cat: 'Raw Material', stock: 600, rop: 200, max: 1500, unit: 'Rolls', cost: 75, abc: 'C', loc: 'Zone B / R5-S1' },
  { code: 'RM-006', name: 'Fastener Kit (Mixed)', cat: 'Raw Material', stock: 1500, rop: 500, max: 3000, unit: 'Kits', cost: 45, abc: 'C', loc: 'Zone C / R1-S1' },
];

const badgeClasses: Record<string, string> = {
  'Raw Material': 'badge-primary',
  'WIP': 'badge-accent',
  'Finished Goods': 'badge-success',
  'Spare Parts': 'badge-warning',
  A: 'badge-danger',
  B: 'badge-warning',
  C: 'badge-success',
};

export default function InventoryPage() {
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [items, setItems] = useState(initialItems);
  const [showModal, setShowModal] = useState(false);
  const [newItem, setNewItem] = useState({
    code: '',
    name: '',
    cat: 'Raw Material',
    stock: '',
    rop: '',
    max: '',
    unit: 'Pcs',
    cost: '',
    abc: 'B',
    loc: '',
  });

  const cats = ['All', 'Raw Material', 'WIP', 'Finished Goods', 'Spare Parts'];
  const lowStock = items.filter(i => i.stock < i.rop).length;
  const totalValue = items.reduce((sum, i) => sum + i.stock * i.cost, 0);
  const filtered = items.filter(i => 
    (filter === 'All' || i.cat === filter) && 
    (i.name.toLowerCase().includes(search.toLowerCase()) || i.code.toLowerCase().includes(search.toLowerCase()))
  );

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.code || !newItem.name || !newItem.stock || !newItem.cost) return;

    const itemObj = {
      code: newItem.code,
      name: newItem.name,
      cat: newItem.cat,
      stock: parseInt(newItem.stock) || 0,
      rop: parseInt(newItem.rop) || 100,
      max: parseInt(newItem.max) || 1000,
      unit: newItem.unit,
      cost: parseFloat(newItem.cost) || 0,
      abc: newItem.abc,
      loc: newItem.loc || 'Unassigned',
    };

    setItems([itemObj, ...items]);
    setShowModal(false);
    setNewItem({
      code: '',
      name: '',
      cat: 'Raw Material',
      stock: '',
      rop: '',
      max: '',
      unit: 'Pcs',
      cost: '',
      abc: 'B',
      loc: '',
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--color-text-primary)', margin: 0 }}>Inventory Management</h2>
          <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', margin: '4px 0 0' }}>Track stock levels, raw materials, spare parts, and reorder alerts</p>
        </div>
        <button 
          onClick={() => setShowModal(true)} 
          className="btn btn-primary"
        >
          <Plus size={16} /> Add Item
        </button>
      </div>

      {/* Metric Stat Cards */}
      <div className="grid-4">
        <div className="stat-card">
          <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)', textTransform: 'uppercase', fontWeight: 600, marginBottom: '4px' }}>Total Items</div>
          <div className="stat-card-value">{items.length}</div>
        </div>
        <div className="stat-card" style={{ borderLeft: '3px solid var(--color-danger)' }}>
          <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)', textTransform: 'uppercase', fontWeight: 600, marginBottom: '4px' }}>Low Stock Alerts</div>
          <div className="stat-card-value" style={{ color: 'var(--color-danger)' }}>{lowStock}</div>
        </div>
        <div className="stat-card">
          <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)', textTransform: 'uppercase', fontWeight: 600, marginBottom: '4px' }}>Total Value</div>
          <div className="stat-card-value" style={{ color: 'var(--color-success)' }}>₹{(totalValue / 100000).toFixed(1)}L</div>
        </div>
        <div className="stat-card">
          <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)', textTransform: 'uppercase', fontWeight: 600, marginBottom: '4px' }}>Categories</div>
          <div className="stat-card-value">4</div>
        </div>
      </div>

      {/* Category Pills & Search */}
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {cats.map(c => (
            <button 
              key={c} 
              onClick={() => setFilter(c)} 
              style={{ 
                padding: '6px 16px', 
                borderRadius: '20px', 
                border: '1px solid', 
                borderColor: filter === c ? 'var(--color-primary)' : 'rgba(255,255,255,0.1)', 
                background: filter === c ? 'rgba(59,130,246,0.15)' : 'transparent', 
                color: filter === c ? 'var(--color-primary-light)' : 'var(--color-text-secondary)', 
                fontSize: '13px', 
                fontWeight: 500, 
                cursor: 'pointer' 
              }}
            >
              {c}
            </button>
          ))}
        </div>
        <div style={{ flex: 1 }} />
        <div className="header-search" style={{ minWidth: '220px' }}>
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
        <table className="data-table">
          <thead>
            <tr>
              {['Code', 'Item Name', 'Category', 'Stock', 'Reorder Lvl', 'Unit', 'Cost (₹)', 'ABC', 'Location'].map(h => (
                <th key={h}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length > 0 ? (
              filtered.map(it => {
                const isLow = it.stock < it.rop;
                return (
                  <tr key={it.code} style={{ background: isLow ? 'rgba(239,68,68,0.05)' : undefined }}>
                    <td className="cell-mono" style={{ color: 'var(--color-primary-light)', fontWeight: 600 }}>{it.code}</td>
                    <td style={{ fontWeight: 500 }}>
                      {isLow && <AlertTriangle size={14} color="var(--color-danger)" style={{ marginRight: 6, verticalAlign: 'middle', display: 'inline-block' }} />}
                      {it.name}
                    </td>
                    <td><span className={`badge ${badgeClasses[it.cat]}`}>{it.cat}</span></td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div className="progress-bar" style={{ width: '60px' }}>
                          <div 
                            className={`progress-bar-fill ${isLow ? 'danger' : 'success'}`} 
                            style={{ width: `${Math.min(100, (it.stock / it.max) * 100)}%` }} 
                          />
                        </div>
                        <span style={{ fontSize: '13px', color: isLow ? 'var(--color-danger)' : 'var(--color-text-primary)', fontWeight: 600 }}>
                          {it.stock.toLocaleString()}
                        </span>
                      </div>
                    </td>
                    <td>{it.rop.toLocaleString()}</td>
                    <td>{it.unit}</td>
                    <td>₹{it.cost.toLocaleString()}</td>
                    <td><span className={`badge ${badgeClasses[it.abc]}`}>{it.abc}</span></td>
                    <td style={{ color: 'var(--color-text-tertiary)', fontSize: '12px' }}>{it.loc}</td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={9} style={{ textAlign: 'center', color: 'var(--color-text-tertiary)' }}>No inventory items found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add Item Modal */}
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
              maxWidth: '520px',
              padding: '24px',
              boxShadow: 'var(--shadow-xl)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 className="card-title" style={{ fontSize: '18px' }}>Add New Inventory Item</h3>
              <button 
                onClick={() => setShowModal(false)}
                style={{ background: 'none', border: 'none', color: 'var(--color-text-secondary)', cursor: 'pointer' }}
              >
                <XCircle size={20} />
              </button>
            </div>

            <form onSubmit={handleAddItem} className="login-form" style={{ gap: '14px' }}>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label form-label-required">Item Code</label>
                  <input 
                    type="text" 
                    required 
                    className="form-input" 
                    placeholder="e.g. RM-007"
                    value={newItem.code}
                    onChange={e => setNewItem({ ...newItem, code: e.target.value.toUpperCase() })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select 
                    className="form-select"
                    value={newItem.cat}
                    onChange={e => setNewItem({ ...newItem, cat: e.target.value })}
                  >
                    <option>Raw Material</option>
                    <option>WIP</option>
                    <option>Finished Goods</option>
                    <option>Spare Parts</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label form-label-required">Item Name</label>
                <input 
                  type="text" 
                  required 
                  className="form-input" 
                  placeholder="e.g. Aluminum Sheets (2mm)"
                  value={newItem.name}
                  onChange={e => setNewItem({ ...newItem, name: e.target.value })}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label form-label-required">Stock Quantity</label>
                  <input 
                    type="number" 
                    required 
                    className="form-input" 
                    placeholder="Current stock"
                    value={newItem.stock}
                    onChange={e => setNewItem({ ...newItem, stock: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Reorder Level (ROP)</label>
                  <input 
                    type="number" 
                    className="form-input" 
                    placeholder="Alert threshold"
                    value={newItem.rop}
                    onChange={e => setNewItem({ ...newItem, rop: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Maximum Stock</label>
                  <input 
                    type="number" 
                    className="form-input" 
                    placeholder="Max capacity"
                    value={newItem.max}
                    onChange={e => setNewItem({ ...newItem, max: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Unit</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="e.g. Pcs, kg, Sheets"
                    value={newItem.unit}
                    onChange={e => setNewItem({ ...newItem, unit: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label form-label-required">Unit Cost (₹)</label>
                  <input 
                    type="number" 
                    required 
                    className="form-input" 
                    placeholder="Cost per unit"
                    value={newItem.cost}
                    onChange={e => setNewItem({ ...newItem, cost: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">ABC Class</label>
                  <select 
                    className="form-select"
                    value={newItem.abc}
                    onChange={e => setNewItem({ ...newItem, abc: e.target.value })}
                  >
                    <option>A</option>
                    <option>B</option>
                    <option>C</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Warehouse Storage Location</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="e.g. Zone B / R1-S1"
                  value={newItem.loc}
                  onChange={e => setNewItem({ ...newItem, loc: e.target.value })}
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
                  Add Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
