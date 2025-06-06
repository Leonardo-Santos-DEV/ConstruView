import express from 'express';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth';
import clientRoutes from './routes/client';
import contentRoutes from './routes/content';
import projectRoutes from './routes/project';
import userRoutes from './routes/user';
import sequelize from "./config/database";
import addDefaultInfos from "./seeders/addDefaultInfos";
import {setupAssociations} from "./models/associations";
import cors from 'cors';

const app = express();

const corsOptions = {
  origin: process.env.FRONTEND_HOST || 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(cookieParser());

setupAssociations();

sequelize.sync()
  .then(() => addDefaultInfos())
  .then(() => console.info("Database synced"))
  .catch(e => console.error("Error syncing database", e));

app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

app.use('/auth', authRoutes);
app.use('/clients', clientRoutes);
app.use('/contents', contentRoutes);
app.use('/projects', projectRoutes);
app.use('/users', userRoutes);

export default app;
