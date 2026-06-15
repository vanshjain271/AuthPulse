import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Layout, Sticker, Type, ImageIcon, Upload, Save, X, Plus, Trash2,
  ArrowUp, ArrowDown, Eye, EyeOff, MousePointer2, Sparkles,
  AlignCenter, AlignLeft, AlignRight, CheckCircle2, ChevronRight,
  Bold, Italic, Move
} from 'lucide-react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';

import { STARTER_TEMPLATES } from '../data/starterTemplates';

const FONTS = [
  'Inter', 'Playfair Display', 'Cinzel', 'Montserrat',
  'EB Garamond', 'Roboto Slab', 'Georgia', 'Arial'
];

const SAMPLE_DATA = {
  studentName: 'Alexandra Johnson',
  internshipDomain: 'Machine Learning & AI',
  certificateId: 'AUTH-2024-XXXX',
  issueDate: '15th June 2024',
  qrCode: 'https://authpulse.com/verify/demo',
  integrityHash: '0x9a7b...8f4c'
};

const VARIABLES = [
  { label: 'Student Name', key: 'studentName', description: 'Recipient full name' },
  { label: 'Program / Domain', key: 'internshipDomain', description: 'Course or internship title' },
  { label: 'Certificate ID', key: 'certificateId', description: 'Unique verification ID' },
  { label: 'Issue Date', key: 'issueDate', description: 'Date of issuance' },
  { label: 'Security QR Code', key: 'qrCode', description: 'Scannable verification QR' },
  { label: 'Integrity Hash', key: 'integrityHash', description: 'Blockchain/Crypto hash' },
];

