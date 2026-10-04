// backend/migrate-products.js
require("dotenv").config();
const fs = require("fs");
const path = require("path");
const dns = require("dns");

dns.setServers(["8.8.8.8", "8.8.4.4"]);

const connectDB = require("./config/db");
const Product = require("./models/Product");

(async () => {
  try {
    console.log("🚀 Starting migration...\n");

    await connectDB();

    const productsFile = path.join(__dirname, "products.json");

    if (!fs.existsSync(productsFile)) {
      console.error("❌ products.json not found");
      process.exit(1);
    }

    const rawData = fs.readFileSync(productsFile, "utf8");
    const products = JSON.parse(rawData);

    console.log(`📦 Found ${products.length} products in JSON\n`);

    if (products.length === 0) {
      console.log("⚠️  No products to migrate");
      process.exit(0);
    }

    console.log("🗑️  Clearing existing products from MongoDB...");
    const deleteResult = await Product.deleteMany({});
    console.log(`   Deleted ${deleteResult.deletedCount} existing products\n`);

    let successCount = 0;
    let errorCount = 0;

    for (let i = 0; i < products.length; i++) {
      const p = products[i];
      try {
        await Product.create({
          name: p.name,
          price: Number(p.price),
          originalPrice: p.originalPrice ? Number(p.originalPrice) : null,
          category: p.category || "uncategorized",
          description: p.description || "",
          stock: Number(p.stock) || 0,
          image: p.image || "",
        });

        successCount++;
        if ((i + 1) % 10 === 0 || i === products.length - 1) {
          console.log(`✅ Progress: ${i + 1}/${products.length}`);
        }
      } catch (error) {
        errorCount++;
        console.log(`❌ Failed: ${p.name} - ${error.message}`);
      }
    }

    console.log("\n" + "=".repeat(50));
    console.log(`✅ Migration complete!`);
    console.log(`   Successful: ${successCount}`);
    console.log(`   Failed: ${errorCount}`);
    console.log("=".repeat(50) + "\n");

    process.exit(0);
  } catch (error) {
    console.error("❌ Migration error:", error);
    process.exit(1);
  }
})();
