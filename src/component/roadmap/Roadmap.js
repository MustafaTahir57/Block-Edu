import React from "react";
import background from "../../assets/background.jpeg";
const Roadmap = () => {
  return (
    <div className="container ">
      <div className="row mt-5 pb-5 d-flex align-items-center">
        <div className="col-md-5 mt-4">
          <img src={background} alt="study" className="study-img img-fluid" />
        </div>
        <div className="col-md-7 mt-4">
          <h3 className="overview-h3">Why BlockClass Rocks:</h3>
          <p className="Innovative-span">
            Super Easy to Start: Just log in with a MetaMask wallet, and that's
            it. You don't need to tell us anything else about yourself. Setting
            up a class is just a few clicks away.
          </p>
          <p className="Innovative-span">
            Anyone Can Teach: Got an idea for a class? Put it out there. Set a
            goal for how much support you need to get it started. If enough
            people are interested, your class happens. It's that simple.
          </p>
          <p className="Innovative-span">
            Using Tools You Know: We don't host the classes ourselves. Instead,
            we suggest using popular video tools like Google Meet or Zoom. This
            way, you get to use tools you're already familiar with.
          </p>
          <p className="Innovative-span">
            Safe and Fair: We keep an eye on the funds to make sure everything's
            on the up and up, releasing them only after the class is done by
            smart contract. This way, everyone's happy and safe.
          </p>
          <p className="Innovative-span">
            Powered by Feedback: After the class, students can give feedback.
            This helps everyone know which classes are hitting the mark.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Roadmap;
