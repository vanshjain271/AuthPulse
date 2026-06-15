import React, { forwardRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';

const CertificateCard = forwardRef(({ data, branding, template }, ref) => {
  if (!data) return null;

  const verificationUrl = `${window.location.origin}/verify/${data.certificateId}`;
  const canvasAspectRatio = template?.aspectRatio || 1.414;

  return (
    <div className="cert-wrapper">
      <div ref={ref} className="cert-container" style={{
        width: '100%',
        background: 'white',
        boxShadow: '0 20px 50px rgba(0,0,0,0.1)',
        position: 'relative',
        overflow: 'hidden',
        aspectRatio: `${canvasAspectRatio} / 1`,
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
              {el.type === 'variable' && el.key !== 'qrCode' && el.key !== 'integrityHash' && (
                <span style={{
                  color: el.color || '#1e293b',
                  fontSize: `${(el.fontSize || 24) / 10}cqw`,
                  fontWeight: el.fontWeight || 600,
                  fontFamily: el.fontFamily || 'serif',
                  letterSpacing: el.letterSpacing || '0px',
                  fontStyle: el.fontStyle || 'normal',
                  textAlign: 'center',
                  whiteSpace: 'nowrap',
                  opacity: el.opacity || 1
                }}>
                  {data[el.key] || `[${el.key}]`}
                </span>
              )}
              {el.type === 'variable' && el.key === 'qrCode' && (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: `${(el.width || 80) / 10}cqw` }}>
                  <QRCodeSVG value={verificationUrl} style={{ width: '100%', height: '100%' }} size={256} />
                  <span style={{ fontSize: `${(el.width || 80) * 0.01}cqw`, color: el.color || '#1e293b', marginTop: '0.4cqw', fontWeight: 600 }}>SCAN TO VERIFY</span>
                </div>
              )}
              {el.type === 'variable' && el.key === 'integrityHash' && (
                <div style={{ textAlign: el.textAlign || 'center' }}>
                  <p style={{ fontSize: `${(el.fontSize || 24) * 0.08}cqw`, color: el.color, margin: 0, fontFamily: 'monospace', letterSpacing: '0.1cqw' }}>
                    HASH: {data.hash?.slice(0, 32)}...
                  </p>
                </div>
              )}
              {el.type === 'text' && (
                <span style={{
                  color: el.color || '#1e293b',
                  fontSize: `${(el.fontSize || 24) / 10}cqw`,
                  fontWeight: el.fontWeight || 600,
                  fontFamily: el.fontFamily || 'serif',
                  letterSpacing: el.letterSpacing || '0px',
                  fontStyle: el.fontStyle || 'normal',
                  textAlign: 'center',
                  whiteSpace: 'nowrap',
                  opacity: el.opacity || 1
                }}>
                  {el.content}
                </span>
              )}
              {el.type === 'image' && (
                <img 
                  src={el.url} 
                  alt="Template Asset" 
                  style={{ 
                    width: `${(el.width || 100) / 10}cqw`, 
                    height: 'auto',
                    opacity: el.opacity || 1
                  }} 
                />
              )}
            </div>
          ))}

          {/* 3. Automatic Security & Identity Overlays */}
          {/* Institutional Watermark (Top Corner) */}
          <div style={{ position: 'absolute', top: '4%', left: '4%', display: 'flex', alignItems: 'center', gap: '1.6cqw' }}>
            {branding?.logo && <img src={branding.logo} alt="Seal" style={{ maxHeight: '6cqw', filter: 'drop-shadow(0 0.2cqw 0.4cqw rgba(0,0,0,0.1))' }} />}
            <div style={{ borderLeft: '0.1cqw solid rgba(0,0,0,0.1)', paddingLeft: '1.6cqw' }}>
               <p className="serif" style={{ fontSize: '1.6cqw', fontWeight: 700, margin: 0, color: 'rgba(0,0,0,0.2)', letterSpacing: '0.2cqw' }}>AUTHPULSE</p>
            </div>
          </div>

          {/* Fallback Security Layers (Only render if user didn't explicitly place them in TemplateDesigner) */}
          {!template?.elements?.find(e => e.key === 'qrCode') && (
            <div style={{ position: 'absolute', bottom: '6%', right: '6%', textAlign: 'center', width: '9cqw' }}>
              <QRCodeSVG value={verificationUrl} style={{ width: '100%', height: '100%' }} size={256} />
              <p style={{ fontSize: '1cqw', color: '#94a3b8', marginTop: '0.5cqw', fontWeight: 600 }}>SCAN TO VERIFY</p>
            </div>
          )}

          {!template?.elements?.find(e => e.key === 'integrityHash') && (
            <div style={{ position: 'absolute', bottom: '6%', left: '6%' }}>
              <p style={{ fontSize: '1.1cqw', color: '#94a3b8', margin: 0, fontFamily: 'monospace', letterSpacing: '0.1cqw' }}>
                INTEGRITY HASH: {data.hash?.slice(0, 32)}...
              </p>
              <p style={{ fontSize: '1cqw', color: '#94a3b8', marginTop: '0.2cqw' }}>
                VERIFICATION ID: {data.certificateId}
              </p>
            </div>
          )}

          {/* Smart Layer Fallback: Automatically injects professional placement if no elements exist */}
          {(!template?.elements || template.elements.length === 0) && (
            <div style={{ 
              height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', 
              alignItems: 'center', padding: '10%', textAlign: 'center' 
            }}>
              <h1 className="serif" style={{ fontSize: '5.5cqw', marginBottom: '2.5cqw', color: '#1e293b' }}>
                Certificate of Excellence
              </h1>
              <p style={{ fontStyle: 'italic', color: '#64748b', fontSize: '2cqw', marginBottom: '1.6cqw' }}>
                This is to certify that
              </p>
              <h2 className="serif" style={{ fontSize: '5.5cqw', margin: '0.8cqw 0', color: branding?.colors?.primary || '#b45309' }}>
                {data.studentName}
              </h2>
              <p style={{ color: '#64748b', maxWidth: '60cqw', lineHeight: 1.6, fontSize: '1.8cqw' }}>
                has successfully completed the professional program in <br/>
                <strong style={{ fontSize: '2.2cqw', color: '#1e293b' }}>{data.internshipDomain}</strong>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

export default CertificateCard;
