import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { prisma } from './config/prisma.config';
import authRoutes from './routes/auth.route';
import userRoutes from './routes/user.route';
import enterpriseRoutes from './routes/enterprise.route';
import branchRoutes from './routes/branch.route';
import routingRoutes from './routes/routing.route';
import incentiveRoutes from './routes/incentive.route';
import superadminRoutes from './routes/superadmin.route';
import exaRoutes from './routes/exa.route';
import { errorMiddleware } from './middlewares/error.middleware';
import { setupSwagger } from './utils/swagger';

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Setup Swagger Documentation
setupSwagger(app);

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/enterprises", enterpriseRoutes);
app.use("/api/branches", branchRoutes);
app.use("/api/routings", routingRoutes);
app.use("/api/incentives", incentiveRoutes);
app.use("/api/superadmin", superadminRoutes);
app.use("/api/exa", exaRoutes);

// Test Route
app.get('/', async (req, res) => {
  try {
    const userCount = await prisma.user.count();
    res.status(200).json({
      message: 'Welcome to lotus',
      database: 'Connected to MySQL',
      stats: { users: userCount }
    });
  } catch (error) {
    res.status(500).json({ message: 'Database connection failed' });
  }
});

// Centralized Error Handling Middleware (Must be last)
app.use(errorMiddleware);

export default app;