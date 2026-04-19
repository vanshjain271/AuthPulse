import React, { useState, useRef } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import CertificateCard from './components/CertificateCard';
import AdminDashboard from './components/AdminDashboard';
import { useReactToPrint } from 'react-to-print';
import { Download, AlertCircle, Share2, ShieldCheck, Mail } from 'lucide-react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

function App() {
  const [certificate, setCertificate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [branding, setBranding] = useState(null);
  const certificateRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => certificateRef.current,
    documentTitle: `Credential_${certificate?.certificateId}`,
  });

  const handleSearch = async (id) => {
    setLoading(true);
    setError(null);
    setCertificate(null);
    try {
      const res = await axios.get(`http://127.0.0.1:5000/api/certificates/${id}`);
      setCertificate(res.data);
    } catch (err) {
      setError('Credential not found. Please verify the secure ID.');
    } finally {
      setLoading(false);
    }
  };

  const shareToLinkedIn = () => {
    const url = `https://www.linkedin.com/profile/add?startTask=CERTIFICATION_NAME&name=${encodeURIComponent(certificate.internshipDomain)}&organizationName=CertiVerify&issueYear=${new Date(certificate.issuedAt).getFullYear()}&issueMonth=${new Date(certificate.issuedAt).getMonth() + 1}&certId=${certificate.certificateId}`;
    window.open(url, '_blank');
  };

  return (
    <div className="App">
      <Navbar onAdminClick={() => setIsAdminOpen(true)} />
      
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
                {certificate.revoked && (
                  <div style={{ background: '#fef2f2', color: '#dc2626', padding: '1rem', borderRadius: '8px', marginBottom: '2rem', textAlign: 'center', border: '1px solid #fee2e2' }}>
                    <ShieldCheck inline="true" /> This credential has been officially revoked by the issuing authority.
                  </div>
                )}

                <div className="no-print" style={{ 
                  display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '3rem' 
                }}>
                  <button onClick={handlePrint} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <Download size={20} /> Export High-Res PDF
                  </button>
                  <button onClick={shareToLinkedIn} className="btn-primary" style={{ background: '#0077b5', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <Share2 size={20} /> Add to LinkedIn
                  </button>
                </div>
                
                <CertificateCard ref={certificateRef} data={certificate} branding={branding} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <footer className="no-print" style={{
        padding: '6rem 0', background: '#f8fafc', borderTop: '1px solid #e2e8f0', textAlign: 'center'
      }}>
        <div className="premium-container">
          <h3 className="serif" style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>CertiVerify Ecosystem</h3>
          <p style={{ color: '#64748b', fontSize: '0.9rem', maxWidth: '500px', margin: '0 auto' }}>
            A trusted platform for verification and issuance of academic and professional credentials.
            Secured by cryptographic hashing.
          </p>
        </div>
      </footer>

      {isAdminOpen && <AdminDashboard onClose={() => setIsAdminOpen(false)} />}
    </div>
  );
}

export default App;
