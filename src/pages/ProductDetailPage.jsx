// pages/ProductDetailPage.jsx - COMPLETE FIXED
import React, { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate, useLocation, Link } from "react-router-dom";
import { useCart } from "../components/CartContext";
import { toast } from "react-hot-toast";
import { productData } from "../components/Category";
import { productsData } from "../data/productsApi";
import api from "../api/axios";

// ✅ HARDCODED API URL
const API_BASE_URL = "https://karachi-clothes.vercel.app";

const ProductDetailPage = () => {
  const { productId } = useParams(); // Route param name
  const navigate = useNavigate();
  const location = useLocation();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [currentImage, setCurrentImage] = useState("");
  const [currentTitle, setCurrentTitle] = useState("");
  const [currentDescription, setCurrentDescription] = useState("");
  const [categoryThumbnails, setCategoryThumbnails] = useState([]);
  const [categoryProducts, setCategoryProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [zoomStyle, setZoomStyle] = useState({
    transformOrigin: "center center",
    transform: "scale(2)",
  });
  const [isZooming, setIsZooming] = useState(false);
  const imageRef = useRef(null);

  // ✅ Fetch all products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        console.log("🔍 Fetching all products...");
        const res = await api.get("/api/products");
        const data = res.data.data || [];
        console.log(`✅ Loaded ${data.length} products`);
        setAllProducts(data);
      } catch (error) {
        console.error("❌ Error fetching products:", error);
        setAllProducts([]);
      }
    };
    fetchProducts();
  }, []);

  // ✅ FIXED getImageUrl with HARDCODED URL
  const getImageUrl = useCallback((path) => {
    if (!path) return "https://placehold.co/400x500?text=No+Image";
    if (path.startsWith("http://") || path.startsWith("https://")) return path;

    if (path.startsWith("/uploads/")) return `${API_BASE_URL}${path}`;
    if (path.startsWith("./images/") || path.startsWith("images/")) {
      return `${API_BASE_URL}/${path.replace("./", "")}`;
    }
    if (path.startsWith("/images/")) return `${API_BASE_URL}${path}`;
    return `${API_BASE_URL}/${path}`;
  }, []);

  const handleBack = () => {
    if (location.state?.from) {
      navigate(`/collection/${location.state.from}`, { replace: true });
      return;
    }
    navigate(-1);
  };

  // ✅ FIXED: MongoDB _id ke saath kaam karo
  const findProductById = useCallback(
    (id) => {
      if (!id) return { product: null, category: null };

      const idStr = String(id);
      let foundProduct = null;
      let foundCategory = null;

      // ✅ 1. Backend data
      if (allProducts.length > 0) {
        const found = allProducts.find(
          (p) => String(p._id) === idStr || String(p.id) === idStr, // ✅ FIX
        );
        if (found) {
          return {
            product: { ...found },
            category: found.category || "summer",
          };
        }
      }

      // ✅ 2. Local data
      if (productData) {
        Object.keys(productData).forEach((category) => {
          const items = productData[category];
          if (Array.isArray(items)) {
            const item = items.find((p) => String(p.id) === idStr); // ✅ FIX
            if (item) {
              foundProduct = { ...item, category };
              foundCategory = category;
            }
          }
        });
        if (foundProduct)
          return { product: foundProduct, category: foundCategory };
      }

      // ✅ 3. productsApi.js
      if (productsData) {
        const apiProduct = productsData.find((p) => String(p.id) === idStr); // ✅ FIX
        if (apiProduct) {
          let category = "summer";
          const numId = parseInt(idStr);
          if (numId >= 20001 && numId <= 20020) category = "lawn";
          else if (numId >= 30001 && numId <= 30020) category = "formal";
          else if (numId >= 40001 && numId <= 40029) category = "luxury";
          return { product: { ...apiProduct, category }, category };
        }
      }

      return { product: null, category: null };
    },
    [allProducts],
  );

  // ✅ Get similar products - FIXED
  const getCategoryProducts = useCallback(
    (categorySlug) => {
      if (!categorySlug) return [];

      const idStr = String(productId);

      if (allProducts.length > 0) {
        return allProducts.filter(
          (p) =>
            p.category &&
            p.category.toLowerCase() === categorySlug.toLowerCase() &&
            String(p._id) !== idStr &&
            String(p.id) !== idStr,
        );
      }
      return [];
    },
    [allProducts, productId],
  );

  // ✅ MAIN useEffect - FIXED: don't wait for allProducts
  useEffect(() => {
    console.log("🔍 Looking for product ID:", productId);

    const { product: foundProduct, category: foundCategory } =
      findProductById(productId);

    if (foundProduct) {
      console.log("✅ Product found:", foundProduct.name);
      setProduct(foundProduct);

      // GA4
      if (window.gtag) {
        window.gtag("event", "view_item", {
          currency: "PKR",
          value: foundProduct.price,
          items: [
            {
              item_id: String(foundProduct._id || foundProduct.id),
              item_name: foundProduct.name,
              item_category: foundCategory || "",
              price: foundProduct.price,
            },
          ],
        });
      }

      const imagePath = foundProduct.image;
      setCurrentImage(getImageUrl(imagePath));
      setCurrentTitle(foundProduct.name);
      setCurrentDescription(
        foundProduct.description ||
          "Premium quality fabric perfect for all occasions.",
      );

      // Similar products
      const products = getCategoryProducts(foundCategory);
      setCategoryProducts(products);

      // Thumbnails
      const thumbnails = [
        {
          image: getImageUrl(imagePath),
          title: foundProduct.name,
          description: foundProduct.description || "Premium quality fabric",
          isDefault: true,
        },
      ];

      if (products && products.length > 0) {
        const otherProducts = products.slice(0, 4);
        const otherItems = otherProducts.map((p) => ({
          image: getImageUrl(p.image),
          title: p.name,
          description: p.description || "Premium quality fabric",
          isDefault: false,
        }));
        thumbnails.push(...otherItems);
      }

      setCategoryThumbnails(thumbnails);
      setLoading(false);
    } else {
      // ✅ Agar allProducts load ho gaya hai aur phir bhi nahi mila
      if (allProducts.length > 0) {
        console.error("❌ Product not found for ID:", productId);
        setLoading(false);
        // Don't redirect - show "not found" message
      }
      // Warna wait karo allProducts load hone ka
    }
  }, [
    productId,
    allProducts,
    getImageUrl,
    getCategoryProducts,
    findProductById,
  ]);

  const handleThumbnailClick = (thumbnail) => {
    setCurrentImage(thumbnail.image);
    setCurrentTitle(thumbnail.title);
    setCurrentDescription(thumbnail.description);
    setImageLoaded(false);
  };

  const handleMouseMove = (e) => {
    if (!imageRef.current) return;
    const { left, top, width, height } =
      imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomStyle({
      transformOrigin: `${x}% ${y}%`,
      transform: "scale(2)",
    });
  };

  const handleQuantityChange = (action) => {
    if (action === "increase") setQuantity((prev) => prev + 1);
    else if (action === "decrease" && quantity > 1)
      setQuantity((prev) => prev - 1);
  };

  const handleAddToCart = () => {
    if (!product) return;
    const productToAdd = {
      id: product._id || product.id,
      name: currentTitle || product.name,
      price: product.price,
      image: currentImage || product.image,
      quantity: quantity,
      category: product.category || "summer",
    };
    addToCart(productToAdd);
    toast.success(`${quantity}x ${productToAdd.name} added to cart!`, {
      icon: "🛒",
      duration: 3000,
    });
  };

  // ✅ Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto"></div>
          <p className="mt-4 text-gray-500">Loading product...</p>
        </div>
      </div>
    );
  }

  // ✅ Not found state
  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md px-4">
          <p className="text-xl font-semibold text-gray-800">
            Product Not Found
          </p>
          <p className="text-gray-500 mt-2 text-sm">
            The product you're looking for doesn't exist or has been removed.
          </p>
          <button
            onClick={() => navigate("/")}
            className="mt-6 bg-black text-white px-6 py-3 rounded-full hover:bg-gray-800 transition"
          >
            Go Back Home
          </button>
        </div>
      </div>
    );
  }

  const imageUrl = currentImage || getImageUrl(product.image);

  return (
    <div className="min-h-screen bg-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <button
          onClick={handleBack}
          className="mb-6 inline-flex items-center gap-2 text-gray-600 hover:text-black transition-colors duration-300"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {/* Image Section */}
          <div className="relative">
            <div
              ref={imageRef}
              onMouseMove={handleMouseMove}
              onMouseEnter={() => setIsZooming(true)}
              onMouseLeave={() => setIsZooming(false)}
              className="bg-gray-100 rounded-2xl overflow-hidden aspect-[3/4] relative cursor-zoom-in select-none"
            >
              <img
                src={imageUrl}
                alt={currentTitle || product.name}
                draggable={false}
                className="w-full h-full object-cover object-center transition-transform duration-75 ease-out"
                style={
                  isZooming
                    ? zoomStyle
                    : {
                        transform: "scale(1)",
                        transformOrigin: "center center",
                      }
                }
                onLoad={() => setImageLoaded(true)}
                onError={(e) => {
                  e.target.src =
                    "data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%27800%27 height=%271200%27 viewBox=%270 0 800 1200%27%3E%3Crect width=%27800%27 height=%271200%27 fill=%27%23f3f4f6%27/%3E%3Ctext x=%27400%27 y=%27600%27 font-family=%27sans-serif%27 font-size=%2740%27 fill=%27%239ca3af%27 text-anchor=%27middle%27%3ENo Image%3C/text%3E%3C/svg%3E";
                }}
              />
            </div>

            <div className="lg:hidden absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/70 text-white text-xs px-3 py-1.5 rounded-full backdrop-blur-sm">
              👆 Tap & hold to zoom
            </div>
          </div>

          {/* Info Section */}
          <div className="flex flex-col">
            <div className="flex items-center gap-2 text-sm text-gray-400 mb-4 flex-wrap">
              <span>Premium Quality</span>
              <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
              <span>In Stock</span>
              {product.category && (
                <>
                  <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                  <span className="bg-orange-50 text-orange-700 text-xs font-semibold px-3 py-1 rounded-full border border-orange-200 capitalize">
                    {product.category}
                  </span>
                </>
              )}
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">
              {currentTitle || product.name}
            </h1>

            <p className="text-gray-500 text-sm my-7 leading-relaxed">
              {currentDescription ||
                product.description ||
                "Premium quality fabric."}
            </p>

            <div className="flex items-center gap-4 mb-4">
              <span className="text-3xl font-bold text-black">
                Rs. {product.price.toLocaleString()}
              </span>
              {product.originalPrice && (
                <>
                  <span className="text-sm text-gray-400 line-through">
                    Rs. {product.originalPrice.toLocaleString()}
                  </span>
                  <span className="bg-green-100 text-green-700 text-xs font-medium px-2 py-1 rounded-full">
                    {Math.round(
                      (1 - product.price / product.originalPrice) * 100,
                    )}
                    % OFF
                  </span>
                </>
              )}
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-3 text-sm">
                <svg
                  className="w-5 h-5 text-gray-400 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span className="text-gray-600">Premium Quality Fabric</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <svg
                  className="w-5 h-5 text-gray-400 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="text-gray-600">Fast Delivery</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <svg
                  className="w-5 h-5 text-gray-400 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
                <span className="text-gray-600">100% Authentic</span>
              </div>
            </div>

            <div className="flex items-center gap-4 mb-4">
              <span className="text-sm font-medium text-gray-700">
                Quantity:
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleQuantityChange("decrease")}
                  disabled={quantity <= 1}
                  className={`w-8 h-8 border border-gray-200 rounded-lg flex items-center justify-center ${quantity <= 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-100"}`}
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M20 12H4"
                    />
                  </svg>
                </button>
                <span className="w-12 text-center font-medium text-lg">
                  {quantity}
                </span>
                <button
                  onClick={() => handleQuantityChange("increase")}
                  className="w-8 h-8 border border-gray-200 rounded-lg flex items-center justify-center hover:bg-gray-100"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                </button>
              </div>
            </div>

            <span className="text-sm font-medium">Note:</span>
            <p className="text-sm py-3 text-gray-600">
              Actual product color may vary slightly due to studio lighting
              during photography and differences in device screen settings.
            </p>

            {categoryThumbnails.length > 1 && (
              <div className="mt-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    Similar Products:
                  </span>
                  <span className="text-xs text-gray-400">
                    ({categoryThumbnails.length} items)
                  </span>
                </div>
                <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                  {categoryThumbnails.map((thumb, index) => {
                    const isSelected = currentImage === thumb.image;
                    return (
                      <button
                        key={index}
                        onClick={() => handleThumbnailClick(thumb)}
                        className={`relative rounded-lg overflow-hidden aspect-square border-2 transition-all ${isSelected ? "border-black shadow-lg scale-105" : "border-gray-200 hover:border-gray-400 hover:scale-105"}`}
                      >
                        <img
                          src={thumb.image}
                          alt={thumb.title}
                          className="w-full h-full object-cover"
                          loading="lazy"
                          onError={(e) => {
                            e.target.src =
                              "data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%27100%27 height=%27100%27 viewBox=%270 0 100 100%27%3E%3Crect width=%27100%27 height=%27100%27 fill=%27%23f3f4f6%27/%3E%3Ctext x=%2750%27 y=%2750%27 font-family=%27sans-serif%27 font-size=%2712%27 fill=%27%239ca3af%27 text-anchor=%27middle%27%3ENo Image%3C/text%3E%3C/svg%3E";
                          }}
                        />
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 mt-6">
              <button
                onClick={handleAddToCart}
                className="flex-1 bg-black text-white px-6 py-4 text-sm font-semibold hover:bg-gray-900 transition"
              >
                Add to Cart ({quantity})
              </button>
              <Link
                to="/"
                className="flex-1 border-2 border-gray-500 text-gray-600 px-6 py-4 text-sm font-medium hover:border-black hover:text-black transition text-center"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
