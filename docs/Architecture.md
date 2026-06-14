# QuickShare Architecture

## Overview

QuickShare is a secure browser-to-browser file sharing application built using WebRTC Data Channels. The application enables users to transfer files directly between devices without uploading file contents to a central server.

The backend acts solely as a signaling server responsible for exchanging WebRTC connection information between peers. Once a connection is established, all file data travels directly between browsers.

### Key Characteristics

* Peer-to-peer file transfer
* No file storage on server
* End-to-end browser communication
* Real-time transfer statistics
* SHA-256 file integrity verification
* Room-based connection management
* Cross-platform support

---

# System Architecture

```text
┌─────────────────────────────────────────────┐
│                 Frontend                    │
│                 React.js                    │
└─────────────────────────────────────────────┘
                     │
                     │ Socket.io
                     ▼
┌─────────────────────────────────────────────┐
│              Signaling Server               │
│            Node.js + Express.js             │
│                Socket.io                    │
└─────────────────────────────────────────────┘
                     ▲
                     │
                     │ WebRTC Signaling
                     │
                     ▼

      ┌───────────────────────────────┐
      │       Peer-to-Peer Layer      │
      │     WebRTC Data Channel       │
      └───────────────────────────────┘
                 │           │
                 ▼           ▼

          Sender Browser  Receiver Browser
```

---

# High-Level Workflow

1. Sender selects a file.
2. Sender creates a room.
3. Backend generates a unique room ID.
4. Sender shares the room link.
5. Receiver joins the room.
6. Signaling server exchanges WebRTC signaling messages.
7. Peer connection is established.
8. Sender transmits file chunks through WebRTC Data Channel.
9. Receiver reconstructs the file.
10. SHA-256 hashes are compared.
11. Receiver downloads the verified file.

---

# Project Structure

```text
quickshare/
│
├── client/
├── server/
├── shared/
├── docs/
│
├── README.md
├── package.json
├── render.yaml
└── .gitignore
```

---

# Frontend Architecture

The frontend is built using React and is responsible for user interaction, WebRTC management, file processing, and transfer visualization.

## Frontend Responsibilities

* File selection
* Room creation
* Room joining
* WebRTC connection management
* Data channel communication
* Transfer progress tracking
* Hash generation and verification
* Download handling

---

## Frontend Modules

### Pages

```text
pages/
├── Home.jsx
├── CreateRoom.jsx
├── JoinRoom.jsx
└── TransferPage.jsx
```

### Components

```text
components/
├── FileDropzone.jsx
├── ProgressBar.jsx
├── ConnectionStatus.jsx
├── TransferStats.jsx
├── HashVerification.jsx
└── RoomLinkCard.jsx
```

### Services

```text
services/
├── socket.js
├── peerConnection.js
└── fileTransfer.js
```

### Context API

```text
context/
├── RoomContext.jsx
└── TransferContext.jsx
```

### Utilities

```text
utils/
├── chunkFile.js
├── hashFile.js
├── formatBytes.js
├── calculateSpeed.js
└── calculateETA.js
```

---

# Backend Architecture

The backend is intentionally lightweight and functions exclusively as a signaling server.

## Backend Responsibilities

* Room creation
* Room validation
* Room cleanup
* Offer forwarding
* Answer forwarding
* ICE candidate forwarding
* Peer disconnection handling

The backend never receives, stores, or processes file contents.

---

## Backend Modules

```text
server/src/
│
├── socket/
│   ├── socketHandler.js
│   └── roomManager.js
│
├── config/
│   └── cors.js
│
├── middleware/
│   └── errorHandler.js
│
├── app.js
└── server.js
```

---

# Shared Module

The shared folder contains constants and event definitions used by both frontend and backend.

```text
shared/
├── constants.js
└── events.js
```

Benefits:

* Single source of truth
* Prevents event name mismatches
* Simplifies maintenance
* Improves code consistency

---

# Room Management

