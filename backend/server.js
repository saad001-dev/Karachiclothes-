// backend/server.js
require("dotenv").config();

// ✅ DNS RESOLVER (MongoDB Atlas SRV ke liye zaroori)
const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]); // Google DNS

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const connectDB = require("./config/db");
const telegramService = require("./services/TelegramService");
const productsRoutes = require("./routes/products");
const authRoutes = require("./routes/auth");
const reviewsRoutes = require("./routes/reviews"); // ✅ ADD
const app = express();

// ✅ CONNECT DATABASE
connectDB();

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "10mb" }));

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/images", express.static(path.join(__dirname, "../public/images")));

app.use("/api/products", productsRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/reviews", reviewsRoutes);
app.get("/api/health", (req, res) => {
  const mongoose = require("mongoose");
  res.json({
    status: "OK",
    message: "Server is running",
    timestamp: new Date().toISOString(),
    database:
      mongoose.connection.readyState === 1 ? "connected" : "disconnected",
    dbName: mongoose.connection.name || "none",
    dns: dns.getServers(),
  });
});

app.post("/api/orders", async (req, res) => {
  try {
    const { customer, items, totalAmount } = req.body;

    if (!customer || !items || !totalAmount) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    const orderId = "KC" + Date.now().toString().slice(-8);
    const order = {
      orderId,
      customer,
      items,
      totalAmount,
      createdAt: new Date().toISOString(),
    };

    const result = await telegramService.sendOrderNotification(order);

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      data: { orderId, totalAmount },
      telegram: result.success ? "sent" : "failed",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 Backend server running on http://localhost:${PORT}`);
  });
}

module.exports = app;
