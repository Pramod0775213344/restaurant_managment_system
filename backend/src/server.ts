// MUST be first — load env vars before any other imports
import "dotenv/config";

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import routes from "./routes";
import authRoutes from "./routes/authRoutes";
import { errorHandler } from "./middleware/errorHandler";
import { supabase } from "./lib/supabase";

const app = express();
const port = process.env.PORT || 3000;

// Enable CORS for frontend requests with credentials (cookies)
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Central routes
app.use("/api", routes);

// Legacy compatibility for direct /auth routes if any client calls /auth
app.use("/auth", authRoutes);

// Global Error Handler (must be last middleware)
app.use(errorHandler);

// Check DB connection on startup via Supabase HTTP (bypasses port blocking)
async function checkDatabaseConnection() {
  try {
    const { error } = await supabase.from("roles").select("count").limit(1);
    if (error) throw error;
    console.log("Database connected successfully via Supabase HTTP!");
  } catch (error: any) {
    console.error("Database connection FAILED:", error.message);
  }
}

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
  checkDatabaseConnection();
});