// components/News.jsx - FIXED Image Heights
import React, { useState } from "react";
import { Link } from "react-router-dom";

const News = () => {
  const [activeFilter, setActiveFilter] = useState("all");

  const newsData = [
    {
      id: 1,
      title: "Premium Unstitched Fabric Collection Available",
      category: "collection",
      date: "July 2026",
      excerpt:
        "Browse our wide range of premium Lawn, Khaddar, Linen, Cotton, Wash & Wear, Boski, and other quality fabrics for every season.",
      image: "./images/ash8.webp",
      author: "Faizan Silk",
      featured: true,
    },
    {
      id: 2,
      title: "New Designs Added Every Week",
      category: "update",
      date: "July 2026",
      excerpt:
        "We regularly add fresh designs and colors to ensure you always find the latest fabric collections.",
      image:
        "./images/adan12.webp",
      author: "Faizan Silk",
      featured: false,
    },
    {
      id: 3,
      title: "Nationwide Delivery Across Pakistan",
      category: "service",
      date: "July 2026",
      excerpt:
        "We deliver premium quality fabrics safely and quickly to customers all over Pakistan.",
      image:
        "https://images.openai.com/static-rsc-4/KfgPA1dh7ODJ-xkOMziCVImPvY9CQQnvagYsr2vpWCbEgm21pU3sx_t91qaHAPM_tO-_dtCYjnv-dn8NU5F1BYwf6zsLCXyLdbd8kJMVfwgJHHntk8bDrX3a24A6bb_5E4K8D5BuTMQ-86cOg2b1GQsk46neFeOHHewNxMc5PMA?purpose=inline",
      author: "Faizan Silk",
      featured: false,
    },
    {
      id: 4,
      title: "Quality Assured Before Delivery",
      category: "quality",
      date: "July 2026",
      excerpt:
        "Every order is carefully inspected before shipping to ensure the best quality reaches our customers.",
      image:
        "https://images.openai.com/static-rsc-4/3LffzncHz5uaHJSvP3wL2KRvOKGO6lUkQSryI8Zd7BuLSxnq7k7Zxg1xuga3sDSMyAde62PPSGD4atLq_NTwZYpwMchA1i_HnoH39qb03F3w1N19kr3pg5WNRPn2H2rLrK2Ahx2oSyXL8sTZPXuC6SokycaQip2WZNI2SyrVjTgDtOsTBmWzhBOGWcfiVPWO?purpose=fullsize",
      author: "Faizan Silk",
      featured: false,
    },
    {
      id: 5,
      title: "Premium Fabrics for Every Season",
      category: "collection",
      date: "July 2026",
      excerpt:
        "From lightweight lawn for summer to warm khaddar and linen for winter, explore fabrics for every occasion.",
      image:
        "https://gracefabrics.com/cdn/shop/files/CEDAR-BROWN.jpg?v=1778676258&width=400",
      author: "Faizan Silk",
      featured: false,
    },
    {
      id: 6,
      title: "Easy Online Shopping Experience",
      category: "service",
      date: "July 2026",
      excerpt:
        "Shop your favorite fabrics online with a simple ordering process and secure customer support.",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcStMLhqO26F8aYtdlcFPNzM7Z5XA-jmP1njBj46TsZpwA&s=10",
      author: "Faizan ",
      featured: false,
    },
    {
      id: 7,
      title: "Premium Lawn 3 Piece Ash By Johra Collection",
      category: "collection",
      date: "July 2026",
      excerpt:
        "Discover our latest premium khaddar fabrics crafted for elegance, warmth, and everyday comfort during the winter season.",
      image: "./images/ash9.webp",
      author: "Faizan",
      featured: false,
    },
  ];

  const categories = [
    { id: "all", label: "All News" },
    { id: "collection", label: "Collections" },
    { id: "update", label: "Updates" },
    { id: "service", label: "Services" },
    { id: "quality", label: "Quality" },
  ];

  const featuredNews = newsData.find((news) => news.featured);

  const filteredNews =
    activeFilter === "all"
      ? newsData.filter((news) => !news.featured)
      : newsData.filter(
          (news) => news.category === activeFilter && !news.featured,
        );

  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-3">
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 bg-black/5 rounded-full text-xs font-medium text-gray-600 tracking-wider uppercase mb-4">
            Stay Updated
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold">
            Our <span className="text-gray-400">News</span>
          </h2>
          <p className="text-gray-500 mt-3 max-w-2xl mx-auto">
            Stay updated with the latest news, collections, and achievements
          </p>
        </div>

        {/* Featured News - FIXED IMAGE HEIGHT */}
        {featuredNews && (
          <div className="mb-12">
            <div className="bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-shadow duration-500">
              <div className="grid grid-cols-1 lg:grid-cols-2">
                <div className="relative contain overflow-hidden">
                  <img
                    src={featuredNews.image}
                    alt={featuredNews.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                    onError={(e) => {
                      e.target.src =
                        "https://placehold.co/800x600/cccccc/666666?text=Featured+News";
                    }}
                  />
                  <div className="absolute top-4 left-4 bg-black text-white text-xs font-bold px-3 py-1.5 rounded-full">
                    Featured
                  </div>
                </div>
                <div className="p-8 lg:p-10 flex flex-col justify-center">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                      {featuredNews.category}
                    </span>
                    <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                    <span className="text-xs text-gray-400">
                      {featuredNews.date}
                    </span>
                  </div>
                  <h3 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-3">
                    {featuredNews.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">
                    {featuredNews.excerpt}
                  </p>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">
                    From the finest lawns to the richest khaddar, we bring you
                    fabrics that tell stories of tradition, quality, and
                    timeless elegance. With 15+ years of excellence, Karachi
                    Clothes is where fashion meets comfort.
                  </p>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={(e) => e.stopPropagation()}
                      className="bg-black text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-gray-800 transition-all duration-300"
                    >
                      Read More
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveFilter(category.id)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                activeFilter === category.id
                  ? "bg-black text-white shadow-lg shadow-black/25"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-black"
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>

        {/* News Grid - FIXED IMAGE HEIGHT */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredNews.map((news) => (
            <div
              key={news.id}
              className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 flex flex-col"
            >
              {/* ✅ Fixed Image Container with proper height */}
              <div className="relative cover h-100 overflow-hidden bg-gray-100  flex-shrink-0">
                <img
                  src={news.image}
                  alt={news.title}
                  className="w-full h-full  group-hover:scale-110 transition-transform duration-700"
                  onError={(e) => {
                    e.target.src =
                      "https://placehold.co/400x300/cccccc/666666?text=News";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-gray-800">
                  {news.category}
                </div>
              </div>

              {/* Content - flex-grow to fill remaining space */}
              <div className="p-6 flex flex-col flex-1">
                <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
                  <span>{news.date}</span>
                  <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-black transition-colors duration-300 line-clamp-2">
                  {news.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-4 line-clamp-3 flex-1">
                  {news.excerpt}
                </p>
                <Link
                  to="#"
                  className="inline-flex items-center gap-2 text-sm font-medium text-black hover:text-gray-600 transition-colors duration-300 group/link mt-auto"
                >
                  Read More
                  <svg
                    className="w-4 h-4 group-hover/link:translate-x-1 transition-transform duration-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredNews.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No news found in this category.</p>
          </div>
        )}

        {/* Newsletter Subscription */}
        <div className="mt-16 bg-gradient-to-r from-gray-900 to-gray-800 rounded-3xl p-8 md:p-12 text-center">
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
            Subscribe to Our Newsletter
          </h3>
          <p className="text-gray-400 text-sm mb-6">
            Get the latest news, collections, and exclusive offers directly in
            your inbox.
          </p>
          <form className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-5 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent transition-all duration-300"
            />
            <button className="bg-white text-gray-900 px-8 py-3 rounded-xl text-sm font-medium hover:bg-gray-200 transition-all duration-300 hover:scale-105">
              Subscribe Now
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default News;
