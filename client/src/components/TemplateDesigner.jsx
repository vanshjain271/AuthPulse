import React, { useState, useEffect, useRef } from 'react';
import { 
  Move, Type, Image as ImageIcon, Save, X, Plus, Trash2, 
  Sliders, Layout, Layers, Monitor, Upload, CheckCircle2,
  Copy, Bold, Italic, AlignLeft, AlignCenter, AlignRight,
  Sticker, MousePointer2, ChevronRight, HelpCircle, ArrowUp, ArrowDown,
  Link, Sparkles, Wand2
} from 'lucide-react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

const TemplateDesigner = ({ onSave, onClose }) => {
  const [activeTab, setActiveTab] = useState('templates');
  const [assets, setAssets] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [magicLink, setMagicLink] = useState('');
  const [template, setTemplate] = useState({
    id: `template-${Date.now()}`,
    name: 'New AuthPulse Design',
    background: 'https://images.unsplash.com/photo-1589330694653-731336c53f3e?auto=format&fit=crop&q=80&w=2000',
    elements: [
      { id: 'heading', type: 'text', content: 'CERTIFICATE OF ACHIEVEMENT', x: 50, y: 25, fontSize: 32, fontWeight: 700, color: '#1e293b', fontFamily: 'Cinzel', letterSpacing: '4px', zIndex: 10 },
      { id: 'name', type: 'variable', key: 'studentName', x: 50, y: 48, fontSize: 56, fontWeight: 700, color: '#b45309', fontFamily: 'Playfair Display', zIndex: 20 }
    ]
  });

  const [selectedId, setSelectedId] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const canvasRef = useRef(null);

  const FONTS = ['Inter', 'Playfair Display', 'Cinzel', 'Montserrat', 'EB Garamond', 'Roboto Slab'];
  const VARIABLES = [
    { label: 'Student Name', key: 'studentName' },
    { label: 'Internship Domain', key: 'internshipDomain' },
    { label: 'Certificate ID', key: 'certificateId' },
    { label: 'Issue Date', key: 'issueDate' }
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [assetsRes, templatesRes] = await Promise.all([
        axios.get('http://127.0.0.1:5000/api/admin/assets'),
        axios.get('http://127.0.0.1:5000/api/admin/templates')
      ]);
      setAssets(assetsRes.data);
      setTemplates(templatesRes.data);
    } catch (err) {
      console.error('Failed to fetch data');
    }
  };

  const uploadBackground = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setIsUploading(true);
    const formData = new FormData();
    formData.append('background', file);
    try {
      const { data } = await axios.post('http://127.0.0.1:5000/api/admin/templates/upload-bg', formData);
      setTemplate(prev => ({ ...prev, background: data.bgUrl }));
    } catch (err) {
      alert('Upload failed');
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
      const { data } = await axios.post('http://127.0.0.1:5000/api/admin/assets/upload', formData);
      setAssets(prev => [...prev, data.assetUrl]);
    } catch (err) {
      alert('Asset upload failed');
    }
  };

  const handleMagicImport = () => {
    if (!magicLink.includes('canva.com')) {
      alert('Please enter a valid Canva design link.');
      return;
    }
    // Remove the fake simulation and replace with a professional Bridge Assistant
    const bridgeMsg = "CANVA BRIDGE DETECTED: \n\n1. In Canva: Click 'Share' -> 'Download' -> 'PNG'. \n2. In AuthPulse: Use the 'Upload Design (PNG)' button below. \n\nThis ensures 100% fidelity of your custom colors and shapes. Would you like to open the upload box?";
    if (window.confirm(bridgeMsg)) {
       document.getElementById('bg-upload-input').click();
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
      id: newId,
      type,
      x: 50,
      y: 50,
      fontSize: 24,
      width: 150,
      zIndex: template.elements.length * 10 + 10,
      color: '#1e293b',
      fontFamily: 'Inter',
      fontWeight: 500,
      ...config
    };
    setTemplate(prev => ({ ...prev, elements: [...prev.elements, base] }));
    setSelectedId(newId);
  };

  const handleDrag = (e, id) => {
    if (!canvasRef.current || e.clientX === 0) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    updateElement(id, { x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) });
  };

  const saveTemplate = async () => {
    try {
      await axios.post('http://127.0.0.1:5000/api/admin/templates', template);
      alert('Design Hub: Sync Successful.');
      onSave();
    } catch (err) {
      alert('Sync failed');
    }
  };

  const selectedElement = template.elements.find(el => el.id === selectedId);

  return (
    <div style={{ position: 'fixed', inset: 0, background: '#0f172a', zIndex: 3000, display: 'flex', overflow: 'hidden' }}>
      
      {/* 1. Side Rail */}
      <div style={{ 
        width: '72px', background: '#000', display: 'flex', flexDirection: 'column', 
        alignItems: 'center', padding: '1rem 0', borderRight: '1px solid rgba(255,255,255,0.05)'
      }}>
        {[
          { id: 'templates', icon: <Layout size={20} />, label: 'Designs' },
          { id: 'elements', icon: <Sticker size={20} />, label: 'Dynamic' },
          { id: 'text', icon: <Type size={20} />, label: 'Text' },
          { id: 'uploads', icon: <ImageIcon size={20} />, label: 'Uploads' }
        ].map(tab => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{ 
              width: '100%', padding: '0.75rem 0', background: activeTab === tab.id ? '#1e293b' : 'transparent',
              border: 'none', color: activeTab === tab.id ? '#3b82f6' : '#94a3b8', 
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem',
              cursor: 'pointer', transition: '0.2s'
            }}
          >
            {tab.icon}
            <span style={{ fontSize: '0.6rem', fontWeight: 600 }}>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* 2. Sidebar Content */}
      <div style={{ 
        width: '360px', background: '#1e293b', borderRight: '1px solid rgba(255,255,255,0.05)',
        display: 'flex', flexDirection: 'column', overflowY: 'auto'
      }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <h3 style={{ color: 'white', fontSize: '1rem', fontWeight: 700 }}>{activeTab.toUpperCase()}</h3>
        </div>

        <div style={{ padding: '1.5rem' }}>
          {activeTab === 'templates' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              
              {/* Canva link Importer */}
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#00c4cc', marginBottom: '0.75rem' }}>
                  <Sparkles size={16} />
                  <span style={{ fontSize: '0.8rem', fontWeight: 700 }}>CANVA MAGIC LINK</span>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input 
                    placeholder="Paste Canva.com link..." 
                    value={magicLink} onChange={(e) => setMagicLink(e.target.value)}
                    style={{ flex: 1, background: '#000', border: 'none', color: 'white', padding: '0.5rem', borderRadius: '4px', fontSize: '0.75rem' }}
                  />
                  <button onClick={handleMagicImport} style={{ background: '#00c4cc', border: 'none', padding: '0.5rem', borderRadius: '4px', cursor: 'pointer' }}>
                    <Wand2 size={16} color="white" />
                  </button>
                </div>
              </div>

              {/* Upload Direct Background */}
              <label style={{ 
                width: '100%', padding: '1.5rem', border: '2px dashed #00c4cc', 
                background: 'rgba(0,196,204,0.05)',
                borderRadius: '12px', textAlign: 'center', cursor: 'pointer', display: 'flex',
                flexDirection: 'column', alignItems: 'center', gap: '0.5rem'
              }}>
                 <input id="bg-upload-input" type="file" onChange={uploadBackground} style={{ display: 'none' }} />
                 <Upload size={24} style={{ color: '#00c4cc' }} />
                 <span style={{ color: 'white', fontSize: '0.85rem', fontWeight: 700 }}>Upload Design (PNG)</span>
                 <p style={{ color: '#94a3b8', fontSize: '0.7rem' }}>Sync your Canva export here</p>
              </label>

              <p style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 700, marginTop: '1rem' }}>REUSE EXISTING DESIGNS</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                {templates.map(t => (
                  <div 
                    key={t.id} 
                    onClick={() => setTemplate(t)}
                    style={{ 
                      borderRadius: '8px', overflow: 'hidden', border: template.id === t.id ? '2px solid #3b82f6' : '1px solid rgba(255,255,255,0.1)',
                      cursor: 'pointer', position: 'relative'
                    }}
                  >
                    <img src={t.background} style={{ width: '100%', height: '80px', objectFit: 'cover', opacity: 0.8 }} />
                    <div style={{ position: 'absolute', bottom: 0, width: '100%', background: 'rgba(0,0,0,0.6)', padding: '0.25rem', fontSize: '0.6rem', color: 'white', textAlign: 'center' }}>
                      {t.name.slice(0, 15)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'elements' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {VARIABLES.map(v => (
                <button key={v.key} onClick={() => addElement('variable', { key: v.key, content: `{{${v.key}}}` })} className="canva-btn">
                  <span>{v.label}</span>
                  <Plus size={14} />
                </button>
              ))}
            </div>
          )}

          {activeTab === 'text' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <button onClick={() => addElement('text', { content: 'ADD A HEADING', fontSize: 42, fontWeight: 800, fontFamily: 'Cinzel' })} className="canva-btn">Large Heading</button>
              <button onClick={() => addElement('text', { content: 'Add a sub-heading', fontSize: 24, fontWeight: 600 })} className="canva-btn">Subheading</button>
            </div>
          )}

          {activeTab === 'uploads' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <label className="upload-box" style={{ cursor: 'pointer', textAlign: 'center', padding: '2rem', border: '1px dashed rgba(255,255,255,0.1)', borderRadius: '12px' }}>
                 <input type="file" onChange={uploadAsset} style={{ display: 'none' }} />
                 <ImageIcon size={32} style={{ color: '#3b82f6', marginBottom: '1rem' }} />
                 <p style={{ color: '#94a3b8', fontSize: '0.8rem' }}>Add Asset (Logo/Sign)</p>
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                {assets.map((url, i) => (
                  <img key={i} src={url} onClick={() => addElement('image', { url, width: 120 })} style={{ width: '100%', height: '80px', objectFit: 'contain', background: 'rgba(0,0,0,0.2)', borderRadius: '8px', cursor: 'pointer' }} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 3. Design Canvas Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Top Control Bar */}
        <div style={{ height: '64px', background: 'rgba(0,0,0,0.3)', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', padding: '0 2rem', gap: '1.5rem' }}>
          {selectedElement ? (
             <>
               {selectedElement.type !== 'image' ? (
                 <>
                  <select value={selectedElement.fontFamily} onChange={(e) => updateElement(selectedId, { fontFamily: e.target.value })} style={{ background: '#000', color: 'white', border: '1px solid rgba(255,255,255,0.1)', padding: '0.5rem', borderRadius: '4px' }}>
                    {FONTS.map(f => <option key={f} value={f}>{f}</option>)}
                  </select>
                  <input type="number" value={selectedElement.fontSize} onChange={(e) => updateElement(selectedId, { fontSize: Number(e.target.value) })} style={{ width: '60px', background: '#000', color: 'white', padding: '0.5rem' }} />
                  <input type="color" value={selectedElement.color || '#000000'} onChange={(e) => updateElement(selectedId, { color: e.target.value })} />
                 </>
               ) : (
                 <>
                   <ImageIcon size={20} color="#3b82f6" />
                   <input type="range" min="20" max="800" value={selectedElement.width} onChange={(e) => updateElement(selectedId, { width: Number(e.target.value) })} />
                   <span style={{ color: 'white' }}>{selectedElement.width}px</span>
                 </>
               )}
               <div style={{ display: 'flex', gap: '0.5rem' }}>
                 <button onClick={() => updateElement(selectedId, { zIndex: (selectedElement.zIndex || 0) + 10 })} className="tool-btn"><ArrowUp size={16} /></button>
                 <button onClick={() => updateElement(selectedId, { zIndex: (selectedElement.zIndex || 0) - 10 })} className="tool-btn"><ArrowDown size={16} /></button>
                 <button onClick={() => setTemplate(prev => ({...prev, elements: prev.elements.filter(e => e.id !== selectedId)}))} className="tool-btn" style={{ color: '#ef4444' }}><Trash2 size={16} /></button>
               </div>
             </>
          ) : (
            <span style={{ color: '#64748b', fontSize: '0.85rem' }}>Select an element to customize</span>
          )}
        </div>

        {/* Canvas */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'auto', padding: '4rem' }}>
           <div 
             ref={canvasRef}
             style={{ 
               width: '100%', maxWidth: '850px', aspectRatio: '1.414 / 1', background: 'white', 
               position: 'relative', boxShadow: '0 50px 100px rgba(0,0,0,0.5)',
               backgroundImage: `url(${template.background})`, backgroundSize: 'cover'
             }}
           >
             {template.elements.sort((a,b) => (a.zIndex || 0) - (b.zIndex || 0)).map(el => (
               <div 
                  key={el.id} onMouseDown={() => setSelectedId(el.id)} draggable onDragEnd={(e) => handleDrag(e, el.id)}
                  style={{ position: 'absolute', top: `${el.y}%`, left: `${el.x}%`, transform: 'translate(-50%, -50%)', cursor: 'move', zIndex: el.zIndex || 1, border: selectedId === el.id ? '2px solid #3b82f6' : '1px dashed transparent', padding: '4px' }}
               >
                 {el.type === 'image' ? (
                    <img src={el.url} style={{ width: `${el.width}px`, height: 'auto', display: 'block' }} draggable={false} />
                 ) : (
                    <div style={{ color: el.color, fontSize: `${el.fontSize}px`, fontFamily: el.fontFamily, fontWeight: el.fontWeight || 600, whiteSpace: 'nowrap' }}>
                      {el.type === 'variable' ? `{{${el.key}}}` : el.content}
                    </div>
                 )}
               </div>
             ))}
           </div>
        </div>

        {/* Footer Bar */}
        <div style={{ height: '80px', background: '#000', borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 2rem' }}>
          <input 
            value={template.name} onChange={(e) => setTemplate({...template, name: e.target.value})}
            style={{ background: '#1e293b', border: 'none', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '8px', width: '300px' }}
          />
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button onClick={onClose} className="btn-secondary" style={{ color: 'white' }}>Cancel</button>
            <button onClick={saveTemplate} className="btn-primary" style={{ padding: '1rem 2rem' }}>Save & Sync EcoSystem</button>
          </div>
        </div>
      </div>

      <style>{`
        .canva-btn { width: 100%; padding: 1.25rem; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); color: white; border-radius: 12px; text-align: left; cursor: pointer; transition: 0.2s; display: flex; justify-content: space-between; align-items: center; }
        .canva-btn:hover { background: rgba(255,255,255,0.08); }
        .tool-btn { background: #000; color: white; border: 1px solid rgba(255,255,255,0.1); padding: 0.5rem; border-radius: 4px; cursor: pointer; display: flex; align-items: center; justify-content: center; }
      `}</style>
    </div>
  );
};

export default TemplateDesigner;
