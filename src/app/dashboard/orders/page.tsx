'use client';

import { useState } from 'react';
import { ShoppingCart, ArrowRight, Plus, XCircle } from 'lucide-react';

const initialOrders = [
  { id: 'ORD-2026-101', customer: 'Tata Motors Ltd.', product: 'Electric Motor EM-5000', qty: 200, price: 8500, status: 'IN_PRODUCTION', orderDate: '2026-06-28', reqDate: '2026-07-20' },
  { id: 'ORD-2026-102', customer: 'Mahindra & Mahindra', product: 'Gearbox GB-3000', qty: 100, price: 12000, status: 'CONFIRMED', orderDate: '2026-07-02', reqDate: '2026-07-25' },
  { id: 'ORD-2026-103', customer: 'Ashok Leyland', product: 'Pump Assembly PA-200', qty: 150, price: 6500, status: 'DISPATCHED', orderDate: '2026-06-20', reqDate: '2026-07-10' },
  { id: 'ORD-2026-104', customer: 'Bajaj Auto', product: 'Servo Motor SM-100', qty: 300, price: 4200, status: 'RECEIVED', orderDate: '2026-07-12', reqDate: '2026-08-05' },
  { id: 'ORD-2026-105', customer: 'Kirloskar Brothers', product: 'Hydraulic Cylinder HC-50', qty: 80, price: 15000, status: 'DELIVERED', orderDate: '2026-06-15', reqDate: '2026-07-05' },
  { id: 'ORD-2026-106', customer: 'L&T Heavy Engineering', product: 'Control Panel CP-800', qty: 50, price: 28000, status: 'IN_PRODUCTION', orderDate: '2026-07-01', reqDate: '2026-07-28' },
  { id: 'ORD-2026-107', customer: 'Bharat Forge', product: 'Electric Motor EM-5000', qty: 500, price: 8500, status: 'CONFIRMED', orderDate: '2026-07-10', reqDate: '2026-08-15' },
  { id: 'ORD-2026-108', customer: 'Thermax Ltd.', product: 'Pump Assembly PA-200', qty: 120, price: 6500, status: 'RECEIVED', orderDate: '2026-07-13', reqDate: '2026-08-10' },
];

const pipeline = ['RECEIVED', 'CONFIRMED', 'IN_PRODUCTION', 'DISPATCHED', 'DELIVERED'];

const badgeClasses: Record<string, string> = {
  RECEIVED: 'badge-default',
  CONFIRMED: 'badge-primary',
  IN_PRODUCTION: 'badge-warning',
  DISPATCHED: 'badge-accent',
  DELIVERED: 'badge-success',
};

const statusColors: Record<string, string> = {
  RECEIVED: '#9ca3af',
  CONFIRMED: '#3b82f6',
  IN_PRODUCTION: '#f59e0b',
  DISPATCHED: '#8b5cf6',
  DELIVERED: '#10b981',
};

