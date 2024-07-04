import React from "react";
import PickMeals from "../../images/pick-meals-image.jpg";
import ChooseMeals from "../../images/cars.jpg";
import DeliveryMeals from "../../images/hand.jpg";
import '../../styles/LandingPage.css';

const Work = () => {
  const workInfoData = [
    {
      image: PickMeals,
      title: "Interactive Lessons",
      text: "Our AI adapts to each child's learning style, delivering interactive and engaging lessons that foster curiosity and creativity.",
    },
    {
      image: ChooseMeals,
      title: "Flexible Learning",
      text: "Children can learn at their own pace, anytime and anywhere, with lessons tailored to their unique needs and preferences.",
    },
    {
      image: DeliveryMeals,
      title: "Real-Time Feedback",
      text: "Our platform provides instant feedback, helping children understand their progress and areas for improvement, ensuring a comprehensive learning experience.",
    },
  ];
  return (
    <div className="work-section-wrapper">
      <div className="work-section-top">
        <p className="primary-subheading">Work</p>
        <h1 className="primary-heading">How It Works</h1>
        <p className="primary-text">
        Our AI-driven platform personalizes learning experiences to inspire 
        and engage children, making education fun and effective.
        </p>
      </div>
      <div className="work-section-bottom">
        {workInfoData.map((data) => (
          <div className="work-section-info" key={data.title}>
            <div className="info-boxes-img-container">
              <img src={data.image} alt="" />
            </div>
            <h2>{data.title}</h2>
            <p>{data.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Work;