Each room supports exactly two participants:

* Sender
* Receiver

Room state is stored in memory.

Example:

```javascript
{
  "ABC123": {
    sender: "socket-id-1",
    receiver: "socket-id-2"
  }
}
```

Room lifecycle:

```text
Create Room
      │
      ▼
Join Room
      │
      ▼
Connected
      │
      ▼
Transfer Complete
      │
      ▼
Room Deleted
```

---

# WebRTC Architecture

WebRTC is used to establish a direct peer-to-peer connection between browsers.

## Components

### RTCPeerConnection

Responsible for:

* Peer negotiation
* Connection management
* ICE candidate exchange

### RTCDataChannel

Responsible for:

* Binary file transfer
* Metadata transfer
* Hash exchange

---

## Connection Flow

```text
Sender
   │
   ├── Create Offer
   ▼
Server
   ▼
Receiver

Receiver
   │
   ├── Create Answer
   ▼
Server
   ▼
Sender

Both Peers
   │
   ├── Exchange ICE Candidates
   ▼
Peer Connection Established
```

---

# File Transfer Architecture

Once the WebRTC connection is established, file transfer begins.

## Sender Flow

```text
Selected File
      │
      ▼
ArrayBuffer
      │
      ▼
Chunking
      │
      ▼
Data Channel Send
```

## Receiver Flow

```text
Received Chunks
      │
      ▼
Chunk Buffer
      │
      ▼
Blob Creation
      │
      ▼
Download File
```

---

# Chunking Strategy

Large files are divided into smaller chunks before transmission.

Default chunk size:

```text
64 KB
```

Benefits:

* Reduced memory usage
* Better transfer monitoring
* Improved browser compatibility
* Real-time progress tracking

---

# Transfer Statistics

During transfer, the application calculates:

### Progress

```text
Transferred Bytes / Total Bytes
```

### Transfer Speed

```text
Bytes Transferred / Time Elapsed
```

### Estimated Time Remaining

```text
Remaining Bytes / Current Speed
```

Displayed Example:

```text
Progress: 45%
Speed: 2.3 MB/s
Remaining: 12 seconds
```

---

# File Integrity Verification

QuickShare verifies transferred files using SHA-256 hashing.

## Sender

```text
File
 │
 ▼
SHA-256 Hash
 │
 ▼
Send Hash Metadata
```

## Receiver

```text
Received File
 │
 ▼
SHA-256 Hash
 │
 ▼
Compare Hashes
```

---

## Verification Results

Success:

```text
✓ File Verified
```

Failure:

```text
✗ Verification Failed
```

This ensures that the transferred file has not been corrupted during transmission.

---

# Security Model

QuickShare is designed around privacy and direct communication.

## Security Features

### No File Storage

Files never pass through the backend server.

### Peer-to-Peer Transfer

All file contents travel directly between browsers.

### Room Isolation

Each room only permits two participants.

### Hash Verification

SHA-256 integrity checking protects against data corruption.

### Server Limitations

The server only relays:

* SDP Offers
* SDP Answers
* ICE Candidates

The server never receives:

* File contents
* File chunks
* File metadata payloads

---

# Deployment Architecture

## Frontend

Platform:

```text
Vercel
```

Responsibilities:

* Serve React application
* Route room links
* Connect to signaling server

---

## Backend

Platform:

```text
Render
```

Responsibilities:

* Socket.io signaling
* Room management
* Connection relay

---

# Scalability Considerations

Future improvements may include:

* TURN server integration
* Multiple file transfers
* Transfer pause/resume
* Room expiration policies
* End-to-end encryption layer
* Transfer history
* QR code room sharing
* Progressive file streaming

---

# Summary

QuickShare combines React, Node.js, Socket.io, and WebRTC to deliver secure browser-to-browser file sharing without relying on centralized file storage. The architecture separates signaling from data transfer, ensuring efficient, scalable, and privacy-focused communication between peers.
