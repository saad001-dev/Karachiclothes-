// src/pages/CollectionPage.jsx
import axios from "axios";
import api from "../api/axios";
import React, {
  useEffect,
  useState,
  useCallback,
  useMemo,
  useRef,
  memo,
} from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

// ✅ FIXED: Hardcoded API URL
const API_BASE_URL = "https://karachi-clothes.vercel.app";

// ✅ Custom hook for lazy loading
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
      { rootMargin, threshold: 0.1 },
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [inView, rootMargin]);

  return [ref, inView];
};

// ✅ GA4 Tracking Functions - FIXED
const trackProductClick = (product, collectionType) => {
  if (window.gtag) {
    window.gtag("event", "view_item", {
      currency: "PKR",
      value: product.price,
      items: [
        {
          item_id: String(product._id || product.id), // ✅ FIXED
          item_name: product.name,
          item_category: collectionType || "collection",
          price: product.price,
          quantity: 1,
        },
      ],
    });
    console.log("📊 Product Clicked:", product.name, "from", collectionType);
  }
};

const trackCategoryClick = (category, collectionType) => {
  if (window.gtag) {
    window.gtag("event", "select_item", {
      item_list_name: collectionType || "collection",
      items: [
        {
          item_id: String(category.id),
          item_name: category.name,
          item_category: collectionType || "collection",
        },
      ],
    });
    console.log("📊 Category Clicked:", category.name);
  }
};

