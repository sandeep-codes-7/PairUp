import { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import coffee from "../assets/images/coffee.png";
import Preferences from "../components/preferences";

const Dashboard = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("Home");
  const menuOptions = ["Home", "PairUp", "Find friends", "Groups"];

  return (
    // 1. Wrapping everything in a screen-height flex column
    <div className="flex flex-col h-screen overflow-hidden">
      {/* 2. Navbar: shrink-0 ensures it never squishes */}
      <nav className="bg-black text-white p-4 shrink-0 border-b border-gray-800 z-50">
        <ul className="justify-between flex">
          <li className="font-bold text-4xl">
            <a href="/">
              PairUp<span className="text-purple-500">.</span>
            </a>
          </li>
          <li className="w-10 h-10 p-auto w-30">
            <a href="#">
              <img src={coffee} alt="coffee" />
            </a>
          </li>
        </ul>
      </nav>

      {/* 3. Section: flex-1 fills the remaining height underneath the nav */}
      <section className="flex flex-1 overflow-hidden relative">
        {/* Sidebar: overflow-y-auto allows internal scrolling if menu gets long */}
        <div
          className={`bg-black text-white border-r border-gray-800 transition-all duration-300 flex flex-col overflow-y-auto
        ${isOpen ? "w-64" : "w-0 overflow-hidden"}`}
        >
          <div className="p-4">
            <div className="flex gap-3 items-center justify-between">
              <p className="text-white font-bold text-2xl tracking-tighter">
                Features
              </p>
              <button onClick={() => setIsOpen(!isOpen)}>
                {isOpen && (
                  <FaTimes className="text-gray-400 hover:text-white" />
                )}
              </button>
            </div>

            <ul className="mt-8 space-y-2">
              {menuOptions.map((option) => (
                <li key={option}>
                  <button
                    onClick={() => setActiveTab(option)}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-colors font-medium ${
                      activeTab === option
                        ? "bg-purple-600 text-white shadow-lg shadow-purple-600/40"
                        : "text-gray-400 hover:bg-gray-800 hover:text-white"
                    }`}
                  >
                    {option}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
        {/* 4. Main Content: flex-1 takes right-side width, overflow-y-auto handles tall components like Preferences! */}
        <div className="flex-1 bg-black flex flex-col overflow-y-auto no-scrollbar">
          <div className="shrink-0">
            <button onClick={() => setIsOpen(!isOpen)}>
              {!isOpen && (
                <FaBars className="h-10 w-10 text-white m-4 p-2 cursor-pointer hover:bg-gray-800 rounded" />
              )}
            </button>
          </div>

          {/* Tab Content Wrapper */}
          <div className="p-8">
            {/* <h1 className="text-3xl text-white font-bold mb-6">{activeTab}</h1> */}

            <div className={activeTab === "Home" ? "block" : "hidden"}>
              {/* <p className="text-gray-400 mt-4">
                Welcome to your Home dashboard. Here is your overview.
              </p> */}
              <h1 className="items-center justify-center flex text-white font-display font-extrabold text-[5rem]">
                Welcome Users!
              </h1>
              <p className="text-gray-300 max-w-3xl mx-auto text-center pt-8 px-4 leading-relaxed">
                Welcome to{" "}
                <span className="text-purple-400 font-bold">PairUp</span>! Built
                as a trial project, this platform is a safe haven for introverts
                and anyone who feels a bit shy in the outside world. Our goal is
                to help you comfortably connect with like-minded individuals and
                overcome social anxiety at your own pace. Please be respectful
                and responsible in your conversations. For your safety, we
                strongly advise against sharing personal information—if you
                choose to do so, it is strictly at your own risk. Thank you for
                joining our community! <br />
                <br />
                <span className="text-purple-400 font-medium">
                  — Team PairUp
                </span>
              </p>
              <div className="text-white flex gap-5 justify-center mt-5">
                <div className="border border-gray-400 w-60 h-40 p-5 justify-center flex rounded-md">
                  active users
                </div>
                <div className="border border-gray-400 w-60 h-40 p-5 justify-center flex rounded-md">
                  active users
                </div>

                {/* <div>some extra information</div> */}
              </div>
            </div>

            <div className={activeTab === "PairUp" ? "block" : "hidden"}>
              <div className="flex justify-center items-center flex-col">
                <Preferences />
              </div>
            </div>

            <div className={activeTab === "Find friends" ? "block" : "hidden"}>
              <p className="text-gray-400 mt-4">
                Search and connect with new friends globally.
              </p>
            </div>

            <div className={activeTab === "Groups" ? "block" : "hidden"}>
              <p className="text-gray-400 mt-4">
                Join communities and participate in group chats.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
