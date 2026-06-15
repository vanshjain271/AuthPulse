/**
 * AuthPulse Built-in Starter Templates
 * 6 professionally designed certificate templates with pre-placed elements.
 * Organizations can pick one and customize it to match their brand.
 */

export const STARTER_TEMPLATES = [
  {
    id: 'starter-classic-gold',
    name: 'Classic Gold',
    thumbnail: 'https://images.unsplash.com/photo-1618005198919-d3d4b5a16eda?auto=format&fit=crop&q=80&w=400&h=283',
    background: 'https://images.unsplash.com/photo-1618005198919-d3d4b5a16eda?auto=format&fit=crop&q=80&w=2000',
    aspectRatio: 1.414,
    elements: [
      { id: 'heading', type: 'text', content: 'CERTIFICATE OF ACHIEVEMENT', x: 50, y: 20, fontSize: 28, fontWeight: 800, color: '#d4a017', fontFamily: 'Cinzel', letterSpacing: '4px', zIndex: 10 },
      { id: 'sub1', type: 'text', content: 'This is to proudly certify that', x: 50, y: 35, fontSize: 16, fontWeight: 400, color: '#ffffffcc', fontFamily: 'EB Garamond', letterSpacing: '1px', zIndex: 10 },
      { id: 'name', type: 'variable', key: 'studentName', x: 50, y: 48, fontSize: 52, fontWeight: 700, color: '#FFD700', fontFamily: 'Playfair Display', zIndex: 20 },
      { id: 'sub2', type: 'text', content: 'has successfully completed the professional program in', x: 50, y: 60, fontSize: 15, fontWeight: 400, color: '#ffffffbb', fontFamily: 'EB Garamond', zIndex: 10 },
      { id: 'domain', type: 'variable', key: 'internshipDomain', x: 50, y: 70, fontSize: 26, fontWeight: 700, color: '#ffffff', fontFamily: 'Montserrat', zIndex: 20 },
      { id: 'date', type: 'variable', key: 'issueDate', x: 50, y: 82, fontSize: 14, fontWeight: 400, color: '#ffffff88', fontFamily: 'Inter', zIndex: 10 },
    ]
  },
  {
    id: 'starter-modern-minimal',
    name: 'Modern Minimal',
    thumbnail: 'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?auto=format&fit=crop&q=80&w=400&h=283',
    background: 'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?auto=format&fit=crop&q=80&w=2000',
    aspectRatio: 1.414,
    elements: [
      { id: 'line-top', type: 'text', content: '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', x: 50, y: 18, fontSize: 12, fontWeight: 400, color: '#2563eb', fontFamily: 'Inter', zIndex: 5 },
      { id: 'heading', type: 'text', content: 'Certificate of Completion', x: 50, y: 27, fontSize: 34, fontWeight: 700, color: '#1e293b', fontFamily: 'Inter', letterSpacing: '-1px', zIndex: 10 },
      { id: 'sub1', type: 'text', content: 'Presented to', x: 50, y: 38, fontSize: 14, fontWeight: 400, color: '#64748b', fontFamily: 'Inter', zIndex: 10 },
      { id: 'name', type: 'variable', key: 'studentName', x: 50, y: 50, fontSize: 48, fontWeight: 800, color: '#2563eb', fontFamily: 'Inter', zIndex: 20 },
      { id: 'sub2', type: 'text', content: 'for outstanding completion of', x: 50, y: 62, fontSize: 14, fontWeight: 400, color: '#64748b', fontFamily: 'Inter', zIndex: 10 },
      { id: 'domain', type: 'variable', key: 'internshipDomain', x: 50, y: 71, fontSize: 22, fontWeight: 700, color: '#1e293b', fontFamily: 'Inter', zIndex: 20 },
      { id: 'line-bot', type: 'text', content: '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', x: 50, y: 80, fontSize: 12, fontWeight: 400, color: '#2563eb', fontFamily: 'Inter', zIndex: 5 },
      { id: 'date', type: 'variable', key: 'issueDate', x: 50, y: 88, fontSize: 13, fontWeight: 400, color: '#94a3b8', fontFamily: 'Inter', zIndex: 10 },
    ]
  },
  {
    id: 'starter-academic-blue',
    name: 'Academic Blue',
    thumbnail: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=400&h=283',
    background: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=2000',
    aspectRatio: 1.414,
    elements: [
      { id: 'org', type: 'text', content: 'AUTHPULSE ACADEMY', x: 50, y: 16, fontSize: 14, fontWeight: 700, color: '#93c5fd', fontFamily: 'Cinzel', letterSpacing: '6px', zIndex: 10 },
      { id: 'heading', type: 'text', content: 'CERTIFICATE OF EXCELLENCE', x: 50, y: 28, fontSize: 30, fontWeight: 800, color: '#ffffff', fontFamily: 'Cinzel', letterSpacing: '3px', zIndex: 10 },
      { id: 'sub1', type: 'text', content: 'This certifies that', x: 50, y: 40, fontSize: 15, fontWeight: 300, color: '#bfdbfe', fontFamily: 'EB Garamond', zIndex: 10 },
      { id: 'name', type: 'variable', key: 'studentName', x: 50, y: 52, fontSize: 46, fontWeight: 700, color: '#ffffff', fontFamily: 'Playfair Display', zIndex: 20 },
      { id: 'sub2', type: 'text', content: 'has demonstrated excellence in the field of', x: 50, y: 64, fontSize: 14, fontWeight: 300, color: '#bfdbfe', fontFamily: 'EB Garamond', zIndex: 10 },
      { id: 'domain', type: 'variable', key: 'internshipDomain', x: 50, y: 74, fontSize: 24, fontWeight: 700, color: '#93c5fd', fontFamily: 'Montserrat', zIndex: 20 },
      { id: 'date', type: 'variable', key: 'issueDate', x: 25, y: 87, fontSize: 12, fontWeight: 400, color: '#93c5fd88', fontFamily: 'Inter', zIndex: 10 },
      { id: 'certid', type: 'variable', key: 'certificateId', x: 75, y: 87, fontSize: 12, fontWeight: 400, color: '#93c5fd88', fontFamily: 'Inter', zIndex: 10 },
    ]
  },
  {
    id: 'starter-tech-dark',
    name: 'Tech Achievement',
    thumbnail: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=400&h=283',
    background: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=2000',
    aspectRatio: 1.414,
    elements: [
      { id: 'heading', type: 'text', content: '[ CERTIFICATE OF ACHIEVEMENT ]', x: 50, y: 20, fontSize: 20, fontWeight: 700, color: '#34d399', fontFamily: 'Roboto Slab', letterSpacing: '2px', zIndex: 10 },
      { id: 'sub1', type: 'text', content: 'Awarded to', x: 50, y: 33, fontSize: 14, fontWeight: 400, color: '#94a3b8', fontFamily: 'Inter', zIndex: 10 },
      { id: 'name', type: 'variable', key: 'studentName', x: 50, y: 47, fontSize: 50, fontWeight: 800, color: '#f0f9ff', fontFamily: 'Montserrat', zIndex: 20 },
      { id: 'sub2', type: 'text', content: 'for completing advanced training in', x: 50, y: 60, fontSize: 14, fontWeight: 400, color: '#94a3b8', fontFamily: 'Inter', zIndex: 10 },
      { id: 'domain', type: 'variable', key: 'internshipDomain', x: 50, y: 70, fontSize: 28, fontWeight: 700, color: '#34d399', fontFamily: 'Roboto Slab', zIndex: 20 },
      { id: 'date', type: 'variable', key: 'issueDate', x: 50, y: 83, fontSize: 12, fontWeight: 400, color: '#475569', fontFamily: 'Inter', letterSpacing: '3px', zIndex: 10 },
    ]
  },
  {
    id: 'starter-internship',
    name: 'Internship Certificate',
    thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400&h=283',
    background: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=2000',
    aspectRatio: 1.414,
    elements: [
      { id: 'heading', type: 'text', content: 'INTERNSHIP COMPLETION CERTIFICATE', x: 50, y: 18, fontSize: 22, fontWeight: 800, color: '#1e293b', fontFamily: 'Montserrat', letterSpacing: '2px', zIndex: 10 },
      { id: 'sub1', type: 'text', content: 'This is to certify that', x: 50, y: 30, fontSize: 16, fontWeight: 400, color: '#475569', fontFamily: 'EB Garamond', zIndex: 10 },
      { id: 'name', type: 'variable', key: 'studentName', x: 50, y: 43, fontSize: 46, fontWeight: 700, color: '#7c3aed', fontFamily: 'Playfair Display', zIndex: 20 },
      { id: 'sub2', type: 'text', content: 'has successfully completed an internship in', x: 50, y: 55, fontSize: 15, fontWeight: 400, color: '#475569', fontFamily: 'EB Garamond', zIndex: 10 },
      { id: 'domain', type: 'variable', key: 'internshipDomain', x: 50, y: 65, fontSize: 26, fontWeight: 700, color: '#1e293b', fontFamily: 'Montserrat', zIndex: 20 },
      { id: 'sub3', type: 'text', content: 'during the period ending on', x: 50, y: 75, fontSize: 14, fontWeight: 400, color: '#64748b', fontFamily: 'Inter', zIndex: 10 },
      { id: 'date', type: 'variable', key: 'issueDate', x: 50, y: 83, fontSize: 18, fontWeight: 600, color: '#7c3aed', fontFamily: 'Inter', zIndex: 20 },
    ]
  },
  {
    id: 'starter-workshop',
    name: 'Workshop Completion',
    thumbnail: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=400&h=283',
    background: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=2000',
    aspectRatio: 1.414,
    elements: [
      { id: 'heading', type: 'text', content: '🎓 WORKSHOP COMPLETION', x: 50, y: 20, fontSize: 24, fontWeight: 800, color: '#ffffff', fontFamily: 'Montserrat', letterSpacing: '2px', zIndex: 10 },
      { id: 'sub1', type: 'text', content: 'We are delighted to recognize', x: 50, y: 33, fontSize: 16, fontWeight: 400, color: '#ffffff99', fontFamily: 'Inter', zIndex: 10 },
      { id: 'name', type: 'variable', key: 'studentName', x: 50, y: 47, fontSize: 48, fontWeight: 800, color: '#fbbf24', fontFamily: 'Playfair Display', zIndex: 20 },
      { id: 'sub2', type: 'text', content: 'for attending and completing the workshop on', x: 50, y: 60, fontSize: 14, fontWeight: 400, color: '#ffffffcc', fontFamily: 'Inter', zIndex: 10 },
      { id: 'domain', type: 'variable', key: 'internshipDomain', x: 50, y: 70, fontSize: 26, fontWeight: 700, color: '#ffffff', fontFamily: 'Montserrat', zIndex: 20 },
      { id: 'date', type: 'variable', key: 'issueDate', x: 50, y: 82, fontSize: 13, fontWeight: 400, color: '#ffffff77', fontFamily: 'Inter', zIndex: 10 },
    ]
  }
];