// ✅ Memoized Product Card
const ProductCard = memo(
  ({
    product,
    index,
    onClick,
    isLoaded,
    onImageLoad,
    getImageUrl,
    collectionType,
  }) => {
    const [cardRef, inView] = useInView("50px");
    const [imgError, setImgError] = useState(false);

    // ✅ FIXED: Use _id || id consistently
    const productId = product._id || product.id;

    const fallback =
      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='500' viewBox='0 0 400 500'%3E%3Crect width='400' height='500' fill='%23f3f4f6'/%3E%3Ctext x='200' y='250' font-family='sans-serif' font-size='20' fill='%239ca3af' text-anchor='middle'%3EProduct%3C/text%3E%3C/svg%3E";

    const imageUrl = imgError
      ? fallback
      : getImageUrl(product.image) || fallback;
    const isPriority = index < 6;

    const handleClick = () => {
      trackProductClick(product, collectionType);
      onClick(product);
    };

    return (
      <motion.div
        ref={cardRef}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: Math.min(index * 0.04, 0.4) }}
        whileHover={{ y: -8 }}
        onClick={handleClick}
        className="group cursor-pointer bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 border border-gray-100"
      >
        <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
          {!isLoaded && !imgError && (
            <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200" />
          )}

          {inView && (
            <img
              src={imageUrl}
              alt={product.name}
              className={`w-full h-full object-cover object-top group-hover:scale-110 transition-all duration-500 ${
                isLoaded && !imgError ? "opacity-100" : "opacity-0"
              }`}
              loading={isPriority ? "eager" : "lazy"}
              decoding="async"
              fetchPriority={isPriority ? "high" : "auto"}
              onLoad={() => {
                setImgError(false);
                onImageLoad(productId); // ✅ FIXED
              }}
              onError={(e) => {
                setImgError(true);
                e.target.onerror = null;
                e.target.src = fallback;
                onImageLoad(productId); // ✅ FIXED
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
          <div className="mt-2 md:block hidden flex items-center gap-2">
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
            <div className="mt-1 md:block hidden">
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

// ✅ MAIN COLLECTION PAGE
const CollectionPage = () => {
  const { collectionType } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [loadedImages, setLoadedImages] = useState({});
  const [productsData, setProductsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const imageCache = useRef(new Map());
  const [isValid, setIsValid] = useState(true);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const hasChecked = useRef(false);

  const validCollections = ["summer", "formal", "luxury", "lawn", "mens"];

  // ✅ API call with HARDCODED URL
  useEffect(() => {
    setLoading(true);

    axios
      .get(`${API_BASE_URL}/api/products`) // ✅ FIXED
      .then((res) => {
        console.log("✅ Products fetched:", res.data.data?.length || 0);
        setProductsData(res.data.data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("❌ Error fetching products:", err);
        setProductsData([]);
        setLoading(false);
      });
  }, []);

  // ✅ VALIDATION
  useEffect(() => {
    if (hasChecked.current) return;
    hasChecked.current = true;

    if (!collectionType || !validCollections.includes(collectionType)) {
      setIsValid(false);
      setIsRedirecting(true);
      navigate("/", { replace: true });
    } else {
      setIsValid(true);
      setIsRedirecting(false);
    }
  }, [collectionType, navigate, validCollections]);

  // ✅ Track page view
  useEffect(() => {
    if (collectionType && validCollections.includes(collectionType)) {
      if (window.gtag) {
        window.gtag("event", "page_view", {
          page_title: `${collectionType.charAt(0).toUpperCase() + collectionType.slice(1)} Collection`,
          page_location: window.location.href,
        });
      }
    }
  }, [collectionType]);

  // ✅ FIXED getImageUrl
  const getImageUrl = useCallback((imagePath) => {
    if (!imagePath) {
      return "https://placehold.co/400x500?text=No+Image";
    }

    if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
      return imagePath;
    }

    // ✅ HARDCODED API URL
    if (imagePath.startsWith("/uploads/")) {
      return `${API_BASE_URL}${imagePath}`;
    }

    if (imagePath.startsWith("./images/") || imagePath.startsWith("images/")) {
      return `${API_BASE_URL}/${imagePath.replace("./", "")}`;
    }

    if (imagePath.startsWith("/images/")) {
      return `${API_BASE_URL}${imagePath}`;
    }

    return `${API_BASE_URL}/${imagePath}`;
  }, []);

  // ✅ Collection data
  const collectionData = useMemo(() => {
    if (!isValid || isRedirecting || !collectionType || loading) return null;

    let products = [...productsData];
    let title = "";
    let description = "";
    let bgColor = "";

    console.log(`🔍 Filtering for: ${collectionType}`);

    switch (collectionType) {
      case "summer":
        products = products.filter(
          (product) =>
            product.category && product.category.toLowerCase() === "summer",
        );
        title = "Summer Collection";
        description =
          "Discover our premium summer collection. Lightweight, breathable and stylish fabrics.";
        bgColor = "from-orange-50 to-amber-50";
        break;

      case "formal":
        products = products.filter(
          (product) =>
            product.category && product.category.toLowerCase() === "formal",
        );
        title = "Formal Collection";
        description = "Discover our premium formal collection.";
        bgColor = "from-gray-50 to-slate-50";
        break;

      case "luxury":
        products = products.filter(
          (product) =>
            product.category && product.category.toLowerCase() === "luxury",
        );
        title = "Luxury Collection";
        description = "Discover our premium luxury collection.";
        bgColor = "from-purple-50 to-pink-50";
        break;

      case "lawn":
        products = products.filter(
          (product) =>
            product.category && product.category.toLowerCase() === "lawn",
        );
        title = "Lawn Collection";
        description = "Discover our premium lawn collection.";
        bgColor = "from-blue-50 to-indigo-50";
        break;

      case "mens":
        return {
          isMens: true,
          title: "Gents Collection",
          description:
            "Discover premium gents fabrics from Pakistan's most trusted brands.",
          categories: [
            {
              id: 10,
              name: "Cotton",
              image:
                "https://www.dynastyfabrics.com/cdn/shop/files/GREEN_copy_Percentage_288ef168-1a88-4d70-988f-da75a65e6d1c.jpg?v=1769682089&width=823",
              slug: "cotton",
            },
            {
              id: 1,
              name: "Grace",
              image:
                "https://gracefabrics.com/cdn/shop/files/METALIC-GREY_1205c7db-633e-4a07-a028-4b1d5217d726.jpg?v=1778676260&width=400",
              slug: "grace",
            },
            {
              id: 2,
              name: "Zain Jee",
              image: "../images/zain.jpg",
              slug: "zain-g",
            },
            {
              id: 4,
              name: "Florence",
              image:
                "https://lawrencepur.com/cdn/shop/products/edited_4012b5f0-bb57-4e68-ad64-0a683c4368df.jpg?v=1756867518&width=400",
              slug: "florence",
            },
            {
              id: 3,
              name: "Narkins",
              image:
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQmuijssbl3J7r5Ldq7d57kLC5aawQP8Ddc8icGvQ-ATw&s=10",
              slug: "narkins",
            },
            {
              id: 5,
              name: "ASCO",
              image:
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcShlzywWtQJTZ-SaXrr3uHLzHzgc8896NVzH_kZvgbCnLMMocHdEBaMxRmH&s=10",
              slug: "asco",
            },
            {
              id: 6,
              name: "Muneeb",
              image:
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT4INvhQNE7doO6HG71w6De8biTL0NlYJ820bWTVElg4PQYgwFJKdwZ8oGo&s=10",
              slug: "muneeb",
            },
            {
              id: 7,
              name: "Al-Karam",
              image: "../images/al-karam.jpg",
              slug: "al-karam",
            },
            {
              id: 9,
              name: "Wash & Wear",
              image:
                "https://gracefabrics.com/cdn/shop/files/leather_brown.jpg?v=1771485248&width=400",
              slug: "wash-wear",
            },
            {
              id: 11,
              name: "Unstitched Collection",
              image:
                "https://thecambridgeshop.com/cdn/shop/files/Black-4_c968313d-e11c-47b1-a5c3-573ead8d7abb.jpg?v=1766477068&width=400",
              slug: "unstitched",
            },
          ],
        };

      default:
        return null;
    }

    return { products, title, description, bgColor, isMens: false };
  }, [collectionType, isValid, isRedirecting, productsData, loading]);

  // ✅ Preload first 6 images - FIXED
  useEffect(() => {
    if (
      collectionData &&
      !collectionData.isMens &&
      collectionData.products &&
      collectionData.products.length > 0
    ) {
      const imagesToPreload = collectionData.products.slice(0, 6);
      imagesToPreload.forEach((product) => {
        const productId = product._id || product.id; // ✅ FIXED
        const imgUrl = getImageUrl(product.image);
        if (imgUrl && !imageCache.current.has(productId)) {
          const img = new Image();
          img.src = imgUrl;
          img.onload = () => {
            imageCache.current.set(productId, true);
            setLoadedImages((prev) => ({ ...prev, [productId]: true }));
          };
        }
      });
    }
  }, [collectionData, getImageUrl]);

  // ✅ Handle product click - FIXED
  const handleProductClick = useCallback(
    (product) => {
      const id = product._id || product.id; // ✅ FIXED
      if (!id) {
        console.error("❌ No product ID found");
        return;
      }
      navigate(`/product/${id}`, {
        state: { from: collectionType },
      });
    },
    [navigate, collectionType],
  );

  const handleCategoryClick = useCallback(
    (category) => {
      trackCategoryClick(category, collectionType);
      navigate(`/category/${category.slug}`);
    },
    [navigate, collectionType],
  );

  const handleImageLoad = useCallback((id) => {
    imageCache.current.set(id, true);
    setLoadedImages((prev) => ({ ...prev, [id]: true }));
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [collectionType]);

  const handleBack = () => {
    navigate("/");
    setTimeout(() => {
      const element = document.getElementById("products-section");
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }, 200);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto"></div>
          <p className="text-gray-500 mt-4">Loading collection...</p>
        </div>
      </div>
    );
  }

  if (!isValid || isRedirecting || !collectionData) {
    return null;
  }

  if (collectionData.isMens) {
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

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-800">
              Gents <span className="text-gray-400">Collection</span>
            </h1>
            <p className="text-gray-500 text-lg mt-4 max-w-2xl mx-auto">
              Discover premium gents fabrics from Pakistan's most trusted brands
            </p>
            <div className="w-24 h-1 bg-black mx-auto mt-4"></div>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
            {collectionData.categories.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.05 }}
                onClick={() => handleCategoryClick(category)}
                className="group cursor-pointer"
              >
                <div className="relative overflow-hidden rounded-2xl bg-gray-100 aspect-[3/4] shadow-md hover:shadow-2xl transition-all duration-500">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    loading={index < 4 ? "eager" : "lazy"}
                    fetchPriority={index < 4 ? "high" : "auto"}
                    width="400"
                    height="500"
                    onError={(e) => {
                      e.target.src =
                        "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='500' viewBox='0 0 400 500'%3E%3Crect width='400' height='500' fill='%23f3f4f6'/%3E%3Ctext x='200' y='250' font-family='sans-serif' font-size='20' fill='%239ca3af' text-anchor='middle'%3E" +
                        category.name +
                        "%3C/text%3E%3C/svg%3E";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                    <div className="bg-white/95 backdrop-blur-sm rounded-xl px-4 py-3 shadow-lg">
                      <h3 className="text-sm font-bold text-center text-black truncate">
                        {category.name}
                      </h3>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    );
  }

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

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-800">
            {collectionData.title.split(" ")[0]}{" "}
            <span className="text-gray-400">
              {collectionData.title.split(" ").slice(1).join(" ")}
            </span>
          </h1>
          <p className="text-gray-500 text-lg mt-4 max-w-2xl mx-auto">
            {collectionData.description}
          </p>
          <div className="w-24 h-1 bg-black mx-auto mt-4"></div>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4 sm:gap-6">
          {collectionData.products.map((product, index) => (
            <ProductCard
              key={product._id || product.id}
              product={product}
              index={index}
              onClick={handleProductClick}
              isLoaded={!!loadedImages[product._id || product.id]}
              onImageLoad={handleImageLoad}
              getImageUrl={getImageUrl}
              collectionType={collectionType}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CollectionPage;
