# Security Considerations

## Overview

QuickShare is designed with privacy, integrity, and minimal server trust in mind.

Unlike traditional file-sharing platforms, QuickShare does not upload files to a central server. Instead, files are transferred directly between browsers using WebRTC Data Channels.

This document describes the security model, threat considerations, and protection mechanisms implemented within the application.

---

# Security Goals

QuickShare aims to achieve the following:

* Direct peer-to-peer communication
* No file storage on the backend
* Minimal server trust
* File integrity verification
* Room isolation
* Secure browser communication
* Reduced attack surface

---

# Security Architecture

```text id="aqw19e"
Sender Browser
      │
      │
      │ WebRTC Data Channel
      ▼
Receiver Browser

          ▲
          │
          │ Signaling Only
          │
          ▼

     Signaling Server
```

The signaling server is responsible only for connection negotiation.

File contents never pass through the server.

---

# Threat Model

QuickShare assumes:

### Trusted Participants

The sender and receiver intentionally share files.

### Untrusted Network

Internet infrastructure between peers may be monitored.

### Untrusted Server

The signaling server should not be trusted with user files.

### Malicious Users

Users may attempt to:

* Join invalid rooms
* Spam room creation
* Send malformed signaling data

The application should mitigate these risks.

---

# Direct Peer-to-Peer Transfer

## Traditional File Sharing

Traditional systems:

```text id="z5okwx"
Sender
   │
   ▼
Server
   │
   ▼
Receiver
```

The server sees:

* File contents
* Metadata
* Transfer history

---

## QuickShare Model

QuickShare uses:

```text id="48k28n"
Sender
   │
   ▼
Receiver
```

The backend only assists with connection setup.

Benefits:

* Reduced server exposure
* Lower infrastructure costs
* Improved privacy
* Faster transfer speeds

---

# No File Storage

QuickShare never stores:

* Files
* Chunks
* Hashes
* Downloads
* Upload history

The backend never writes user file data to:

```text id="13esvr"
Database
Disk
Object Storage
Cache
Memory Buffers
```

Only temporary signaling information is retained.

---

# Signaling Server Limitations

The signaling server only relays:

```text id="9d28x4"
Offer
Answer
ICE Candidate
```

Example:

```javascript id="jlwm9m"
socket.emit("offer", offer);
```

The server forwards messages but never interprets file contents.

---

# Room Isolation

Each room supports exactly two peers.

Structure:

```javascript id="zud0zl"
{
  roomId: "ABC123",
  sender: "socket-1",
  receiver: "socket-2"
}
```

Restrictions:

* One sender
* One receiver
* No spectators
* No multi-user rooms

Benefits:

* Reduced complexity
* Reduced attack surface
* Better privacy

---

# Unique Room IDs

Each room receives a randomly generated identifier.

Example:

```text id="58x99r"
ABC123
```

Characteristics:

* Randomly generated
* Short-lived
* Temporary

Purpose:

* Prevent accidental collisions
* Separate active sessions

---

# Secure Transport

## HTTPS

Production deployments must use HTTPS.

Examples:

```text id="gv5xq7"
https://quickshare.vercel.app
```

```text id="y17wof"
https://quickshare-server.onrender.com
```

Benefits:

* Encrypted signaling traffic
* Protection against interception
* Browser WebRTC compatibility

---

## Secure WebSockets

Socket.io connections use:

```text id="0p84a4"
wss://
```

instead of:

```text id="f0y68s"
ws://
```

Benefits:

* Encrypted signaling messages
* Reduced MITM risk
* Secure browser communication

---

# WebRTC Security

WebRTC includes built-in encryption.

All peer-to-peer traffic is protected using:

```text id="nrt07w"
DTLS
SRTP
```

Benefits:

* Confidentiality
* Integrity
* Authentication

Even if network traffic is intercepted, file contents remain protected.

---

# File Integrity Verification

QuickShare verifies every transferred file.

Algorithm:

```text id="ujml5r"
SHA-256
```

---

## Sender Process

