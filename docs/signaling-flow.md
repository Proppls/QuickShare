# WebRTC Signaling Flow

## Overview

QuickShare uses a lightweight Socket.io signaling server to establish direct peer-to-peer connections between browsers.

The signaling server is responsible only for exchanging WebRTC connection information and never handles actual file contents.

After signaling is complete, all communication occurs directly through a WebRTC Data Channel.

---

# What Is Signaling?

WebRTC peers cannot communicate immediately because they must first exchange connection information.

This process is called signaling.

The signaling server helps peers exchange:

* Session Description Protocol (SDP) Offers
* Session Description Protocol (SDP) Answers
* ICE Candidates

After this exchange, the peers establish a direct connection.

---

# Signaling Architecture

```text id="z8wqvt"
Sender Browser
        │
        │ Socket.io
        ▼
 ┌─────────────────┐
 │ Signaling Server│
 └─────────────────┘
        ▲
        │ Socket.io
        │
Receiver Browser
```

After connection establishment:

```text id="wkh4z9"
Sender Browser
        │
        │ WebRTC Data Channel
        ▼
Receiver Browser
```

No file data passes through the server.

---

# Signaling Lifecycle

The signaling process consists of five stages:

1. Room Creation
2. Room Joining
3. Offer Exchange
4. Answer Exchange
5. ICE Candidate Exchange

---

# Stage 1: Room Creation

The sender starts by creating a room.

## Event

```javascript id="pm2wii"
create-room
```

## Flow

```text id="9xndh3"
Sender
  │
  ├── create-room
  ▼
Server
```

### Server Responsibilities

* Generate unique room ID
* Create room entry
* Register sender socket
* Return room details

### Room Example

```javascript id="f1n7qf"
{
  roomId: "ABC123",
  sender: "socket-id-1",
  receiver: null
}
```

---

# Stage 2: Room Created

The server responds with room information.

## Event

```javascript id="jxcll6"
room-created
```

## Flow

```text id="91xy0z"
Server
  │
  └── room-created
         │
         ▼
      Sender
```

### Response Example

```javascript id="eg9g9g"
{
  roomId: "ABC123"
}
```

The sender can now share:

```text id="xykq3u"
https://quickshare.app/room/ABC123
```

---

# Stage 3: Room Joining

The receiver opens the invite link and joins the room.

## Event

```javascript id="i3v5c5"
join-room
```

## Flow

```text id="rj6vw3"
Receiver
   │
   ├── join-room
   ▼
Server
```

### Server Validation

The server checks:

* Room exists
* Room is not full
* Sender is connected

### Invalid Cases

```text id="6r7hys"
Room not found
```

```text id="6w68wy"
Room already full
```

If validation fails:

```javascript id="13g0j9"
room-error
```

is emitted.

---

# Stage 4: Room Joined

When the receiver successfully joins:

## Event

```javascript id="v0r40r"
room-joined
```

## Flow

```text id="r85q6u"
Server
   │
   └── room-joined
          │
          ▼
       Receiver
```

The server also notifies the sender.

## Event

```javascript id="v0pdwe"
peer-joined
```

```text id="x2g6an"
Server
   │
   └── peer-joined
          │
          ▼
        Sender
```

At this point both peers know they are ready to negotiate.

---

# Stage 5: Offer Creation

The sender creates a WebRTC offer.

## Event

```javascript id="i8ot4h"
offer
```

### Sender Actions

```javascript id="n3rmsr"
const offer = await peerConnection.createOffer();

await peerConnection.setLocalDescription(offer);
```

The sender forwards the offer through the signaling server.

---

## Flow

```text id="ewwkwo"
Sender
   │
   ├── offer
   ▼
Server
   │
   ▼
Receiver
```

### Payload Example

```javascript id="1m1b2l"
{
  roomId: "ABC123",
  offer: {
    type: "offer",
    sdp: "..."
  }
}
```

---

# Stage 6: Answer Creation

The receiver receives the offer.

### Receiver Actions

