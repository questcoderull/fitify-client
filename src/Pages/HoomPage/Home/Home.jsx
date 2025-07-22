import React from "react";
import Banner from "../Banner/Banner";
import FeatureSection from "../FeatureSection/FeatureSection";
import About from "../About/About";
import NewsLater from "../NewsLater/NewsLater";
import { Helmet } from "react-helmet-async";
import ReviewList from "../../ReviewList/ReviewList";

const Home = () => {
  return (
    <div>
      <Helmet>
        <title>Fitify | Home</title>
      </Helmet>
      <Banner></Banner>
      <FeatureSection></FeatureSection>
      <About></About>
      <NewsLater></NewsLater>
      <ReviewList></ReviewList>
    </div>
  );
};

export default Home;
