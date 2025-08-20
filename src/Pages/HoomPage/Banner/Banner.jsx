import React from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Link } from "react-router";
import {
  FaUsers,
  FaDumbbell,
  FaChalkboardTeacher,
  FaRunning,
} from "react-icons/fa";

const Banner = () => {
  return (
    <div className="my-10">
      <Carousel
        autoPlay
        infiniteLoop
        showThumbs={false}
        showStatus={false}
        interval={5000}
        className="rounded-xl overflow-hidden"
      >
        {/* Slide 1: Explore Classes */}
        <div className="relative h-[500px]">
          <img
            src="https://i.ibb.co/xtDRVq5f/banner3.jpg"
            alt="Explore Classes"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 flex flex-col justify-center items-center text-center bg-black/50 text-white px-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 flex items-center gap-2">
              <FaDumbbell /> Transform Your Body, One Class at a Time
            </h1>
            <p className="mb-6 text-lg max-w-2xl">
              Dive into strength, cardio, yoga & more — all under one roof.
              Designed to match your lifestyle and goal.
            </p>
            <Link to="/all-classes" className="btn btn-primary">
              Explore Classes
            </Link>
          </div>
        </div>

        {/* Slide 2: See Trainers */}
        <div className="relative h-[500px]">
          <img
            src="https://i.ibb.co/Z6QBD97M/banner2.jpg"
            alt="Our Trainers"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 flex flex-col justify-center items-center text-center bg-black/50 text-white px-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 flex items-center gap-2">
              <FaChalkboardTeacher /> Learn from Certified Trainers
            </h1>
            <p className="mb-6 text-lg max-w-2xl">
              Get personal guidance and motivation from top-notch fitness
              experts.
            </p>
            <Link to="/all-trainers" className="btn btn-primary">
              Meet Our Trainers
            </Link>
          </div>
        </div>

        {/* Slide 3: Explore Forums */}
        <div className="relative h-[500px]">
          <img
            src="https://i.ibb.co/8nmPnnjT/banner1.jpg"
            alt="Community"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 flex flex-col justify-center items-center text-center bg-black/50 text-white px-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 flex items-center gap-2">
              <FaUsers /> Join the Fitify Community
            </h1>
            <p className="mb-6 text-lg max-w-2xl">
              Connect, share, and grow stronger together with our forum
              discussions.
            </p>
            <Link to="/community" className="btn btn-primary">
              Go to Forum
            </Link>
          </div>
        </div>

        {/* Slide 4: Ready to Start */}
        <div className="relative h-[500px]">
          <img
            src="https://i.ibb.co/fGnPGyww/banner4.jpg"
            alt="Start Now"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 flex flex-col justify-center items-center text-center bg-black/50 text-white px-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 flex items-center gap-2">
              <FaRunning /> Start Your Fitness Journey Today
            </h1>
            <p className="mb-6 text-lg max-w-2xl">
              It's never too late to build a better, stronger version of
              yourself.
            </p>
            <Link to="/signUp" className="btn btn-primary">
              Get Started Now
            </Link>
          </div>
        </div>
      </Carousel>
    </div>
  );
};

export default Banner;
