import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Upload, History, Settings, X, Search, ShieldAlert, CheckCircle2, Download, AlertCircle, Trash2, Palette, Wand2 } from 'lucide-react';
import Analytics from './Analytics';
import TemplateDesigner from './TemplateDesigner';
import axios from 'axios';

const AdminDashboard = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isDesignerOpen, setIsDesignerOpen] = useState(false);
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [branding, setBranding] = useState({ logo: '', brandColor: '#0f172a' });
  const [certs, setCerts] = useState([]);
  const [logs, setLogs] = useState([]);
  const [file, setFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [filter, setFilter] = useState('All');

  const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000';
  const API_BASE = `${API_URL}/api/admin`;

  const getAuthHeaders = () => {
    const token = localStorage.getItem('authpulse_token');
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const { data: stats } = await axios.get(`${API_BASE}/analytics`, getAuthHeaders());
      const { data: tmpls } = await axios.get(`${API_BASE}/templates`, getAuthHeaders());
      const { data: brand } = await axios.get(`${API_BASE}/branding`, getAuthHeaders());
      setAnalytics(stats);
      setBranding(brand || { logo: '', brandColor: '#0f172a' });
      setLogs(stats.recentLogs || []);
      setCerts(stats.allCertificates || []);
      setTemplates(tmpls || []);
      if (tmpls && tmpls.length > 0) setSelectedTemplate(tmpls[0]);
    } catch (err) {
      console.error('Failed to fetch AuthPulse ecosystem data', err);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    if (selectedTemplate) {
      formData.append('templateId', selectedTemplate._id); // ensure _id is used
    }
    
    try {
      await axios.post(`${API_URL}/api/certificates/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('authpulse_token')}`
        }
      });
      setUploadStatus({ type: 'success', message: 'Certificates synced with template!' });
      fetchData();
      setFile(null);
    } catch (err) {
      setUploadStatus({ type: 'error', message: 'Upload failed' });
    }
  };

  const handleRevoke = async (id, currentStatus) => {
    try {
      await axios.post(`${API_BASE}/revoke/${id}`, { revoked: !currentStatus }, getAuthHeaders());
      fetchData();
    } catch (err) {
      alert('Revocation failed');
    }
  };

  const handleExport = async () => {
    try {
      // Must use axios with blob response to send headers
      const res = await axios.get(`${API_BASE}/export-zip`, {
        ...getAuthHeaders(),
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `CertVerify_Export_${Date.now()}.zip`);
      document.body.appendChild(link);
      link.click();
    } catch (err) {
      alert('Export failed');
    }
  };

  const handleLogoUpload = async (e) => {
    const logoFile = e.target.files[0];
    if (!logoFile) return;
    const formData = new FormData();
    formData.append('logo', logoFile);
    try {
      await axios.post(`${API_BASE}/upload-logo`, formData, getAuthHeaders());
      fetchData();
    } catch (err) {
      alert('Logo upload failed');
    }
  };

  const saveBrandingColor = async (color) => {
    try {
      await axios.post(`${API_BASE}/branding`, { brandColor: color, logo: branding.logo }, getAuthHeaders());
      fetchData();
    } catch (err) {
      alert('Failed to save brand color');
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

        <nav className="tab-nav" style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid #e2e8f0' }}>
          <button onClick={() => setActiveTab('overview')} className={`tab-link ${activeTab === 'overview' ? 'active' : ''}`} style={{ padding: '1rem', border: 'none', background: 'none', cursor: 'pointer', borderBottom: activeTab === 'overview' ? '2px solid var(--accent)' : 'none' }}>
            Overview
          </button>
          <button onClick={() => setActiveTab('issue')} className={`tab-link ${activeTab === 'issue' ? 'active' : ''}`} style={{ padding: '1rem', border: 'none', background: 'none', cursor: 'pointer', borderBottom: activeTab === 'issue' ? '2px solid var(--accent)' : 'none' }}>
            Issue Multi
          </button>
          <button onClick={() => setActiveTab('design')} className={`tab-link ${activeTab === 'design' ? 'active' : ''}`} style={{ padding: '1rem', border: 'none', background: 'none', cursor: 'pointer', borderBottom: activeTab === 'design' ? '2px solid var(--accent)' : 'none' }}>
            Design Hub
          </button>
          <button onClick={() => setActiveTab('records')} className={`tab-link ${activeTab === 'records' ? 'active' : ''}`} style={{ padding: '1rem', border: 'none', background: 'none', cursor: 'pointer', borderBottom: activeTab === 'records' ? '2px solid var(--accent)' : 'none' }}>
            Audit & Records
          </button>
          <button onClick={() => setActiveTab('settings')} className={`tab-link ${activeTab === 'settings' ? 'active' : ''}`} style={{ padding: '1rem', border: 'none', background: 'none', cursor: 'pointer', borderBottom: activeTab === 'settings' ? '2px solid var(--accent)' : 'none' }}>
            Branding
          </button>
        </nav>

        <div className="tab-content">
          {isDesignerOpen && (
            <TemplateDesigner 
              onSave={() => { setIsDesignerOpen(false); fetchData(); }} 
              onClose={() => setIsDesignerOpen(false)} 
            />
          )}

          {activeTab === 'overview' && analytics && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1.5rem' }}>
                <button onClick={handleExport} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Download size={18} /> Export All (ZIP)
                </button>
              </div>
              <Analytics data={analytics} />
            </div>
          )}
          
          {activeTab === 'issue' && (
            <div className="human-card" style={{ maxWidth: '600px', margin: '0 auto' }}>
              <h2 className="serif" style={{ marginBottom: '2rem' }}>Bulk Issuance</h2>
              <p style={{ color: '#64748b', marginBottom: '2rem' }}>Upload your validated student dataset to generate credentials instantly.</p>
              <input 
                type="file" 
                accept=".csv, .xlsx, .xls"
                onChange={(e) => setFile(e.target.files[0])} 
              />
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

          {activeTab === 'design' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                  <h2 className="serif">Design Hub</h2>
                  <p style={{ color: '#64748b' }}>Explore {templates.length} professional templates across the ecosystem.</p>
                </div>
                <button onClick={() => setIsDesignerOpen(true)} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Wand2 size={18} /> Launch Visual Constructor
                </button>
              </div>

              {/* Canva Bridge Helper */}
              <div style={{ 
                background: 'linear-gradient(135deg, #7d2ae8 0%, #00c4cc 100%)', 
                borderRadius: '16px', padding: '2rem', marginBottom: '3rem', color: 'white',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                boxShadow: '0 10px 30px rgba(125, 42, 232, 0.2)'
              }}>
                <div style={{ maxWidth: '600px' }}>
                  <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>The Canva Bridge</h3>
                  <p style={{ opacity: 0.9 }}>Design your background in Canva, export as PNG, and import it here. Drag variables on top for a full enterprise-grade automated ecosystem.</p>
                </div>
                <button 
                  onClick={() => window.open('https://www.canva.com', '_blank')}
                  style={{ background: 'white', color: '#7d2ae8', border: 'none', padding: '1rem 2rem', borderRadius: '8px', fontWeight: 700, cursor: 'pointer' }}
                >
                  Open Canva
                </button>
              </div>

              {/* Category Filter */}
              <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '2rem', overflowX: 'auto', paddingBottom: '1rem' }}>
                {['All', 'Academic', 'Corporate', 'Minimal', 'Creative'].map(cat => (
                  <button 
                    key={cat}
                    onClick={() => setFilter(cat)}
                    style={{
                      padding: '0.6rem 1.2rem', borderRadius: '99px', border: '1px solid #e2e8f0',
                      background: filter === cat ? 'var(--primary)' : 'white',
                      color: filter === cat ? 'white' : '#64748b',
                      fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap'
                    }}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
                {templates.filter(t => filter === 'All' || t.category === filter).map(tmpl => (
                  <div key={tmpl.id} className="human-card hover-lift" style={{ 
                    padding: 0, overflow: 'hidden', border: selectedTemplate?.id === tmpl.id ? '2px solid var(--accent)' : '1px solid #e2e8f0',
                    position: 'relative'
                  }}>
                    <div style={{ 
                      height: '200px', backgroundImage: `url(${tmpl.background})`, 
                      backgroundSize: 'cover', backgroundPosition: 'center',
                      position: 'relative'
                    }}>
                      <div style={{ position: 'absolute', top: '10px', right: '10px', display: 'flex', gap: '0.5rem' }}>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            if(confirm('Archive this template from ecosystem?')) {
                              axios.delete(`${API_BASE}/templates/${tmpl.id}`).then(() => fetchData());
                            }
                          }}
                          style={{ background: 'rgba(255,255,255,0.9)', border: 'none', padding: '0.4rem', borderRadius: '6px', color: '#ef4444', cursor: 'pointer' }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                    <div style={{ padding: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <span className="serif" style={{ fontWeight: 600, display: 'block' }}>{tmpl.name}</span>
                        <span style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase' }}>{tmpl.category}</span>
                      </div>
                      <button onClick={() => setSelectedTemplate(tmpl)} className="btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>
                        {selectedTemplate?.id === tmpl.id ? 'Active' : 'Select'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'records' && (
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
                          <td>
                             <span style={{ padding: '0.25rem 0.75rem', borderRadius: '99px', fontSize: '0.75rem', background: c.revoked ? '#fef2f2' : '#f0f9ff', color: c.revoked ? '#dc2626' : '#0369a1' }}>
                              {c.revoked ? 'Revoked' : 'Active'}
                            </span>
                          </td>
                          <td style={{ display: 'flex', gap: '0.5rem', padding: '1rem' }}>
                            <button 
                              onClick={() => {
                                const msg = `Hello ${c.studentName}, your official AuthPulse credential is ready! View it here: ${window.location.origin}/verify/${c.certificateId}`;
                                window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank');
                              }}
                              className="btn-secondary" style={{ padding: '0.4rem', color: '#25d366' }} title="WhatsApp"
                            >
                              WA
                            </button>
                            <button onClick={() => handleRevoke(c.certificateId, c.revoked)} className="btn-secondary" style={{ padding: '0.4rem', color: c.revoked ? '#10b981' : '#ef4444' }}>
                              <ShieldAlert size={18} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="human-card">
                <h2 className="serif" style={{ marginBottom: '2rem' }}>Audit Logs</h2>
                {logs.map((log, i) => (
                  <div key={i} style={{ padding: '1rem 0', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between' }}>
                    <div>
                      <strong>[{log.action}]</strong>
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
              <h2 className="serif" style={{ marginBottom: '2rem' }}>Branding & Identity</h2>
              
              <div style={{ marginBottom: '2rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Organization Logo</label>
                {branding.logo && (
                  <div style={{ marginBottom: '1rem', padding: '1rem', border: '1px solid #e2e8f0', borderRadius: '8px', display: 'inline-block' }}>
                    <img src={branding.logo} alt="Organization Logo" style={{ maxHeight: '80px' }} />
                  </div>
                )}
                <label style={{ cursor: 'pointer', display: 'block' }}>
                  <input type="file" onChange={handleLogoUpload} style={{ display: 'none' }} accept="image/*" />
                  <div style={{ padding: '2rem', border: '2px dashed #e2e8f0', borderRadius: '8px', textAlign: 'center', background: '#f8fafc', transition: 'all 0.2s', ':hover': { borderColor: 'var(--accent)' } }}>
                    <Upload size={24} style={{ color: '#94a3b8', marginBottom: '0.5rem' }} />
                    <p style={{ margin: 0, color: '#64748b' }}>Upload New Logo (PNG/JPG)</p>
                  </div>
                </label>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Primary Brand Color</label>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <input 
                    type="color" 
                    value={branding.colors?.primary || branding.brandColor || '#0f172a'} 
                    onChange={(e) => setBranding({ ...branding, brandColor: e.target.value })}
                    onBlur={(e) => saveBrandingColor(e.target.value)}
                    style={{ width: '50px', height: '50px', padding: '0', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
                  />
                  <span style={{ fontFamily: 'monospace', color: '#64748b' }}>{branding.colors?.primary || branding.brandColor || '#0f172a'}</span>
                </div>
                <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '0.5rem' }}>Used for buttons and accents on your students' verification pages.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
