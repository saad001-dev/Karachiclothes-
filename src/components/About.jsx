// src/components/About.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

const About = () => {
  const navigate = useNavigate();

  
  const handleProd = () => {
    navigate("/");
    
    // Category page load hone ke baad products-section par scroll
    setTimeout(() => {
      const section = document.getElementById("products-section");
      if (section) {
        section.scrollIntoView({ 
          behavior: "smooth", 
          block: "start" 
        });
      }
    }, 200); // 500ms delay for page load
  };


  return (
    <section className="py-20 bg-white relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gray-50 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-gray-100 rounded-full blur-3xl opacity-40 translate-y-1/2 -translate-x-1/2"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Side - Images */}
          <div className="relative">
            {/* Main Image */}
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img
                src="https://www.muhajarcloth.com/wp-content/uploads/2022/10/MS-Suiting-Narkins-Muhajar-Cloth-House05629786_n-1.jpg"
                alt="Fabric Manufacturing"
                className="w-full h-[500px] object-cover hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>

              <div className="absolute bottom-6 left-6 bg-white/90 backdrop-blur-sm rounded-xl px-6 py-4 shadow-lg">
                <div className="flex items-center gap-4">
                  <div className="text-3xl font-bold text-black">15+</div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 tracking-wider">
                      YEARS OF
                    </p>
                    <p className="text-sm font-bold text-black">EXCELLENCE</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-8 -right-8 w-48 h-48 rounded-2xl overflow-hidden shadow-xl border-4 border-white">
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTaEAjYuG-5M1JjHcdXYFWD2pisklDWWP358fNRe30fSg&s=10"
                alt="Fabric Detail"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="absolute -top-4 -left-4 w-20 h-20 bg-black/5 rounded-full"></div>
            <div className="absolute top-1/2 -right-6 w-12 h-12 bg-black/5 rounded-full"></div>
          </div>

          {/* Right Side - Content */}
          <div>
            <div className="inline-flex items-center gap-2 bg-black/5 rounded-full px-4 py-1.5 mb-6">
              <span className="w-2 h-2 bg-black rounded-full"></span>
              <span className="text-xs font-medium text-gray-600 tracking-wider uppercase">
                About Our Company
              </span>
            </div>

            <h2 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
              Crafting Excellence in
              <span className="block text-gray-400 mt-1">Every Thread</span>
            </h2>

            <p className="text-gray-600 text-base leading-relaxed mb-6">
              For over 15 years, we have been at the forefront of Pakistan's
              textile industry, delivering unparalleled quality in premium
              fabrics. From the finest lawn to durable khaddar, we cater to
              every need with passion and precision.
            </p>

            <p className="text-gray-600 text-base leading-relaxed mb-8">
              Our commitment to excellence has made us a trusted name among
              leading fashion brands, retailers, and designers across the
              country. We don't just manufacture fabric – we weave dreams.
            </p>

            <div className="grid grid-cols-3 gap-6 mb-10">
              <div className="bg-gray-50 rounded-xl p-4 text-center hover:bg-gray-100 transition-colors duration-300">
                <div className="text-2xl font-bold text-black/70">30+</div>
                <p className="text-xs text-gray-500 mt-1">Fabric Varieties</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 text-center hover:bg-gray-100 transition-colors duration-300">
                <div className="text-2xl font-bold text-black/70">4K+</div>
                <p className="text-xs text-gray-500 mt-1">Happy Clients</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 text-center hover:bg-gray-100 transition-colors duration-300">
                <div className="text-2xl font-bold text-black/70">100%</div>
                <p className="text-xs text-gray-500 mt-1">Premium Quality</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-10">
              <div className="flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-black"
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
                <span className="text-sm text-gray-700">Premium Quality</span>
              </div>
              <div className="flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-black"
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
                <span className="text-sm text-gray-700">Men & Women Wear</span>
              </div>
              <div className="flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-black"
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
                <span className="text-sm text-gray-700">
                  Lawn • Khaddar • Cambric
                </span>
              </div>
              <div className="flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-black"
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
                <span className="text-sm text-gray-700">
                  Bulk Manufacturing
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              <button
                onClick={handleProd}
                className="bg-black text-white px-8 py-3.5 rounded-full text-sm font-medium tracking-wide hover:bg-gray-800 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Explore Our Collection
              </button>
              <button className="border-2 border-black text-black px-8 py-3.5 rounded-full text-sm font-medium tracking-wide hover:bg-black hover:text-white transition-all duration-300">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
