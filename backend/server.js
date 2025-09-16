import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import userRoutes from './routes/userRoutes.js';
import errorHandler from './middlewares/errorHandler.js';

const app = express();
dotenv.config();
connectDB();

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());

app.use("/api/users", userRoutes);

// Error Handler Middleware
app.use(errorHandler);

app.listen(process.env.PORT, () => {
    console.log("Server is running on port", process.env.PORT);
});