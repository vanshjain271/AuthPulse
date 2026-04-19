import React, { useState } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

const Hero = ({ onSearch, loading }) => {
  const [certId, setCertId] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (certId.trim()) onSearch(certId.trim());
  };

  return (
    <section style={{
      padding: '6rem 2rem',
      textAlign: 'center',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="serif" style={{ fontSize: '4.5rem', fontWeight: 700, marginBottom: '1.5rem', lineHeight: 1.1, color: 'var(--primary)' }}>
          Secure Certificate <br/>
          <span style={{ 
            color: 'var(--accent)',
          }}>Verification</span> System
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '1.25rem', maxWidth: '600px', margin: '0 auto 3rem' }}>
          Instantly verify the authenticity of credentials. Enter the unique Certificate ID to view and download official documents.
        </p>
      </motion.div>

      <motion.form 
        onSubmit={handleSubmit}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
        style={{
          width: '100%',
          maxWidth: '600px',
          position: 'relative'
        }}
      >
        <input 
          type="text" 
          value={certId}
          onChange={(e) => setCertId(e.target.value)}
          placeholder="Enter Certificate ID (e.g., CERT-2024-001)"
          className="glass"
          style={{
            width: '100%',
            padding: '1.25rem 1.5rem',
            paddingRight: '4rem',
            fontSize: '1.1rem',
            color: 'var(--primary)',
            outline: 'none',
            border: '1px solid var(--border)',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
            background: 'white',
            borderRadius: '4px'
          }}
        />
        <button 
          type="submit"
          disabled={loading}
          style={{
            position: 'absolute',
            right: '0.75rem',
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'var(--primary)',
            border: 'none',
            borderRadius: '0.5rem',
            padding: '0.6rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white'
          }}
        >
          {loading ? <Loader2 className="animate-spin" /> : <Search size={24} />}
        </button>
      </motion.form>
    </section>
  );
};

export default Hero;
