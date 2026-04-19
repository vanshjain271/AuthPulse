import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Upload, History, Settings, X, Search, ShieldAlert, CheckCircle2, Download, AlertCircle, Trash2 } from 'lucide-react';
import Analytics from './Analytics';
import axios from 'axios';

const AdminDashboard = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [analytics, setAnalytics] = useState(null);
  const [certs, setCerts] = useState([]);
  const [logs, setLogs] = useState([]);
  const [file, setFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState(null);

  const API_BASE = 'http://127.0.0.1:5000/api/admin';

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const { data: stats } = await axios.get(`${API_BASE}/analytics`);
      setAnalytics(stats);
      setLogs(stats.recentLogs);
      setCerts(stats.allCertificates || []);
    } catch (err) {
      console.error('Failed to fetch admin data');
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    try {
      await axios.post('http://127.0.0.1:5000/api/certificates/upload', formData);
      setUploadStatus({ type: 'success', message: 'Certificates synced successfully' });
      fetchData();
      setFile(null);
    } catch (err) {
      setUploadStatus({ type: 'error', message: 'Upload failed' });
    }
  };

  const handleRevoke = async (id, currentStatus) => {
    try {
      await axios.post(`${API_BASE}/revoke/${id}`, { revoked: !currentStatus });
      fetchData();
    } catch (err) {
      alert('Revocation failed');
    }
  };

  const handleExport = () => {
    window.open(`${API_BASE}/export-zip`, '_blank');
  };

  const handleLogoUpload = async (e) => {
    const logoFile = e.target.files[0];
    if (!logoFile) return;

    const formData = new FormData();
    formData.append('logo', logoFile);

    try {
      await axios.post(`${API_BASE}/upload-logo`, formData);
      alert('Logo updated successfully!');
      fetchData();
    } catch (err) {
      alert('Logo upload failed');
    }
  };

  return (
    <div className="no-print" style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(255, 255, 255, 0.98)', zIndex: 2000,
      padding: '2rem', overflowY: 'auto'
    }}>
      <div className="premium-container">
        <header style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3rem' }}>
          <div>
            <h1 className="serif" style={{ fontSize: '2.5rem' }}>Management Console</h1>
            <p style={{ color: '#64748b' }}>Configure your enterprise certificate ecosystem</p>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
            <X size={32} />
          </button>
        </header>

        <nav className="tab-nav">
          <button onClick={() => setActiveTab('overview')} className={`tab-link ${activeTab === 'overview' ? 'active' : ''}`}>
            <LayoutDashboard size={18} inline="true" /> Overview
          </button>
          <button onClick={() => setActiveTab('upload')} className={`tab-link ${activeTab === 'upload' ? 'active' : ''}`}>
            <Upload size={18} inline="true" /> Issue Multi
          </button>
          <button onClick={() => setActiveTab('history')} className={`tab-link ${activeTab === 'history' ? 'active' : ''}`}>
            <History size={18} inline="true" /> Audit & Records
          </button>
          <button onClick={() => setActiveTab('settings')} className={`tab-link ${activeTab === 'settings' ? 'active' : ''}`}>
            <Settings size={18} inline="true" /> Branding
          </button>
        </nav>

        <div className="tab-content">
          {activeTab === 'overview' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1.5rem' }}>
                <button onClick={handleExport} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Download size={18} /> Export All (ZIP)
                </button>
              </div>
              <Analytics data={analytics} />
            </div>
          )}
          
          {activeTab === 'upload' && (
            <div className="human-card" style={{ maxWidth: '600px', margin: '0 auto' }}>
              <h2 className="serif" style={{ marginBottom: '2rem' }}>Bulk Issuance</h2>
              <p style={{ color: '#64748b', marginBottom: '2rem' }}>Upload your validated student dataset to generate unforgeable credentials instantly.</p>
              <input type="file" onChange={(e) => setFile(e.target.files[0])} />
              <button onClick={handleUpload} className="btn-primary" style={{ width: '100%', marginTop: '1.5rem' }}>
                Process Spreadsheet
              </button>
              {uploadStatus && (
                <div style={{ marginTop: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: uploadStatus.type === 'success' ? '#10b981' : '#ef4444' }}>
                  {uploadStatus.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                  {uploadStatus.message}
                </div>
              )}
            </div>
          )}

          {activeTab === 'history' && (
            <div>
              <div className="human-card" style={{ marginBottom: '2rem' }}>
                <h2 className="serif" style={{ marginBottom: '2rem' }}>Credential Registry</h2>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ textAlign: 'left', borderBottom: '2px solid #f1f5f9' }}>
                        <th style={{ padding: '1rem', color: '#64748b' }}>Certificate ID</th>
                        <th style={{ padding: '1rem', color: '#64748b' }}>Student Name</th>
                        <th style={{ padding: '1rem', color: '#64748b' }}>Status</th>
                        <th style={{ padding: '1rem', color: '#64748b' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {certs.map((c, i) => (
                        <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                          <td style={{ padding: '1rem', fontWeight: 600 }}>{c.certificateId}</td>
                          <td style={{ padding: '1rem' }}>{c.studentName}</td>
                          <td style={{ padding: '1rem' }}>
                            <span style={{ 
                              padding: '0.25rem 0.75rem', borderRadius: '99px', fontSize: '0.75rem',
                              background: c.revoked ? '#fef2f2' : '#f0f9ff',
                              color: c.revoked ? '#dc2626' : '#0369a1'
                            }}>
                              {c.revoked ? 'Revoked' : 'Active'}
                            </span>
                          </td>
                          <td style={{ padding: '1rem' }}>
                            <button 
                              onClick={() => handleRevoke(c.certificateId, c.revoked)}
                              style={{ 
                                background: 'none', border: '1px solid #e2e8f0', padding: '0.4rem 0.8rem', 
                                borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem' 
                              }}
                            >
                              <ShieldAlert size={14} color={c.revoked ? '#10b981' : '#ef4444'} />
                              {c.revoked ? 'Restore' : 'Revoke'}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="human-card">
                <h2 className="serif" style={{ marginBottom: '2rem' }}>Recent Audit Logs</h2>
                {logs.map((log, i) => (
                  <div key={i} style={{ padding: '1rem 0', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between' }}>
                    <div>
                      <strong style={{ fontSize: '0.9rem', color: '#1e293b' }}>[{log.action}]</strong>
                      <span style={{ marginLeft: '1rem' }}>{log.description}</span>
                    </div>
                    <small style={{ color: '#94a3b8' }}>{new Date(log.timestamp).toLocaleString()}</small>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="human-card" style={{ maxWidth: '600px' }}>
              <h2 className="serif" style={{ marginBottom: '2rem' }}>Organization Profile</h2>
              <p style={{ color: '#64748b' }}>Configure the appearance and signature authority for your official credentials.</p>
              
              <label style={{ cursor: 'pointer' }}>
                <input type="file" onChange={handleLogoUpload} style={{ display: 'none' }} accept="image/*" />
                <div style={{ marginTop: '2rem', padding: '4rem', border: '1px dashed #e2e8f0', borderRadius: '8px', textAlign: 'center', background: '#f8fafc' }}>
                  <Upload size={32} style={{ color: '#94a3b8', marginBottom: '1rem' }} />
                  <p style={{ fontSize: '0.875rem' }}>Click to Upload Organization Seal (PNG/JPG)</p>
                </div>
              </label>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
