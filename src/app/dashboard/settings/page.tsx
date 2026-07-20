'use client';

import { useState } from 'react';
import { Save, CheckCircle2 } from 'lucide-react';

export default function SettingsPage() {
  const [tab, setTab] = useState('general');
  const [showToast, setShowToast] = useState(false);
  const tabs = ['General', 'Security', 'Notifications', 'System'];

  const handleSave = () => {
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', position: 'relative' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--color-text-primary)', margin: 0 }}>System Settings</h2>
          <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', margin: '4px 0 0' }}>Configure platform preferences, industrial security constraints, and notification parameters</p>
        </div>
      </div>

      {/* Tabs Selector */}
      <div style={{ display: 'flex', gap: '4px', background: 'rgba(255,255,255,0.04)', borderRadius: '10px', padding: '4px', width: 'fit-content' }}>
        {tabs.map(t => (
          <button 
            key={t} 
            onClick={() => setTab(t.toLowerCase())} 
            style={{ 
              padding: '8px 20px', 
              borderRadius: '8px', 
              border: 'none', 
              background: tab === t.toLowerCase() ? 'rgba(59,130,246,0.15)' : 'transparent', 
              color: tab === t.toLowerCase() ? 'var(--color-primary-light)' : 'var(--color-text-secondary)', 
              fontSize: '14px', 
              fontWeight: 600, 
              cursor: 'pointer', 
              transition: 'all 0.2s' 
            }}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Settings Form Card */}
      <div className="card">
        {tab === 'general' && (
          <div className="login-form" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
            <div className="form-group">
              <label className="form-label">Factory Name</label>
              <input className="form-input" defaultValue="ManuVerse Smart Factory" />
            </div>
            <div className="form-group">
              <label className="form-label">Factory Code</label>
              <input className="form-input" defaultValue="MV-PUNE-001" />
            </div>
            <div className="form-group">
              <label className="form-label">Timezone</label>
              <select className="form-select">
                <option>Asia/Kolkata (IST +05:30)</option>
                <option>UTC</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Currency</label>
              <select className="form-select">
                <option>₹ INR (Indian Rupee)</option>
                <option>$ USD</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Date Format</label>
              <select className="form-select">
                <option>DD/MM/YYYY</option>
                <option>MM/DD/YYYY</option>
                <option>YYYY-MM-DD</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Fiscal Year Start</label>
              <input className="form-input" defaultValue="April" />
            </div>
            <div className="form-group">
              <label className="form-label">Default Language</label>
              <select className="form-select">
                <option>English</option>
                <option>Hindi</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Contact Email</label>
              <input className="form-input" defaultValue="admin@manuverse.com" />
            </div>
          </div>
        )}

        {tab === 'security' && (
          <div className="login-form" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
            <div className="form-group">
              <label className="form-label">Minimum Password Length</label>
              <input className="form-input" type="number" defaultValue="8" />
            </div>
            <div className="form-group">
              <label className="form-label">Password Expiry (days)</label>
              <input className="form-input" type="number" defaultValue="90" />
            </div>
            <div className="form-group">
              <label className="form-label">Session Timeout (minutes)</label>
              <input className="form-input" type="number" defaultValue="30" />
            </div>
            <div className="form-group">
              <label className="form-label">Max Login Attempts</label>
              <input className="form-input" type="number" defaultValue="5" />
            </div>
            <div className="form-group">
              <label className="form-label">Two-Factor Auth</label>
              <select className="form-select">
                <option>Disabled</option>
                <option>Enabled (TOTP)</option>
                <option>Enabled (SMS)</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">IP Whitelist</label>
              <input className="form-input" placeholder="e.g., 192.168.1.0/24" />
            </div>
          </div>
        )}

        {tab === 'notifications' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {['Machine Down Alert', 'Low Inventory Warning', 'Quality Failure Alert', 'Maintenance Due Reminder', 'Order Status Update', 'Shift Change Notification'].map(n => (
              <div key={n} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--color-divider)' }}>
                <span style={{ fontSize: '14px', color: 'var(--color-text-primary)' }}>{n}</span>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <label className="form-checkbox">
                    <input type="checkbox" defaultChecked />
                    <span>Email</span>
                  </label>
                  <label className="form-checkbox">
                    <input type="checkbox" defaultChecked />
                    <span>In-App</span>
                  </label>
                  <label className="form-checkbox">
                    <input type="checkbox" />
                    <span>SMS</span>
                  </label>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === 'system' && (
          <div className="login-form" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
            <div className="form-group">
              <label className="form-label">API Rate Limit (req/min)</label>
              <input className="form-input" type="number" defaultValue="1000" />
            </div>
            <div className="form-group">
              <label className="form-label">Data Retention (months)</label>
              <input className="form-input" type="number" defaultValue="24" />
            </div>
            <div className="form-group">
              <label className="form-label">Log Level</label>
              <select className="form-select">
                <option>INFO</option>
                <option>DEBUG</option>
                <option>WARN</option>
                <option>ERROR</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Backup Schedule</label>
              <select className="form-select">
                <option>Daily at 02:00 IST</option>
                <option>Every 6 hours</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Save Button */}
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button 
          onClick={handleSave}
          className="btn btn-primary"
          style={{ padding: '12px 24px' }}
        >
          <Save size={16} /> Save Changes
        </button>
      </div>

      {/* Animated Save Success Toast (human logic code) */}
      {showToast && (
        <div
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            background: 'var(--color-surface-alt)',
            border: '1px solid var(--color-success)',
            borderRadius: '10px',
            padding: '12px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            boxShadow: 'var(--shadow-lg)',
            zIndex: 1000,
            animation: 'login-fade-in 0.3s ease-out',
          }}
        >
          <CheckCircle2 size={18} color="var(--color-success)" />
          <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-text-primary)' }}>Settings saved successfully!</span>
        </div>
      )}

    </div>
  );
}
