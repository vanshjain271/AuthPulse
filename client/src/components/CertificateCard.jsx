import React, { forwardRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';

const CertificateCard = forwardRef(({ data, branding, template }, ref) => {
  if (!data) return null;

  const verificationUrl = `${window.location.origin}/verify/${data.certificateId}`;

  return (
    <div ref={ref} className="cert-container" style={{
      width: '100%',
      maxWidth: '1000px',
      margin: '0 auto',
      background: 'white',
      boxShadow: '0 20px 50px rgba(0,0,0,0.1)',
      position: 'relative',
      overflow: 'hidden',
      aspectRatio: '1.414 / 1', // International A4 Standard
      border: '1px solid #e2e8f0'
    }}>
      {/* 1. Underlying Design Layer */}
      {template?.background ? (
        <div style={{ 
          position: 'absolute', inset: 0, zIndex: 0,
          backgroundImage: `url(${template.background})`, backgroundSize: 'cover', backgroundPosition: 'center'
        }} />
      ) : (
        <div style={{ position: 'absolute', inset: 0, background: '#f8fafc', zIndex: 0 }} />
      )}

      {/* 2. Dynamic Component Layer */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 10 }}>
        {/* Dynamic Elements from Template */}
        {template?.elements?.sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0)).map(el => (
          <div key={el.id} style={{
            position: 'absolute',
            top: `${el.y}%`,
            left: `${el.x}%`,
            transform: 'translate(-50%, -50%)',
            zIndex: el.zIndex || 1,
            pointerEvents: 'none'
          }}>
            {el.type === 'variable' && (
              <span style={{
                color: el.color || '#1e293b',
                fontSize: `${(el.fontSize || 24) * 1.2}px`,
                fontWeight: el.fontWeight || 600,
                fontFamily: el.fontFamily || 'serif',
                letterSpacing: el.letterSpacing || '0px',
                textAlign: 'center',
                whiteSpace: 'nowrap'
              }}>
                {data[el.key] || `[${el.key}]`}
              </span>
            )}
            {el.type === 'text' && (
              <span style={{
                color: el.color || '#1e293b',
                fontSize: `${(el.fontSize || 24) * 1.2}px`,
                fontWeight: el.fontWeight || 600,
                fontFamily: el.fontFamily || 'serif',
                letterSpacing: el.letterSpacing || '0px',
                textAlign: 'center',
                whiteSpace: 'nowrap'
              }}>
                {el.content}
              </span>
            )}
            {el.type === 'image' && (
              <img 
                src={el.url} 
                alt="Template Asset" 
                style={{ 
                  width: `${(el.width || 100) * 1.2}px`, 
                  height: 'auto',
                  opacity: el.opacity || 1
                }} 
              />
            )}
          </div>
        ))}

        {/* 3. Automatic Security & Identity Overlays */}
        {/* Institutional Watermark (Top Corner) */}
        <div style={{ position: 'absolute', top: '4%', left: '4%', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {branding?.logo && <img src={branding.logo} alt="Seal" style={{ maxHeight: '60px', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' }} />}
          <div style={{ borderLeft: '1px solid rgba(0,0,0,0.1)', paddingLeft: '1rem' }}>
             <p className="serif" style={{ fontSize: '1rem', fontWeight: 700, margin: 0, color: 'rgba(0,0,0,0.2)', letterSpacing: '2px' }}>AUTHPULSE</p>
          </div>
        </div>

        {/* TrustSeal QR (Bottom Right) */}
        <div style={{ position: 'absolute', bottom: '6%', right: '6%', textAlign: 'center' }}>
          <QRCodeSVG value={verificationUrl} size={90} />
          <p style={{ fontSize: '0.6rem', color: '#94a3b8', marginTop: '0.5rem', fontWeight: 600 }}>SCAN TO VERIFY</p>
        </div>

        {/* Integrity Hash (Bottom Left) */}
        <div style={{ position: 'absolute', bottom: '6%', left: '6%' }}>
          <p style={{ fontSize: '0.65rem', color: '#94a3b8', margin: 0, fontFamily: 'monospace', letterSpacing: '1px' }}>
            INTEGRITY HASH: {data.hash?.slice(0, 32)}...
          </p>
          <p style={{ fontSize: '0.6rem', color: '#94a3b8', marginTop: '0.2rem' }}>
            VERIFICATION ID: {data.certificateId}
          </p>
        </div>

        {/* Smart Layer Fallback: Automatically injects professional placement if no elements exist */}
        {(!template?.elements || template.elements.length === 0) && (
          <div style={{ 
            height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', 
            alignItems: 'center', padding: '10%', textAlign: 'center' 
          }}>
            <h1 className="serif" style={{ fontSize: '3.5rem', marginBottom: '1.5rem', color: '#1e293b' }}>
              Certificate of Excellence
            </h1>
            <p style={{ fontStyle: 'italic', color: '#64748b', fontSize: '1.2rem', marginBottom: '1rem' }}>
              This is to certify that
            </p>
            <h2 className="serif" style={{ fontSize: '3.5rem', margin: '0.5rem 0', color: branding?.colors?.primary || '#b45309' }}>
              {data.studentName}
            </h2>
            <p style={{ color: '#64748b', maxWidth: '600px', lineHeight: 1.6 }}>
              has successfully completed the professional program in <br/>
              <strong style={{ fontSize: '1.4rem', color: '#1e293b' }}>{data.internshipDomain}</strong>
            </p>
          </div>
        )}
      </div>
    </div>
  );
});

export default CertificateCard;
