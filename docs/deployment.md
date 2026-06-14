# Deployment Guide

## Overview

QuickShare consists of two independently deployed applications:

1. Frontend (React + Vite)
2. Backend (Node.js + Express + Socket.io)

The recommended deployment architecture is:

```text
Frontend → Vercel
Backend  → Render
```

This setup provides:

* HTTPS support
* Automatic deployments
* GitHub integration
* WebSocket compatibility
* Global CDN for frontend assets

---

# Deployment Architecture

```text
┌────────────────────────────┐
│          Vercel            │
│       React Frontend       │
└─────────────┬──────────────┘
              │
              │ Socket.io
              ▼
┌────────────────────────────┐
│          Render            │
│  Express + Socket.io API   │
└─────────────┬──────────────┘
              │
              │ WebRTC Signaling
              ▼

      Browser ↔ Browser

      WebRTC Data Channel
```

---

# Prerequisites

Before deployment:

* GitHub repository created
* Frontend completed
* Backend completed
* Environment variables configured
* Production builds tested locally

---

# Repository Structure

```text
quickshare/
│
├── client/
├── server/
├── shared/
├── docs/
│
├── render.yaml
├── package.json
├── README.md
└── .gitignore
```

---

# Backend Deployment (Render)

The backend acts as a signaling server.

Responsibilities:

* Room management
* Offer forwarding
* Answer forwarding
* ICE candidate forwarding
* Connection lifecycle management

No file data is stored or processed.

---

# Step 1: Push Repository

Push project to GitHub.

```bash
git init

git add .

git commit -m "Initial commit"

git branch -M main

git remote add origin <repository-url>

git push -u origin main
```

---

# Step 2: Create Render Service

1. Log in to Render.
2. Click **New Web Service**.
3. Connect GitHub repository.
4. Select repository.
5. Configure deployment.

---

# Step 3: render.yaml

QuickShare uses Infrastructure as Code.

Create:

```text
render.yaml
```

Contents:

```yaml
services:
  - type: web
    name: quickshare-server
    runtime: node

    rootDir: server

    buildCommand: npm ci
    startCommand: npm start

    healthCheckPath: /

    envVars:
      - key: NODE_ENV
        value: production

      - key: CLIENT_URL
        sync: false
```

---

# Step 4: Environment Variables

Add environment variables in Render dashboard.

## Required Variables

```env
NODE_ENV=production
```

```env
CLIENT_URL=https://your-frontend.vercel.app
```

Example:

```env
CLIENT_URL=https://quickshare.vercel.app
```

---

# Step 5: Health Check Endpoint

Render periodically checks service availability.

Create endpoint:

```javascript
app.get("/", (req, res) => {
  res.status(200).json({
    status: "ok",
    service: "QuickShare Signaling Server"
  });
});
```

Expected response:

```json
{
  "status": "ok",
  "service": "QuickShare Signaling Server"
}
```

---

# Step 6: Deploy

Render automatically:

```text
Clone Repository
        │
        ▼
Install Dependencies
        │
        ▼
Build Application
        │
        ▼
Start Server
        │
        ▼
Generate Public URL
```

Example:

```text
https://quickshare-server.onrender.com
```

Save this URL.

It will be required by the frontend.

---

# Frontend Deployment (Vercel)

The frontend is responsible for:

* User interface
* Room creation
* Room joining
* WebRTC connection management
* File transfer handling

---

# Step 1: Create Vercel Project

1. Log in to Vercel.
2. Click **Add New Project**.
3. Import GitHub repository.
4. Select project.

---

# Step 2: Configure Root Directory

Set:

```text
Root Directory
```

to:

```text
client
```

---

# Step 3: Build Settings

Vercel should automatically detect:

```text
Framework:
Vite
```

Build settings:

```text
Build Command:
npm run build
```

```text
Output Directory:
dist
```

---

# Step 4: Frontend Environment Variables

Add:

```env
VITE_SERVER_URL=https://quickshare-server.onrender.com
```

Replace with actual Render URL.

Example:

```env
VITE_SERVER_URL=https://quickshare-server.onrender.com
```

---

# Step 5: Vite Configuration

Access environment variable:

```javascript
const SERVER_URL =
  import.meta.env.VITE_SERVER_URL;
```

Socket initialization:

```javascript
import { io } from "socket.io-client";

const socket = io(SERVER_URL);
```

---

# Step 6: Deploy

Vercel automatically:

```text
Clone Repository
        │
        ▼
Install Dependencies
        │
        ▼
Build Frontend
        │
        ▼
Publish Static Assets
```

Example:

```text
https://quickshare.vercel.app
```

---

# Production Environment Variables

## Backend

```env
NODE_ENV=production

CLIENT_URL=https://quickshare.vercel.app
```

---

## Frontend

```env
VITE_SERVER_URL=https://quickshare-server.onrender.com
```

---

# CORS Configuration

Backend should only allow requests from the deployed frontend.

Example:

```javascript
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST"]
  }
});
```

---

# Client Routing

QuickShare uses React Router.

Vercel must redirect all routes to:

```text
index.html
```

Create:

```text
client/vercel.json
```

Contents:

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

---

# HTTPS Requirements

WebRTC requires secure contexts.

Production deployments must use:

```text
https://
```

Examples:

```text
https://quickshare.vercel.app
```

```text
https://quickshare-server.onrender.com
```

Modern browsers may block WebRTC functionality on insecure origins.

---

# Deployment Verification Checklist

## Backend

Verify:

* Server starts successfully
* WebSocket connection works
* Health endpoint responds
* CORS configured correctly
* Room creation works

---

## Frontend

Verify:

* Application loads
* Room links work
* React Router works
* Socket connection succeeds

---

## WebRTC

Verify:

* Offer creation works
* Answer creation works
* ICE candidates exchanged
* Peer connection established

---

## File Transfer

Verify:

* File metadata sent
* Chunks transmitted
* Progress updates displayed
* Download generated
* SHA-256 verification passes

---

# Troubleshooting

## Socket Connection Failed

Check:

```env
VITE_SERVER_URL
```

Verify backend URL is correct.

---

## CORS Error

Check:

```env
CLIENT_URL
```

Verify frontend domain matches deployed URL.

---

## Room Join Fails

Verify:

* Backend running
* Socket connected
* Room exists

---

## WebRTC Not Connecting

Check:

* ICE candidates exchanged
* STUN servers reachable
* Browser supports WebRTC

---

## Hash Verification Failed

Possible causes:

* Corrupted chunks
* Incomplete transfer
* Reconstruction error

Review chunk handling logic.

---

# Future Deployment Improvements

Potential production enhancements:

* Dedicated TURN server
* Docker deployment
* Kubernetes deployment
* Cloud monitoring
* Logging and analytics
* CI/CD workflows
* Custom domain support

---

# Summary

QuickShare uses a distributed deployment architecture where the React frontend is hosted on Vercel and the Node.js signaling server is hosted on Render. The backend handles only signaling operations while actual file transfers occur directly between browsers through WebRTC Data Channels, enabling secure and efficient peer-to-peer communication.