```text id="9sp96q"
File
 │
 ▼
SHA-256
 │
 ▼
Hash
```

---

## Receiver Process

```text id="a3whl3"
Received File
 │
 ▼
SHA-256
 │
 ▼
Hash
```

---

## Comparison

Hashes must match.

Success:

```text id="w3vd57"
✓ File Verified
```

Failure:

```text id="m4sn3n"
✗ Verification Failed
```

Benefits:

* Detect corruption
* Detect incomplete transfers
* Verify reconstruction accuracy

---

# Input Validation

The server validates:

* Room IDs
* Socket events
* Connection requests

Example checks:

```text id="q9x9px"
Room exists
Room not full
Valid event payload
Valid socket connection
```

Benefits:

* Reduced abuse
* Reduced crashes
* Improved stability

---

# Connection Cleanup

When a peer disconnects:

```text id="7pkcfi"
Socket Disconnect
       │
       ▼
Room Cleanup
       │
       ▼
Memory Released
```

Benefits:

* Prevent stale rooms
* Prevent memory leaks
* Prevent orphan sessions

---

# Denial of Service Considerations

Potential abuse:

```text id="8g34hf"
Excessive room creation
Rapid connections
Malformed signaling messages
```

Mitigations:

* Room validation
* Connection cleanup
* Input checks
* Socket lifecycle management

Future improvements:

* Rate limiting
* IP throttling
* CAPTCHA protection

---

# File Size Considerations

Large files can increase memory usage.

Current protection:

```text id="pnskpk"
Chunking
Flow Control
Buffered Amount Monitoring
```

Benefits:

* Reduced browser memory pressure
* Improved transfer stability
* Better user experience

---

# Browser Security

QuickShare relies on browser security mechanisms.

Features used:

```text id="mpv67u"
WebRTC
Web Crypto API
Blob API
File API
```

These APIs are sandboxed by the browser.

The application cannot access arbitrary user files.

Users explicitly select files before transfer.

---

# CORS Protection

Backend CORS configuration should restrict access to the deployed frontend.

Example:

```javascript id="hq62s2"
cors({
  origin: process.env.CLIENT_URL
});
```

Benefits:

* Reduced unauthorized access
* Improved deployment security

---

# Environment Variable Protection

Sensitive configuration should be stored in environment variables.

Examples:

```env id="m3l7bh"
CLIENT_URL
```

```env id="jdx70u"
NODE_ENV
```

Environment variables should never be committed to Git.

---

# Data Privacy Summary

The backend can see:

```text id="8y55xj"
Room IDs
Socket IDs
Offer Messages
Answer Messages
ICE Candidates
```

The backend cannot see:

```text id="ynlzwr"
File Contents
File Chunks
Downloaded Files
Transfered Data
SHA-256 Verification Results
```

---

# Current Security Limitations

The current version does not implement:

```text id="zdy8z4"
User Authentication
Access Control Lists
End-to-End File Encryption Layer
Rate Limiting
TURN Authentication
```

These may be added in future releases.

---

# Future Security Enhancements

Potential improvements:

### Password Protected Rooms

```text id="1ahqko"
Room Passwords
```

### End-to-End File Encryption

```text id="6x9z4h"
AES-256 Encryption
```

### Authenticated Sessions

```text id="ct8c7q"
JWT Authentication
```

### Rate Limiting

```text id="9z68ya"
Request Throttling
```

### TURN Infrastructure

```text id="sqj7jp"
Authenticated TURN Servers
```

---

# Security Best Practices

Users should:

* Share room links only with trusted recipients
* Verify file names before downloading
* Use modern browsers
* Use HTTPS deployments
* Close rooms after transfer

---

# Summary

QuickShare follows a privacy-focused security model based on direct browser-to-browser communication. The backend acts only as a signaling server and never stores or processes file contents. WebRTC provides encrypted peer-to-peer communication, while SHA-256 hashing ensures file integrity after transfer. By minimizing server involvement and leveraging browser security features, QuickShare delivers secure and efficient file sharing with a reduced attack surface.
