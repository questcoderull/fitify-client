import React from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import { useNavigate } from "react-router";

const Banner = () => {
  const navigate = useNavigate();

  const handleExploreClasses = () => {
    navigate("/all-classes");
  };

  return (
    <div className="my-10">
      <Carousel
        autoPlay
        infiniteLoop
        showThumbs={false}
        showStatus={false}
        interval={4000}
        className="rounded-xl overflow-hidden"
      >
        {/* Slide 1 */}
        <div className="relative h-[500px]">
          <img
            src="https://i.ibb.co/YF0T6X3b/images.jpg"
            alt="Fitness Banner"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 flex flex-col justify-center items-center text-center bg-black/40 text-white px-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Transform Your Fitness Journey
            </h1>
            <p className="mb-6 text-lg max-w-2xl">
              Discover a wide range of classes and trainers to help you achieve
              your fitness goals.
            </p>
            <button onClick={handleExploreClasses} className="btn btn-primary">
              Explore Classes
            </button>
          </div>
        </div>

        {/* Slide 2 */}
        <div className="relative h-[500px]">
          <img
            src="https://i.ibb.co/VY2f3C2L/download.jpg"
            alt="Classes"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 flex flex-col justify-center items-center text-center bg-black/40 text-white px-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Join Our Top Trainers
            </h1>
            <p className="mb-6 text-lg max-w-2xl">
              Learn from certified experts and become the best version of
              yourself.
            </p>
            <button onClick={handleExploreClasses} className="btn btn-accent">
              Browse Classes
            </button>
          </div>
        </div>

        {/* Slide 3 */}
        <div className="relative h-[500px]">
          <img
            src="https://i.ibb.co/XZscWvf9/download-1.jpg"
            alt="Fitness Community"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 flex flex-col justify-center items-center text-center bg-black/40 text-white px-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Join the Fitness Community
            </h1>
            <p className="mb-6 text-lg max-w-2xl">
              Connect with like-minded fitness enthusiasts and stay motivated
              together.
            </p>
            <button
              onClick={handleExploreClasses}
              className="btn btn-secondary"
            >
              Explore classes and Join Now
            </button>
          </div>
        </div>
      </Carousel>
    </div>
  );
};

export default Banner;
