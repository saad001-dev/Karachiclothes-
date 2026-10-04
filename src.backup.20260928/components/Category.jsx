import React, {
  useState,
  useMemo,
  useCallback,
  useEffect,
  useRef,
} from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useCart } from "./CartContext";
import { toast } from "react-hot-toast";
import api from "../api/axios";

// ✅ Import all data from separate files (Backup ke liye)
import {
  graceData,
  zainjeeData,
  narkinsData,
  florenceData,
  ascoData,
  muneebData,
  alkaramData,
  cottonData,
  unstitchedData,
  washwearData,
} from "../data";

// ============================================
// PRODUCT DATA - Combined from all files (BACKUP)
// ============================================
export const productData = {
  grace: graceData,
  "zain-g": zainjeeData,
  narkins: narkinsData,
  florence: florenceData,
  asco: ascoData,
  muneeb: muneebData,
  "al-karam": alkaramData,
  cotton: cottonData,
  unstitched: unstitchedData,
  "wash-wear": washwearData,
};

// ============================================
// LAZY IMAGE COMPONENT
// ============================================
const LazyImage = ({ src, alt, className, ...props }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [error, setError] = useState(false);

  const getImageUrl = (path) => {
    if (!path) return "https://via.placeholder.com/400x500?text=No+Image";
    if (path.startsWith("http://") || path.startsWith("https://")) return path;

    const API_URL = import.meta.env.VITE_API_URL || "";

    if (path.startsWith("/uploads/")) {
      return `${API_URL}${path}`;
    }
    if (path.startsWith("./images/") || path.startsWith("images/")) {
      return `${API_URL}/${path.replace("./", "")}`;
    }
    if (path.startsWith("/images/")) {
      return `${API_URL}${path}`;
    }
    return `${API_URL}/${path}`;
  };

  const imageUrl = getImageUrl(src);

  return (
    <div className="relative w-full h-full bg-gray-100 overflow-hidden">
      {!imageLoaded && (
        <div className="absolute inset-0 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 animate-pulse"></div>
      )}
      {src && !error ? (
        <img
          src={imageUrl}
          alt={alt}
          loading="lazy"
          decoding="async"
          onLoad={() => setImageLoaded(true)}
          onError={() => setError(true)}
          className={`w-full h-full object-cover transition-opacity duration-500 ${
            imageLoaded ? "opacity-100" : "opacity-0"
          } ${className || ""}`}
          {...props}
        />
      ) : (
        <img
          src="https://via.placeholder.com/400x500/cccccc/666666?text=No+Image"
          alt="Placeholder"
          className="w-full h-full object-cover"
        />
      )}
    </div>
  );
};

