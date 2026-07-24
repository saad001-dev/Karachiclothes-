// Lawn.jsx - ULTRA FAST with useCallback Optimization
import React, { useEffect, useState, useRef, useCallback, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { productsData } from "../data/productsApi";
import { useNavigate } from "react-router-dom";

// ✅ ULTRA FAST: Tiny placeholder SVG
const PLACEHOLDER =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='267' viewBox='0 0 200 267'%3E%3Crect width='200' height='267' fill='%23f3f4f6'/%3E%3C/svg%3E";

// ✅ Custom hook for lazy loading - Optimized
const useInView = (rootMargin = "50px") => {
  const ref = useRef(null);
  const [hasBeenViewed, setHasBeenViewed] = useState(false);

  useEffect(() => {
    if (!ref.current || hasBeenViewed) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasBeenViewed(true);
          observer.disconnect();
        }
      },
      { rootMargin, threshold: 0.01 },
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [hasBeenViewed, rootMargin]);

  return [ref, hasBeenViewed];
};

// ✅ Memoized Product Card - ULTRA FAST
const ProductCard = memo(({ product, index, onClick, onImageLoad }) => {
  const [cardRef, hasBeenViewed] = useInView("50px");
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);

  // ✅ Preload first 4 images
  const shouldPreload = index < 4;

  // ✅ Handle image load
  const handleImageLoad = useCallback(() => {
    setImageLoaded(true);
    onImageLoad(product.id);
  }, [onImageLoad, product.id]);

  // ✅ Handle image error
  const handleImageError = useCallback(
    (e) => {
      setImgError(true);
      setImageLoaded(true);
      onImageLoad(product.id);
      e.target.onerror = null;
    },
    [onImageLoad, product.id],
  );

  // ✅ Force load for preloaded images
  useEffect(() => {
    if (shouldPreload && product.image) {
      const img = new Image();
      img.src = product.image;
      img.onload = handleImageLoad;
      img.onerror = handleImageError;
    }
  }, [shouldPreload, product.image, handleImageLoad, handleImageError]);

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2, delay: Math.min(index * 0.02, 0.2) }}
      whileHover={{ y: -4 }}
      onClick={() => onClick(product)}
      className="group cursor-pointer bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-200 border border-gray-100"
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
        {/* ✅ Simple skeleton - no animation for less CPU */}
        {!imageLoaded && <div className="absolute inset-0 bg-gray-200"></div>}

        {/* ✅ Image - Only loads when viewed or preloaded */}
        {(hasBeenViewed || shouldPreload) && (
          <img
            src={imgError ? PLACEHOLDER : product.image || PLACEHOLDER}
            alt={product.name}
            className={`w-full h-full object-cover object-top transition-opacity duration-150 ${
              imageLoaded ? "opacity-100" : "opacity-0"
            }`}
            loading={shouldPreload ? "eager" : "lazy"}
            decoding="async"
            fetchPriority={shouldPreload ? "high" : "auto"}
            onLoad={handleImageLoad}
            onError={handleImageError}
            width="200"
            height="267"
          />
        )}

        {/* ✅ Discount Badge - Only if > 5% */}
        {product.originalPrice &&
          Math.round((1 - product.price / product.originalPrice) * 100) > 5 && (
            <div className="absolute top-2 left-2 z-10">
              <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow">
                {Math.round((1 - product.price / product.originalPrice) * 100)}%
              </span>
            </div>
          )}
      </div>

      <div className="p-2 sm:p-3">
        <h3 className="text-[11px] sm:text-xs font-semibold text-gray-800 line-clamp-2 min-h-[28px]">
          {product.name.length > 35
            ? product.name.substring(0, 35) + "..."
            : product.name}
        </h3>
        <div className="mt-1 flex items-center gap-1.5 flex-wrap">
          <p className="text-sm sm:text-base font-bold text-gray-900">
            Rs.{product.price.toLocaleString()}
          </p>
          {product.originalPrice && (
            <p className="text-[10px] sm:text-xs text-gray-400 line-through">
              Rs.{product.originalPrice.toLocaleString()}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
});
ProductCard.displayName = "ProductCard";

