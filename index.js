import dotenv from "dotenv";
import express from "express";

import { connectDB } from "./config/database.js";
import personRouter from "./routes/personRoutes.js";

dotenv.config({
    path: './.env'
})

const app = express();
const PORT = process.env.PORT || 3001;

// Initialiased Database Configuration
connectDB();

app.use(express.json());

// Import the Person Route
app.use("/api/v1/person", personRouter);

// Root Entry
app.get('/', (req, res) => {
    res.send('Authentication with Express, MongoDB and JWT')
})

app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
});