```javascript id="tm9a1k"
await peerConnection.setRemoteDescription(
  offer
);

const answer =
  await peerConnection.createAnswer();

await peerConnection.setLocalDescription(
  answer
);
```

The answer is then sent back.

## Event

```javascript id="nhuj2l"
answer
```

---

## Flow

```text id="jj2uul"
Receiver
   │
   ├── answer
   ▼
Server
   │
   ▼
Sender
```

### Payload Example

```javascript id="jlwm55"
{
  roomId: "ABC123",
  answer: {
    type: "answer",
    sdp: "..."
  }
}
```

---

# Stage 7: ICE Candidate Exchange

Offer and answer alone are not enough.

Browsers must discover viable network paths.

This is done using ICE candidates.

---

## Event

```javascript id="z2zvwq"
ice-candidate
```

---

## Sender Flow

```text id="y4j7v4"
Sender
   │
   ├── ice-candidate
   ▼
Server
   ▼
Receiver
```

---

## Receiver Flow

```text id="yvjlwm"
Receiver
   │
   ├── ice-candidate
   ▼
Server
   ▼
Sender
```

---

### Example Candidate

```javascript id="nnmdfz"
{
  roomId: "ABC123",
  candidate: {
    candidate: "...",
    sdpMid: "0",
    sdpMLineIndex: 0
  }
}
```

---

# Connection Established

Once sufficient ICE candidates have been exchanged:

```text id="c53gmz"
new
   │
   ▼
connecting
   │
   ▼
connected
```

The WebRTC connection becomes active.

A Data Channel can now be used.

---

# Data Channel Creation

The sender creates the channel.

```javascript id="5on3n4"
const channel =
  peerConnection.createDataChannel(
    "quickshare-data"
  );
```

The receiver automatically receives it.

```javascript id="sl0s0o"
peerConnection.ondatachannel =
  (event) => {
    const channel = event.channel;
  };
```

---

# Signaling Complete

After connection establishment:

```text id="qww6ti"
Socket.io
     │
     │  (No longer needed)
     ▼

WebRTC Data Channel
     │
     ▼
File Transfer
```

All file transfer traffic bypasses the server.

---

# Peer Disconnection Handling

If either peer disconnects:

## Event

```javascript id="9hrm10"
peer-disconnected
```

---

## Flow

```text id="2xoc3u"
Peer Disconnects
       │
       ▼
Server Detects Disconnect
       │
       ▼
Remaining Peer Notified
```

### Server Cleanup

The server:

* Removes room entry
* Removes disconnected socket
* Frees memory resources

---

# Complete Sequence Diagram

```text id="rcsz9j"
Sender                      Server                     Receiver
  │                            │                           │
  ├─ create-room ─────────────►│                           │
  │◄──────── room-created ─────┤                           │
  │                            │                           │
  │                            │◄──── join-room ──────────┤
  │◄──────── peer-joined ──────┤                           │
  │                            ├──── room-joined ────────►│
  │                            │                           │
  ├──────── offer ────────────►│──────── offer ──────────►│
  │                            │                           │
  │◄────── answer ─────────────│◄────── answer ───────────┤
  │                            │                           │
  ├── ice-candidate ──────────►│──────── candidate ──────►│
  │◄──── candidate ────────────│◄──── candidate ──────────┤
  │                            │                           │
  │═══════ WebRTC Connected ══════════════════════════════│
  │                            │                           │
  │══════ WebRTC Data Channel File Transfer ═════════════│
```

---

# Security Considerations

The signaling server never receives:

* File contents
* File chunks
* Hash values
* Download data

The signaling server only relays:

* Offers
* Answers
* ICE candidates

This design minimizes server load and improves user privacy.

---

# Summary

QuickShare uses Socket.io exclusively for signaling. The signaling process establishes a secure WebRTC connection by exchanging SDP offers, SDP answers, and ICE candidates. Once the connection is established, all file transfer operations occur directly between browsers through a WebRTC Data Channel, ensuring efficient and private peer-to-peer communication.
