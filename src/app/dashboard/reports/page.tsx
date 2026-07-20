'use client';

import { useState } from 'react';
import { Download, FileText, XCircle, Loader2, CheckCircle2 } from 'lucide-react';

const reportsList = [
  { name: 'Daily Production Report', desc: 'Production output, targets, and variance analysis', freq: 'Daily', icon: '📊' },
  { name: 'OEE Report', desc: 'Overall Equipment Effectiveness with breakdown by machine', freq: 'Weekly', icon: '⚙️' },
  { name: 'Inventory Valuation', desc: 'Stock value by category, ABC analysis, and aging', freq: 'Monthly', icon: '📦' },
  { name: 'Quality Analysis', desc: 'Inspection results, defect trends, and NCR summary', freq: 'Weekly', icon: '✅' },
  { name: 'Maintenance Cost Report', desc: 'Maintenance expenditure, MTTR, MTBF by machine', freq: 'Monthly', icon: '🔧' },
  { name: 'Supplier Performance', desc: 'Vendor ratings, delivery compliance, and quality scores', freq: 'Quarterly', icon: '🏢' },
  { name: 'Employee Productivity', desc: 'Attendance, shift output, and skill utilization', freq: 'Monthly', icon: '👥' },
  { name: 'Downtime Pareto', desc: 'Top downtime causes ranked by impact (minutes)', freq: 'Weekly', icon: '⏱️' },
  { name: 'Revenue Summary', desc: 'Sales revenue by product, customer, and region', freq: 'Monthly', icon: '💰' },
  { name: 'Dispatch Report', desc: 'Shipment status, on-time delivery, and logistics KPIs', freq: 'Daily', icon: '🚚' },
];

const badgeClasses: Record<string, string> = {
  Daily: 'badge-primary',
  Weekly: 'badge-warning',
  Monthly: 'badge-success',
  Quarterly: 'badge-accent',
};

export default function ReportsPage() {
  const [activeReport, setActiveReport] = useState<typeof reportsList[0] | null>(null);
  const [generating, setGenerating] = useState(false);
  const [generatedDoc, setGeneratedDoc] = useState<boolean>(false);
  const [exportFormat, setExportFormat] = useState<string>('PDF');

  const handleGenerate = (report: typeof reportsList[0], format: string) => {
    setActiveReport(report);
    setExportFormat(format);
    setGenerating(true);
    setGeneratedDoc(false);

    // Simulate server side document compilation (human logic code)
    setTimeout(() => {
      setGenerating(false);
      setGeneratedDoc(true);
    }, 2000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--color-text-primary)', margin: 0 }}>Reports Engine</h2>
          <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', margin: '4px 0 0' }}>Compile, analyze, and export factory metrics and logs in multiple formats</p>
        </div>
      </div>

      {/* Reports Grid */}
      <div className="grid-cards" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))' }}>
        {reportsList.map(r => (
          <div key={r.name} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '16px' }}>
                <span style={{ fontSize: '28px' }}>{r.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: '4px' }}>{r.name}</div>
                  <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>{r.desc}</div>
                </div>
                <span className={`badge ${badgeClasses[r.freq]}`}>{r.freq}</span>
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
              <button 
                onClick={() => handleGenerate(r, 'PDF')}
                className="btn btn-primary btn-sm" 
                style={{ flex: 1 }}
              >
                <Download size={13} /> Compile
              </button>
              <button 
                onClick={() => handleGenerate(r, 'PDF')} 
                className="btn btn-secondary btn-sm"
                style={{ fontSize: '11px', color: 'var(--color-danger)' }}
              >
                PDF
              </button>
              <button 
                onClick={() => handleGenerate(r, 'EXCEL')} 
                className="btn btn-secondary btn-sm"
                style={{ fontSize: '11px', color: 'var(--color-success)' }}
              >
                XLS
              </button>
              <button 
                onClick={() => handleGenerate(r, 'CSV')} 
                className="btn btn-secondary btn-sm"
                style={{ fontSize: '11px', color: 'var(--color-primary-light)' }}
              >
                CSV
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Generation Status Modal */}
      {activeReport && (
        <div
          onClick={() => { if (!generating) setActiveReport(null); }}
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
              textAlign: 'center',
            }}
          >
            {generating ? (
              <div style={{ padding: '20px 0' }}>
                <Loader2 size={36} className="animate-spin" style={{ color: 'var(--color-primary)', margin: '0 auto 16px' }} />
                <h3 className="card-title" style={{ fontSize: '16px', marginBottom: '8px' }}>Compiling Report...</h3>
                <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>Retrieving telemetry database and aggregating data blocks for {activeReport.name}.</p>
              </div>
            ) : generatedDoc ? (
              <div style={{ padding: '10px 0' }}>
                <CheckCircle2 size={40} color="var(--color-success)" style={{ margin: '0 auto 16px' }} />
                <h3 className="card-title" style={{ fontSize: '18px', marginBottom: '8px' }}>Report Compiled!</h3>
                <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', marginBottom: '20px' }}>
                  The <strong>{activeReport.name}</strong> was successfully compiled in <strong>{exportFormat}</strong> format.
                </p>

                <div style={{ display: 'flex', gap: '12px' }}>
                  <button 
                    onClick={() => setActiveReport(null)}
                    className="btn btn-secondary" 
                    style={{ flex: 1 }}
                  >
                    Close
                  </button>
                  <a 
                    href="#" 
                    onClick={(e) => { e.preventDefault(); alert(`Downloading ${activeReport.name}.${exportFormat.toLowerCase()}`); setActiveReport(null); }}
                    className="btn btn-primary" 
                    style={{ flex: 1, textDecoration: 'none' }}
                  >
                    Download File
                  </a>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}

    </div>
  );
}
