import http from 'http';
import dotenv from 'dotenv';
import { Server } from 'socket.io';

import app from './app.js';
import registerSocketHandlers from './socketHandler.js';

dotenv.config();

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin:
      process.env.CLIENT_URL ||
      'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

registerSocketHandlers(io);

server.listen(PORT, () => {
  console.log(
    `QuickShare signaling server running on port ${PORT}`
  );
});
