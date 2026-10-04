// MensModal.jsx - Updated with fixed back button
import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

const MensModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  // Body scroll disable/enable
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Categories Data
  const gentsCategories = [
  {
      id: 10,
      name: "Cotton",
      image:
        "https://galaxy-apparel.com/cdn/shop/files/Galaxy_apparel_review.jpg?v=1676323250&width=400",
      slug: "cotton",
    },  {
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
      image: "./images/al-karam.jpg",
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

  if (!isOpen) return null;

  // ✅ Category click - Page par navigate karega
  const handleCategoryClick = (category) => {
    navigate(`/category/${category.slug}`);
    onClose(); // Modal band karein
  };

  // ✅ Back button - Modal band karega aur home page par le jayega
  const handleBack = () => {
    navigate("/#category-section", { replace: true });
  };

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
          {/* ✅ Back Button - Modal band aur home */}
          <button
            onClick={handleBack}
            className="fixed top-4 left-4 z-[101] w-12 h-12 bg-black/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-black transition-colors duration-300 shadow-2xl"
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
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
          </button>

          {/* ✅ Close Button - Sirf modal band karega */}
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
              {/* Header */}
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
                  Discover premium gents fabrics from Pakistan's most trusted
                  brands
                </p>
                <div className="w-24 h-1 bg-black mx-auto mt-4"></div>
              </motion.div>

              {/* Categories Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
                {gentsCategories.map((category, index) => (
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
                        onError={(e) => {
                          e.target.src =
                            "https://placehold.co/400x500/cccccc/666666?text=" +
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
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MensModal;
