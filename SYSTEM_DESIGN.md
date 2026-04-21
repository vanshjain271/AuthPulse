# AuthPulse: System Architectural Design

**Project Title**: Pro-Grade Credentialing & Blockchain-Inspired Verification Ecosystem  
**Author**: AuthPulse Engineering Team  
**Scope**: Institutional Automation, Fraud Protection, and Digital Design

---

## 1. Executive Summary
AuthPulse is a high-performance credentialing platform designed to eliminate credential fraud while providing world-class design flexibility. The system bridges the gap between premium design tools (like Canva) and automated verification systems (SHA-256 integrity checks). It features a "Creator Engine" for sub-pixel design precision and a "TrustSeal" QR-based verification portal.

---

## 2. High-Level Architecture

```mermaid
graph TD
    A[Canva / Design Tool] -->|PNG Export| B[Creator Engine]
    B -->|Template Mapping| C[Admin Command Center]
    C -->|Batch Issuance| D[JSON Persistence Layer]
    D -->|Hash Generation| E[Cryptographic Verification Hub]
    
    subgraph "Frontend (React + Vite)"
        B
        C
        F[Public Verification Portal]
    end
    
    subgraph "Backend (Node.js + Express)"
        G[Template Engine]
        H[Security Middleware]
        I[Integrity Manager]
    end
    
    G --> B
    H --> F
    I --> D
```

---

## 3. Core Modules

### 3.1 The Creator Engine (Canva Bridge)
Unlike standard PDF generators, AuthPulse uses a proprietary **A4-Standard Rendering Engine** that enforces a rigid 1.414:1 aspect ratio. 
- **Polymorphic Elements**: Supports Dynamic Variables (Student Data), Static Text (Signatures), and Image Assets (Logos/Seals).
- **Z-Index Layering**: Implements a CSS-Grid based coordinate system to ensure zero layout-shift across different screen resolutions.

### 3.2 Security & Integrity Layer
Every certificate is immutable once issued. The system employs:
- **SHA-256 Hashing**: A unique integrity hash is generated for every credential based on Student ID, Name, Domain, and Issue Date.
- **TrustSeal QR**: An automated QR code that leads directly to the verification page for that specific hash.
- **Status Management**: Real-time revocation/restoration capabilities for institutional control.

### 3.3 Admin Command Center
- **Template Synchronization**: Bi-directional sync between the designer and the issuance engine.
- **Analytics Dashboard**: Granular metrics on mass-issued credentials and usage patterns.

---

## 4. Technical Stack

| Category | Technology | Rationale |
| :--- | :--- | :--- |
| **Frontend** | React 18 (Vite) | High-speed HMR and component-based design. |
| **UI/UX** | Framer Motion | Fluid transitions for the 'Creator Engine' experience. |
| **Icons** | Lucide-React | Crisp, lightweight vector iconography. |
| **Backend** | Node.js (Express) | Asynchronous handling of file uploads and hash generation. |
| **Security** | Crypto-JS | Industry-standard implementation of SHA-256. |
| **Persistence** | Structured JSON | Low-latency local storage for mock deployment. |

---

## 5. Sequence Diagram: Data Flow

```mermaid
sequenceDiagram
    participant Admin
    participant CreatorEngine
    participant Backend
    participant Verifier

    Admin->>CreatorEngine: Upload Canva PNG & Map Variables
    CreatorEngine->>Backend: Save Template Config (Coordinates)
    Admin->>Backend: Issue Batch (Student List)
    Backend->>Backend: Generate Unique SHA-256 Hashes
    Backend->>Admin: Confirm Issuance
    Verifier->>Backend: Scan QR Code
    Backend->>Verifier: Return "VALID" + Student Data
```

---

## 6. Portability & Scaling
The system is designed with a **Headless Architecture**, meaning the Frontend Designer can be swapped or the JSON persistence can be migrated to MongoDB/PostgreSQL with minimal refactoring of the service layer.

---

**© 2026 AuthPulse Project | Developed for Academic & Institutional Excellence**
