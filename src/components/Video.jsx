import React from "react";

const videos = [
  "./images/v8.mp4",
  "./images/v12.mp4",
  "./images/v6.mp4",
  "./images/v13.mp4",
  "./images/v5.mp4",
];

const Video = () => {
  return (
    <section className="w-full bg-white px-4 md:pt-10 pt-9 pb-7 ">
      <div className="max-w-7xl mx-auto ">
        {/* Heading */}
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold">
            Trending <span className="text-gray-400">Designs</span>
          </h2>

          <p className="mt-3 mb-10 text-sm sm:text-base text-gray-500 max-w-2xl mx-auto">
            Explore our latest premium fashion videos showcasing elegant
            designs and luxury fabrics.
          </p>
        </div>

        {/* Videos */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-2">
          {videos.map((video, index) => (
            <div
              key={index}
              className="overflow-hidden rounded-2xl shadow-md hover:shadow-xl transition-all duration-300"
            >
              <video
                src={video}
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-[350px]  md:h-[440px]  object-cover transition-transform duration-500 hover:scale-105"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Video;