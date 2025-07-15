import React from "react";
import CountUp from "react-countup";
import { useInView } from "react-intersection-observer";
import {
  FaCalendarCheck,
  FaUserTie,
  FaMapMarkedAlt,
  FaUsers,
  FaPaintBrush,
  FaBriefcase,
  FaGraduationCap,
  FaHeartbeat,
  FaMusic,
  FaFutbol,
  FaLaptopCode,
  FaSearchLocation,
  FaRegEdit,
} from "react-icons/fa";
import { IoHappyOutline } from "react-icons/io5";
import { MdOutlineKeyboardDoubleArrowDown } from "react-icons/md";

import Details from "../Images/Details.png";
import Lock from "../Images/Lock.png";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "../App.css";

const Home = () => {
  const { isLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();

  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.4,
  });

  const categories = [
    { id: 6, name: "Art", icon: <FaPaintBrush /> },
    { id: 5, name: "Business", icon: <FaBriefcase /> },
    { id: 4, name: "Education", icon: <FaGraduationCap /> },
    { id: 7, name: "Health", icon: <FaHeartbeat /> },
    { id: 2, name: "Music", icon: <FaMusic /> },
    { id: 3, name: "Sports", icon: <FaFutbol /> },
    { id: 1, name: "Tech", icon: <FaLaptopCode /> },
  ];

  const feedbacks = [
    {
      name: "Aarav Patel",
      feedback:
        "EventWave made organizing our fundraiser effortless. The security and support were top-notch!",
    },
    {
      name: "Meera Sharma",
      feedback:
        "Loved the platform! Everything from registration to event day went smoothly and safely.",
    },
    {
      name: "Rohan Das",
      feedback:
        "I've used other platforms, but nothing matches the ease and trust EventWave provides.",
    },
  ];

  const Steps = [
    {
      title: "Discover Events",
      icon: <FaSearchLocation className="text-3xl text-purple-800 mb-2" />,
      desc: "Browse a variety of events happening around you with ease.",
    },
    {
      title: "Register or Create",
      icon: <FaRegEdit className="text-3xl text-purple-800 mb-2" />,
      desc: "Register yourself for events or create your own with ease and flexibility.",
    },
    {
      title: "Attend & Enjoy!",
      icon: <IoHappyOutline className="text-3xl text-purple-800 mb-2" />,
      desc: "Join your community, have fun, and make unforgettable memories.",
    },
  ];

  const handleExplore = () => {
    navigate("/events");
  };

  const handleLogin = () => {
    navigate("/login");
  };

  const handleCategoryClick = (categoryName) => {
    navigate(`/events?category=${encodeURIComponent(categoryName)}`);
  };
  return (
    <div className="font-RobotoSlab">
      {/* Hero Section */}
      <section className="relative bg-[radial-gradient(circle,_#8c509a_0%,_#450e57_100%)] text-white py-20 px-6 text-center h-[90vh] flex justify-center items-center flex-col overflow-hidden">
        {/* Subtle, protected logo */}
        <div className="absolute inset-0  bg-[length:300px] md:bg-[length:600px] bg-no-repeat bg-center opacity-10 pointer-events-none select-none slow-spin home-page-hero"></div>

        <h1 className="text-4xl md:text-7xl font-bold mb-4 z-10">
          Welcome to{" "}
          <span className="text-[#ffc453] font-Kaushan">EventWave</span>
        </h1>
        <p className="text-xl mb-6 max-w-2xl z-10">
          Discover unforgettable experiences, bring people together, and make
          your community thrive — all in one place.
        </p>
        <button
          className="bg-[#712681] text-white px-6 py-3 font-semibold rounded-full shadow hover:bg-[#d8328e] hover:shadow-2xl hover:ring-2 transition cursor-pointer z-10"
          onClick={handleExplore}
        >
          Explore Events
        </button>
      </section>

      {/* Parallax Section - No external library */}
      <section className="home-page-parallx bg-fixed bg-center bg-cover h-[400px] flex items-center justify-center font-Abril">
        <div className="w-full px-4 sm:px-6">
          <div className="glass-bg p-8 rounded-xl text-center max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-purple-100">
              <span className="text-blue-950">Discover</span>.{" "}
              <span className="text-cyan-950">Connect</span>.{" "}
              <span className="text-indigo-950">Celebrate</span>.
            </h2>
          </div>
        </div>
      </section>

      <section ref={ref} className="py-16 px-4 sm:px-6 bg-gray-100 text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-[#4c155e] mb-10">
          Our Impact
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 max-w-6xl mx-auto">
          <div className="w-full max-w-xs sm:max-w-full mx-auto bg-white shadow-lg rounded-xl p-6 border-b-[10px] border-[#4c155e]">
            <FaCalendarCheck className="text-3xl sm:text-4xl text-[#4c155e] mx-auto mb-4" />
            <h3 className="text-3xl sm:text-4xl font-bold text-[#4c155e]">
              {inView ? <CountUp end={100} duration={3} /> : 0}+
            </h3>
            <p className="mt-2 text-gray-600 text-sm sm:text-base">
              Events Hosted
            </p>
          </div>

          <div className="w-full max-w-xs sm:max-w-full mx-auto bg-white shadow-lg rounded-xl p-6 border-b-[10px] border-[#4c155e]">
            <FaUserTie className="text-3xl sm:text-4xl text-[#4c155e] mx-auto mb-4" />
            <h3 className="text-3xl sm:text-4xl font-bold text-[#4c155e]">
              {inView ? <CountUp end={20} duration={3} /> : 0}+
            </h3>
            <p className="mt-2 text-gray-600 text-sm sm:text-base">
              Organizers
            </p>
          </div>

          <div className="w-full max-w-xs sm:max-w-full mx-auto bg-white shadow-lg rounded-xl p-6 border-b-[10px] border-[#4c155e]">
            <FaMapMarkedAlt className="text-3xl sm:text-4xl text-[#4c155e] mx-auto mb-4" />
            <h3 className="text-3xl sm:text-4xl font-bold text-[#4c155e]">
              {inView ? <CountUp end={4} duration={3} /> : 0}
            </h3>
            <p className="mt-2 text-gray-600 text-sm sm:text-base">
              States Covered
            </p>
          </div>

          <div className="w-full max-w-xs sm:max-w-full mx-auto bg-white shadow-lg rounded-xl p-6 border-b-[10px] border-[#4c155e]">
            <FaUsers className="text-3xl sm:text-4xl text-[#4c155e] mx-auto mb-4" />
            <h3 className="text-3xl sm:text-4xl font-bold text-[#4c155e]">
              {inView ? <CountUp end={1000} duration={3} separator="," /> : 0}+
            </h3>
            <p className="mt-2 text-gray-600 text-sm sm:text-base">Attendees</p>
          </div>
        </div>
      </section>

      <section className="relative text-white flex flex-col items-center px-6 text-center bg-[#d8328e] overflow-hidden pt-20 ">
        {/* Text Content */}
        <div className="z-10">
          <h2 className="font-semibold text-4xl sm:text-5xl mb-6">
            Privacy isn't optional—it's the foundation.
          </h2>
          <p className="max-w-2xl mx-auto text-white text-lg leading-relaxed">
            At EventWave, your data stays yours. We don't use ad trackers or
            third-party cookies, and we never sell your information. Our secure
            infrastructure ensures every interaction is private, protected, and
            handled with care.
          </p>
        </div>
        <MdOutlineKeyboardDoubleArrowDown className="text-4xl sm:text-5xl mx-auto mt-10 text-white animate-bounce" />

        <div className="w-full max-w-4xl mt-12 relative">
          {/* Lock icon - scaled like normal image */}
          <div className="absolute top-6 md:top-14 left-1/2 transform -translate-x-1/2 z-20 w-[25%] max-w-[120px]">
            <img
              src={Lock}
              alt="Lock Icon"
              className="w-full h-auto object-contain"
            />
          </div>

          {/* Main image */}
          <img
            src={Details}
            alt="Dashboard Preview"
            className="w-full object-contain rounded-t-xl opacity-40"
          />
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 px-6 bg-gray-50">
        <h2 className="text-3xl font-bold text-center text-purple-900 mb-10">
          Explore Event Categories
        </h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-8 max-w-7xl mx-auto">
          {categories.map((category) => (
            <div
              key={category.id}
              onClick={() => handleCategoryClick(category.name)}
              className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center hover:shadow-xl transition hover:cursor-pointer"
            >
              <div className="text-4xl text-[#4c155e] mb-4">
                {category.icon}
              </div>
              <h3 className="text-xl font-semibold text-[#4c155e]">
                {category.name}
              </h3>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 px-6 bg-gray-100 text-center">
        <h2 className="text-3xl font-bold text-indigo-950 mb-6">
          What People Are Saying
        </h2>
        <p className="text-indigo-950 max-w-2xl mx-auto text-lg mb-10">
          Here's what our community thinks about EventWave.
        </p>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {feedbacks.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white shadow rounded-xl p-6 text-left"
            >
              <p className="text-gray-600 mb-4">"{testimonial.feedback}"</p>
              <h4 className="text-[#4c155e] font-semibold">
                — {testimonial.name}
              </h4>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-6 bg-purple-50 text-center">
        <h2 className="text-3xl font-bold text-purple-800 mb-16">
          How It Works
        </h2>

        <div className="flex flex-col md:flex-row items-center justify-between max-w-6xl mx-auto relative space-y-10 md:space-y-0 md:space-x-6">
          {Steps.map(({ title, icon, desc }, index, arr) => (
            <React.Fragment key={index}>
              {/* Box */}
              <div className="bg-white shadow-md p-6 rounded-lg w-full md:w-1/3 relative z-10">
                <div className="flex flex-col items-center">
                  {icon}
                  <h3 className="text-xl font-semibold text-purple-800">
                    {title}
                  </h3>
                  <p className="text-gray-600 mt-2">{desc}</p>
                </div>
              </div>

              {/* Horizontal connector for desktop */}
              {index !== arr.length - 1 && (
                <div className="hidden md:block h-1 w-6 bg-purple-300"></div>
              )}

              {/* Vertical connector for mobile */}
              {index !== arr.length - 1 && (
                <div className="block md:hidden w-1 h-6 bg-purple-300"></div>
              )}
            </React.Fragment>
          ))}
        </div>
      </section>

      {/* Join CTA */}
      {!isLoggedIn && (
        <section className="py-20 px-6 bg-purple-900 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to join the wave?</h2>
          <p className="mb-6">
            Login and start exploring amazing events around you!
          </p>
          <button
            className="bg-white text-purple-950 px-6 py-3 font-semibold rounded-lg shadow hover:bg-purple-100"
            onClick={handleLogin}
          >
            Get Started
          </button>
        </section>
      )}

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-300 text-center py-6 text-sm">
        &copy; 2025 EventWave. All rights reserved.
      </footer>
    </div>
  );
};

export default Home;
