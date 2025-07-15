import React from "react";
import Banner from "../Banner/Banner";
import FeatureSection from "../FeatureSection/FeatureSection";
import About from "../About/About";
import NewsLater from "../NewsLater/NewsLater";

const Home = () => {
  return (
    <div>
      <Banner></Banner>
      <FeatureSection></FeatureSection>
      <About></About>
      <NewsLater></NewsLater>
    </div>
  );
};

export default Home;
