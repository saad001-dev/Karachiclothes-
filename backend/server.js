// backend/server.js - Complete Fixed Version
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const telegramService = require("./services/TelegramService");
const productsRoutes = require("./routes/products");
const authRoutes = require("./routes/auth");
const app = express();

// ✅ CORS
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
  }),
);

app.use(bodyParser.json());

// ✅ ============ STATIC FILES SERVE KARO ============
// Uploads folder (admin se upload images)

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ Frontend images folder serve karo
app.use("/images", express.static(path.join(__dirname, "../public/images")));

// ✅ Agar images root se serve karni hain
app.use(express.static(path.join(__dirname, "../public")));

// ✅ Routes
app.use("/api/products", productsRoutes);
app.use("/api/auth", authRoutes); 

// ✅ Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "Server is running",
    timestamp: new Date().toISOString(),
  });
});

// ✅ Order API
app.post("/api/orders", async (req, res) => {
  try {
    console.log("📦 Order received");

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

    if (result.success) {
      return res.status(201).json({
        success: true,
        message: "Order placed successfully",
        data: { orderId, totalAmount },
        telegram: "sent",
      });
    } else {
      return res.status(500).json({
        success: false,
        message: "Order created but Telegram failed",
        error: result.error,
      });
    }
  } catch (error) {
    console.error("❌ Server Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
});

// ✅ Server start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Backend server running on http://localhost:${PORT}`);
  console.log(`📦 Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(`📁 Images path: ${path.join(__dirname, "../public/images")}`);
});

// ✅ Export for Vercel
module.exports = app;