export default function OrdersPage() {
  const [orders, setOrders] = useState(initialOrders);
  const [showModal, setShowModal] = useState(false);
  const [newOrder, setNewOrder] = useState({
    customer: '',
    product: '',
    qty: '',
    price: '',
    reqDate: '',
  });

  const pipelineCounts = pipeline.map(s => ({
    status: s,
    count: orders.filter(o => o.status === s).length
  }));

  const totalRevenue = orders.reduce((sum, o) => sum + o.qty * o.price, 0);
  const pendingOrders = orders.filter(o => o.status !== 'DELIVERED').length;

  const handleCreateOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOrder.customer || !newOrder.product || !newOrder.qty || !newOrder.price) return;

    const generatedId = `ORD-2026-${100 + orders.length + 1}`;
    const orderObj = {
      id: generatedId,
      customer: newOrder.customer,
      product: newOrder.product,
      qty: parseInt(newOrder.qty) || 0,
      price: parseFloat(newOrder.price) || 0,
      status: 'RECEIVED',
      orderDate: new Date().toISOString().split('T')[0],
      reqDate: newOrder.reqDate || new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    };

    setOrders([orderObj, ...orders]);
    setShowModal(false);
    setNewOrder({
      customer: '',
      product: '',
      qty: '',
      price: '',
      reqDate: '',
    });
  };

  const cycleStatus = (orderId: string, currentStatus: string) => {
    const currentIndex = pipeline.indexOf(currentStatus);
    const nextIndex = (currentIndex + 1) % pipeline.length;
    const nextStatus = pipeline[nextIndex];
    
    setOrders(orders.map(o => {
      if (o.id === orderId) {
        return { ...o, status: nextStatus };
      }
      return o;
    }));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--color-text-primary)', margin: 0 }}>Order Management</h2>
          <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', margin: '4px 0 0' }}>Customer orders, pipeline tracking, and revenue fulfillment</p>
        </div>
        <button 
          onClick={() => setShowModal(true)} 
          className="btn btn-primary"
        >
          <Plus size={16} /> Create Order
        </button>
      </div>

      {/* KPI Stats */}
      <div className="grid-4">
        <div className="stat-card">
          <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)', textTransform: 'uppercase', fontWeight: 600, marginBottom: '4px' }}>Total Orders</div>
          <div className="stat-card-value">{orders.length}</div>
        </div>
        <div className="stat-card">
          <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)', textTransform: 'uppercase', fontWeight: 600, marginBottom: '4px' }}>Total Revenue</div>
          <div className="stat-card-value" style={{ color: 'var(--color-success)' }}>₹{(totalRevenue / 10000000).toFixed(2)} Cr</div>
        </div>
        <div className="stat-card">
          <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)', textTransform: 'uppercase', fontWeight: 600, marginBottom: '4px' }}>Pending</div>
          <div className="stat-card-value" style={{ color: 'var(--color-warning)' }}>{pendingOrders}</div>
        </div>
        <div className="stat-card">
          <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)', textTransform: 'uppercase', fontWeight: 600, marginBottom: '4px' }}>On-Time Delivery</div>
          <div className="stat-card-value" style={{ color: 'var(--color-primary-light)' }}>94.5%</div>
        </div>
      </div>

      {/* Order Pipeline Stage Indicators */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Order Pipeline Stages</h3>
        </div>
        <div className="card-body">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', flexWrap: 'wrap' }}>
            {pipelineCounts.map((p, i) => (
              <div key={p.status} style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: '1 1 150px' }}>
                <div style={{ flex: 1, padding: '16px', borderRadius: '12px', background: `${statusColors[p.status]}10`, border: `1px solid ${statusColors[p.status]}30`, textAlign: 'center' }}>
                  <div style={{ fontSize: '24px', fontWeight: 700, color: statusColors[p.status] }}>{p.count}</div>
                  <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)', marginTop: '4px', textTransform: 'uppercase', fontWeight: 600 }}>{p.status.replace('_', ' ')}</div>
                </div>
                {i < pipeline.length - 1 && <ArrowRight size={16} color="var(--color-text-tertiary)" className="hidden md:block" style={{ flexShrink: 0 }} />}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Order List Table */}
      <div className="data-table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              {['Order #', 'Customer', 'Product', 'Qty', 'Unit Price', 'Total Value', 'Status (Click to Shift)', 'Order Date', 'Required Date'].map(h => (
                <th key={h}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {orders.map(o => (
              <tr key={o.id}>
                <td className="cell-mono" style={{ color: 'var(--color-primary-light)', fontWeight: 600 }}>{o.id}</td>
                <td style={{ fontWeight: 600 }}>{o.customer}</td>
                <td>{o.product}</td>
                <td>{o.qty}</td>
                <td>₹{o.price.toLocaleString()}</td>
                <td style={{ color: 'var(--color-success)', fontWeight: 600 }}>₹{(o.qty * o.price).toLocaleString()}</td>
                <td>
                  <button 
                    onClick={() => cycleStatus(o.id, o.status)}
                    className={`badge ${badgeClasses[o.status]}`}
                    style={{ border: 'none', cursor: 'pointer', outline: 'none' }}
                    title="Click to advance stage"
                  >
                    {o.status.replace('_', ' ')}
                  </button>
                </td>
                <td>{o.orderDate}</td>
                <td style={{ color: 'var(--color-text-secondary)' }}>{o.reqDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Create Order Modal */}
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
              <h3 className="card-title" style={{ fontSize: '18px' }}>Create New Customer Order</h3>
              <button 
                onClick={() => setShowModal(false)}
                style={{ background: 'none', border: 'none', color: 'var(--color-text-secondary)', cursor: 'pointer' }}
              >
                <XCircle size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateOrder} className="login-form" style={{ gap: '16px' }}>
              <div className="form-group">
                <label className="form-label form-label-required">Customer Name</label>
                <input 
                  type="text" 
                  required 
                  className="form-input" 
                  placeholder="e.g. Tata Motors Ltd."
                  value={newOrder.customer}
                  onChange={e => setNewOrder({ ...newOrder, customer: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label form-label-required">Product</label>
                <input 
                  type="text" 
                  required 
                  className="form-input" 
                  placeholder="e.g. Electric Motor EM-5000"
                  value={newOrder.product}
                  onChange={e => setNewOrder({ ...newOrder, product: e.target.value })}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label form-label-required">Quantity</label>
                  <input 
                    type="number" 
                    required 
                    className="form-input" 
                    placeholder="e.g. 100"
                    value={newOrder.qty}
                    onChange={e => setNewOrder({ ...newOrder, qty: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label form-label-required">Unit Price (₹)</label>
                  <input 
                    type="number" 
                    required 
                    className="form-input" 
                    placeholder="e.g. 8500"
                    value={newOrder.price}
                    onChange={e => setNewOrder({ ...newOrder, price: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Required Delivery Date</label>
                <input 
                  type="date" 
                  className="form-input" 
                  value={newOrder.reqDate}
                  onChange={e => setNewOrder({ ...newOrder, reqDate: e.target.value })}
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
                  Place Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
