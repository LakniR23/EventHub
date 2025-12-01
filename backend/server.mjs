import express from "express"
import cors from "cors"
import userRoutes from "./routes/userRoutes.js"
import eventRoutes from "./routes/eventRoutes.js"
import clubRoutes from "./routes/clubRoutes.js"
import careerRoutes from "./routes/careerRoutes.js"
import announcementRoutes from "./routes/announcementRoutes.js"
import venueRoutes from "./routes/venueRoutes.js"
import registrationRoutes from "./routes/registrationRoutes.js"
import photoRoutes from "./routes/photoRoutes.js"

const app =express();

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Simple request logger to aid debugging of API route issues
app.use((req, res, next) => {
  console.log(`[API] ${req.method} ${req.originalUrl}`);
  next();
});

// Serve uploaded files
app.use('/uploads', express.static('public/uploads'));

// Error handling middleware for payload too large
app.use((error, req, res, next) => {
  if (error.type === 'entity.too.large') {
    return res.status(413).json({
      message: 'File too large. Please compress your image or choose a smaller file (max 50MB).'
    });
  }
  next(error);
});

// Add a health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Route middlewares
app.use("/api", userRoutes);
app.use("/api", eventRoutes);
app.use("/api", clubRoutes);
app.use("/api", careerRoutes);
app.use("/api", announcementRoutes);
app.use("/api", venueRoutes);
app.use("/api", registrationRoutes);
app.use("/api", photoRoutes);

app.listen(5000, () => console.log("Server running on port 5000")); 