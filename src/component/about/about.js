import React from "react";
import backclass from "../../assets/blockclass.jpeg"
const About = () => {
  return (
    <div className="container ">
      <div className="row mt-5 d-flex align-items-center">
        <div className="col-md-7 mt-4">
          <h3 className="overview-h3">Overview</h3>
          <p className="Innovative-span">
            BlockClass is an Innovative Crypto Learning Platform that's all
            about making education easy and open for everyone. We're using the
            cool tech behind Web3 to change how people learn and teach.{" "}
          </p>

          <h3 className="overview-h3">Here's the big idea: </h3>
          <p className="Innovative-span">
            At BlockClass, we're all about the spirit of Web3. It's not about
            who you are; it's about what you can share. The content is king. And
            the best part? The market decides what works. If people love your
            class idea, you're all set. We believe in letting the community
            drive what's taught and learned. That's the future of education
            we're building.
          </p>
          <p className="Innovative-span">Say Goodbye to centralized education platform. </p>
        </div>
        <div className="col-md-5 mt-4">
        <img src={backclass} alt="study" className="study-img img-fluid" />
        </div>
      </div>
    </div>
  );
};

export default About;
