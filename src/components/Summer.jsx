// Summer.jsx - Complete with Lazy Loading, Preloading & Fast Image Caching
import React, { useEffect, useState, useRef, useCallback, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { productsData } from "../data/productsApi";
import { useNavigate, useLocation } from "react-router-dom";

// ✅ Custom hook for lazy loading with faster detection
const useInView = (rootMargin = "100px") => {
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
      { rootMargin, threshold: 0.1 },
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [inView, rootMargin]);

  return [ref, inView];
};

// ✅ Memoized Product Card with Fast Loading
const ProductCard = memo(
  ({ product, index, onClick, isLoaded, onImageLoad, priority }) => {
    const [cardRef, inView] = useInView("100px");
    const [imgError, setImgError] = useState(false);
    const fallback =
      "https://placehold.co/400x500/cccccc/666666?text=Product";

    // ✅ Preload first 4 images
    const shouldPreload = index < 4;

    return (
      <motion.div
        ref={cardRef}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: Math.min(index * 0.03, 0.3) }}
        whileHover={{ y: -6 }}
        onClick={() => onClick(product)}
        className="group cursor-pointer bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 border border-gray-100"
      >
        <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
          {/* ✅ Faster Skeleton Loading with shimmer */}
          {!isLoaded && (
            <div className="absolute inset-0">
              <div className="w-full h-full bg-gray-200 animate-pulse">
                <div className="w-full h-full bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-shimmer"></div>
              </div>
            </div>
          )}

          {/* ✅ Image - Loads faster with preloading and better priority */}
          {inView && (
            <img
              src={imgError ? fallback : product.image || fallback}
              alt={product.name}
              className={`w-full h-full object-cover object-top group-hover:scale-110 transition-all duration-500 ${
                isLoaded ? "opacity-100" : "opacity-0"
              }`}
              loading={shouldPreload ? "eager" : "lazy"}
              decoding="async"
              fetchPriority={shouldPreload ? "high" : "auto"}
              onLoad={() => {
                onImageLoad(product.id);
              }}
              onError={(e) => {
                setImgError(true);
                e.target.onerror = null;
                e.target.src = fallback;
                onImageLoad(product.id);
              }}
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

const Summer = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loadedImages, setLoadedImages] = useState({});
  const isClosingRef = useRef(false);
  const imageCache = useRef(new Map());
  const [preloadedImages, setPreloadedImages] = useState([]);

  const summerProducts = productsData.filter(
    (product) => product.id >= 10001 && product.id <= 10020,
  );

  // ✅ Preload first 4 images for faster initial load
  useEffect(() => {
    if (isOpen) {
      const imagesToPreload = summerProducts.slice(0, 4);
      imagesToPreload.forEach((product) => {
        if (product.image && !imageCache.current.has(product.id)) {
          const img = new Image();
          img.src = product.image;
          img.onload = () => {
            imageCache.current.set(product.id, true);
            setLoadedImages((prev) => ({ ...prev, [product.id]: true }));
          };
        }
      });
    }
  }, [isOpen, summerProducts]);

  // ✅ Body scroll control
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      isClosingRef.current = false;
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // ✅ PRODUCT CLICK - Page navigation with state
  const handleProductClick = useCallback(
    (product) => {
      if (isClosingRef.current) return;
      isClosingRef.current = true;

      navigate(`/product/${product.id}`, {
        state: { from: "summer" },
      });

      setTimeout(() => {
        onClose();
        isClosingRef.current = false;
      }, 100);
    },
    [navigate, onClose],
  );

  // ✅ CLOSE MODAL - Only close, no navigation
  const handleClose = useCallback(
    (e) => {
      e?.stopPropagation();

      if (isClosingRef.current) return;

      isClosingRef.current = true;
      onClose();

      setTimeout(() => {
        isClosingRef.current = false;
      }, 200);
    },
    [onClose],
  );

  // ✅ Handle image load with cache
  const handleImageLoad = useCallback((id) => {
    imageCache.current.set(id, true);
    setLoadedImages((prev) => ({ ...prev, [id]: true }));
  }, []);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[100] bg-white overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* ✅ Shimmer Animation Style */}
          <style>
            {`
              @keyframes shimmer {
                0% {
                  background-position: -200% 0;
                }
                100% {
                  background-position: 200% 0;
                }
              }
              .animate-shimmer {
                animation: shimmer 1.2s ease-in-out infinite;
              }
            `}
          </style>

          {/* Close Button - Only closes modal */}
          <button
            onClick={handleClose}
            className="fixed top-4 right-4 z-[101] w-12 h-12 bg-black/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-black transition-colors duration-300 shadow-2xl"
            aria-label="Close modal"
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
              {/* Header */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center mb-8"
              >
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-800">
                  Summer <span className="text-gray-400">Collection</span>
                </h1>
                <p className="text-gray-500 text-lg mt-4 max-w-2xl mx-auto">
                  Discover our premium summer collection. Lightweight,
                  breathable, and stylish fabrics perfect for the sunny season.
                </p>
                <div className="w-24 h-1 bg-black mx-auto mt-4"></div>
              </motion.div>

              {/* Products Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4 sm:gap-6">
                {summerProducts.map((product, index) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    index={index}
                    onClick={handleProductClick}
                    isLoaded={!!loadedImages[product.id]}
                    onImageLoad={handleImageLoad}
                    priority={index < 4}
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

export default Summer;
