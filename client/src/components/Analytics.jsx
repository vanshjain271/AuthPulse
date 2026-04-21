import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';

const Analytics = ({ data }) => {
  if (!data) return <p>Loading analytics...</p>;

  const domainStats = data.domainStats || {};
  const domainData = Object.entries(domainStats).map(([name, value]) => ({ name, value }));
  const COLORS = ['#1e293b', '#c2410c', '#b45309', '#64748b', '#94a3b8'];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
      <div className="human-card">
        <h3 style={{ marginBottom: '1.5rem' }}>Issuance by Domain</h3>
        <div style={{ height: '300px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={domainData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {domainData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="human-card">
        <h3 style={{ marginBottom: '1.5rem' }}>System Health</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '4px' }}>
            <p style={{ color: '#64748b', fontSize: '0.875rem' }}>Total Issued</p>
            <p style={{ fontSize: '2rem', fontWeight: 700 }}>{data.totalIssued}</p>
          </div>
          <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '4px' }}>
            <p style={{ color: '#64748b', fontSize: '0.875rem' }}>Revoked (Secured)</p>
            <p style={{ fontSize: '2rem', fontWeight: 700, color: '#ef4444' }}>{data.revokedCount}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
