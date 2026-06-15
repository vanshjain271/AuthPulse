import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Lock, Mail, Building } from 'lucide-react';
import axios from 'axios';

const AuthModal = ({ onClose, onLoginSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
      const payload = isLogin ? { email: formData.email, password: formData.password } : formData;
      
      const { data } = await axios.post(`http://127.0.0.1:5000${endpoint}`, payload);
      
      localStorage.setItem('authpulse_token', data.token);
      localStorage.setItem('authpulse_org_id', data.organizationId);
      
      onLoginSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(15, 23, 42, 0.8)', backdropFilter: 'blur(8px)',
      zIndex: 3000, display: 'flex', alignItems: 'center', justifyContent: 'center'
    }}>
      <motion.div 
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        style={{
          background: 'white', borderRadius: '24px', padding: '2.5rem',
          width: '100%', maxWidth: '450px', position: 'relative',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
        }}
      >
        <button 
          onClick={onClose} 
          style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}
        >
          <X size={24} />
        </button>

        <h2 className="serif" style={{ fontSize: '2rem', marginBottom: '0.5rem', textAlign: 'center' }}>
          {isLogin ? 'Welcome Back' : 'Create Organization'}
        </h2>
        <p style={{ color: '#64748b', textAlign: 'center', marginBottom: '2rem' }}>
          {isLogin ? 'Sign in to access your credential ecosystem' : 'Start issuing secure credentials today'}
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {!isLogin && (
            <div style={{ position: 'relative' }}>
              <Building size={20} style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', left: '1rem', color: '#94a3b8' }} />
              <input 
                type="text" 
                placeholder="Organization Name" 
                required
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                style={{ width: '100%', padding: '1rem 1rem 1rem 3rem', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '1rem', boxSizing: 'border-box' }}
              />
            </div>
          )}

          <div style={{ position: 'relative' }}>
            <Mail size={20} style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', left: '1rem', color: '#94a3b8' }} />
            <input 
              type="email" 
              placeholder="Admin Email Address" 
              required
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
              style={{ width: '100%', padding: '1rem 1rem 1rem 3rem', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '1rem', boxSizing: 'border-box' }}
            />
          </div>

          <div style={{ position: 'relative' }}>
            <Lock size={20} style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', left: '1rem', color: '#94a3b8' }} />
            <input 
              type="password" 
              placeholder="Secure Password" 
              required
              value={formData.password}
              onChange={e => setFormData({ ...formData, password: e.target.value })}
              style={{ width: '100%', padding: '1rem 1rem 1rem 3rem', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '1rem', boxSizing: 'border-box' }}
            />
          </div>

          {error && <p style={{ color: '#ef4444', fontSize: '0.875rem', textAlign: 'center', margin: 0 }}>{error}</p>}

          <button 
            type="submit" 
            disabled={loading}
            className="btn-primary" 
            style={{ padding: '1rem', width: '100%', marginTop: '0.5rem', fontSize: '1.1rem' }}
          >
            {loading ? 'Authenticating...' : (isLogin ? 'Sign In' : 'Create Account')}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '2rem', color: '#64748b', fontSize: '0.9rem' }}>
          {isLogin ? "Don't have an account? " : "Already registered? "}
          <button 
            type="button"
            onClick={() => { setIsLogin(!isLogin); setError(null); }}
            style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 600, cursor: 'pointer', padding: 0 }}
          >
            {isLogin ? 'Register Organization' : 'Sign In'}
          </button>
        </p>
      </motion.div>
    </div>
  );
};

export default AuthModal;
