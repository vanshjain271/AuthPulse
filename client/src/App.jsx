import React, { useState, useRef, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import CertificateCard from './components/CertificateCard';
import AdminDashboard from './components/AdminDashboard';
import AuthModal from './components/AuthModal';
import { useReactToPrint } from 'react-to-print';
import { Download, AlertCircle, Share2, ShieldCheck } from 'lucide-react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

function App() {
  const [certificate, setCertificate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [branding, setBranding] = useState(null);
  const [templates, setTemplates] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('authpulse_token'));
  const certificateRef = useRef();

  // For MVP, public pages shouldn't really fetch protected branding/templates directly without an org ID.
  // But we'll leave it as a no-op if they fail to prevent crashing the public search page.
  useEffect(() => {
    // Check auth status on mount
    setIsAuthenticated(!!localStorage.getItem('authpulse_token'));
  }, []);

  const handleAdminClick = () => {
    if (isAuthenticated) {
      setIsAdminOpen(true);
    } else {
      setIsAuthOpen(true);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authpulse_token');
    localStorage.removeItem('authpulse_org_id');
    setIsAuthenticated(false);
    setIsAdminOpen(false);
  };

  const handlePrint = useReactToPrint({
    content: () => certificateRef.current,
    documentTitle: `Credential_${certificate?.certificateId}`,
  });

  const handleSearch = async (id) => {
    setLoading(true);
    setError(null);
    setCertificate(null);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000';
      const res = await axios.get(`${apiUrl}/api/certificates/${id}`);
      setCertificate(res.data);
      
      // Apply Organization Branding dynamically
      if (res.data.organizationId) {
        setBranding({ 
          logo: res.data.organizationId.logo, 
          colors: { primary: res.data.organizationId.brandColor || '#b45309' } 
        });
      }
    } catch (err) {
      setError('Credential not found. Please verify the secure ID.');
    } finally {
      setLoading(false);
    }
  };

  const shareToLinkedIn = () => {
    const certUrl = `${window.location.origin}/verify/${certificate.certificateId}`;
    const orgName = certificate.organizationId?.name || 'AuthPulse';
    let url = `https://www.linkedin.com/profile/add?startTask=CERTIFICATION_NAME&name=${encodeURIComponent(certificate.internshipDomain)}&organizationName=${encodeURIComponent(orgName)}&issueYear=${new Date(certificate.issuedAt).getFullYear()}&issueMonth=${new Date(certificate.issuedAt).getMonth() + 1}&certId=${certificate.certificateId}&certUrl=${encodeURIComponent(certUrl)}`;
    
    if (certificate.expiresAt) {
      const expDate = new Date(certificate.expiresAt);
      url += `&expirationYear=${expDate.getFullYear()}&expirationMonth=${expDate.getMonth() + 1}`;
    }
    
    window.open(url, '_blank');
  };

  return (
    <div className="App">
      <Navbar onAdminClick={handleAdminClick} isAuthenticated={isAuthenticated} onLogout={handleLogout} />
      
      <main className="premium-container">
        <Hero onSearch={handleSearch} loading={loading} />

        <div style={{ paddingBottom: '6rem' }}>
          <AnimatePresence>
            {error && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{
                textAlign: 'center', color: '#c2410c', padding: '2rem', background: '#fff7ed', borderRadius: '8px', border: '1px solid #ffedd5'
              }}>
                <AlertCircle size={24} style={{ marginBottom: '0.5rem' }} />
                <p className="serif" style={{ fontSize: '1.2rem' }}>{error}</p>
              </motion.div>
            )}

            {certificate && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                {certificate.status === 'REVOKED' && (
                  <div style={{ background: '#fef2f2', color: '#dc2626', padding: '1rem', borderRadius: '8px', marginBottom: '2rem', textAlign: 'center', border: '1px solid #fee2e2' }}>
                    <ShieldCheck inline="true" /> This credential has been officially revoked by the issuing authority.
                  </div>
                )}

                <div className="no-print" style={{ 
                  display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '3rem' 
                }}>
                  <button onClick={handlePrint} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: branding?.colors?.primary || 'var(--primary)' }}>
                    <Download size={20} /> Export High-Res PDF
                  </button>
                  <button onClick={shareToLinkedIn} className="btn-primary" style={{ background: '#0077b5', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <Share2 size={20} /> Add to LinkedIn
                  </button>
                </div>
                
                <CertificateCard 
                  ref={certificateRef} 
                  data={certificate} 
                  branding={branding} 
                  template={templates.find(t => t.id === certificate.templateId) || templates[0]} 
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <footer className="no-print" style={{
        padding: '6rem 0', background: '#f8fafc', borderTop: '1px solid #e2e8f0', textAlign: 'center'
      }}>
        <div className="premium-container">
          <h3 className="serif" style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>AuthPulse Ecosystem</h3>
          <p style={{ color: '#64748b', fontSize: '0.9rem', maxWidth: '500px', margin: '0 auto' }}>
            A trusted platform for verification and issuance of academic and professional credentials.
            Secured by cryptographic hashing.
          </p>
        </div>
      </footer>

      {isAuthOpen && (
        <AuthModal 
          onClose={() => setIsAuthOpen(false)} 
          onLoginSuccess={() => {
            setIsAuthOpen(false);
            setIsAuthenticated(true);
            setIsAdminOpen(true);
          }} 
        />
      )}
      
      {isAdminOpen && <AdminDashboard onClose={() => setIsAdminOpen(false)} />}
    </div>
  );
}

export default App;
