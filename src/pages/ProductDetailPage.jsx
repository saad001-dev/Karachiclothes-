// pages/ProductDetailPage.jsx - COMPLETE FIXED with Backend Data

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate, useLocation, Link } from "react-router-dom";
import { useCart } from "../components/CartContext";
import { toast } from "react-hot-toast";
import { productData } from "../components/Category";
import { productsData } from "../data/productsApi";
import api from "../api/axios";

const ProductDetailPage = () => {
  const { productId } = useParams();
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

  const [zoomStyle, setZoomStyle] = useState({
    transformOrigin: "center center",
    transform: "scale(2)",
  });
  const [isZooming, setIsZooming] = useState(false);
  const imageRef = useRef(null);

  // ✅ Fetch all products from backend on mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get("/api/products");
        setAllProducts(res.data.data || []);
      } catch (error) {
        console.error("Error fetching products:", error);
        setAllProducts([]);
      }
    };
    fetchProducts();
  }, []);

  // ✅ Get image URL - FIXED for Vercel
  const getImageUrl = useCallback((path) => {
    if (!path) return "";
    if (path.startsWith("http://") || path.startsWith("https://")) return path;

    const API_URL = import.meta.env.VITE_API_URL || "";

    if (path.startsWith("/uploads/")) return `${API_URL}${path}`;
    if (path.startsWith("./images/") || path.startsWith("images/")) {
      return `${API_URL}/${path.replace("./", "")}`;
    }
    if (path.startsWith("/images/")) return `${API_URL}${path}`;
    return `${API_URL}/${path}`;
  }, []);

  const handleBack = () => {
    if (location.state?.from) {
      navigate(`/collection/${location.state.from}`, { replace: true });
      return;
    }
    navigate(-1);
  };

  // ✅ FIND PRODUCT - Backend + Local data
  const findProductById = (id) => {
    let foundProduct = null;
    let foundCategory = null;

    // ✅ 1. Pehle backend data mein dhoondo
    if (allProducts.length > 0) {
      const found = allProducts.find((p) => p.id === parseInt(id));
      if (found) {
        foundProduct = { ...found };
        foundCategory = found.category || "summer";
        return { product: foundProduct, category: foundCategory };
      }
    }

    // ✅ 2. Agar backend mein nahi mila toh local data mein dhoondo
    if (productData) {
      Object.keys(productData).forEach((category) => {
        const items = productData[category];
        if (Array.isArray(items)) {
          const item = items.find((p) => p.id === parseInt(id));
          if (item) {
            foundProduct = { ...item, category };
            foundCategory = category;
          }
        }
      });
    }

    // ✅ 3. Agar local mein bhi nahi mila toh productsData mein dhoondo
    if (!foundProduct && productsData) {
      const apiProduct = productsData.find((p) => p.id === parseInt(id));
      if (apiProduct) {
        let category = "summer";
        if (id >= 20001 && id <= 20020) category = "lawn";
        else if (id >= 30001 && id <= 30020) category = "formal";
        else if (id >= 40001 && id <= 40029) category = "luxury";
        foundProduct = { ...apiProduct, category };
        foundCategory = category;
      }
    }

    return { product: foundProduct, category: foundCategory };
  };

  const getCategoryProducts = (categorySlug) => {
    // ✅ Backend data se filter karo
    if (allProducts.length > 0 && categorySlug) {
      return allProducts.filter(
        (p) =>
          p.category &&
          p.category.toLowerCase() === categorySlug.toLowerCase() &&
          p.id !== parseInt(productId),
      );
    }

    // ✅ Fallback - local data
    if (categorySlug === "summer") {
      return productsData.filter(
        (p) => p.id !== parseInt(productId) && p.id >= 10001 && p.id <= 10020,
      );
    }
    if (categorySlug === "lawn") {
      return productsData.filter(
        (p) => p.id !== parseInt(productId) && p.id >= 20001 && p.id <= 20011,
      );
    }
    if (categorySlug === "formal") {
      return productsData.filter(
        (p) => p.id !== parseInt(productId) && p.id >= 30001 && p.id <= 30020,
      );
    }
    if (categorySlug === "pret" || categorySlug === "luxury") {
      return productsData.filter(
        (p) => p.id !== parseInt(productId) && p.id >= 40001 && p.id <= 40029,
      );
    }
    if (categorySlug && productData[categorySlug]) {
      return productData[categorySlug].filter(
        (p) => p.id !== parseInt(productId),
      );
    }
    return [];
  };

  useEffect(() => {
    // ✅ Wait for allProducts to load
    if (allProducts.length === 0) return;

    const { product: foundProduct, category: foundCategory } =
      findProductById(productId);

    if (foundProduct) {
      setProduct(foundProduct);

      // ✅ GA4 Tracking
      if (window.gtag) {
        window.gtag("event", "view_item", {
          currency: "PKR",
          value: foundProduct.price,
          items: [
            {
              item_id: String(foundProduct.id),
              item_name: foundProduct.name,
              item_category: foundCategory || "",
              price: foundProduct.price,
            },
          ],
        });
      }

      let imagePath = foundProduct.image;
      setCurrentImage(getImageUrl(imagePath));
      setCurrentTitle(foundProduct.name);
      setCurrentDescription(
        foundProduct.description ||
          "Premium quality fabric perfect for all occasions. Crafted with the finest materials to ensure comfort, durability, and style.",
      );

      // ✅ Get similar products
      const products = getCategoryProducts(foundCategory);
      setCategoryProducts(products);

      // ✅ Thumbnails
      const thumbnails = [
        {
          image: getImageUrl(imagePath),
          title: foundProduct.name,
          description: foundProduct.description || "Premium quality fabric",
          isDefault: true,
        },
      ];

      if (products && products.length > 0) {
        const otherProducts = products.filter((p) => p.id !== foundProduct.id);
        const otherItems = otherProducts.slice(0, 4).map((p) => ({
          image: getImageUrl(p.image),
          title: p.name,
          description:
            p.description ||
            "Premium quality fabric perfect for all occasions.",
          isDefault: false,
        }));
        thumbnails.push(...otherItems);
      }

      setCategoryThumbnails(thumbnails);
    } else {
      console.error("❌ Product not found for ID:", productId);
      navigate("/");
    }
  }, [productId, navigate, allProducts, getImageUrl]);

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
    if (action === "increase") {
      setQuantity((prev) => prev + 1);
    } else if (action === "decrease" && quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;
    const productToAdd = {
      id: product.id,
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

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto"></div>
          <p className="mt-4 text-gray-500">Loading product...</p>
        </div>
      </div>
    );
  }

  const imageUrl = currentImage || product.image;

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
          {/* Product Image Section */}
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
                className="w-full h-full object-cover object-center image-rendering-auto transition-transform duration-75 ease-out"
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
                    "https://via.placeholder.com/800x1200/cccccc/666666?text=Product";
                }}
              />
            </div>

            <div className="lg:hidden absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/70 text-white text-xs px-3 py-1.5 rounded-full backdrop-blur-sm">
              👆 Tap & hold to zoom
            </div>
          </div>

          {/* Product Info Section */}
          <div className="flex flex-col">
            <div className="flex items-center gap-2 text-sm text-gray-400 mb-4 flex-wrap">
              <span>Premium Quality</span>
              <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
              <span>In Stock</span>
              {product.category === "summer" && (
                <>
                  <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                  <span className="bg-orange-50 text-orange-700 text-xs font-semibold px-3 py-1 rounded-full border border-orange-200">
                    Summer Collection
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
                "Premium quality fabric perfect for all occasions. Crafted with the finest materials to ensure comfort, durability, and style."}
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
                  className={`w-8 h-8 border border-gray-200 rounded-lg flex items-center justify-center transition-colors duration-300 ${quantity <= 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-100"}`}
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
                  className="w-8 h-8 border border-gray-200 rounded-lg flex items-center justify-center hover:bg-gray-100 transition-colors duration-300"
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
              <span className="text-xs text-gray-400">
                ({quantity} item{quantity > 1 ? "s" : ""})
              </span>
            </div>

            <span>Note:</span>
            <p className="text-sm py-3 text-gray-600">
              Actual product color may vary slightly due to studio lighting
              during photography and differences in device screen settings.
            </p>

            {categoryThumbnails.length > 1 && (
              <div className="mt-4">
                <div className="flex items-center gap-2">
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
                        className={`relative rounded-lg overflow-hidden aspect-square border-2 transition-all duration-300 ${isSelected ? "border-black shadow-lg scale-105" : "border-gray-200 hover:border-gray-400 hover:scale-105"}`}
                        title={thumb.isDefault ? "Default Image" : thumb.title}
                      >
                        <img
                          src={thumb.image}
                          alt={thumb.isDefault ? "Default" : thumb.title}
                          className="w-full h-full object-cover"
                          loading="lazy"
                          onError={(e) => {
                            e.target.src =
                              "https://via.placeholder.com/100x100/cccccc/666666?text=Product";
                          }}
                        />
                        {isSelected && (
                          <div className="absolute inset-0 border-2 border-white/30 rounded-lg pointer-events-none"></div>
                        )}
                        {thumb.isDefault && (
                          <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-[8px] text-center py-0.5 truncate">
                            Default
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 mt-6">
              <button
                onClick={handleAddToCart}
                className="flex-1 bg-black text-white px-6 py-4 text-sm font-semibold border border-gray-700 hover:bg-gray-900 hover:border-gray-500 transition-all duration-300 hover:scale-[1.02]"
              >
                Add to Cart ({quantity})
              </button>
              <Link
                to="/"
                className="flex-1 border-2 border-gray-500 text-gray-600 px-6 py-4 text-sm font-medium hover:border-black hover:text-black transition-all duration-300 text-center"
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
