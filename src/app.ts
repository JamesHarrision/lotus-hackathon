import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Test Route
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Welcome to hackathon SwipeToHire API 🚀',
    status: 'success',
  });
});

export default app;