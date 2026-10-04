// backend/routes/reviews.js
const express = require("express");
const router = express.Router();
const connectDB = require("../config/db");
const Review = require("../models/Review");

const ensureDB = async () => {
  await connectDB();
};

// ===== GET reviews by productId =====
// GET /api/reviews/:productId
router.get("/:productId", async (req, res) => {
  try {
    await ensureDB();
    const { productId } = req.params;

    const reviews = await Review.find({ productId }).sort({
      createdAt: -1,
    });

    // Average rating
    const total = reviews.reduce((sum, r) => sum + r.rating, 0);
    const average = reviews.length > 0 ? total / reviews.length : 0;

    res.json({
      success: true,
      count: reviews.length,
      average: Math.round(average * 10) / 10,
      data: reviews,
    });
  } catch (error) {
    console.error("❌ GET reviews error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// ===== POST new review =====
// POST /api/reviews
router.post("/", async (req, res) => {
  try {
    await ensureDB();
    const { productId, name, rating, comment } = req.body;

    // Validation
    if (!productId || !name || !rating || !comment) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: "Rating must be between 1 and 5",
      });
    }

    const review = await Review.create({
      productId: String(productId),
      name: name.trim(),
      rating: Number(rating),
      comment: comment.trim(),
    });

    console.log("✅ Review created:", review._id);

    res.status(201).json({
      success: true,
      message: "Review added successfully",
      data: review,
    });
  } catch (error) {
    console.error("❌ POST review error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// ===== GET all reviews (for admin) =====
// GET /api/reviews
router.get("/", async (req, res) => {
  try {
    await ensureDB();
    const reviews = await Review.find().sort({ createdAt: -1 }).limit(100);
    res.json({ success: true, count: reviews.length, data: reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ===== DELETE review (for admin) =====
router.delete("/:id", async (req, res) => {
  try {
    await ensureDB();
    const review = await Review.findByIdAndDelete(req.params.id);
    if (!review) {
      return res
        .status(404)
        .json({ success: false, message: "Review not found" });
    }
    res.json({ success: true, message: "Review deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