// ============================================
// CATEGORY PAGE COMPONENT (Default Export)
// ============================================
const Category = () => {
  const { categorySlug } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { addToCart } = useCart();
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const hasRedirected = useRef(false);

  // ✅ Fetch from backend
  useEffect(() => {
    if (!categorySlug) {
      navigate("/", { replace: true });
      return;
    }

    setLoading(true);

    api
      .get("/api/products")
      .then((res) => {
        const allProducts = res.data.data || [];
        const filtered = allProducts.filter(
          (p) =>
            p.category &&
            p.category.toLowerCase() === categorySlug.toLowerCase(),
        );

        if (filtered.length > 0) {
          setProducts(filtered);
        } else {
          const localProducts = productData[categorySlug] || [];
          setProducts(localProducts);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching products:", err);
        const localProducts = productData[categorySlug] || [];
        setProducts(localProducts);
        setLoading(false);
      });
  }, [categorySlug, navigate]);

  // ✅ Redirect if invalid category
  useEffect(() => {
    if (!loading && products.length === 0 && !hasRedirected.current) {
      hasRedirected.current = true;
      navigate("/", { replace: true });
    }
  }, [loading, products, navigate]);

  // Get category name
  const categoryName = useMemo(() => {
    const names = {
      grace: "Grace",
      "zain-g": "Zain Jee",
      zainjee: "Zain Jee",
      narkins: "Narkins",
      florence: "Florence",
      asco: "ASCO",
      muneeb: "Muneeb",
      "al-karam": "Al-Karam",
      alkaram: "Al-Karam",
      cotton: "Cotton",
      unstitched: "Unstitched Collection",
      "wash-wear": "Wash & Wear",
      washwear: "Wash & Wear",
      summer: "Summer Collection",
      formal: "Formal Collection",
      lawn: "Lawn Collection",
      luxury: "Luxury Collection",
    };
    return names[categorySlug] || categorySlug;
  }, [categorySlug]);

  // Filter products based on search
  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) return products;
    return products.filter((product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [products, searchQuery]);

  const handleAddToCart = useCallback(
    (product, e) => {
      e.stopPropagation();
      addToCart({
        id: product._id || product.id, // ✅ FIX
        name: product.name,
        price: product.price,
        image: product.image,
        category: "gents",
      });
      toast.success(`${product.name} added to cart!`, {
        icon: "🛒",
        duration: 3000,
      });
    },
    [addToCart],
  );

  // ✅ FIX: MongoDB _id use karo
  const handleProductClick = useCallback(
    (product) => {
      const id = product._id || product.id;
      if (!id) {
        toast.error("Product ID not found");
        return;
      }
      navigate(`/product/${id}`);
    },
    [navigate],
  );

  const handleBackToCategories = () => {
    if (location.state?.from) {
      navigate(`/collection/${location.state.from}`, { replace: true });
      return;
    }
    navigate(-1);
  };

  if (!categorySlug) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <div>
            <button
              onClick={handleBackToCategories}
              className="text-gray-600 hover:text-black transition-colors flex items-center gap-2 text-sm mb-1"
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
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Back to Categories
            </button>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mt-1">
              {categoryName} Collection
            </h1>
            <p className="text-gray-500 text-sm">
              {products.length} products available
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-sm"
            />
            <svg
              className="absolute right-3 top-2.5 w-4 h-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">
              No products found matching your search.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product._id || product.id} // ✅ FIX
                onClick={() => handleProductClick(product)}
                className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 cursor-pointer"
              >
                <div className="relative aspect-square overflow-hidden bg-gray-100">
                  <LazyImage
                    src={product.image}
                    alt={product.name}
                    className="group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <button
                    onClick={(e) => handleAddToCart(product, e)}
                    className="absolute md:block hidden bottom-4 left-1/2 transform -translate-x-1/2 bg-white text-black px-6 py-2 rounded-full text-xs font-medium opacity-0 group-hover:opacity-100 transition-all duration-500 hover:bg-black hover:text-white shadow-lg"
                  >
                    Add to Cart
                  </button>
                </div>
                <div className="p-4">
                  <h3 className="text-sm font-medium text-gray-800 truncate">
                    {product.name}
                  </h3>
                  <div className="flex justify-between items-center mt-1">
                    <p className="text-sm font-bold text-black">
                      Rs. {product.price.toLocaleString()}
                    </p>
                    {product.originalPrice && (
                      <p className="text-xs text-gray-400 line-through">
                        Rs. {product.originalPrice.toLocaleString()}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// ============================================
// CATEGORY SECTION COMPONENT (Named Export - for Modal)
// ============================================
export const CategorySection = () => {
  const navigate = useNavigate();

  const gentsCategories = [
    {
      id: 10,
      name: "Cotton",
      image:
        "https://galaxy-apparel.com/cdn/shop/files/Galaxy_apparel_review.jpg?v=1676323250&width=400",
      slug: "cotton",
    },
    {
      id: 1,
      name: "Grace",
      image:
        "https://galaxy-apparel.com/cdn/shop/files/EverlastingGraceUnveilingthe2024FabricsCollectionGraceFABRIC2024WashNWearSummerEdition.jpg?v=1707315770&width=400",
      slug: "grace",
    },
    {
      id: 2,
      name: "Zain Jee",
      image:
        "https://galaxy-apparel.com/cdn/shop/files/ZainJeeSoftCottonhighqualitycottonsuit_Selection_7.jpg?v=1707657864&width=600",
      slug: "zain-g",
    },
    {
      id: 3,
      name: "Narkins",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQLwdx6xa2hogNAMix4WWW_K81TRkWo88r4tVTE3y9cyg&s=10",
      slug: "narkins",
    },
    {
      id: 4,
      name: "Florence",
      image:
        "https://lawrencepur.com/cdn/shop/products/edited_4012b5f0-bb57-4e68-ad64-0a683c4368df.jpg?v=1756867518",
      slug: "florence",
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
      image: "https://alsheikhfabrics.store/wp-content/uploads/2026/01/330.jpg",
      slug: "al-karam",
    },
    {
      id: 9,
      name: "Wash & Wear",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS8q9KPk0xbkeBuyMoS7xmwR1DEw7f25qM-GMGLK7ph0w&s=10",
      slug: "wash-wear",
    },
    {
      id: 11,
      name: "Unstitched Collection",
      image:
        "https://www.wijdanstore.com/cdn/shop/products/cover_e61eb4a0-df89-444d-9643-2cf23d987709.jpg?v=1750393102",
      slug: "unstitched",
    },
  ];

  const handleCategoryClick = (category) => {
    navigate(`/category/${category.slug}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12 bg-gradient-to-r from-gray-50 to-white rounded-2xl p-8 border border-gray-100 shadow-sm">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">
            Premium Gents Fabrics Collection – Quality & Comfort
          </h3>
          <div className="space-y-3 text-gray-600 leading-relaxed">
            <p>
              Welcome to our premium gents fabric collection, where quality
              meets comfort. We offer a wide range of high-quality unstitched
              fabrics for men, including cotton, khaddar, wash & wear, and
              premium formal fabrics.
            </p>
            <p>
              Each fabric is carefully selected to ensure the highest quality,
              durability, and comfort. Whether you're looking for everyday wear
              or formal occasions, our collection has something for everyone.
            </p>
            <p>
              All our products are available with cash on delivery across
              Pakistan. Shop with confidence and experience the best in fabric
              quality and service.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
          {gentsCategories.map((category) => (
            <div
              key={category.id}
              onClick={() => handleCategoryClick(category)}
              className="group cursor-pointer"
            >
              <div className="relative overflow-hidden rounded-2xl bg-gray-100 aspect-[3/4] shadow-md hover:shadow-2xl transition-all duration-500">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  onError={(e) => {
                    e.target.src =
                      "https://via.placeholder.com/400x500/cccccc/666666?text=" +
                      category.name;
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
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Category;
