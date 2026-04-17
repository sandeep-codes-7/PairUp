import { useState, useEffect } from "react";

function Navbar(){
  const [scrolled, setScrolled] = useState(false);

  // Optional: Add a background color when the user scrolls down
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled ? "bg-black backdrop-blur-md py-3" : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        {/* Logo */}
        <a href="/" className="text-white font-bold text-2xl tracking-tighter">
          PairUp<span className="text-purple-500">.</span>
        </a>

        {/* Links */}
        <div className="flex gap-8 text-white/80 text-sm font-medium">
          <a href="#" className="hover:text-white transition-colors">Home</a>
          <a href="#about" className="hover:text-white transition-colors">About</a>
          <a href="#" className="hover:text-white transition-colors">Buy me a coffee</a>
        </div>

        {/* Action Button */}
        <a href="/init" className="px-5 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-full text-sm font-semibold transition-all shadow-lg shadow-purple-500/20">
          Get Started
        </a>
      </div>
    </nav>
  );
};

export default Navbar;