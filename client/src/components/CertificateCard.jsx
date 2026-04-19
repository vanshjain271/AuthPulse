import React, { forwardRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';

const CertificateCard = forwardRef(({ data, branding }, ref) => {
  if (!data) return null;

  const verificationUrl = `https://certverify.com/verify/${data.certificateId}`;

  return (
    <div ref={ref} className="cert-preview" style={{
      maxWidth: '900px',
      margin: '0 auto',
      minHeight: '600px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      border: '2px solid' + (branding?.colors?.primary || '#1e293b'),
      padding: '4rem'
    }}>
      {/* Branding Logo */}
      {branding?.logo && (
        <div style={{ marginBottom: '2rem' }}>
          <img src={branding.logo} alt="Organization Logo" style={{ maxHeight: '60px', width: 'auto' }} />
        </div>
      )}

      {/* QR Code for Verification */}
      <div className="cert-qr">
        <QRCodeSVG value={verificationUrl} size={80} />
      </div>

      <div style={{ textAlign: 'center', width: '100%' }}>
        <h4 style={{ textTransform: 'uppercase', letterSpacing: '4px', color: '#64748b', fontSize: '0.8rem', marginBottom: '2rem' }}>
          Official Credential
        </h4>
        
        <h1 className="serif" style={{ fontSize: '3.5rem', marginBottom: '1.5rem', color: '#1e293b' }}>
          Certificate of Excellence
        </h1>
        
        <p style={{ fontSize: '1.1rem', color: '#64748b', fontStyle: 'italic', marginBottom: '1rem' }}>
          This certifies that
        </p>

        <h2 className="serif" style={{ fontSize: '2.8rem', color: branding?.colors?.primary || '#1e293b', marginBottom: '1.5rem' }}>
          {data.studentName}
        </h2>

        <p style={{ maxWidth: '600px', margin: '0 auto', color: '#334155', fontSize: '1.05rem', lineHeight: 1.8 }}>
          has honorably completed an intensive internship program specializing in 
          <span style={{ fontWeight: 600, display: 'block', margin: '0.5rem 0' }}>
            {data.internshipDomain}
          </span>
          concluding on <strong>{new Date(data.endDate).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</strong>.
        </p>

        {/* Footer with Signatures & Hash */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6rem', width: '100%' }}>
          <div style={{ textAlign: 'left' }}>
            <div style={{ borderBottom: '1px solid #94a3b8', width: '180px', height: '40px' }}>
              {/* Optional Signature Image Placeholder */}
            </div>
            <p style={{ fontSize: '0.75rem', marginTop: '0.5rem', color: '#94a3b8' }}>AUTHORIZED REPRESENTATIVE</p>
          </div>

          <div style={{ textAlign: 'right' }}>
            <p style={{ fontWeight: 600 }}>{new Date(data.issuedAt).getFullYear()}/V-{data.certificateId.slice(-4)}</p>
            <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>VERIFICATION ID</p>
          </div>
        </div>

        <div className="cert-hash">
          Blockchain Integrity Hash: {data.hash || 'GEN-UNVERIFIED-HASH-256'}
        </div>
      </div>
    </div>
  );
});

export default CertificateCard;
