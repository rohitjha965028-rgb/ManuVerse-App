'use client';

import { useState } from 'react';
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const revenueData7d = [{ m: 'Mon', rev: 12, target: 15 },{ m: 'Tue', rev: 15, target: 15 },{ m: 'Wed', rev: 14, target: 15 },{ m: 'Thu', rev: 18, target: 15 },{ m: 'Fri', rev: 22, target: 18 },{ m: 'Sat', rev: 16, target: 18 },{ m: 'Sun', rev: 20, target: 18 }];
const revenueData30d = [{ m: 'Week 1', rev: 62, target: 70 },{ m: 'Week 2', rev: 71, target: 70 },{ m: 'Week 3', rev: 68, target: 75 },{ m: 'Week 4', rev: 79, target: 75 }];
const revenueDataYear = [{ m: 'Feb', rev: 262, target: 270 },{ m: 'Mar', rev: 271, target: 270 },{ m: 'Apr', rev: 268, target: 275 },{ m: 'May', rev: 279, target: 275 },{ m: 'Jun', rev: 282, target: 280 },{ m: 'Jul', rev: 288, target: 285 }];

const production = [{ d:'Mon',planned:2200,actual:2050 },{ d:'Tue',planned:2200,actual:2140 },{ d:'Wed',planned:2200,actual:1890 },{ d:'Thu',planned:2200,actual:2180 },{ d:'Fri',planned:2200,actual:2100 },{ d:'Sat',planned:1500,actual:1420 },{ d:'Sun',planned:1500,actual:1350 }];
const invCat = [{ name:'Raw Materials',value:42,color:'#3b82f6' },{ name:'WIP',value:28,color:'#8b5cf6' },{ name:'Finished Goods',value:18,color:'#10b981' },{ name:'Consumables',value:12,color:'#f59e0b' }];
const machineUtil = [{ name:'CNC Mill #1',util:91 },{ name:'CNC Mill #2',util:87 },{ name:'Lathe #2',util:94 },{ name:'Press #2',util:82 },{ name:'Welder #1',util:89 },{ name:'Grinder #1',util:78 },{ name:'Assembly #1',util:96 },{ name:'Packaging',util:72 }];
const tooltipStyle = { background: 'var(--color-surface-alt)', border: 'var(--glass-border)', borderRadius: '8px', color: 'var(--color-text-primary)' };

export default function AnalyticsPage() {
  const [range, setRange] = useState<'7d' | '30d' | '1y'>('30d');

  const activeRevenueData = range === '7d' 
    ? revenueData7d 
    : range === '30d' 
    ? revenueData30d 
    : revenueDataYear;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--color-text-primary)', margin: 0 }}>Analytics & Insights</h2>
          <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', margin: '4px 0 0' }}>Data-driven insights across production output, quality yield, and plant operations</p>
        </div>

        {/* Date filter selector */}
        <div style={{ display: 'flex', background: 'rgba(255,255,255,0.04)', borderRadius: '10px', padding: '4px' }}>
          {([
            { key: '7d', label: 'Last 7 Days' },
            { key: '30d', label: 'Last 30 Days' },
            { key: '1y', label: 'This Year' }
          ] as const).map(r => (
            <button 
              key={r.key} 
              onClick={() => setRange(r.key)} 
              style={{ 
                padding: '6px 14px', 
                borderRadius: '8px', 
                border: 'none', 
                background: range === r.key ? 'rgba(59,130,246,0.15)' : 'transparent', 
                color: range === r.key ? 'var(--color-primary-light)' : 'var(--color-text-secondary)', 
                fontSize: '13px', 
                fontWeight: 600, 
                cursor: 'pointer', 
                transition: 'all 0.2s' 
              }}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid-2" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))' }}>
        {/* Revenue trend */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Revenue Trend (₹ Lakhs)</h3>
          </div>
          <div className="card-body">
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={activeRevenueData}>
                <defs>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)"/>
                <XAxis dataKey="m" tick={{ fill:'var(--color-text-secondary)', fontSize:12 }} axisLine={{ stroke:'var(--color-divider)' }}/>
                <YAxis tick={{ fill:'var(--color-text-secondary)', fontSize:12 }} axisLine={{ stroke:'var(--color-divider)' }}/>
                <Tooltip contentStyle={tooltipStyle}/>
                <Area type="monotone" dataKey="rev" stroke="var(--color-primary)" fill="url(#revGrad)" strokeWidth={2} name="Revenue"/>
                <Line type="monotone" dataKey="target" stroke="var(--color-danger)" strokeDasharray="5 5" dot={false} name="Target"/>
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Production efficiency */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Production Efficiency</h3>
          </div>
          <div className="card-body">
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={production} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)"/>
                <XAxis dataKey="d" tick={{ fill:'var(--color-text-secondary)', fontSize:12 }} axisLine={{ stroke:'var(--color-divider)' }}/>
                <YAxis tick={{ fill:'var(--color-text-secondary)', fontSize:12 }} axisLine={{ stroke:'var(--color-divider)' }}/>
                <Tooltip contentStyle={tooltipStyle}/>
                <Bar dataKey="planned" fill="rgba(255,255,255,0.1)" radius={[4,4,0,0]} name="Planned"/>
                <Bar dataKey="actual" fill="var(--color-success)" radius={[4,4,0,0]} name="Actual"/>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Inventory distribution */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Inventory Distribution</h3>
          </div>
          <div className="card-body">
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={invCat} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={4} dataKey="value">
                  {invCat.map((e,i) => <Cell key={i} fill={e.color} stroke="none"/>)}
                </Pie>
                <Tooltip contentStyle={tooltipStyle}/>
              </PieChart>
            </ResponsiveContainer>
            <div style={{ display:'flex', flexWrap:'wrap', gap:'12px', justifyContent:'center', marginTop:'8px' }}>
              {invCat.map((c,i) => (
                <span key={i} style={{ display:'flex', alignItems:'center', gap:'6px', fontSize:'12px', color:'var(--color-text-secondary)' }}>
                  <span style={{ width:'8px', height:'8px', borderRadius:'50%', background:c.color }}/>{c.name} ({c.value}%)
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Machine utilization */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Machine Utilization (%)</h3>
          </div>
          <div className="card-body">
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={machineUtil} layout="vertical" barSize={18}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)"/>
                <XAxis type="number" domain={[0,100]} tick={{ fill:'var(--color-text-secondary)', fontSize:12 }} axisLine={{ stroke:'var(--color-divider)' }}/>
                <YAxis type="category" dataKey="name" tick={{ fill:'var(--color-text-secondary)', fontSize:11 }} width={110} axisLine={{ stroke:'var(--color-divider)' }}/>
                <Tooltip contentStyle={tooltipStyle}/>
                <Bar dataKey="util" radius={[0,4,4,0]}>
                  {machineUtil.map((e,i) => (
                    <Cell key={i} fill={e.util >= 90 ? 'var(--color-success)' : e.util >= 80 ? 'var(--color-primary)' : 'var(--color-warning)'}/>
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

    </div>
  );
}