const Lawn = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [loadedCount, setLoadedCount] = useState(0);
  const imageCache = useRef(new Set());
  const isClosingRef = useRef(false);

  // ✅ Lawn products - ID range 20001 to 20011
  const lawnProducts = productsData.filter(
    (product) => product.id >= 20001 && product.id <= 20011,
  );

  // ✅ Preload first 4 images
  useEffect(() => {
    if (isOpen) {
      const imagesToPreload = lawnProducts.slice(0, 4);
      imagesToPreload.forEach((product) => {
        if (product.image && !imageCache.current.has(product.id)) {
          const img = new Image();
          img.src = product.image;
          img.onload = () => {
            imageCache.current.add(product.id);
            setLoadedCount((prev) => prev + 1);
          };
          img.onerror = () => {
            imageCache.current.add(product.id);
            setLoadedCount((prev) => prev + 1);
          };
        }
      });
    }
  }, [isOpen, lawnProducts]);

  // ✅ Body scroll control - Optimized
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.width = "100%";
      isClosingRef.current = false;
    } else {
      document.body.style.overflow = "unset";
      document.body.style.position = "unset";
      document.body.style.width = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
      document.body.style.position = "unset";
      document.body.style.width = "unset";
    };
  }, [isOpen]);

  // ✅ PRODUCT CLICK - with useCallback
  const handleProductClick = useCallback(
    (product) => {
      if (isClosingRef.current) return;
      isClosingRef.current = true;
      navigate(`/product/${product.id}`, {
        state: { from: "lawn" },
      });
      setTimeout(() => {
        onClose();
        isClosingRef.current = false;
      }, 80);
    },
    [navigate, onClose],
  );

  // ✅ CLOSE MODAL - with useCallback
  const handleClose = useCallback(() => {
    if (isClosingRef.current) return;
    isClosingRef.current = true;
    onClose();
    setTimeout(() => {
      isClosingRef.current = false;
    }, 150);
  }, [onClose]);

  // ✅ Handle image load
  const handleImageLoad = useCallback((id) => {
    if (!imageCache.current.has(id)) {
      imageCache.current.add(id);
      setLoadedCount((prev) => prev + 1);
    }
  }, []);

  // ✅ Keyboard escape - with useCallback
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape" && isOpen) {
        handleClose();
      }
    };
    window.addEventListener("keydown", handleEsc, { passive: true });
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, handleClose]);

  if (!isOpen) return null;

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-[100] bg-white overflow-y-auto overscroll-contain"
          onClick={(e) => e.stopPropagation()}
        >
          {/* ✅ Sticky Header - Minimal */}
          <div className="sticky top-0 z-[101] bg-white/95 backdrop-blur-sm px-3 py-2 flex justify-between items-center border-b border-gray-100">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-gray-800">Lawn</h2>
              <span className="text-[10px] text-gray-400">
                ({lawnProducts.length})
              </span>
            </div>
            <button
              onClick={handleClose}
              className="w-8 h-8 bg-black/90 rounded-full flex items-center justify-center hover:bg-black transition-colors duration-150 shadow-md"
              aria-label="Close"
            >
              <svg
                className="w-4 h-4 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.5"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div className="py-2 sm:py-4">
            <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
              {/* ✅ Header - Minimal */}
              <div className="text-center mb-4">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
                  Lawn <span className="text-gray-400">Collection</span>
                </h1>
                <p className="text-xs text-gray-500 mt-1">
                  Premium lightweight lawn fabrics for summer
                </p>
              </div>

              {/* ✅ Product Grid - Ultra Minimal */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-2 sm:gap-3">
                {lawnProducts.map((product, index) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    index={index}
                    onClick={handleProductClick}
                    onImageLoad={handleImageLoad}
                  />
                ))}
              </div>

              {/* ✅ Minimal Footer */}
              <div className="text-center mt-4 text-[10px] text-gray-300">
                {lawnProducts.length} items •
                {loadedCount > 0 && ` ${loadedCount} images loaded`}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Lawn;
