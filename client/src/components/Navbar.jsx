import React from 'react';
import { Award, ShieldCheck, User } from 'lucide-react';

const Navbar = ({ onAdminClick }) => {
  return (
    <nav className="no-print" style={{
      padding: '1.5rem 0',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderBottom: '1px solid var(--border)',
      background: 'rgba(252, 252, 249, 0.8)',
      backdropFilter: 'blur(8px)',
      position: 'sticky',
      top: 0,
      zIndex: 1000
    }}>
      <div className="premium-container" style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Award size={28} color="var(--primary)" />
          <span className="serif" style={{ fontSize: '1.75rem', fontWeight: 700, letterSpacing: '-0.5px', color: 'var(--primary)' }}>
            CertiVerify
          </span>
        </div>
        
        <div style={{ display: 'flex', gap: '2.5rem', alignItems: 'center' }}>
          <a href="/" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontWeight: 500, fontSize: '0.9rem' }}>Home</a>
          <button 
            onClick={onAdminClick}
            style={{ 
              display: 'flex', alignItems: 'center', gap: '0.5rem',
              background: 'none', border: '1px solid var(--border)', padding: '0.5rem 1rem',
              borderRadius: '4px', cursor: 'pointer', fontWeight: 500, color: 'var(--primary)'
            }}
          >
            <ShieldCheck size={18} />
            Admin Portal
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
