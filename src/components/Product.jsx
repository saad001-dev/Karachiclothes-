// Product.jsx - Fixed with real product IDs
import React, { useState } from "react";
import { useCart } from "./CartContext";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

// ✅ Lazy loading image component
const LazyImage = ({ src, alt, className, onError }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageSrc, setImageSrc] = useState(src);

  return (
    <div className="relative w-full h-full bg-gray-100">
      {!imageLoaded && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-gray-200 border-t-black rounded-full animate-spin"></div>
        </div>
      )}
      <img
        src={imageSrc}
        alt={alt}
        className={`${className} ${!imageLoaded ? "opacity-0" : "opacity-100"} transition-opacity duration-500`}
        loading="lazy"
        onLoad={() => setImageLoaded(true)}
        onError={(e) => {
          if (onError) {
            onError(e);
          } else {
            e.target.src =
              "https://via.placeholder.com/400x500/cccccc/666666?text=No+Image";
          }
          setImageLoaded(true);
        }}
      />
    </div>
  );
};

const Product = () => {
  const { addToCart } = useCart();
  const navigate = useNavigate();

  // ✅ REAL PRODUCTS from your data - using existing IDs
  const products = [
    {
      id: 21001,
      name: "Premium Cotton Silver Gray – Unstitched Men's Suit",
      price: 3000,
      originalPrice: 3800,
      image:
        "https://sapphire-online.com/dw/image/v2/BKSB_PRD/on/demandware.static/-/Sites-sapphire-master-catalog/default/dwd3c127a9/images/April26/22ndApril26/US2P26CTV341_5.JPG?sw=1000&sh=1200",
      description:
        "Premium Cotton Silver Gray is a premium unstitched fabric featuring a classic silver gray shade. Made from 100% pure cotton, it offers comfort and elegance for daily wear. Available with cash on delivery across Pakistan.",
    },
    {
      id: 80006,
      name: "Zain Jee Unstitched Men's Premium Suit",
      price: 3200,
      originalPrice: 4000,
      image:
        "https://zainjeecollection.com/wp-content/uploads/2026/06/IMG-20260629-WA0004.jpg",
      description:
        "Premium quality unstitched fabric from Zain Jee Collection. Made from high-quality cotton, offering superior comfort, durability, and elegance. Perfect for formal and casual occasions. Available with cash on delivery across Pakistan.",
    },
    {
      id: 60010,
      name: "Unstitched Men's Suit – Premium Fabric",
      price: 3000,
      originalPrice: 3800,
      image:
        "https://bareezeman.com/cdn/shop/files/3000000038338_2.jpg?v=1770701478&width=400",
      description:
        "Premium unstitched fabric perfect for men's formal and casual wear. Made from high-quality material, it offers comfort, durability, and style. Available with cash on delivery across Pakistan.",
    },
  ];

  const handleAddToCart = (product, e) => {
    e.stopPropagation();
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category || "gents",
    });

    toast.success(`${product.name} added to cart!`, {
      icon: "🛒",
      duration: 3000,
    });
  };

  // ✅ Handle product click - Navigate to ProductDetailPage
  const handleProductClick = (product) => {
    navigate(`/product/${product.id}`);
  };

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 bg-black/5 rounded-full text-xs font-medium text-gray-600 tracking-wider uppercase mb-4">
            Latest Collections
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold">
            New <span className="text-gray-400">Arrivals</span>
          </h2>
          <p className="text-gray-500 mt-3 max-w-2xl mx-auto">
            Discover our latest fabric collections from top brands
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <div
              key={product.id}
              onClick={() => handleProductClick(product)}
              className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 cursor-pointer"
            >
              {/* Image Container with Lazy Loading */}
              <div className="relative overflow-hidden h-80 bg-gray-100">
                <LazyImage
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute top-4 left-4 bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full">
                  NEW
                </div>

                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-bold text-gray-800 group-hover:text-black transition-colors duration-300 line-clamp-1">
                    {product.name}
                  </h3>
                  <span className="text-sm font-medium text-gray-400">
                    {product.brand}
                  </span>
                </div>
                <p className="text-gray-500 text-sm mb-3 line-clamp-2">
                  {product.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold text-black">
                    {product.priceDisplay}
                  </span>
                  <button
                    onClick={(e) => handleAddToCart(product, e)}
                    className="bg-black text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-800 transition-all duration-300 hover:scale-105 active:scale-95"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button - Now navigates to Category page */}
        <div className="text-center mt-12">
          <button
            onClick={() => navigate("/collection/mens")}
            className="border-2 border-black text-black px-10 py-3.5 rounded-full text-sm font-medium tracking-wide hover:bg-black hover:text-white transition-all duration-300 hover:shadow-xl active:scale-95"
          >
            View All Items
          </button>
        </div>
      </div>
    </section>
  );
};

export default Product;
