// components/ProductDetail.jsx - With Simple CSS Hover Zoom Effect
import React, { useState, useRef, useEffect } from "react";
import { useCart } from "./CartContext";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

const ProductDetail = ({
  product,
  isOpen,
  onClose,
  activeTab,
  categoryProducts = [],
}) => {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [viewerCount, setViewerCount] = useState(0);
  const [isReviewExpanded, setIsReviewExpanded] = useState(false);
  const [visibleReviews, setVisibleReviews] = useState(5);

  // Current states - Image, Title & Description
  const [currentImage, setCurrentImage] = useState("");
  const [currentTitle, setCurrentTitle] = useState("");
  const [currentDescription, setCurrentDescription] = useState("");

  // Category Products Thumbnails with full data
  const [categoryThumbnails, setCategoryThumbnails] = useState([]);

  // Customer Review States
  const [customerRating, setCustomerRating] = useState(0);
  const [customerReviewText, setCustomerReviewText] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [customerReviews, setCustomerReviews] = useState([]);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [zoomStyle, setZoomStyle] = useState({
    transformOrigin: "center center",
    transform: "scale(2)",
  });

  const [isZooming, setIsZooming] = useState(false);
  const imageRef = useRef(null);
  const handleMouseMove = (e) => {
    const { left, top, width, height } =
      imageRef.current.getBoundingClientRect();

    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;

    setZoomStyle({
      transformOrigin: `${x}% ${y}%`,
      transform: "scale(2.1)",
    });
  };
  // Generate random reviews
  const generateRandomReviews = (productId) => {
    const reviewCount = Math.floor(Math.random() * 150) + 20;
    const rating = (3 + Math.random() * 2).toFixed(1);
    const reviewTexts = [
      "Amazing quality! The fabric feels premium and looks exactly as shown.",
      "Great value for money. The cloth quality is outstanding! Will definitely order again.",
      "The color is slightly different from the picture but the fabric quality is still beautiful.",
      "Fast delivery and excellent packaging. The material is so soft and comfortable! Highly recommend!",
      "Perfect for special occasions. The fabric drapes beautifully and feels luxurious.",
      "The fabric quality is excellent! Very smooth and breathable material.",
      "Absolutely love this! The texture is so soft and comfortable against the skin.",
      "Good quality fabric for the price. Would recommend to others looking for affordable options.",
      "The stitching is top-notch. Very impressed with the craftsmanship and fabric durability.",
      "Color matches perfectly with the description. The fabric feels high-end and premium.",
      "Mashallah! The fabric quality exceeded my expectations. So elegant and classy.",
      "The material is very durable and doesn't lose its shape after washing. Highly satisfied!",
      "Beautiful fabric with excellent finishing. The texture is smooth and feels expensive.",
      "The cloth is lightweight yet feels sturdy. Perfect for everyday wear.",
      "Stunning fabric quality! The colors are vibrant and the material is breathable.",
      "Very comfortable fabric. Perfect for summer season, light and airy.",
      "The quality of the fabric is unmatched. It's soft, smooth, and feels premium.",
      "Excellent workmanship! The fabric doesn't fade and maintains its color after multiple washes.",
      "Love the fabric texture! It's soft, comfortable, and looks very elegant.",
      "The material is high-quality and the stitching is perfect. Very happy with my purchase!",
      "SubhanAllah! Such beautiful fabric. The feel and quality are amazing.",
      "The cloth has a beautiful shine and feels very comfortable to wear.",
      "Perfect fabric quality for festive occasions. It looks rich and elegant.",
      "The fabric is soft, smooth, and has a beautiful flow. Highly recommended!",
      "Excellent fabric quality. Worth every penny!",
      "Premium feel with a very elegant finish.",
      "Very happy with this purchase. Highly satisfied!",
      "Soft, breathable, and comfortable for daily wear.",
      "The material feels luxurious and premium.",
      "Exactly what I was looking for. Great quality!",
      "Beautiful texture and excellent color.",
      "Fabric quality is even better than expected.",
      "Very smooth and comfortable to wear all day.",
      "Excellent choice for formal wear.",
      "Great stitching and premium finishing.",
      "The fabric is soft yet durable.",
      "Looks classy and feels amazing.",
      "Highly recommended for anyone looking for premium fabric.",
      "Very elegant design and excellent quality.",
      "The cloth feels rich and comfortable.",
      "Amazing craftsmanship and premium material.",
      "Perfect color and outstanding texture.",
      "Excellent purchase. Will buy again soon.",
      "The quality is simply outstanding.",
      "Very stylish and comfortable fabric.",
      "Super soft material with a premium touch.",
      "The finish is clean and professional.",
      "Fabric quality is top class.",
      "Comfortable, breathable, and lightweight.",
      "Worth buying without any hesitation.",
      "Excellent fabric for all seasons.",
      "Very satisfied with the quality.",
      "The texture feels really premium.",
      "High-quality cloth with beautiful colors.",
      "Looks exactly as expected.",
      "The fabric has a luxurious appearance.",
      "Very elegant and stylish material.",
      "The cloth is soft and wrinkle-resistant.",
      "Excellent quality and fast delivery.",
      "Premium fabric with perfect finishing.",
      "Really impressed with the overall quality.",
      "Feels comfortable even after long hours.",
      "Beautiful material with excellent durability.",
      "Very fine texture and smooth finish.",
      "The cloth is soft and easy to maintain.",
      "One of the best fabric purchases I've made.",
      "Looks premium and feels even better.",
      "Great fabric for traditional wear.",
      "Excellent quality at a reasonable price.",
      "Very classy and elegant look.",
      "Comfortable fabric with excellent stitching.",
      "The material is fresh and breathable.",
      "Absolutely worth the price.",
      "The fabric quality is exceptional.",
      "Looks beautiful after stitching.",
      "Very premium feel and smooth texture.",
      "Perfect for weddings and special events.",
      "The color stays fresh after washing.",
      "Elegant fabric with beautiful finishing.",
      "Very pleased with this purchase.",
      "The cloth quality is truly impressive.",
      "Excellent value for premium fabric.",
      "The texture is soft and luxurious.",
      "Highly satisfied with the material.",
      "Perfect balance of comfort and style.",
      "The fabric has a rich and elegant look.",
      "Very soft and easy to wear.",
      "Excellent craftsmanship throughout.",
      "Premium quality with beautiful detailing.",
      "The cloth feels light but durable.",
      "Very neat finishing and quality stitching.",
      "One of my favorite fabrics so far.",
      "Excellent material with premium comfort.",
      "Beautiful quality and amazing texture.",
      "Feels smooth and luxurious.",
      "Very happy with the overall experience.",
      "The fabric exceeded my expectations.",
      "Outstanding quality and beautiful colors.",
      "Perfect choice for premium clothing.",
      "Very refined and elegant fabric.",
      "Top-quality material with excellent finish.",
      "Will definitely recommend this to friends.",
      "Beautiful fabric that feels premium every time.",
      "Excellent purchase. Five stars from me!",
    ];

    const reviewers = [
      "Ahmed Ali",
      "Fatima Hassan",
      "Muhammad Khan",
      "Ayesha Malik",
      "Saad Ahmed",
      "Zara Hussain",
      "Omar Farooq",
      "Hina Tariq",
      "Bilal Shah",
      "Sana Mirza",
      "Usman Ghani",
      "Mehwish Sheikh",
      "Hassan Raza",
      "Nadia Javed",
      "Imran Qureshi",
      "Sadia Chaudhry",
      "Fahad Iqbal",
      "Maheen Siddiqui",
      "Danish Khan",
      "Rabia Anwar",
      "Hamza Ali",
      "Saima Akhtar",
      "Faisal Mehmood",
      "Saba Tahir",
      "Zain Ul Abideen",
      "Kiran Rasheed",
      "Adnan Hashmi",
      "Iman Zafar",
      "Shehryar Malik",
      "Aiman Khan",
      "Hammad Butt",
      "Sadia Naseem",
      "Faizan Ahmed",
      "Hira Shah",
      "Muzammil Hussain",
      "Aleena Tariq",
      "Rizwan Ashraf",
      "Mahnoor Sheikh",
      "Awais Ali",
      "Anum Kamran",
      "Abdullah Khan",
      "Noor Fatima",
      "Talha Ahmed",
      "Iqra Malik",
      "Mohsin Raza",
      "Laiba Khan",
      "Shahzaib Ali",
      "Maham Aslam",
      "Asad Mahmood",
      "Esha Tariq",
      "Umer Farooq",
      "Sidra Yousaf",
      "Taimoor Khan",
      "Komal Ahmed",
      "Asim Qureshi",
      "Minal Hassan",
      "Jawad Iqbal",
      "Dua Fatima",
      "Khurram Shah",
      "Zoya Ali",
      "Noman Akhtar",
      "Alina Sheikh",
      "Adeel Raza",
      "Maryam Noor",
      "Haris Khan",
      "Amna Siddiqui",
      "Waqas Ahmed",
      "Sehrish Malik",
      "Junaid Aslam",
      "Anaya Hussain",
      "Shoaib Khan",
      "Bisma Tariq",
      "Salman Farooq",
      "Iqra Javed",
      "Arslan Butt",
      "Maham Khan",
      "Nabeel Ahmed",
      "Sahar Ali",
      "Yasir Mehmood",
      "Areeba Hassan",
      "Taha Qureshi",
      "Eman Raza",
      "Shayan Malik",
      "Nimra Sheikh",
      "Huzaifa Khan",
      "Rimsha Ahmed",
      "Sameer Ali",
      "Anisha Tariq",
      "Farhan Hussain",
      "Arooba Malik",
      "Kamran Iqbal",
      "Bushra Khan",
      "Osama Ahmed",
      "Neha Raza",
      "Irfan Sheikh",
      "Hafsa Noor",
      "Ahsan Ali",
      "Muneeba Fatima",
      "Zohaib Khan",
      "Rida Ahmed",
    ];

    const reviews = [];
    const numReviews = Math.min(reviewCount, 50);

    for (let i = 0; i < numReviews; i++) {
      const randomRating = (3 + Math.random() * 2).toFixed(1);
      const daysAgo = Math.floor(Math.random() * 180) + 1;
      const isVerified = Math.random() > 0.3;
      reviews.push({
        id: `${productId}-review-${i}`,
        reviewer: reviewers[Math.floor(Math.random() * reviewers.length)],
        rating: parseFloat(randomRating),
        text: reviewTexts[Math.floor(Math.random() * reviewTexts.length)],
        date: `${daysAgo} ${daysAgo === 1 ? "day" : "days"} ago`,
        verified: isVerified,
        helpful: Math.floor(Math.random() * 50) + 1,
        isCustomer: false,
      });
    }

    reviews.sort((a, b) => parseInt(a.date) - parseInt(b.date));

    return {
      count: reviewCount,
      averageRating: parseFloat(rating),
      reviews: reviews,
    };
  };

  const generateViewerCount = () => {
    return Math.floor(Math.random() * 296) + 5;
  };

  // Load product data
  useEffect(() => {
    setQuantity(1);
    setImageLoaded(false);

    if (product) {
      const defaultImg = product.image;
      const defaultTitle = product.name;
      const defaultDesc =
        product.description ||
        "Premium quality fabric perfect for all occasions. Crafted with the finest materials to ensure comfort, durability, and style.";

      setCurrentImage(defaultImg);
      setCurrentTitle(defaultTitle);
      setCurrentDescription(defaultDesc);

      const thumbnails = [
        {
          image: defaultImg,
          title: defaultTitle,
          description: defaultDesc,
          isDefault: true,
        },
      ];

      if (categoryProducts && categoryProducts.length > 0) {
        const otherProducts = categoryProducts.filter(
          (p) => p.id !== product.id,
        );
        const otherItems = otherProducts.slice(0, 4).map((p) => ({
          image: p.image,
          title: p.name,
          description:
            p.description ||
            "Premium quality fabric perfect for all occasions.",
          isDefault: false,
        }));
        thumbnails.push(...otherItems);
      }

      setCategoryThumbnails(thumbnails);

      const reviews = generateRandomReviews(product.id);
      setCustomerReviews(reviews.reviews);
      setViewerCount(generateViewerCount());
    }
  }, [product, categoryProducts]);

  // Handle thumbnail click - changes Image, Title AND Description
  const handleThumbnailClick = (thumbnail) => {
    setCurrentImage(thumbnail.image);
    setCurrentTitle(thumbnail.title);
    setCurrentDescription(thumbnail.description);
    setImageLoaded(false);
  };

  // Update viewer count
  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(
      () => {
        setViewerCount((prev) => {
          const change = Math.floor(Math.random() * 8) - 4;
          let newCount = prev + change;
          newCount = Math.min(Math.max(newCount, 5), 300);
          return newCount;
        });
      },
      5000 + Math.random() * 5000,
    );
    return () => clearInterval(interval);
  }, [isOpen]);

  // Disable body scroll
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

  if (!isOpen || !product) return null;

  const handleQuantityChange = (action) => {
    if (action === "increase") {
      setQuantity((prev) => prev + 1);
    } else if (action === "decrease" && quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleAddToCart = () => {
    const productToAdd = {
      id: product.id,
      name: currentTitle,
      price: product.price,
      image: currentImage,
      quantity: quantity,
      category: activeTab,
    };
    addToCart(productToAdd);
    toast.success(`${quantity}x ${productToAdd.name} added to cart!`, {
      icon: "🛒",
      duration: 3000,
    });
    onClose();
  };

  const handleSubmitReview = () => {
    if (customerRating === 0) {
      toast.error("Please select a star rating!", {
        icon: "⭐",
        duration: 3000,
      });
      return;
    }
    if (!customerReviewText.trim()) {
      toast.error("Please write your review!", {
        icon: "✍️",
        duration: 3000,
      });
      return;
    }
    if (!customerName.trim()) {
      toast.error("Please enter your name!", {
        icon: "👤",
        duration: 3000,
      });
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const newReview = {
        id: `${product.id}-customer-${Date.now()}`,
        reviewer: customerName.trim(),
        rating: customerRating,
        text: customerReviewText.trim(),
        date: "Just now",
        verified: true,
        helpful: 0,
        isCustomer: true,
      };

      setCustomerReviews((prev) => [newReview, ...prev]);
      setHasSubmitted(true);
      setShowReviewForm(false);
      setIsSubmitting(false);

      toast.success(
        "✅ Thank you for your review! Your feedback is valuable to us.",
        {
          icon: "🌟",
          duration: 5000,
          style: {
            background: "#10b981",
            color: "#fff",
          },
        },
      );

      setCustomerRating(0);
      setCustomerReviewText("");
      setCustomerName("");
    }, 1500);
  };

  const handleShowMoreReviews = () => {
    setVisibleReviews(customerReviews.length);
  };

  const allReviews = [...customerReviews];
  const totalReviews = allReviews.length;
  const averageRating =
    totalReviews > 0
      ? allReviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
      : 0;

  const imageUrl =
    currentImage ||
    product.image ||
    "https://via.placeholder.com/800x1000/cccccc/666666?text=Product";

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          <motion.div
            initial={{ scale: 0.9, y: 30, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 30, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={(e) => {
              if (e.target === e.currentTarget) onClose();
            }}
          >
            <div className="bg-white rounded-3xl max-w-7xl w-full max-h-[100vh] shadow-2xl relative overflow-visible">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 z-20 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors duration-300 shadow-lg"
              >
                <svg
                  className="w-6 h-6 text-gray-600"
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 max-h-[90vh] overflow-y-auto rounded-3xl bg-white">
                {/* Product Image Section */}
                <div className="relative">
                  {/* Main Image with Simple CSS Hover Zoom */}
                  <div
                    ref={imageRef}
                    onMouseMove={handleMouseMove}
                    onMouseEnter={() => setIsZooming(true)}
                    onMouseLeave={() => setIsZooming(false)}
                    className="bg-gray-100 rounded-2xl overflow-hidden aspect-square relative cursor-zoom-in select-none"
                  >
                    <img
                      src={imageUrl}
                      alt={currentTitle || product.name}
                      draggable={false}
                      className="w-full h-full object-cover transition-transform duration-75 ease-out"
                      style={
                        isZooming
                          ? zoomStyle
                          : {
                              transform: "scale(1)",
                              transformOrigin: "center center",
                            }
                      }
                      onLoad={() => setImageLoaded(true)}
                      onError={(e) => {
                        e.target.src =
                          "https://via.placeholder.com/800x1000/cccccc/666666?text=Product";
                      }}
                    />
                  </div>

                  {/* Viewer Count Badge */}
                  <div className="absolute top-4 left-4 flex flex-col gap-2">
                    <div className="bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full animate-pulse flex items-center gap-1.5">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                      </span>
                      {viewerCount} people are viewing
                    </div>
                  </div>

                  {/* Mobile hint */}
                  <div className="lg:hidden absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/70 text-white text-xs px-3 py-1.5 rounded-full backdrop-blur-sm">
                    👆 Tap & hold to zoom
                  </div>
                </div>

                {/* Product Info */}
                <div className="flex flex-col h-full">
                  <div className="flex items-center gap-2 text-sm text-gray-400 mb-2 flex-wrap">
                    <span>Premium Quality</span>
                    <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                    <span>In Stock</span>
                    {activeTab === "ladies" && (
                      <>
                        <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                        <span className="bg-blue-50 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full border border-blue-200">
                          Per meter
                        </span>
                      </>
                    )}
                  </div>

                  {/* Dynamic Title */}
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
                    {currentTitle || product.name}
                  </h2>

                  {/* Dynamic Description */}
                  <p className="text-gray-500 text-sm mb-3 leading-relaxed">
                    {currentDescription ||
                      product.description ||
                      "Premium quality fabric perfect for all occasions. Crafted with the finest materials to ensure comfort, durability, and style."}
                  </p>

                  {/* Rating with Reviews */}
                  <div className="flex items-center gap-2 mb-3 flex-wrap">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => {
                        const rating = averageRating || 4.5;
                        const isFullStar = i < Math.floor(rating);
                        const isHalfStar =
                          i === Math.floor(rating) && rating % 1 >= 0.5;
                        return (
                          <svg
                            key={i}
                            className="w-4 h-4 fill-current"
                            viewBox="0 0 24 24"
                          >
                            {isFullStar ? (
                              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                            ) : isHalfStar ? (
                              <path
                                d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
                                fillOpacity="0.5"
                              />
                            ) : (
                              <path
                                d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
                                fill="none"
                                stroke="currentColor"
                              />
                            )}
                          </svg>
                        );
                      })}
                    </div>
                    <span className="text-sm font-semibold text-gray-700">
                      {averageRating.toFixed(1) || "4.5"}
                    </span>
                    <span className="text-sm text-gray-500">
                      ({totalReviews} reviews)
                    </span>
                    <button
                      onClick={() => {
                        setIsReviewExpanded(!isReviewExpanded);
                        if (!isReviewExpanded) setVisibleReviews(5);
                      }}
                      className="text-sm text-indigo-600 hover:text-indigo-800 font-medium ml-1 hover:underline"
                    >
                      {isReviewExpanded ? "Hide" : "View all"}
                    </button>
                    <button
                      onClick={() => {
                        if (hasSubmitted) {
                          toast.info(
                            "You have already submitted a review for this product!",
                            {
                              icon: "🙏",
                              duration: 3000,
                            },
                          );
                          return;
                        }
                        setShowReviewForm(!showReviewForm);
                        if (!showReviewForm) {
                          setCustomerRating(0);
                          setCustomerReviewText("");
                          setCustomerName("");
                        }
                      }}
                      className="text-sm bg-black text-white px-3 py-1.5 rounded-full font-medium hover:bg-gray-800 transition-all duration-300 ml-auto flex items-center gap-1"
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
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                      Write Review
                    </button>
                  </div>

                  {/* Review Form */}
                  {showReviewForm && !hasSubmitted && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="mb-3 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-4 border border-indigo-100"
                    >
                      <h4 className="text-sm font-bold text-gray-800 mb-2 flex items-center gap-2">
                        <svg
                          className="w-5 h-5 text-indigo-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                        Write Your Review
                      </h4>

                      <div className="space-y-3">
                        <div>
                          <label className="text-xs font-medium text-gray-700 block mb-1">
                            Your Rating <span className="text-red-500">*</span>
                          </label>
                          <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                onClick={() => setCustomerRating(star)}
                                className="text-2xl transition-all duration-200 hover:scale-110"
                              >
                                <span
                                  className={
                                    star <= customerRating
                                      ? "text-yellow-400"
                                      : "text-gray-300"
                                  }
                                >
                                  ★
                                </span>
                              </button>
                            ))}
                            {customerRating > 0 && (
                              <span className="text-xs text-gray-500 ml-2 self-center">
                                {customerRating === 1
                                  ? "Poor"
                                  : customerRating === 2
                                    ? "Fair"
                                    : customerRating === 3
                                      ? "Good"
                                      : customerRating === 4
                                        ? "Very Good"
                                        : "Excellent!"}
                              </span>
                            )}
                          </div>
                        </div>

                        <div>
                          <label className="text-xs font-medium text-gray-700 block mb-1">
                            Your Name <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={customerName}
                            onChange={(e) => setCustomerName(e.target.value)}
                            placeholder="Enter your name"
                            className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          />
                        </div>

                        <div>
                          <label className="text-xs font-medium text-gray-700 block mb-1">
                            Your Review <span className="text-red-500">*</span>
                          </label>
                          <textarea
                            value={customerReviewText}
                            onChange={(e) =>
                              setCustomerReviewText(e.target.value)
                            }
                            placeholder="Share your experience with this product..."
                            rows="2"
                            className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                          />
                        </div>

                        <div className="flex gap-2">
                          <button
                            onClick={handleSubmitReview}
                            disabled={isSubmitting}
                            className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium text-white transition-all duration-300 ${
                              isSubmitting
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 hover:scale-[1.02]"
                            }`}
                          >
                            {isSubmitting ? (
                              <span className="flex items-center justify-center gap-2">
                                <svg
                                  className="animate-spin h-4 w-4 text-white"
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                >
                                  <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                  ></circle>
                                  <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                  ></path>
                                </svg>
                                Submitting...
                              </span>
                            ) : (
                              "Submit Review"
                            )}
                          </button>
                          <button
                            onClick={() => setShowReviewForm(false)}
                            className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-800 border border-gray-300 hover:border-gray-400 transition-all duration-300"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Thank You Message */}
                  {hasSubmitted && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="mb-3 bg-green-50 rounded-xl p-3 border border-green-200 text-center"
                    >
                      <div className="flex items-center justify-center gap-2">
                        <span className="text-2xl">🎉</span>
                        <span className="text-sm font-medium text-green-700">
                          Thank you for your review!
                        </span>
                      </div>
                      <p className="text-xs text-green-600 mt-1">
                        Your feedback helps other customers make better
                        decisions.
                      </p>
                    </motion.div>
                  )}

                  {/* Reviews Section */}
                  {isReviewExpanded && customerReviews.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="mb-3 bg-gray-50 rounded-xl p-3 max-h-60 overflow-y-auto border border-gray-100"
                    >
                      <div className="space-y-3">
                        {customerReviews
                          .slice(0, visibleReviews)
                          .map((review) => (
                            <div
                              key={review.id}
                              className={`border-b border-gray-100 last:border-0 pb-2 last:pb-0 ${
                                review.isCustomer
                                  ? "bg-indigo-50/50 rounded-lg p-2 border border-indigo-100"
                                  : ""
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <span className="font-medium text-sm text-gray-700">
                                    {review.reviewer}
                                  </span>
                                  {review.verified && (
                                    <span className="text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full">
                                      ✓ Verified
                                    </span>
                                  )}
                                  {review.isCustomer && (
                                    <span className="text-xs bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded-full">
                                      ★ Your Review
                                    </span>
                                  )}
                                </div>
                                <span className="text-xs text-gray-400">
                                  {review.date}
                                </span>
                              </div>
                              <div className="flex items-center gap-1 mt-0.5">
                                {[...Array(5)].map((_, i) => (
                                  <svg
                                    key={i}
                                    className={`w-3 h-3 ${i < review.rating ? "text-yellow-400 fill-current" : "text-gray-300 fill-current"}`}
                                    viewBox="0 0 24 24"
                                  >
                                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                                  </svg>
                                ))}
                              </div>
                              <p className="text-sm text-gray-600 mt-0.5">
                                {review.text}
                              </p>
                              <div className="text-xs text-gray-400 mt-0.5">
                                {review.helpful} people found this helpful
                              </div>
                            </div>
                          ))}

                        {customerReviews.length > visibleReviews && (
                          <button
                            onClick={handleShowMoreReviews}
                            className="w-full text-center text-sm text-indigo-600 hover:text-indigo-800 font-medium py-2 hover:bg-indigo-50 rounded-lg transition-colors duration-200"
                          >
                            Show all {customerReviews.length} reviews
                          </button>
                        )}

                        {customerReviews.length === visibleReviews &&
                          visibleReviews > 5 && (
                            <button
                              onClick={() => setVisibleReviews(5)}
                              className="w-full text-center text-sm text-gray-500 hover:text-gray-700 font-medium py-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                            >
                              Show less
                            </button>
                          )}
                      </div>
                    </motion.div>
                  )}

                  {/* Price */}
                  <div className="flex items-center gap-4 mb-4">
                    <span className="text-3xl font-bold text-black">
                      Rs. {product.price.toLocaleString()}
                    </span>
                    {product.originalPrice && (
                      <>
                        <span className="text-sm text-gray-400 line-through">
                          Rs. {product.originalPrice.toLocaleString()}
                        </span>
                        <span className="bg-green-100 text-green-700 text-xs font-medium px-2 py-1 rounded-full">
                          {Math.round(
                            (1 - product.price / product.originalPrice) * 100,
                          )}
                          % OFF
                        </span>
                      </>
                    )}
                  </div>

                  {/* Details */}
                  <div className="space-y-2 mb-3">
                    <div className="flex items-center gap-3 text-sm">
                      <svg
                        className="w-5 h-5 text-gray-400 flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span className="text-gray-600">
                        Premium Quality Fabric
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <svg
                        className="w-5 h-5 text-gray-400 flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span className="text-gray-600">Fast Delivery</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <svg
                        className="w-5 h-5 text-gray-400 flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                        />
                      </svg>
                      <span className="text-gray-600">100% Authentic</span>
                    </div>
                  </div>

                  {/* Quantity */}
                  <div className="flex items-center gap-4 mb-3">
                    <span className="text-sm font-medium text-gray-700">
                      Quantity:
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleQuantityChange("decrease")}
                        disabled={quantity <= 1}
                        className={`w-8 h-8 border border-gray-200 rounded-lg flex items-center justify-center transition-colors duration-300 ${
                          quantity <= 1
                            ? "opacity-50 cursor-not-allowed"
                            : "hover:bg-gray-100"
                        }`}
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
                      <span className="w-12 text-center font-medium text-lg">
                        {quantity}
                      </span>
                      <button
                        onClick={() => handleQuantityChange("increase")}
                        className="w-8 h-8 border border-gray-200 rounded-lg flex items-center justify-center hover:bg-gray-100 transition-colors duration-300"
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
                    <span className="text-xs text-gray-400">
                      ({quantity} item{quantity > 1 ? "s" : ""})
                    </span>
                  </div>

                  {/* Thumbnails */}
                  {categoryThumbnails.length > 0 && (
                    <div className="mt-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-medium text-gray-700">
                          Similar Products:
                        </span>
                        <span className="text-xs text-gray-400">
                          ({categoryThumbnails.length} items)
                        </span>
                      </div>
                      <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                        {categoryThumbnails.map((thumb, index) => {
                          const isSelected = currentImage === thumb.image;
                          return (
                            <button
                              key={index}
                              onClick={() => handleThumbnailClick(thumb)}
                              className={`relative rounded-lg overflow-hidden aspect-square border-2 transition-all duration-300 ${
                                isSelected
                                  ? "border-black shadow-lg scale-105"
                                  : "border-gray-200 hover:border-gray-400 hover:scale-105"
                              }`}
                              title={
                                thumb.isDefault ? "Default Image" : thumb.title
                              }
                            >
                              <img
                                src={thumb.image}
                                alt={thumb.isDefault ? "Default" : thumb.title}
                                className="w-full h-full object-cover"
                                loading="lazy"
                                onError={(e) => {
                                  e.target.src =
                                    "https://via.placeholder.com/100x100/cccccc/666666?text=Product";
                                }}
                              />
                              {isSelected && (
                                <div className="absolute inset-0 border-2 border-white/30 rounded-lg pointer-events-none"></div>
                              )}
                              {thumb.isDefault && (
                                <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-[8px] text-center py-0.5 truncate">
                                  Default
                                </div>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 mt-auto pt-2">
                    <button
                      onClick={handleAddToCart}
                      className="flex-1 bg-black text-white px-6 py-3.5 rounded-2xl text-sm font-semibold border border-gray-700 hover:bg-gray-900 hover:border-gray-500 transition-all duration-300 hover:scale-[1.02] shadow-xl shadow-black/40"
                    >
                      Add to Cart ({quantity})
                    </button>
                    <button
                      onClick={onClose}
                      className="flex-1 border-2 border-gray-500 text-gray-600 px-6 py-3.5 rounded-2xl text-sm font-medium hover:border-black hover:text-black transition-all duration-300"
                    >
                      Continue Shopping
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ProductDetail;