const TemplateDesigner = ({ onSave, onClose }) => {
  const [activeTab, setActiveTab] = useState('gallery');
  const [assets, setAssets] = useState([]);
  const [savedTemplates, setSavedTemplates] = useState([]);
  const [template, setTemplate] = useState(STARTER_TEMPLATES[0]);
  const [selectedId, setSelectedId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [isPreview, setIsPreview] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [importStep, setImportStep] = useState(1); // 1=guide, 2=upload
  const [isSaving, setIsSaving] = useState(false);
  const canvasRef = useRef(null);
  const editInputRef = useRef(null);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('authpulse_token');
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (editingId && editInputRef.current) {
      editInputRef.current.focus();
      editInputRef.current.select();
    }
  }, [editingId]);

  const fetchData = async () => {
    try {
      const [assetsRes, templatesRes] = await Promise.all([
        axios.get('http://127.0.0.1:5000/api/admin/assets', getAuthHeaders()),
        axios.get('http://127.0.0.1:5000/api/admin/templates', getAuthHeaders()),
      ]);
      setAssets(assetsRes.data);
      setSavedTemplates(templatesRes.data);
    } catch (err) {
      console.error('Fetch failed', err);
    }
  };

  const updateElement = (id, updates) => {
    setTemplate(prev => ({
      ...prev,
      elements: prev.elements.map(el => el.id === id ? { ...el, ...updates } : el)
    }));
  };

  const addElement = (type, config = {}) => {
    const newId = `el-${Date.now()}`;
    const base = {
      id: newId, type, x: 50, y: 50, fontSize: 24, fontWeight: 600,
      color: '#1e293b', fontFamily: 'Inter', zIndex: (template.elements.length + 1) * 10,
      textAlign: 'center', width: 80,
      ...(type === 'text' ? { content: 'Double-click to edit' } : {}),
      ...config
    };
    setTemplate(prev => ({ ...prev, elements: [...prev.elements, base] }));
    setSelectedId(newId);
  };

  const deleteElement = (id) => {
    setTemplate(prev => ({ ...prev, elements: prev.elements.filter(e => e.id !== id) }));
    setSelectedId(null);
    setEditingId(null);
  };

  const handleCanvasDrag = useCallback((e, id) => {
    if (!canvasRef.current || e.clientX === 0) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    updateElement(id, {
      x: Math.max(2, Math.min(98, x)),
      y: Math.max(2, Math.min(98, y))
    });
  }, []);

  const uploadBackground = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setIsUploading(true);
    const formData = new FormData();
    formData.append('background', file);
    try {
      const { data } = await axios.post('http://127.0.0.1:5000/api/admin/templates/upload-bg', formData, {
        headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${localStorage.getItem('authpulse_token')}` }
      });
      setTemplate(prev => ({ ...prev, background: data.bgUrl, aspectRatio: data.aspectRatio || 1.414 }));
      setImportStep(1);
      setActiveTab('elements');
    } catch (err) {
      alert('Upload failed. Ensure the file is under 25MB.');
    } finally {
      setIsUploading(false);
    }
  };

  const uploadAsset = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('asset', file);
    try {
      const { data } = await axios.post('http://127.0.0.1:5000/api/admin/assets/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${localStorage.getItem('authpulse_token')}` }
      });
      setAssets(prev => [...prev, data.assetUrl]);
    } catch (err) {
      alert('Asset upload failed');
    }
  };

  const saveTemplate = async () => {
    setIsSaving(true);
    try {
      await axios.post('http://127.0.0.1:5000/api/admin/templates', template, getAuthHeaders());
      await fetchData();
      onSave();
    } catch (err) {
      alert('Save failed: ' + (err.response?.data?.message || 'Server error'));
    } finally {
      setIsSaving(false);
    }
  };

  const selectedEl = template.elements.find(el => el.id === selectedId);
  const canvasAspectRatio = template.aspectRatio || 1.414;

  const renderElementContent = (el) => {
      const displayValue = isPreview
        ? (el.type === 'variable' ? SAMPLE_DATA[el.key] || `[${el.key}]` : el.content)
        : (el.type === 'variable' ? `{{${el.key}}}` : el.content);

      if (el.type === 'variable' && el.key === 'qrCode') {
        return (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <QRCodeSVG value={SAMPLE_DATA.qrCode} size={el.width || 80} />
            <span style={{ fontSize: '0.55rem', color: el.color || '#1e293b', marginTop: '4px', fontWeight: 600 }}>SCAN TO VERIFY</span>
          </div>
        );
      }

      if (el.type === 'variable' && el.key === 'integrityHash') {
        return (
          <div style={{ textAlign: el.textAlign || 'center' }}>
            <p style={{ fontSize: `${el.fontSize * 0.8}px`, color: el.color, margin: 0, fontFamily: 'monospace', letterSpacing: '1px' }}>
              HASH: {displayValue}
            </p>
          </div>
        );
      }

    if (editingId === el.id && el.type === 'text') {
      return (
        <input
          ref={editInputRef}
          value={el.content}
          onChange={(e) => updateElement(el.id, { content: e.target.value })}
          onBlur={() => setEditingId(null)}
          onKeyDown={(e) => e.key === 'Escape' && setEditingId(null)}
          style={{
            background: 'transparent', border: 'none', outline: '2px solid #3b82f6',
            color: el.color, fontSize: `${el.fontSize}px`, fontFamily: el.fontFamily,
            fontWeight: el.fontWeight, textAlign: el.textAlign || 'center',
            width: '100%', cursor: 'text', padding: '2px 4px', borderRadius: '2px'
          }}
        />
      );
    }
    return (
      <span style={{
        color: el.color, fontSize: `${el.fontSize}px`, fontFamily: el.fontFamily,
        fontWeight: el.fontWeight, letterSpacing: el.letterSpacing || '0px',
        fontStyle: el.fontStyle || 'normal', textAlign: el.textAlign || 'center',
        display: 'block', whiteSpace: 'nowrap'
      }}>
        {displayValue}
      </span>
    );
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: '#0a0f1e', zIndex: 3000, display: 'flex', overflow: 'hidden', fontFamily: 'Inter, sans-serif' }}>

      {/* ── LEFT ICON RAIL ── */}
      <div style={{ width: '68px', background: '#050810', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '1.25rem 0', borderRight: '1px solid rgba(255,255,255,0.06)', gap: '0.25rem' }}>
        {[
          { id: 'gallery', icon: <Layout size={20} />, label: 'Gallery' },
          { id: 'import', icon: <Upload size={20} />, label: 'Import' },
          { id: 'elements', icon: <Sticker size={20} />, label: 'Fields' },
          { id: 'text', icon: <Type size={20} />, label: 'Text' },
          { id: 'assets', icon: <ImageIcon size={20} />, label: 'Assets' },
        ].map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
            width: '100%', padding: '0.85rem 0', background: activeTab === tab.id ? 'rgba(59,130,246,0.15)' : 'transparent',
            border: 'none', borderLeft: activeTab === tab.id ? '3px solid #3b82f6' : '3px solid transparent',
            color: activeTab === tab.id ? '#3b82f6' : '#64748b',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.3rem', cursor: 'pointer', transition: 'all 0.2s'
          }}>
            {tab.icon}
            <span style={{ fontSize: '0.55rem', fontWeight: 600, letterSpacing: '0.5px' }}>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* ── SIDEBAR CONTENT ── */}
      <div style={{ width: '320px', background: '#0d1526', borderRight: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ color: 'white', fontSize: '0.85rem', fontWeight: 700, letterSpacing: '1px' }}>{activeTab.toUpperCase()}</span>
        </div>

        <div style={{ padding: '1.25rem' }}>

          {/* GALLERY TAB */}
          {activeTab === 'gallery' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <p style={{ color: '#64748b', fontSize: '0.75rem', margin: 0 }}>Pick a starter and customize it to match your brand.</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                {STARTER_TEMPLATES.map(t => (
                  <div key={t.id} onClick={() => { setTemplate({ ...t, id: `template-${Date.now()}`, name: t.name + ' (Copy)' }); setSelectedId(null); }}
                    style={{ borderRadius: '10px', overflow: 'hidden', border: template.id === t.id ? '2px solid #3b82f6' : '1px solid rgba(255,255,255,0.08)', cursor: 'pointer', position: 'relative', transition: 'all 0.2s' }}>
                    <img src={t.thumbnail} alt={t.name} style={{ width: '100%', height: '80px', objectFit: 'cover', display: 'block' }} />
                    <div style={{ background: 'rgba(0,0,0,0.75)', padding: '0.4rem 0.6rem' }}>
                      <p style={{ color: 'white', fontSize: '0.65rem', fontWeight: 600, margin: 0 }}>{t.name}</p>
                    </div>
                    {template.name.startsWith(t.name) && (
                      <div style={{ position: 'absolute', top: '6px', right: '6px', background: '#3b82f6', borderRadius: '50%', padding: '2px' }}>
                        <CheckCircle2 size={12} color="white" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
              {savedTemplates.length > 0 && <>
                <p style={{ color: '#64748b', fontSize: '0.7rem', fontWeight: 700, marginTop: '0.5rem', letterSpacing: '1px' }}>MY SAVED DESIGNS</p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  {savedTemplates.map(t => (
                    <div key={t._id} onClick={() => setTemplate(t)}
                      style={{ borderRadius: '10px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)', cursor: 'pointer' }}>
                      <div style={{ height: '80px', backgroundImage: `url(${t.background})`, backgroundSize: 'cover' }} />
                      <div style={{ background: 'rgba(0,0,0,0.75)', padding: '0.4rem 0.6rem' }}>
                        <p style={{ color: 'white', fontSize: '0.65rem', fontWeight: 600, margin: 0 }}>{t.name?.slice(0, 20)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </>}
            </div>
          )}

          {/* IMPORT TAB */}
          {activeTab === 'import' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {importStep === 1 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.3)', borderRadius: '12px', padding: '1rem' }}>
                    <p style={{ color: '#93c5fd', fontSize: '0.75rem', fontWeight: 700, margin: '0 0 0.5rem' }}>📋 HOW TO IMPORT FROM CANVA</p>
                    <ol style={{ color: '#cbd5e1', fontSize: '0.75rem', paddingLeft: '1.2rem', lineHeight: '1.8', margin: 0 }}>
                      <li>Open your certificate design in <strong style={{ color: 'white' }}>Canva</strong></li>
                      <li>Click <strong style={{ color: 'white' }}>Share</strong> → <strong style={{ color: 'white' }}>Download</strong></li>
                      <li>Choose <strong style={{ color: 'white' }}>PNG</strong> format</li>
                      <li>Set quality to <strong style={{ color: 'white' }}>High / 2x</strong> for best results</li>
                      <li>Click the button below to upload the file</li>
                    </ol>
                  </div>
                  <a href="https://canva.com" target="_blank" rel="noreferrer"
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.75rem', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#00c4cc', textDecoration: 'none', fontSize: '0.8rem', fontWeight: 600 }}>
                    <Sparkles size={14} /> Open Canva.com ↗
                  </a>
                  <button onClick={() => setImportStep(2)} style={{ padding: '0.9rem', background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', border: 'none', borderRadius: '10px', color: 'white', fontWeight: 700, cursor: 'pointer', fontSize: '0.85rem' }}>
                    I've exported the PNG →
                  </button>
                </div>
              )}
              {importStep === 2 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <button onClick={() => setImportStep(1)} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', textAlign: 'left', fontSize: '0.75rem', padding: 0 }}>← Back to instructions</button>
                  <label style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem', padding: '2.5rem 1.5rem', border: '2px dashed rgba(59,130,246,0.5)', borderRadius: '14px', cursor: 'pointer', background: 'rgba(59,130,246,0.05)', transition: 'all 0.2s' }}>
                    <input type="file" accept="image/png,image/jpeg" onChange={uploadBackground} style={{ display: 'none' }} />
                    {isUploading
                      ? <><div style={{ width: '36px', height: '36px', border: '3px solid #3b82f6', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} /><p style={{ color: '#64748b', fontSize: '0.8rem', margin: 0 }}>Uploading & analyzing...</p></>
                      : <><Upload size={36} style={{ color: '#3b82f6' }} /><p style={{ color: 'white', fontWeight: 700, margin: 0, fontSize: '0.9rem' }}>Drop PNG here or click to upload</p><p style={{ color: '#64748b', fontSize: '0.72rem', margin: 0 }}>Supports PNG, JPG • Max 25MB</p></>
                    }
                  </label>
                </div>
              )}
            </div>
          )}

          {/* FIELDS (DYNAMIC VARIABLES) TAB */}
          {activeTab === 'elements' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <p style={{ color: '#64748b', fontSize: '0.72rem', margin: '0 0 0.5rem' }}>Click to add a field. Drag it on the canvas to position it.</p>
              {VARIABLES.map(v => (
                <button key={v.key} onClick={() => addElement('variable', { key: v.key })}
                  style={{ width: '100%', padding: '0.9rem 1rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '10px', color: 'white', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', textAlign: 'left', transition: '0.2s' }}>
                  <div>
                    <p style={{ margin: 0, fontSize: '0.82rem', fontWeight: 600 }}>{v.label}</p>
                    <p style={{ margin: 0, fontSize: '0.68rem', color: '#64748b' }}>{v.description}</p>
                  </div>
                  <Plus size={16} style={{ color: '#3b82f6', flexShrink: 0 }} />
                </button>
              ))}
            </div>
          )}

          {/* TEXT TAB */}
          {activeTab === 'text' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <p style={{ color: '#64748b', fontSize: '0.72rem', margin: '0 0 0.5rem' }}>Add static text. Double-click any text on the canvas to edit it inline.</p>
              {[
                { label: 'Large Heading', config: { content: 'HEADING TEXT', fontSize: 40, fontWeight: 800, fontFamily: 'Cinzel', letterSpacing: '3px' } },
                { label: 'Subheading', config: { content: 'Sub-heading text', fontSize: 22, fontWeight: 600, fontFamily: 'Playfair Display' } },
                { label: 'Body Text', config: { content: 'This is to certify that', fontSize: 16, fontWeight: 400, fontFamily: 'Inter' } },
                { label: 'Small Label', config: { content: 'LABEL TEXT', fontSize: 12, fontWeight: 700, fontFamily: 'Inter', letterSpacing: '3px' } },
                { label: 'Divider Line', config: { content: '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', fontSize: 11, fontWeight: 400, fontFamily: 'Inter', color: '#94a3b8' } },
              ].map(({ label, config }) => (
                <button key={label} onClick={() => addElement('text', config)}
                  style={{ width: '100%', padding: '0.9rem 1rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '10px', color: 'white', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: '0.2s' }}>
                  <span style={{ fontSize: '0.82rem', fontWeight: 600 }}>{label}</span>
                  <Plus size={16} style={{ color: '#3b82f6' }} />
                </button>
              ))}
            </div>
          )}

          {/* ASSETS TAB */}
          {activeTab === 'assets' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <label style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', padding: '1.5rem', border: '1px dashed rgba(255,255,255,0.1)', borderRadius: '12px', cursor: 'pointer', textAlign: 'center' }}>
                <input type="file" accept="image/*" onChange={uploadAsset} style={{ display: 'none' }} />
                <ImageIcon size={28} style={{ color: '#3b82f6' }} />
                <p style={{ color: 'white', fontWeight: 700, margin: 0, fontSize: '0.82rem' }}>Upload Logo / Signature</p>
                <p style={{ color: '#64748b', fontSize: '0.7rem', margin: 0 }}>PNG with transparency recommended</p>
              </label>
              {assets.length > 0 && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                  {assets.map((url, i) => (
                    <img key={i} src={url} alt="" onClick={() => addElement('image', { url, width: 120 })}
                      style={{ width: '100%', height: '80px', objectFit: 'contain', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', cursor: 'pointer', border: '1px solid rgba(255,255,255,0.08)' }} />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── MAIN CANVAS AREA ── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>

        {/* TOP BAR */}
        <div style={{ height: '56px', background: 'rgba(0,0,0,0.4)', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', padding: '0 1.5rem', gap: '1rem', flexShrink: 0 }}>
          {selectedEl ? (
            <>
              {selectedEl.type !== 'image' && (
                <>
                  <select value={selectedEl.fontFamily} onChange={e => updateElement(selectedId, { fontFamily: e.target.value })}
                    style={{ background: '#1e293b', color: 'white', border: '1px solid rgba(255,255,255,0.1)', padding: '0.35rem 0.6rem', borderRadius: '6px', fontSize: '0.8rem' }}>
                    {FONTS.map(f => <option key={f} value={f}>{f}</option>)}
                  </select>
                  <input type="number" value={selectedEl.fontSize} min="8" max="200"
                    onChange={e => updateElement(selectedId, { fontSize: Number(e.target.value) })}
                    style={{ width: '56px', background: '#1e293b', color: 'white', border: '1px solid rgba(255,255,255,0.1)', padding: '0.35rem', borderRadius: '6px', textAlign: 'center', fontSize: '0.8rem' }} />
                  <input type="color" value={selectedEl.color || '#ffffff'}
                    onChange={e => updateElement(selectedId, { color: e.target.value })}
                    title="Text Color" style={{ width: '32px', height: '32px', borderRadius: '6px', border: 'none', cursor: 'pointer', background: 'none' }} />
                  <div style={{ display: 'flex', gap: '2px' }}>
                    {[{ icon: <AlignLeft size={14} />, val: 'left' }, { icon: <AlignCenter size={14} />, val: 'center' }, { icon: <AlignRight size={14} />, val: 'right' }].map(a => (
                      <button key={a.val} onClick={() => updateElement(selectedId, { textAlign: a.val })}
                        style={{ background: selectedEl.textAlign === a.val ? '#3b82f6' : 'rgba(255,255,255,0.05)', border: 'none', color: 'white', padding: '0.35rem 0.5rem', borderRadius: '4px', cursor: 'pointer' }}>
                        {a.icon}
                      </button>
                    ))}
                  </div>
                  <button onClick={() => updateElement(selectedId, { fontWeight: selectedEl.fontWeight >= 700 ? 400 : 700 })}
                    style={{ background: selectedEl.fontWeight >= 700 ? '#3b82f6' : 'rgba(255,255,255,0.05)', border: 'none', color: 'white', padding: '0.35rem 0.5rem', borderRadius: '4px', cursor: 'pointer' }}>
                    <Bold size={14} />
                  </button>
                  <button onClick={() => updateElement(selectedId, { fontStyle: selectedEl.fontStyle === 'italic' ? 'normal' : 'italic' })}
                    style={{ background: selectedEl.fontStyle === 'italic' ? '#3b82f6' : 'rgba(255,255,255,0.05)', border: 'none', color: 'white', padding: '0.35rem 0.5rem', borderRadius: '4px', cursor: 'pointer' }}>
                    <Italic size={14} />
                  </button>
                </>
              )}
              {selectedEl.type === 'image' && (
                <>
                  <span style={{ color: '#64748b', fontSize: '0.8rem' }}>Width:</span>
                  <input type="range" min="20" max="600" value={selectedEl.width || 120}
                    onChange={e => updateElement(selectedId, { width: Number(e.target.value) })}
                    style={{ width: '120px' }} />
                  <span style={{ color: 'white', fontSize: '0.8rem' }}>{selectedEl.width || 120}px</span>
                </>
              )}
              <div style={{ marginLeft: 'auto', display: 'flex', gap: '4px' }}>
                <button onClick={() => updateElement(selectedId, { zIndex: (selectedEl.zIndex || 0) + 10 })} title="Bring Forward"
                  style={{ background: 'rgba(255,255,255,0.05)', border: 'none', color: '#94a3b8', padding: '0.35rem 0.5rem', borderRadius: '4px', cursor: 'pointer' }}><ArrowUp size={14} /></button>
                <button onClick={() => updateElement(selectedId, { zIndex: Math.max(1, (selectedEl.zIndex || 0) - 10) })} title="Send Backward"
                  style={{ background: 'rgba(255,255,255,0.05)', border: 'none', color: '#94a3b8', padding: '0.35rem 0.5rem', borderRadius: '4px', cursor: 'pointer' }}><ArrowDown size={14} /></button>
                <button onClick={() => deleteElement(selectedId)} title="Delete"
                  style={{ background: 'rgba(239,68,68,0.1)', border: 'none', color: '#ef4444', padding: '0.35rem 0.5rem', borderRadius: '4px', cursor: 'pointer' }}><Trash2 size={14} /></button>
              </div>
            </>
          ) : (
            <span style={{ color: '#475569', fontSize: '0.82rem' }}>
              {template.elements.length > 0 ? '← Click an element to edit it. Double-click text to type.' : 'Add fields from the left panel to get started.'}
            </span>
          )}

          {/* Preview toggle */}
          <button onClick={() => { setIsPreview(p => !p); setSelectedId(null); setEditingId(null); }}
            style={{ marginLeft: selectedEl ? '0' : 'auto', background: isPreview ? '#22c55e' : 'rgba(255,255,255,0.05)', border: 'none', color: isPreview ? 'white' : '#94a3b8', padding: '0.35rem 0.85rem', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.78rem', fontWeight: 600 }}>
            {isPreview ? <><Eye size={14} /> Preview ON</> : <><EyeOff size={14} /> Preview</>}
          </button>
        </div>

        {/* CANVAS */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'auto', padding: '3rem', background: 'radial-gradient(circle at center, #1e293b22 0%, transparent 70%)' }}
          onClick={(e) => { if (e.target === e.currentTarget) { setSelectedId(null); setEditingId(null); } }}>
          <div ref={canvasRef}
            style={{ position: 'relative', background: 'white', boxShadow: '0 40px 80px rgba(0,0,0,0.6)', width: '100%', maxWidth: '880px', aspectRatio: `${canvasAspectRatio} / 1`, backgroundImage: `url(${template.background})`, backgroundSize: 'cover', backgroundPosition: 'center', userSelect: 'none' }}>

            {[...template.elements].sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0)).map(el => (
              <div key={el.id}
                draggable={editingId !== el.id}
                onDragEnd={e => handleCanvasDrag(e, el.id)}
                onMouseDown={() => { if (editingId !== el.id) setSelectedId(el.id); }}
                onDoubleClick={() => { if (el.type === 'text') { setSelectedId(el.id); setEditingId(el.id); } }}
                style={{
                  position: 'absolute', top: `${el.y}%`, left: `${el.x}%`,
                  transform: 'translate(-50%, -50%)', cursor: editingId === el.id ? 'text' : 'grab',
                  zIndex: el.zIndex || 1,
                  outline: selectedId === el.id && editingId !== el.id ? '2px solid #3b82f6' : 'none',
                  outlineOffset: '4px', borderRadius: '2px', padding: '2px'
                }}>
                {el.type === 'image'
                  ? <img src={el.url} alt="" draggable={false} style={{ width: `${el.width || 120}px`, height: 'auto', display: 'block', opacity: el.opacity || 1 }} />
                  : renderElementContent(el)
                }
                {/* Move indicator */}
                {selectedId === el.id && editingId !== el.id && (
                  <div style={{ position: 'absolute', top: '-20px', left: '50%', transform: 'translateX(-50%)', background: '#3b82f6', color: 'white', fontSize: '0.55rem', padding: '2px 6px', borderRadius: '4px', whiteSpace: 'nowrap', fontWeight: 600 }}>
                    DRAG TO MOVE {el.type === 'text' ? '• DBL-CLICK TO EDIT' : ''}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* BOTTOM BAR */}
        <div style={{ height: '72px', background: '#050810', borderTop: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 1.5rem', gap: '1rem', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <input value={template.name} onChange={e => setTemplate(prev => ({ ...prev, name: e.target.value }))}
              style={{ background: '#0d1526', border: '1px solid rgba(255,255,255,0.1)', color: 'white', padding: '0.6rem 1rem', borderRadius: '8px', fontSize: '0.85rem', width: '260px' }} />
            <span style={{ color: '#475569', fontSize: '0.72rem' }}>{template.elements.length} element{template.elements.length !== 1 ? 's' : ''}</span>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            {isPreview && <span style={{ fontSize: '0.72rem', color: '#22c55e', fontWeight: 600 }}>👁 Preview mode — showing sample data</span>}
            <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: '#94a3b8', padding: '0.6rem 1.25rem', borderRadius: '8px', cursor: 'pointer', fontSize: '0.85rem' }}>Cancel</button>
            <button onClick={saveTemplate} disabled={isSaving}
              style={{ background: isSaving ? '#1e3a5f' : 'linear-gradient(135deg, #2563eb, #7c3aed)', border: 'none', color: 'white', padding: '0.6rem 1.75rem', borderRadius: '8px', cursor: 'pointer', fontWeight: 700, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              {isSaving ? 'Saving...' : <><Save size={16} /> Save & Sync</>}
            </button>
          </div>
        </div>
      </div>

      {/* RIGHT PROPERTY PANEL — visible when element is selected */}
      <AnimatePresence>
        {selectedEl && !isPreview && (
          <motion.div initial={{ width: 0, opacity: 0 }} animate={{ width: 260, opacity: 1 }} exit={{ width: 0, opacity: 0 }} transition={{ duration: 0.2 }}
            style={{ background: '#0d1526', borderLeft: '1px solid rgba(255,255,255,0.06)', overflow: 'hidden', flexShrink: 0 }}>
            <div style={{ width: '260px', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'white', fontSize: '0.82rem', fontWeight: 700 }}>PROPERTIES</span>
                <button onClick={() => setSelectedId(null)} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', padding: '2px' }}><X size={16} /></button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <label style={{ color: '#64748b', fontSize: '0.7rem', fontWeight: 600, letterSpacing: '1px' }}>POSITION</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                  <div>
                    <p style={{ color: '#94a3b8', fontSize: '0.68rem', margin: '0 0 0.25rem' }}>X (%)</p>
                    <input type="number" value={Math.round(selectedEl.x * 10) / 10} step="0.5"
                      onChange={e => updateElement(selectedId, { x: Number(e.target.value) })}
                      style={{ width: '100%', background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', color: 'white', padding: '0.4rem', borderRadius: '6px', fontSize: '0.8rem', boxSizing: 'border-box' }} />
                  </div>
                  <div>
                    <p style={{ color: '#94a3b8', fontSize: '0.68rem', margin: '0 0 0.25rem' }}>Y (%)</p>
                    <input type="number" value={Math.round(selectedEl.y * 10) / 10} step="0.5"
                      onChange={e => updateElement(selectedId, { y: Number(e.target.value) })}
                      style={{ width: '100%', background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', color: 'white', padding: '0.4rem', borderRadius: '6px', fontSize: '0.8rem', boxSizing: 'border-box' }} />
                  </div>
                </div>
              </div>

              {selectedEl.type !== 'image' && (
                <>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ color: '#64748b', fontSize: '0.7rem', fontWeight: 600, letterSpacing: '1px' }}>FONT SIZE</label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <input type="range" min="8" max="120" value={selectedEl.fontSize}
                        onChange={e => updateElement(selectedId, { fontSize: Number(e.target.value) })}
                        style={{ flex: 1 }} />
                      <span style={{ color: 'white', fontSize: '0.8rem', width: '30px', textAlign: 'right' }}>{selectedEl.fontSize}</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ color: '#64748b', fontSize: '0.7rem', fontWeight: 600, letterSpacing: '1px' }}>LETTER SPACING</label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <input type="range" min="0" max="20" step="0.5" value={parseFloat(selectedEl.letterSpacing) || 0}
                        onChange={e => updateElement(selectedId, { letterSpacing: `${e.target.value}px` })}
                        style={{ flex: 1 }} />
                      <span style={{ color: 'white', fontSize: '0.8rem', width: '30px', textAlign: 'right' }}>{parseFloat(selectedEl.letterSpacing) || 0}px</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ color: '#64748b', fontSize: '0.7rem', fontWeight: 600, letterSpacing: '1px' }}>OPACITY</label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <input type="range" min="0.1" max="1" step="0.05" value={selectedEl.opacity || 1}
                        onChange={e => updateElement(selectedId, { opacity: Number(e.target.value) })}
                        style={{ flex: 1 }} />
                      <span style={{ color: 'white', fontSize: '0.8rem', width: '30px', textAlign: 'right' }}>{Math.round((selectedEl.opacity || 1) * 100)}%</span>
                    </div>
                  </div>
                </>
              )}
              {(selectedEl.type === 'image' || selectedEl.key === 'qrCode') && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ color: '#64748b', fontSize: '0.7rem', fontWeight: 600, letterSpacing: '1px' }}>SIZE (WIDTH)</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <input type="range" min="20" max="600" value={selectedEl.width || 80}
                      onChange={e => updateElement(selectedId, { width: Number(e.target.value) })}
                      style={{ flex: 1 }} />
                    <span style={{ color: 'white', fontSize: '0.8rem', width: '40px', textAlign: 'right' }}>{selectedEl.width || 80}px</span>
                  </div>
                </div>
              )}

              <button onClick={() => deleteElement(selectedId)}
                style={{ width: '100%', padding: '0.65rem', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '8px', color: '#ef4444', cursor: 'pointer', fontWeight: 600, fontSize: '0.82rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                <Trash2 size={14} /> Delete Element
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700;800&family=EB+Garamond:ital,wght@0,400;0,600;1,400&family=Inter:wght@300;400;600;700;800&family=Montserrat:wght@400;600;700;800&family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Roboto+Slab:wght@400;600;700&display=swap');
        @keyframes spin { to { transform: rotate(360deg); } }
        input[type=range] { accent-color: #3b82f6; }
      `}</style>
    </div>
  );
};

export default TemplateDesigner;
