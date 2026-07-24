const upload = require("../middleware/upload");
const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();
const productsFile = path.join(__dirname, "../products.json");

// Helper: Read products
const readProducts = () => {
  try {
    const data = fs.readFileSync(productsFile, "utf8");
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
};

// Helper: Write products
const writeProducts = (products) => {
  fs.writeFileSync(productsFile, JSON.stringify(products, null, 2), "utf8");
};

// ===== GET All Products =====
router.get("/", (req, res) => {
  try {
    const products = readProducts();
    res.json({ success: true, data: products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ===== GET Single Product =====
router.get("/:id", (req, res) => {
  try {
    const products = readProducts();
    const product = products.find((p) => p.id == req.params.id);
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

// ===== POST Add Product =====
router.post("/", upload.single("image"), (req, res) => {
  try {
    const products = readProducts();

    const { name, price, originalPrice, category, description, stock } =
      req.body;

    const newProduct = {
      id: Date.now(),
      name,
      price: Number(price),
      originalPrice: Number(originalPrice) || null,
      category: category || "uncategorized",
      description: description || "",
      stock: Number(stock) || 0,
      image: req.file ? `/uploads/${req.file.filename}` : "",
    };

    products.push(newProduct);
    writeProducts(products);

    res.status(201).json({
      success: true,
      message: "Product added successfully",
      data: newProduct,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ===== PUT Update Product =====
router.put("/:id", upload.single("image"), (req, res) => {
  try {
    const products = readProducts();
    const index = products.findIndex((p) => p.id == req.params.id);

    if (index === -1) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    const { name, price, originalPrice, category, description, stock } =
      req.body;

    // Update fields
    products[index].name = name || products[index].name;
    products[index].price = Number(price) || products[index].price;
    products[index].originalPrice =
      Number(originalPrice) || products[index].originalPrice;
    products[index].category = category || products[index].category;
    products[index].description = description || products[index].description;
    products[index].stock =
      Number(stock) !== undefined ? Number(stock) : products[index].stock;

    // If new image uploaded
    if (req.file) {
      // Delete old image file (optional)
      if (products[index].image) {
        const oldPath = path.join(__dirname, "..", products[index].image);
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }
      products[index].image = `/uploads/${req.file.filename}`;
    }

    writeProducts(products);

    res.json({
      success: true,
      message: "Product updated successfully",
      data: products[index],
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ===== DELETE Product =====
router.delete("/:id", (req, res) => {
  try {
    const products = readProducts();
    const index = products.findIndex((p) => p.id == req.params.id);

    if (index === -1) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    // Delete image file
    if (products[index].image) {
      const imagePath = path.join(__dirname, "..", products[index].image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    products.splice(index, 1);
    writeProducts(products);

    res.json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
