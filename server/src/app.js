import express from 'express';
import cors from 'cors';

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  })
);

app.use(express.json());

app.get('/', (req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'QuickShare Signaling Server',
  });
});

export default app;
