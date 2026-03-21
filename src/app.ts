import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { prisma } from './config/prisma.config';
import authRoutes from './routes/auth.route';
import userRoutes from './routes/user.route';
import enterpriseRoutes from './routes/enterprise.route';
import branchRoutes from './routes/branch.route';
import routingRoutes from './routes/routing.route';

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/enterprises", enterpriseRoutes);
app.use("/api/branches", branchRoutes);
app.use("/api/routings", routingRoutes);

// Test Route
app.get('/', async (req, res) => {
  try {
    const userCount = await prisma.user.count();
    res.status(200).json({
      message: 'Welcome to lotus',
      database: 'Connected to MySQL',
      userCount: userCount,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Database connection failed',
      error: error,
    });
  }
});

export default app;