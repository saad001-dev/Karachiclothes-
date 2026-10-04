import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "./CartContext";
import CartDrawer from "./CartDrawer";
import { ShieldCheckIcon } from "@heroicons/react/24/outline";
import { LogOutIcon, Menu, X, Search } from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { getTotalItems } = useCart();
  const navigate = useNavigate();

  const cartCount = getTotalItems();

  // ✅ Check if user is logged in
  const isLoggedIn = localStorage.getItem("adminToken") !== null;

  // ✅ LOGOUT FUNCTION
  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
    navigate("/login");
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
      setIsSearchOpen(false);
    }
  };

  const handleCartClick = () => {
    setIsCartOpen(true);
  };

  // ✅ ADMIN BUTTON CLICK
  const handleAdminClick = () => {
    if (isLoggedIn) {
      navigate("/admin");
    } else {
      navigate("/login");
    }
  };

  const handleProductsClick = (e) => {
    e.preventDefault();
    closeMenu();

    if (
      window.location.pathname === "/" ||
      window.location.pathname === "/home"
    ) {
      const section = document.getElementById("products-section");
      if (section) {
        section.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    } else {
      navigate("/");
      setTimeout(() => {
        const section = document.getElementById("products-section");
        if (section) {
          section.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      }, 300);
    }
  };

  // ✅ Mobile menu toggle
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <nav className="relative shadow-sm backdrop-blur-sm bg-white/90 border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 ">
          <div className="flex justify-between items-center h-16 sm:h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center flex-shrink-0">
              <img
                src="/images/k.webp"
                alt="Karachi Clothes"
                className="h-7 sm:h-8 md:h-10 w-auto object-contain"
              />
            </Link>

            {/* Desktop Menu */}
            <ul className="hidden lg:flex gap-4 xl:gap-6 text-[11px] xl:text-[12px] font-medium tracking-wide">
              <li className="relative cursor-pointer text-black hover:text-gray-600 transition-colors duration-300 group">
                <Link to="/">HOME</Link>
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-black transition-all duration-300 group-hover:w-full"></span>
              </li>
              <li className="relative cursor-pointer text-black hover:text-gray-600 transition-colors duration-300 group">
                <a href="#" onClick={handleProductsClick} className="block">
                  PRODUCTS
                </a>
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-black transition-all duration-300 group-hover:w-full"></span>
              </li>
              <li className="relative cursor-pointer text-black hover:text-gray-600 transition-colors duration-300 group">
                <Link to="/perfume" onClick={closeMenu}>
                  PERFUME
                </Link>
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-black transition-all duration-300 group-hover:w-full"></span>
              </li>
              <li className="relative cursor-pointer text-black hover:text-gray-600 transition-colors duration-300 group">
                <Link to="/about">ABOUT US</Link>
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-black transition-all duration-300 group-hover:w-full"></span>
              </li>
              <li className="relative cursor-pointer text-black hover:text-gray-600 transition-colors duration-300 group">
                <Link to="/new">NEW ARTICLES</Link>
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-black transition-all duration-300 group-hover:w-full"></span>
              </li>
              <li className="relative cursor-pointer text-black hover:text-gray-600 transition-colors duration-300 group">
                <Link to="/news">OUR NEWS</Link>
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-black transition-all duration-300 group-hover:w-full"></span>
              </li>
              <li className="relative cursor-pointer text-black hover:text-gray-600 transition-colors duration-300 group">
                <Link to="/contact">CONTACT US</Link>
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-black transition-all duration-300 group-hover:w-full"></span>
              </li>
            </ul>

            {/* Right Side - Search & Cart */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Search Bar - Desktop */}
              <div className="hidden md:flex items-center">
                <form onSubmit={handleSearch} className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search fabrics..."
                    className="w-36 lg:w-60 px-4 py-1.5 lg:py-2 pl-8 lg:pl-10 bg-gray-100 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-300"
                  />
                  <svg
                    className="absolute left-2.5 lg:left-3 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 lg:w-4 lg:h-4 text-gray-400"
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
                  <button type="submit" className="hidden">
                    Search
                  </button>
                </form>
              </div>

              {/* Search Icon - Mobile */}
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="md:hidden w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors duration-300"
              >
                <Search className="w-5 h-5 text-gray-700" />
              </button>

              {/* Mobile Search Input */}
              {isSearchOpen && (
                <div className="absolute top-16 left-0 right-0 bg-white/95 backdrop-blur-md p-4 shadow-lg border-b border-gray-100 md:hidden animate-slideDown">
                  <form onSubmit={handleSearch} className="relative">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search fabrics..."
                      className="w-full px-4 py-3 pl-12 bg-gray-100 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-300"
                      autoFocus
                    />
                    <svg
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
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
                    <button type="submit" className="hidden">
                      Search
                    </button>
                  </form>
                </div>
              )}

              {/* Cart Icon */}
              <button
                onClick={handleCartClick}
                className="relative w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors duration-300 group"
              >
                <svg
                  className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700 group-hover:scale-110 transition-transform duration-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-black text-white text-[10px] sm:text-xs font-bold w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center animate-pulse">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* ✅ ADMIN BUTTON + LOGOUT - Mobile Friendly */}
              {isLoggedIn ? (
                <div className="flex items-center gap-0.5 sm:gap-1">
                  <button
                    onClick={handleAdminClick}
                    className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition"
                    title="Admin Panel"
                  >
                    <ShieldCheckIcon className="w-5 h-5 sm:w-5.5 sm:h-5.5 text-gray-700" />
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-full hover:bg-red-50 transition"
                    title="Logout"
                  >
                    <LogOutIcon className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleAdminClick}
                  className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition"
                  title="Admin Login"
                >
                  <ShieldCheckIcon className="w-5 h-5 sm:w-5.5 sm:h-5.5 text-gray-700" />
                </button>
              )}

              {/* Mobile Menu Button - Hamburger */}
              <button
                onClick={toggleMenu}
                className="lg:hidden relative w-9 h-9 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors duration-300 focus:outline-none"
                aria-label="Toggle menu"
              >
                {isOpen ? (
                  <X className="w-6 h-6 text-gray-700" />
                ) : (
                  <Menu className="w-6 h-6 text-gray-700" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Menu Dropdown - FIXED */}
          <div
            className={`lg:hidden overflow-hidden transition-all duration-500 ease-in-out ${
              isOpen ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <ul className="flex flex-col py-4 px-4 space-y-1 text-sm font-medium tracking-wide border-t border-gray-100">
              <li className="cursor-pointer text-black hover:text-gray-600 hover:pl-4 transition-all duration-300 py-2.5 rounded-lg hover:bg-gray-50">
                <Link to="/" onClick={closeMenu}>
                  HOME
                </Link>
              </li>
              <li className="cursor-pointer text-black hover:text-gray-600 hover:pl-4 transition-all duration-300 py-2.5 rounded-lg hover:bg-gray-50">
                <Link to="/category" onClick={closeMenu}>
                  PRODUCTS
                </Link>
              </li>
              <li className="cursor-pointer text-black hover:text-gray-600 hover:pl-4 transition-all duration-300 py-2.5 rounded-lg hover:bg-gray-50">
                <Link to="/perfume" onClick={closeMenu}>
                  PERFUME
                </Link>
              </li>
              <li className="cursor-pointer text-black hover:text-gray-600 hover:pl-4 transition-all duration-300 py-2.5 rounded-lg hover:bg-gray-50">
                <Link to="/about" onClick={closeMenu}>
                  ABOUT US
                </Link>
              </li>
              <li className="cursor-pointer text-black hover:text-gray-600 hover:pl-4 transition-all duration-300 py-2.5 rounded-lg hover:bg-gray-50">
                <Link to="/new" onClick={closeMenu}>
                  NEW ARTICLES
                </Link>
              </li>
              <li className="cursor-pointer text-black hover:text-gray-600 hover:pl-4 transition-all duration-300 py-2.5 rounded-lg hover:bg-gray-50">
                <Link to="/news" onClick={closeMenu}>
                  OUR NEWS
                </Link>
              </li>
              <li className="cursor-pointer text-black hover:text-gray-600 hover:pl-4 transition-all duration-300 py-2.5 rounded-lg hover:bg-gray-50">
                <Link to="/contact" onClick={closeMenu}>
                  CONTACT US
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
};

export default Navbar;