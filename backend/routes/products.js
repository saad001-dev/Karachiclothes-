// backend/routes/products.js
const express = require("express");
const router = express.Router();
const connectDB = require("../config/db");
const Product = require("../models/Product");

// Helper: Ensure DB connected
const ensureDB = async () => {
  await connectDB();
};

// ===== GET All Products =====
router.get("/", async (req, res) => {
  try {
    await ensureDB();
    console.log("📦 Fetching all products...");

    const products = await Product.find().sort({ createdAt: -1 });
    console.log(`✅ Found ${products.length} products`);

    res.json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    console.error("❌ Fetch error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// ===== GET Single Product =====
router.get("/:id", async (req, res) => {
  try {
    await ensureDB();
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }
    res.json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ===== POST Add Product (with Image URL) =====
router.post("/", async (req, res) => {
  try {
    await ensureDB();
    console.log("📦 Creating product:", req.body.name);

    const { name, price, originalPrice, category, description, stock, image } =
      req.body;

    // Validation
    if (!name || !price || !category || !image) {
      return res.status(400).json({
        success: false,
        message: "Name, price, category and image URL are required",
      });
    }

    const newProduct = await Product.create({
      name,
      price: Number(price),
      originalPrice: originalPrice ? Number(originalPrice) : null,
      category: category || "uncategorized",
      description: description || "",
      stock: Number(stock) || 0,
      image: image, // ✅ Direct URL
    });

    console.log("✅ Product created:", newProduct._id);

    res.status(201).json({
      success: true,
      message: "Product added successfully",
      data: newProduct,
    });
  } catch (error) {
    console.error("❌ Create error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// ===== PUT Update Product =====
router.put("/:id", async (req, res) => {
  try {
    await ensureDB();
    console.log("✏️ Updating product:", req.params.id);

    const { name, price, originalPrice, category, description, stock, image } =
      req.body;

    const updateData = {};
    if (name) updateData.name = name;
    if (price !== undefined) updateData.price = Number(price);
    if (originalPrice !== undefined)
      updateData.originalPrice = originalPrice ? Number(originalPrice) : null;
    if (category) updateData.category = category;
    if (description !== undefined) updateData.description = description;
    if (stock !== undefined) updateData.stock = Number(stock);
    if (image) updateData.image = image;

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    console.log("✅ Product updated");

    res.json({
      success: true,
      message: "Product updated successfully",
      data: product,
    });
  } catch (error) {
    console.error("❌ Update error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// ===== DELETE Product =====
router.delete("/:id", async (req, res) => {
  try {
    await ensureDB();
    console.log("🗑️ Deleting product:", req.params.id);

    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    console.log("✅ Product deleted");
    res.json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    console.error("❌ Delete error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;