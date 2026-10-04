// components/SearchResults.jsx - Fixed (navigate to ProductDetailPage)
import React, { useState, useEffect } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom"; // ✅ Added useNavigate
import { useCart } from "./CartContext";
import { toast } from "react-hot-toast";
import { productData as importedProductData } from "./Category";
import { productsData } from "../data/productsApi";

const SearchResults = () => {
  const location = useLocation();
  const navigate = useNavigate(); // ✅ Added
  const { addToCart } = useCart();
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);

  // Get search query from URL
  const query = new URLSearchParams(location.search).get("q");

  // Combine both data sources
  const getAllProducts = () => {
    const allProducts = [];

    // 1. Gents products from Category.jsx
    if (importedProductData) {
      Object.keys(importedProductData).forEach((key) => {
        if (Array.isArray(importedProductData[key])) {
          importedProductData[key].forEach((product) => {
            allProducts.push({
              ...product,
              category: key,
              source: "gents",
            });
          });
        }
      });
    }

    // 2. Ladies/All products from productsApi.js
    if (productsData && Array.isArray(productsData)) {
      productsData.forEach((product) => {
        let category = "summer";
        if (product.id >= 20001 && product.id <= 20011) {
          category = "lawn";
        } else if (product.id >= 30001 && product.id <= 30020) {
          category = "formal";
        } else if (product.id >= 40001 && product.id <= 40029) {
          category = "luxury";
        }

        allProducts.push({
          ...product,
          category: category,
          source: "ladies",
        });
      });
    }

    return allProducts;
  };

  useEffect(() => {
    if (query) {
      const allProducts = getAllProducts();
      const results = allProducts.filter((product) =>
        product.name.toLowerCase().includes(query.toLowerCase()),
      );
      setSearchResults(results);
    }
    setLoading(false);
  }, [query]);

  // ✅ FIXED: Navigate to ProductDetailPage instead of opening modal
  const handleProductClick = (product) => {
    navigate(`/product/${product.id}`);
  };

  const handleAddToCart = (product, e) => {
    e.stopPropagation();
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category || "summer",
    });
    toast.success(`${product.name} added to cart!`, {
      icon: "🛒",
      duration: 3000,
    });
  };

  // Check if product is from ladies collection
  const isLadiesProduct = (product) => {
    if (!product) return false;
    return product.source === "ladies";
  };

  return (
    <>
      <section className="py-20 bg-white min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold">
              Search Results for{" "}
              <span className="text-gray-400">"{query}"</span>
            </h1>
            <p className="text-gray-500 mt-2">
              Found {searchResults.length} product
              {searchResults.length !== 1 ? "s" : ""}
            </p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto"></div>
              <p className="mt-4 text-gray-500">Searching...</p>
            </div>
          ) : searchResults.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
              {searchResults.map((product) => (
                <div
                  key={product.id}
                  onClick={() => handleProductClick(product)}
                  className="group cursor-pointer"
                >
                  <div className="relative overflow-hidden rounded-2xl bg-gray-100 aspect-[3/4] shadow-md hover:shadow-2xl transition-all duration-500">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      onError={(e) => {
                        e.target.src =
                          "data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%27400%27 height=%27500%27 viewBox=%270 0 400 500%27%3E%3Crect width=%27400%27 height=%27500%27 fill=%27%23f3f4f6%27/%3E%3Ctext x=%27200%27 y=%27250%27 font-family=%27sans-serif%27 font-size=%2720%27 fill=%27%239ca3af%27 text-anchor=%27middle%27%3ENo Image%3C/text%3E%3C/svg%3E";
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                    {/* Ladies Badge */}

                    <button
                      onClick={(e) => handleAddToCart(product, e)}
                      className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white text-black px-6 py-2 rounded-full text-xs font-medium opacity-0 group-hover:opacity-100 transition-all duration-500 hover:bg-black hover:text-white shadow-lg"
                    >
                      Add to Cart
                    </button>
                  </div>
                  <div className="p-4">
                    <h3 className="text-sm font-medium text-gray-800 line-clamp-2 min-h-[40px]">
                      {product.name}
                    </h3>
                    <div className="flex justify-between items-center mt-1">
                      <p className="text-sm font-bold text-black">
                        Rs. {product.price.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <svg
                className="w-24 h-24 mx-auto text-gray-300 mb-4"
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
              <p className="text-gray-500 text-lg">No products found</p>
              <p className="text-gray-400 text-sm mt-2">
                Try searching with different keywords
              </p>
              <Link
                to="/category"
                className="inline-block mt-6 bg-black text-white px-8 py-3 rounded-full text-sm font-medium hover:bg-gray-800 transition-all duration-300"
              >
                Browse Categories
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* ✅ REMOVED ProductDetail Modal - No longer needed */}
    </>
  );
};

export default SearchResults;
