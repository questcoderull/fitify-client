import React from "react";
import Banner from "../Banner/Banner";
import FeatureSection from "../FeatureSection/FeatureSection";
import About from "../About/About";
import NewsLater from "../NewsLater/NewsLater";
import { Helmet } from "react-helmet-async";
import ReviewList from "../../ReviewList/ReviewList";
import FeaturedClasses from "../../FeaturedClasses/FeaturedClasses";
import LatestCommunityPosts from "../../LatestCommunityPosts/LatestCommunityPosts";

const Home = () => {
  return (
    <div>
      <Helmet>
        <title>Fitify | Home</title>
      </Helmet>
      <Banner></Banner>
      <FeatureSection></FeatureSection>
      <About></About>
      <FeaturedClasses></FeaturedClasses>
      <LatestCommunityPosts></LatestCommunityPosts>
      <NewsLater></NewsLater>
      <ReviewList></ReviewList>
    </div>
  );
};

export default Home;
