// Hero.jsx - COMPLETE FIXED VERSION

import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Summer from "./Summer";
import Category from "./Category";
import Winter from "./Lawn";
import Formal from "./Formal";
import Pret from "./Pret";
import MensModal from "./MensModal"; // ✅ Import MensModal
import Lawn from "./Lawn";

const Hero = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isSummerOpen, setIsSummerOpen] = useState(false);
  const [isPretOpen, setIsPretOpen] = useState(false);
  const [isFormalOpen, setIsFormalOpen] = useState(false);
  const [isLawnOpen, setIsLawnOpen] = useState(false);
  const [isMensModalOpen, setIsMensModalOpen] = useState(false); // ✅ ADD THIS
  const [active, setActive] = useState(2);

  // ✅ Slideshow Images (Bottom Section)
  const slideshowImages = [
    "./images/slide12.png",
    "./images/slide-img.webp",
    "./images/slide14.png",
    "./images/slide27.png",
  ];

  const images = [
    "./images/img23.webp",
    "/images/img15.webp",
    "/images/img7.webp",
    "/images/img26.webp",
    "/images/img11.webp",
    "/images/img13.webp",
    "/images/img10.webp",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActive((prev) => (prev + 1) % images.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // ✅ Category Cards Data
  const categoryCards = [
    {
      id: 2,
      title: "UNSTITCHED",
      subtitle: "LAWN",
      tag: "",
      image: "./images/lawn.webp",
      slug: "lawn",
      bgColor: "from-blue-50 to-indigo-50",
      icon: "",
      type: "page",
    },
    {
      id: 5,
      title: "UNSTITCHED",
      subtitle: "LUXURY",
      tag: "",
      image: "./images/luxury.webp",
      slug: "luxury",
      bgColor: "from-gray-50 to-slate-50",
      icon: "",
      type: "page",
    },
    {
      id: 1,
      title: "UNSTITCHED",
      subtitle: "SUMMER",
      tag: "",
      image:
        "https://mohsinsaeedfabrics.pk/cdn/shop/files/40_4b710e16-598a-4ff3-9bd7-e1c07182295e.webp?v=1776430766&width=1600",
      slug: "summer",
      bgColor: "from-amber-50 to-orange-50",
      icon: "",
      type: "modal",
    },
    {
      id: 3,
      title: "UNSTITCHED",
      subtitle: "FORMAL",
      tag: "",
      image:
        "https://mohsinsaeedfabrics.pk/cdn/shop/files/1_3_2b52d166-7421-43c0-aa6a-359e0285e1db.webp?v=1769425389&width=1600",
      slug: "formal",
      bgColor: "from-gray-50 to-slate-50",
      icon: "",
      type: "page",
    },

    {
      id: 6,
      title: "UNSTITCHED",
      subtitle: "MENS",
      tag: "",
      image:
        "https://mohsinsaeedfabrics.pk/cdn/shop/files/7_80e4eeaa-7207-4f93-900b-1af5f4db902a.webp?v=1764159337&width=1600",
      slug: "mens",
      bgColor: "from-gray-50 to-slate-50",
      icon: "",
      type: "category",
    },
  ];

  // ✅ Auto slide every 2.5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slideshowImages.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [slideshowImages.length]);

  const HandleScroll = () => {
    // Navigate to home page with products-section hash
    navigate("/#products-section");
    // Scroll to the section after navigation
    setTimeout(() => {
      const element = document.getElementById("products-section");
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  };

  // ✅ FIXED HandleCategoryClick function
  // Hero.jsx - HandleCategoryClick mein change
  const HandleCategoryClick = (card) => {
    if (card.slug === "summer") {
      navigate("/collection/summer");
    } else if (card.slug === "lawn") {
      navigate("/collection/lawn");
    } else if (card.slug === "formal") {
      navigate("/collection/formal");
    } else if (card.slug === "luxury") {
      navigate("/collection/luxury");
    } else if (card.slug === "mens") {
      navigate("/collection/mens");
    } else {
      navigate(`/category/${card.slug}`);
    }
  };
  // ✅ Counter animation component
  const AnimatedCounter = React.memo(
    ({ target, suffix, label, duration = 2000 }) => {
      const [count, setCount] = useState(0);
      const ref = React.useRef(null);
      const [hasAnimated, setHasAnimated] = useState(false);

      useEffect(() => {
        const observer = new IntersectionObserver(
          (entries) => {
            const entry = entries[0];
            if (entry.isIntersecting && !hasAnimated) {
              setHasAnimated(true);
              let startTime;
              const startValue = 0;
              const endValue = target;
              const isFloat = target % 1 !== 0;

              const animate = (timestamp) => {
                if (!startTime) startTime = timestamp;
                const progress = Math.min(
                  (timestamp - startTime) / duration,
                  1,
                );
                const eased = 1 - Math.pow(1 - progress, 3);
                const current = startValue + (endValue - startValue) * eased;

                if (isFloat) {
                  setCount(parseFloat(current.toFixed(1)));
                } else {
                  setCount(Math.floor(current));
                }

                if (progress < 1) {
                  requestAnimationFrame(animate);
                }
              };

              requestAnimationFrame(animate);
            }
          },
          { threshold: 0.3, once: true },
        );

        if (ref.current) {
          observer.observe(ref.current);
        }

        return () => {
          if (ref.current) {
            observer.unobserve(ref.current);
          }
        };
      }, [target, duration, hasAnimated]);

      return (
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={hasAnimated ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <motion.span
            className="text-3xl md:text-4xl font-bold block"
            whileHover={{ scale: 1.1 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            {count}
            {suffix}
          </motion.span>
          <p className="text-gray-500 text-xs md:text-sm mt-1 tracking-wider">
            {label}
          </p>
        </motion.div>
      );
    },
  );

  // ✅ Memoize counters
  const CountersSection = useMemo(
    () => (
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.8 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 pt-8 border-t border-gray-200"
      >
        <AnimatedCounter
          target={15}
          suffix="+"
          label="YEARS OF EXPERIENCE"
          duration={2000}
        />
        <AnimatedCounter
          target={30}
          suffix="+"
          label="FABRIC VARIETIES"
          duration={2000}
        />
        <AnimatedCounter
          target={4}
          suffix="k+"
          label="ORDERS COMPLETED"
          duration={2500}
        />
        <AnimatedCounter
          target={100}
          suffix="%"
          label="SATISFACTION"
          duration={2000}
        />
      </motion.div>
    ),
    [],
  );

  return (
    <>
      <div className="min-h-screen bg-white px-4 sm:px-8 md:px-16 lg:px-24 py-6 overflow-hidden">
        {/* Hero Content */}
        <div className="flex flex-col lg:flex-row justify-between items-center gap-8 lg:gap-12">
          {/* Left Text Section */}
          <motion.div
            whileInView={{ opacity: 1, x: 0 }}
            initial={{ opacity: 0, x: -100 }}
            viewport={{ once: false }}
            transition={{ duration: 1 }}
            className="flex-1 w-full lg:w-auto"
          >
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.2]"
            >
              Premium Quality
              <br />
              <span className="text-gray-400">Fabrics</span> For Every
              <br />
              Occasion
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-gray-600 text-sm sm:text-base md:text-lg max-w-lg mt-4 sm:mt-6 leading-relaxed"
            >
              From luxurious lawn to durable khaddar, we bring you the finest
              quality fabrics for men and women. With 15+ years of excellence,
              we redefine comfort and style in every thread.
            </motion.p>

            <motion.button
              whileHover={{
                scale: 1.05,
                boxShadow: "0 20px 25px -5px rgba(0,0,0,0.2)",
              }}
              whileTap={{ scale: 0.95 }}
              onClick={() => HandleScroll()}
              className="bg-black text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-full text-sm font-medium tracking-wide hover:bg-gray-800 transition-all duration-300 shadow-lg hover:shadow-xl mt-6 sm:mt-8"
            >
              Explore Collection
            </motion.button>
          </motion.div>

          {/* Right Images Section */}
          <motion.div
            whileInView={{ opacity: 1, x: 0 }}
            initial={{ opacity: 0, x: 100 }}
            viewport={{ once: false }}
            transition={{ duration: 0.9 }}
            className="flex-1 flex justify-center lg:justify-end"
          >
            <div className="grid grid-cols-2 gap-5 w-full flex-1">
              {/* Main Model Image */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.4 }}
                className="col-span-1 row-span-2 overflow-hidden shadow-xl rounded-2xl "
              >
                <img
                  src="./images/img13.webp"
                  alt="Premium Collection"
                  className="w-full h-full object-cover"
                />
              </motion.div>

              {/* Fabric Image */}
           <motion.div
  whileHover={{ scale: 1.03 }}
  transition={{ duration: 0.4 }}
  className="overflow-hidden rounded-2xl shadow-xl h-[240px]"
>
  <img
  src="https://www.subhanfabrics.com.pk/cdn/shop/files/Black-1_0c2ba431-23f1-4965-addb-0a579d39936e.jpg?v=1749847193"
  className="w-full h-full object-cover scale-110"
/>
</motion.div>

              {/* Small Fabric Texture */}
              <motion.div
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.4 }}
                className="overflow-hidden rounded-2xl shadow-lg"
              >
                <img
                  src="./images/second.webp"
                  alt="Fabric Texture"
                  className="w-full h-[220px] object-cover"
                />
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Stats Section with Animated Counters */}
        {CountersSection}
      </div>

      {/* ✅ FULL WIDTH SLIDESHOW SECTION */}
      <div className="w-full  sm:pt-6 border-t border-gray-200">
        <div
          className="relative w-full h-[42vw]
min-h-[280px]
max-h-[720px] overflow-hidden "
        >
          {slideshowImages.map((img, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0 }}
              animate={{
                opacity: currentSlide === index ? 1 : 0,
                scale: currentSlide === index ? 1 : 1.05,
              }}
              transition={{
                opacity: { duration: 0.8, ease: "easeInOut" },
                scale: { duration: 8, ease: "easeOut" },
              }}
              className="absolute inset-0 w-full h-full"
            >
              <img
                src={img}
                alt={`Slide ${index + 1}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src =
                    "https://via.placeholder.com/1920x600/cccccc/666666?text=Image";
                }}
              />
            </motion.div>
          ))}

          {/* Slide Indicators - Dots */}
          <div className="absolute bottom-3 sm:bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 sm:gap-3 z-10">
            {slideshowImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`transition-all duration-300 rounded-full ${
                  currentSlide === index
                    ? "w-6 sm:w-8 md:w-10 h-2 sm:h-2.5 bg-white"
                    : "w-2 h-2 sm:w-2.5 sm:h-2.5 bg-white/50 hover:bg-white/80"
                }`}
              />
            ))}
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={() =>
              setCurrentSlide(
                (prev) =>
                  (prev - 1 + slideshowImages.length) % slideshowImages.length,
              )
            }
            className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 z-10 w-8 h-8 sm:w-10 sm:h-10 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white text-xl sm:text-2xl transition-all duration-300"
          >
            ‹
          </button>
          <button
            onClick={() =>
              setCurrentSlide((prev) => (prev + 1) % slideshowImages.length)
            }
            className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 z-10 w-8 h-8 sm:w-10 sm:h-10 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white text-xl sm:text-2xl transition-all duration-300"
          >
            ›
          </button>
        </div>
      </div>

      <div
        id="products-section"
        className="w-full max-w-8xl mx-auto px-8 sm:px-8 md:px-16 lg:px-15 py-10 sm:py-12"
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-6 sm:mb-10"
        >
          <div className="text-center mt-10 mb-8 md:mb-12">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold">
              Shop By <span className="text-gray-400">Category</span>
            </h2>

            <p className="mt-3 text-sm sm:text-base text-gray-500 max-w-2xl mx-auto">
              Discover our latest fashion videos featuring premium lawn
              collections, elegant designs, and timeless style
            </p>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 px-4 gap-2 md:gap-2">
        {categoryCards.map((card, index) => (
          <motion.div
            key={card.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.15 }}
            whileHover={{
              y: -8,
              boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
            }}
            onClick={() => HandleCategoryClick(card)}
            className={`relative overflow-hidden rounded-xl sm:rounded-2xl cursor-pointer bg-gradient-to-br ${card.bgColor} shadow-lg transition-all duration-300 group`}
          >
            <div className="relative sm:h-60 md:h-70 overflow-hidden">
              <img
                src={card.image}
                alt={card.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                onError={(e) => {
                  e.target.src =
                    "https://via.placeholder.com/600x400/cccccc/666666?text=" +
                    card.subtitle;
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            </div>
            <div className="absolute inset-0 border-2 border-transparent group-hover:border-white/30 rounded-xl sm:rounded-2xl transition-all duration-300 pointer-events-none"></div>
          </motion.div>
        ))}
      </div>

      <section className="w-full overflow-hidden py-25 bg-white">
        <div className="text-center my-5 ">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold">
            Featured <span className="text-gray-400">Collections</span>
          </h2>

          <p className="mt-3 mb-10 text-sm sm:text-base text-gray-500 max-w-2xl mx-auto">
            Discover premium fabrics and timeless designs for every occasion.
          </p>
        </div>
        <div className="relative flex justify-center mt-29 items-center h-[500px]">
          {images.map((img, i) => {
            let position = i - active;

            if (position < -3) position += images.length;
            if (position > 3) position -= images.length;

            const styles = {
              "-3": "translate-x-[-650px] scale-75 z-0",
              "-2": "translate-x-[-430px] scale-90 z-10",
              "-1": "translate-x-[-220px] scale-95 z-20",
              0: "translate-x-0 scale-110 z-30",
              1: "translate-x-[220px] scale-95 z-20",
              2: "translate-x-[430px] scale-90 z-10",
              3: "translate-x-[650px] scale-75 z-0",
            };

            return (
              <div
                key={i}
                className={`absolute transition-all duration-1000 ease-in-out ${styles[position] || "hidden"}`}
              >
                <img
                  src={img}
                  alt=""
                  className={`object-cover rounded-sm shadow-xl ${
                    position === 0
                      ? "w-[360px] h-[500px]"
                      : "w-[250px] h-[450px]"
                  }`}
                />
              </div>
            );
          })}
        </div>
      </section>

      {/* ✅ CATEGORY CARDS SECTION */}

      {/* ✅ MODALS */}
      <Summer isOpen={isSummerOpen} onClose={() => setIsSummerOpen(false)} />
      <Lawn isOpen={isLawnOpen} onClose={() => setIsLawnOpen(false)} />
      <Pret isOpen={isPretOpen} onClose={() => setIsPretOpen(false)} />
      <Formal isOpen={isFormalOpen} onClose={() => setIsFormalOpen(false)} />

      {/* ✅ MENS MODAL - ADD THIS */}
      <MensModal
        isOpen={isMensModalOpen}
        onClose={() => setIsMensModalOpen(false)}
      />
    </>
  );
};

export default Hero;
