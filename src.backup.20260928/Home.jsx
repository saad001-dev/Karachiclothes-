// Home.jsx - Complete Fixed
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Hero from "./components/Hero";
import Category from "./components/Category";
import Product from "./components/Product";
import About from "./components/About";
import Contact from "./components/Contact";
import News from "./components/News";
import Video from "./components/Video";
import Summer from "./components/Summer";
import Lawn from "./components/Lawn";
import Formal from "./components/Formal";
import Pret from "./components/Pret";
import PerfumeSection from "./components/PerfumeSection";

const Home = () => {
  const location = useLocation();

  // Modal states
  const [isSummerOpen, setIsSummerOpen] = useState(false);
  const [isLawnOpen, setIsLawnOpen] = useState(false);
  const [isFormalOpen, setIsFormalOpen] = useState(false);
  const [isPretOpen, setIsPretOpen] = useState(false);

  // ✅ Check if we need to reopen modal
  useEffect(() => {
    if (location.state?.openModal && !location.state?.fromProduct) {
      const modal = location.state.openModal;
      if (modal === "summer") setIsSummerOpen(true);
      else if (modal === "lawn") setIsWinterOpen(true);
      else if (modal === "formal") setIsFormalOpen(true);
      else if (modal === "pret") setIsPretOpen(true);

      window.history.replaceState({}, document.title);
    }

    if (location.state?.fromProduct) {
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  // ✅ Scroll to category section when hash is #category-section
  useEffect(() => {
    if (location.hash === "#category-section") {
      setTimeout(() => {
        const section = document.getElementById("category-section");
        if (section) {
          section.scrollIntoView({ behavior: "instant" });
        }
        // Clean URL
        window.history.replaceState(null, "", window.location.pathname);
      }, 100);
    }
  }, [location.hash]);

  return (
    <>
      <Hero
        setIsSummerOpen={setIsSummerOpen}
        setIsLawnOpen={setIsLawnOpen}
        setIsFormalOpen={setIsFormalOpen}
        setIsPretOpen={setIsPretOpen}
      />

      {/* ✅ Category section with ID */}
      <div id="category-section">
        <Category />
      </div>

      <Video />
      <PerfumeSection/>
      <Product />
      <About />
      <News />
      <Contact />

      {/* Modals */}
      <Summer isOpen={isSummerOpen} onClose={() => setIsSummerOpen(false)} />
      <Lawn isOpen={isLawnOpen} onClose={() => setIsLawnOpen(false)} />
      <Formal isOpen={isFormalOpen} onClose={() => setIsFormalOpen(false)} />
      <Pret isOpen={isPretOpen} onClose={() => setIsPretOpen(false)} />
    </>
  );
};

export default Home;
