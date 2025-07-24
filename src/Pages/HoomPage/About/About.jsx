import React from "react";
import { Link } from "react-router";

const About = () => {
  return (
    <div>
      <section className="px-4 py-4 my-16 flex flex-col lg:flex-row items-center gap-10 border border-primary rounded-2xl">
        {/* Left Side: Image */}
        <div className="flex-1">
          <img
            src="https://i.ibb.co/TxQ0rHqQ/fitness-About.jpg"
            alt="About Fitify"
            className="w-full rounded-xl shadow-lg object-cover"
          />
        </div>

        {/* Right Side: Text Content */}
        <div className="flex-1 space-y-5">
          <h2 className="text-4xl font-bold text-primary">About Fitify</h2>
          <p className="text-lg text-gray-700 leading-relaxed">
            Fitify is more than just a fitness platform—it's a movement to
            empower individuals towards a healthier and happier lifestyle.
            Whether you're a beginner or a fitness enthusiast, our certified
            trainers, engaging classes, and supportive community are here to
            help you transform your life.
          </p>
          <p className="text-gray-600 leading-relaxed">
            Our goal is to make fitness accessible, fun, and motivating for
            everyone. From personalized workout routines to community challenges
            and expert guidance, Fitify is your one-stop destination for
            reaching your health goals.
          </p>
          <Link to="/community" className="btn btn-primary">
            Join Our Community
          </Link>
        </div>
      </section>
    </div>
  );
};

export default About;
