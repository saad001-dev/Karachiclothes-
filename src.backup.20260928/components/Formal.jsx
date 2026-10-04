// Formal.jsx - Complete with Lazy Loading & Image Caching
import React, { useEffect, useState, useRef, useCallback, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { productsData } from "../data/productsApi";
import { useNavigate } from "react-router-dom";

// ✅ Custom hook for lazy loading with smaller rootMargin
const useInView = (rootMargin = "50px") => {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (!ref.current || inView) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin, threshold: 0.01 },
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [inView, rootMargin]);

  return [ref, inView];
};

// ✅ Memoized Product Card with WebP fallback
const ProductCard = memo(
  ({ product, index, onClick, isLoaded, onImageLoad }) => {
    const [cardRef, inView] = useInView("50px");
    const fallback =
      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='500' viewBox='0 0 400 500'%3E%3Crect width='400' height='500' fill='%23f3f4f6'/%3E%3Ctext x='200' y='250' font-family='sans-serif' font-size='20' fill='%239ca3af' text-anchor='middle'%3EProduct%3C/text%3E%3C/svg%3E";

    // ✅ Generate optimized image URL with size parameter
    const getOptimizedImageUrl = (url) => {
      if (!url) return fallback;

      // If it's a Sapphire image, add size parameter
      if (url.includes("sapphire-online.com")) {
        return url.replace("sw=1000&sh=1200", "sw=400&sh=500");
      }

      // If it's a local image
      if (url.startsWith("./images/") || url.startsWith("/images/")) {
        return url;
      }

      return url;
    };

    const imageUrl = getOptimizedImageUrl(product.image);

    return (
      <motion.div
        ref={cardRef}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: Math.min(index * 0.04, 0.4) }}
        whileHover={{ y: -8 }}
        onClick={() => onClick(product)}
        className="group cursor-pointer bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 border border-gray-100"
      >
        <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
          {/* ✅ Skeleton with shimmer effect */}
          {!isLoaded && (
            <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200" />
          )}

          {/* ✅ Image - Only loads when in viewport */}
          {inView && (
            <img
              src={imageUrl}
              alt={product.name}
              className={`w-full h-full object-cover object-top group-hover:scale-110 transition-all duration-500 ${
                isLoaded ? "opacity-100" : "opacity-0"
              }`}
              loading="lazy"
              decoding="async"
              fetchPriority={index < 4 ? "high" : "auto"}
              onLoad={() => onImageLoad(product.id)}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = fallback;
                onImageLoad(product.id);
              }}
              width="400"
              height="500"
            />
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        <div className="p-4">
          <h3 className="text-sm font-semibold text-gray-800 line-clamp-2 min-h-[40px]">
            {product.name}
          </h3>
          <div className="mt-2 flex items-center gap-2">
            <p className="text-lg font-bold text-gray-900">
              Rs. {product.price.toLocaleString()}
            </p>
            {product.originalPrice && (
              <p className="text-sm text-gray-400 line-through">
                Rs. {product.originalPrice.toLocaleString()}
              </p>
            )}
          </div>
          {product.originalPrice && (
            <div className="mt-1">
              <span className="bg-red-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
                {Math.round((1 - product.price / product.originalPrice) * 100)}%
                OFF
              </span>
            </div>
          )}
        </div>
      </motion.div>
    );
  },
);

ProductCard.displayName = "ProductCard";

const Formal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [loadedImages, setLoadedImages] = useState({});
  const imageCache = useRef(new Map());

  const formalProducts = productsData.filter(
    (product) => product.id >= 30001 && product.id <= 30020,
  );

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      // ✅ Preload first 6 images
      const preloadImages = formalProducts.slice(0, 6);
      preloadImages.forEach((product) => {
        if (product.image && !imageCache.current.has(product.id)) {
          const img = new Image();
          img.src = product.image;
          img.onload = () => {
            imageCache.current.set(product.id, true);
            setLoadedImages((prev) => ({ ...prev, [product.id]: true }));
          };
        }
      });
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen, formalProducts]);

  // ✅ PRODUCT CLICK - Page navigation with state
  const handleProductClick = useCallback(
    (product) => {
      navigate(`/product/${product.id}`, {
        state: { from: "formal" },
      });
      onClose();
    },
    [navigate, onClose],
  );

  // ✅ Handle image load with cache
  const handleImageLoad = useCallback((id) => {
    imageCache.current.set(id, true);
    setLoadedImages((prev) => ({ ...prev, [id]: true }));
  }, []);

  // ✅ BACK TO CATEGORIES - Modal close
  const handleBackToCategories = useCallback(() => {
    onClose();
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="fixed inset-0 z-[100] bg-white overflow-y-auto"
        >
          <button
            onClick={onClose}
            className="fixed top-4 right-4 z-[101] w-12 h-12 bg-black/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-black transition-colors duration-300 shadow-2xl"
          >
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          <div className="py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center mb-8"
              >
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-800">
                  Formal <span className="text-gray-400">Collection</span>
                </h1>
                <p className="text-gray-500 text-lg mt-4 max-w-2xl mx-auto">
                  Discover our premium formal collection. Elegant,
                  sophisticated, and luxurious fabrics for your special
                  occasions.
                </p>
                <div className="w-24 h-1 bg-black mx-auto mt-4"></div>
              </motion.div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4 sm:gap-6">
                {formalProducts.map((product, index) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    index={index}
                    onClick={handleProductClick}
                    isLoaded={!!loadedImages[product.id]}
                    onImageLoad={handleImageLoad}
                  />
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Formal;
