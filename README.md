# CertiVerify - Enterprise Credential Ecosystem

**CertiVerify** is a sophisticated, high-end MERN-stack platform designed for the seamless issuance and instant verification of digital certificates. Built with a focus on "human-crafted" aesthetics and cryptographic security, it serves as a robust solution for organizations to manage professional credentials.

---

## 🌟 Core Features

### 🏢 Organization Management
- **Bespoke Branding**: Upload your organization seal and set a custom primary color palette to ensure certificates match your brand identity.
- **Digital Signatures**: Verified placement of authorized signatory seals directly on the credential.
- **Enterprise Dashboard**: A centralized console for analytics, bulk issuance, and audit tracking.

### 📜 Credential Security
- **Dynamic QR Verification**: Every certificate includes a unique QR code for instant mobile-based authenticity checks.
- **Blockchain Integrity Hashing**: Each record is secured with a SHA-256 cryptographic hash, ensuring credentials are tamper-proof.
- **Revocation System**: Full control over certificate status, allowing admins to revoke or restore credentials in real-time.

### ⚡ Automation & Growth
- **Bulk Spreadsheet Processing**: Issue hundreds of certificates in seconds by uploading standard `.xlsx` datasets.
- **LinkedIn "Add to Profile"**: One-click social integration for students to showcase their verified credentials to the world.
- **Universal Export**: Mass-export the entire certificate ecosystem into a compressed ZIP format for secure backups.

---

## 🎨 Design Philosophy
CertiVerify moves away from generic templates, utilizing a refined design language characterized by:
- **Sophisticated Typography**: A harmonious blend of *Playfair Display* (Serif) for authority and *Inter* (Sans-serif) for utility.
- **Architectural Whitespace**: A clean, breathable layout that emphasizes content clarity and professional elegance.
- **Micro-interactions**: Subtle, intentional animations that provide a premium user experience without distraction.

---

## 🛠 Tech Stack
- **Frontend**: React.js, Vite, Framer Motion, Recharts, Lucide Icons.
- **Backend**: Node.js, Express, Multer (File Processing), Adm-Zip.
- **Storage**: Portable JSON Architecture (Optimized for instant deployment).
- **Security**: SHA-256 Hashing, JWT-ready structure.

---

## 🚀 Quick Start

### 1. Installation
```bash
# Install server dependencies
cd server && npm install

# Install client dependencies
cd ../client && npm install
```

### 2. Launch the System
```bash
# Start the Backend (Port 5000)
cd server && npm start

# Start the Frontend (Port 5173)
cd client && npm run dev
```

### 3. Usage
- **Admin**: Click "Admin Portal" to access the Management Console (Default logic: Local JSON persistence).
- **Student**: Enter a Certificate ID on the landing page for instant verification.

---

## 📄 License
This project is proprietary and built for high-end professional use.

*Built with precision by Vansh jain.*
