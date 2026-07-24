// PerfumeSection.jsx - With Product Click Tracking
import React, { useState, useEffect } from "react";
import { useCart } from "./CartContext";
import { toast } from "react-hot-toast";
import CommentBox from "./CommentBox";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY,
);

// Real Star Display for Reviews
const StarDisplay = ({ rating }) => {
  const fullStars = Math.round(rating);
  const emptyStars = 5 - fullStars;
  return (
    <div className="flex text-yellow-400 text-sm">
      {[...Array(fullStars)].map((_, i) => (
        <span key={`full-${i}`}>★</span>
      ))}
      {[...Array(emptyStars)].map((_, i) => (
        <span key={`empty-${i}`} className="text-gray-300">
          ★
        </span>
      ))}
    </div>
  );
};

const PerfumeSection = () => {
  const { addToCart } = useCart();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [productRatings, setProductRatings] = useState({});

  const perfumes = [
    {
      id: 1,
      image: "./images/perfume1.webp",
      price: 1999,
      name: "Hafiz Khubaib Royal Women",
      description:
        "Experience the richness of authentic Arabic Attar imported directly from Saudi Arabia...",
      tags: [
        "Rose",
        "Jasmine",
        "Peony",
        "Orange Blossom",
        "Pear",
        "Bergamot",
        "Vanilla",
        "White Musk",
        "Amber",
        "Sandalwood",
      ],
      category: "Premium",
      badges: [
        "100% Original",
        "Fast Delivery",
        "Premium Quality",
        "Satisfaction Guaranteed",
      ],
    },
    {
      id: 2,
      image: "./images/perfume2.webp",
      price: 1499,
      name: "Hafiz Khubaib Gold",
      description:
        "An elegant luxury fragrance specially selected for women who appreciate sophistication...",
      tags: [
        "Pure Oud",
        "White Musk",
        "Amber",
        "Saffron",
        "Frankincense",
        "Sandalwood",
        "Cedarwood",
        "Patchouli",
        "Leather",
        "Agarwood",
      ],
      category: "Luxury",
      badges: [
        "100% Original",
        "Fast Delivery",
        "Alcohol Free",
        "Satisfaction Guaranteed",
      ],
    },
    {
      id: 3,
      image: "./images/perfume3.webp",
      price: 2999,
      name: "Hafiz Khubaib Noir Men",
      description:
        "Crafted for the modern gentleman, this premium fragrance is imported from Saudi Arabia...",
      category: "Signature",
      tags: [
        "Bergamot",
        "Lemon",
        "Lavender",
        "Black Pepper",
        "Cardamom",
        "Cedarwood",
        "Sandalwood",
        "Amber",
        "White Musk",
        "Oud",
      ],
      badges: [
        "100% Original",
        "Fast Delivery",
        "Premium Quality",
        "Satisfaction Guaranteed",
      ],
    },
  ];

  // Load ratings for all products
  useEffect(() => {
    const loadAllRatings = async () => {
      const ratings = {};
      for (const perfume of perfumes) {
        const { data, error } = await supabase
          .from("reviews")
          .select("rating")
          .eq("product_id", perfume.id);

        if (!error && data && data.length > 0) {
          const total = data.reduce((sum, r) => sum + r.rating, 0);
          const avg = total / data.length;
          ratings[perfume.id] = {
            average: Math.round(avg * 10) / 10,
            count: data.length,
          };
        } else {
          ratings[perfume.id] = { average: 0, count: 0 };
        }
      }
      setProductRatings(ratings);
    };
    loadAllRatings();
  }, []);

  // 🔥 GA4 - Product Click Function
  const trackProductClick = (product) => {
    if (window.gtag) {
      window.gtag("event", "view_item", {
        currency: "PKR",
        value: product.price,
        items: [
          {
            item_id: String(product.id),
            item_name: product.name,
            item_category: product.category || "perfume",
            price: product.price,
            quantity: 1,
          },
        ],
      });
      console.log("📊 Product Clicked:", product.name);
    }
  };

  // 🔥 GA4 - Add to Cart Function
  const trackAddToCart = (product, quantity) => {
    if (window.gtag) {
      window.gtag("event", "add_to_cart", {
        currency: "PKR",
        value: product.price * quantity,
        items: [
          {
            item_id: String(product.id),
            item_name: product.name,
            item_category: product.category || "perfume",
            price: product.price,
            quantity: quantity,
          },
        ],
      });
      console.log("📊 Added to Cart:", product.name, "x", quantity);
    }
  };

  const openModal = (product) => {
    // 🔥 Track product click
    trackProductClick(product);

    setSelectedProduct(product);
    setQuantity(1);
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setSelectedProduct(null);
    document.body.style.overflow = "auto";
  };

  const handleAddToCart = () => {
    if (selectedProduct) {
      // 🔥 Track add to cart
      trackAddToCart(selectedProduct, quantity);

      addToCart({
        id: selectedProduct.id,
        name: selectedProduct.name,
        price: selectedProduct.price,
        image: selectedProduct.image,
        quantity: quantity,
        category: "perfume",
      });
      toast.success(`${selectedProduct.name} added to cart!`, {
        duration: 3000,
        position: "top-right",
        icon: "🛒",
      });
      closeModal();
    }
  };

  return (
    <>
      <section className="py-20 px-5 bg-white">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold">
            Hafiz <span className="text-gray-400">Khubaib</span>
          </h2>
          <p className="text-gray-500 mt-3 max-w-2xl mx-auto">
            Premium Luxury Fragrance Long Lasting
          </p>
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {perfumes.map((item) => {
            const rating = productRatings[item.id] || { average: 0, count: 0 };
            return (
              <div key={item.id} className="group cursor-pointer">
                <div
                  className="relative w-full h-[480px] overflow-hidden rounded-xl bg-gray-100"
                  onClick={() => openModal(item)}
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover transition duration-700 group-hover:scale-105"
                  />

                  {/* Rating Badge - TOP LEFT */}
                  <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm px-3 py-1 rounded-full text-white text-xs flex items-center gap-1.5 z-10">
                    <span className="text-yellow-400 text-sm">★</span>
                    {rating.count > 0 ? (
                      <>
                        <span className="font-medium">{rating.average}</span>
                       
                        <span>({rating.count})</span>
                      </>
                    ) : (
                      <span className="text-gray-300">No reviews</span>
                    )}
                  </div>

                  <button
                    className="absolute bottom-4 left-4 px-6 py-2.5 text-sm tracking-wide text-white font-medium backdrop-blur-md bg-transparent border border-white/30 hover:bg-white/30 hover:scale-105 transition-all duration-300 shadow-sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      openModal(item);
                    }}
                  >
                    Add to Cart
                  </button>
                </div>

                <div className="text-center mt-6">
                  <h3 className="text-xl tracking-wide font-light text-gray-900">
                    {item.name}
                  </h3>
                  <p className="text-gray-400 text-sm mt-2">{item.category}</p>
                  <p className="text-gray-600 mt-2 text-lg font-medium">
                    Rs {item.price.toLocaleString()}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Modal - Same as before */}
      {selectedProduct && (
        <div
          className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={closeModal}
        >
          <div
            className="bg-white rounded max-w-6xl w-full max-h-[90vh] overflow-y-auto modal-container relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* ... modal content (same as before) ... */}
            <style>
              {`
                .modal-container::-webkit-scrollbar {
                  width: 6px;
                  height: 6px;
                }
                .modal-container::-webkit-scrollbar-track {
                  background: transparent;
                  border-radius: 10px;
                }
                .modal-container::-webkit-scrollbar-thumb {
                  background: #000000;
                  border-radius: 10px;
                  height: 30px;
                  min-height: 30px;
                }
                .modal-container::-webkit-scrollbar-thumb:hover {
                  background: #333333;
                }
              `}
            </style>

            <button
              onClick={closeModal}
              className="absolute top-4 right-4 z-10 w-12 h-12 flex items-center justify-center rounded-full bg-black/80 text-white hover:bg-black transition-all duration-300"
            >
              <svg
                className="w-6 h-6"
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

            <div className="grid md:grid-cols-2 gap-8 p-8 md:p-10">
              {/* Left - Image */}
              <div className="relative h-[550px] md:h-[650px]">
                <img
                  src={selectedProduct.image}
                  alt={selectedProduct.name}
                  className="w-full h-full object-cover rounded-2xl"
                />
              </div>

              {/* Right - Details */}
              <div
                className="flex flex-col h-[550px] md:h-[650px] overflow-y-auto pr-3"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
              >
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                  {selectedProduct.name}
                </h2>
                <p className="text-gray-500 text-sm mb-3">
                  {selectedProduct.category}
                </p>

                {/* Rating in Modal */}
                {(() => {
                  const rating = productRatings[selectedProduct.id] || {
                    average: 0,
                    count: 0,
                  };
                  return (
                    <div className="flex items-center gap-2 mb-4">
                      {rating.count > 0 ? (
                        <>
                          <StarDisplay rating={rating.average} />
                          <span className="text-gray-600 text-sm">
                            {rating.average} ({rating.count}{" "}
                            {rating.count === 1 ? "review" : "reviews"})
                          </span>
                        </>
                      ) : (
                        <span className="text-gray-400 text-sm">
                          No reviews yet
                        </span>
                      )}
                    </div>
                  );
                })()}

                <p className="text-3xl font-bold text-black mb-4">
                  Rs {selectedProduct.price.toLocaleString()}
                </p>

                {/* Badges */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {selectedProduct.badges.map((badge, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-green-50 text-green-700 text-xs font-medium rounded-full border border-green-200"
                    >
                      ✓ {badge}
                    </span>
                  ))}
                </div>

                {/* Description */}
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  {selectedProduct.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-5">
                  <span className="inline-flex items-center px-3 py-1 bg-gray-200 text-gray-600 text-xs md:text-sm font-semibold tracking-wide uppercase shadow-sm">
                    Top Notes
                  </span>
                  {selectedProduct.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gray-50 text-gray-500 text-xs rounded-full border border-gray-200"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Quantity */}
                <div className="flex items-center gap-4 mb-5">
                  <label className="text-sm font-medium text-gray-700">
                    Quantity:
                  </label>
                  <div className="flex items-center gap-2 border border-gray-300 rounded-lg">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-9 h-9 flex items-center justify-center hover:bg-gray-100 transition"
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
                    <span className="w-10 text-center font-medium">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-9 h-9 flex items-center justify-center hover:bg-gray-100 transition"
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

                {/* Add to Cart */}
                <button
                  onClick={handleAddToCart}
                  className="w-full bg-black text-white py-4 px-8 text-base font-medium hover:bg-gray-800 transition-all duration-300"
                >
                  Add to Cart
                </button>

                {/* Comments Section */}
                <div className="mt-5 border-t pt-4">
                  <h3 className="text-base font-bold mb-3">
                    💬 Reviews & Comments
                  </h3>
                  <p className="text-xs text-gray-400 mb-3">
                    Real reviews from real customers. No login required!
                  </p>
                  <CommentBox productId={selectedProduct.id} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PerfumeSection;
