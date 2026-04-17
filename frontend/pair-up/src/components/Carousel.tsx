import React from 'react';

const items = [
  "Skip the small talk.",
  "For the introverts.",
  "No profiles. Just vibes.",
  "Find your person.",
  "Safe. Anonymous. College-only.",
  "Your story starts here."
];

const Carousel: React.FC = () => {
  // Double the items for a seamless loop
  const duplicatedItems = [...items, ...items];

  return (
    <>
      {/* 1. Injecting the keyframes via a style tag so you don't need a config file */}
      <style>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-scroll {
          animation: scroll 30s linear infinite;
        }
      `}</style>

      <div className="w-full bg-[#1a0505] py-8 overflow-hidden relative border-y border-red-950">
        
        {/* 2. Vintage Vignette Overlays (Left & Right Fades) */}
        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#1a0505] to-transparent z-10" />
        <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#1a0505] to-transparent z-10" />

        {/* 3. The Scrolling Track */}
        <div className="flex w-max animate-scroll hover:[animation-play-state:paused] cursor-default">
          {duplicatedItems.map((text, index) => (
            <div
              key={index}
              className="flex items-center whitespace-nowrap px-12"
            >
              {/* Retro Separator (Golden Dot) */}
              <span className="w-2 h-2 rounded-full bg-[#e2b04a] opacity-40 mr-12 shadow-[0_0_10px_#e2b04a]" />
              
              <span className="text-2xl md:text-4xl font-serif italic tracking-tighter text-[#e2b04a] opacity-90">
                {text}
              </span>
            </div>
          ))}
        </div>

        {/* 4. Film Grain Texture Overlay */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.04] bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]" />
      </div>
    </>
  );
};

export default Carousel;