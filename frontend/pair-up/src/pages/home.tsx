import heroImg from "../assets/images/hero_img.png";
// import thinking from "../assets/images/thinking-face.png";
import Carousel from "../components/Carousel";
import Navbar from "../components/Navbar";
function Home() {
  return (
    <>
      {/* <style>{`
        .carousel{
          margin: 20px auto;
          width: 50%;
    
          display: flex;
          overflow-x: auto;
          gap: 1em;
        }
        
        .carousel::-webkit-scrollbar{
          display:none;
        }

        .group{
          display:flex;
          align-items: center:
          justify-content: center;
          gap: 1em;
          animation: spin 15s infinite linear;
          padding-right: 1em;
        }

        .card{
          flex: 0 0 100vh;
          text-align: center;
          align-content: center;
        }

        @keyframes spin{
          from {translate: 0;}
          to {translate: -100%;}
        }
      `}</style> */}
      <Navbar />
      <section className="h-screen w-full overflow-x-hidden bg-black relative flex items-center justify-center">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImg})` }}
        ></div>

        <div className="absolute inset-0 bg-gradient-to-t from-black from-10% via-50% to-transparent-50%"></div>

        <div className="relative z-10 text-center flex flex-col items-center">
          <h1
            className="text-7xl md:text-9xl font-bold tracking-tighter"
            style={{
              color: "#fff",
              textShadow: `
                0 0 20px #bb13fe3e`,
            }}
          >
            PairUp<span className="text-purple-500">.</span>
          </h1>
          <p className="text-purple-200 mt-10 tracking-[0.6em] opacity-80 text-xs">
            Exclusively for grown ups
          </p>
          <div className="text-white flex gap-3 mt-10">
            <a
              href="/chat"
              className="p-2 bg-white rounded-md text-black font-bold w-25 text-2xl"
            >
              Chat
            </a>
            <a
              href="#disclaimer"
              className="p-2 border rounded-md w-30 justify-center items-center text-center flex hover:bg-purple-200 hover:text-black font-bold"
            >
              Know more
            </a>
          </div>
          {/* <span className="mt-15">
            <div className="carousel">
              <div className="group">
                <div className="card text-white text-sm">● anonymous texting</div>
                <div className="card text-white text-sm">● no login/register</div>
                <div className="card text-white text-sm">● healthy community</div>
                <div className="card text-white text-sm">● find friends</div>
              </div>
              <div aria-hidden className="group">
                <div className="card text-white text-sm">● anonymous texting</div>
                <div className="card text-white text-sm">● no login/register</div>
                <div className="card text-white text-sm">● healthy community</div>
                <div className="card text-white text-sm">● find friends</div>
              </div>
            </div>
          </span> */}
          <span className="mt-24">
            <Carousel />
          </span>
        </div>
      </section>
      {/* <section
        className="h-screen w-full bg-black flex items-center justify-center"
        id="knowmore"
      >
        <div className="pt-0 flex flex-col justify-center items-center">
          <div className="flex justify-center items-center text-center">
            <h1 className="text-[50px] font-serif italic tracking-tighter text-[#e2b04a]">
              Why PairUp
            </h1>
            <img src={thinking} alt="emoji" className="rounded-md" />
            <span className="text-[50px] font-serif italic tracking-tighter text-[#e2b04a]">
              ???
            </span>
          </div>
          <a href="#about" className="text-gray-700 font-bold italic">
            scroll down
          </a>
        </div>
      </section> */}
      <section
        className="h-screen bg-black flex flex-col justify-center text-center"
        id="disclaimer"
      >
        <h1 className="font-mono text-red-500 text-4xl">Disclaimer</h1>
        <p className="font-special text-white text-md p-10">
          Disclaimer & Chat Rules To ensure a safe experience for all students,
          this platform is actively moderated. By entering, you agree that no
          abusive language or ill-treatment of other users will be tolerated.
          Warning: Please use the platform responsibly. Any violations of
          community standards may result in an immediate ban. Don't risk your
          access or your reputation over a poor decision in the heat of the
          moment.
        </p>
      </section>
      <section
        className="h-screen bg-black flex flex-col justify-center text-center"
        id="about"
      >
        <h1 className="font-mono text-white text-4xl">About</h1>
        <p className="font-special text-white text-md p-10">
          Why PairUp?... Let’s be real, college is a lot!!!{" "}
          <span>
            <br />
          </span>{" "}
          Between the lectures and the social noise, it’s easy to feel a bit
          lost or like you’re on the outside looking in. For many of us, walking
          up to a stranger in the canteens, parks or library feels like a
          mountain we’re just not ready to climb. PairUp was built for the ones
          who have a lot to say, but are a little too shy to say it out loud
          yet. The Vision We’re here to fix a broken dating culture. We believe
          that a great connection shouldn’t be gated behind a "perfect" profile
          or the pressure of an immediate face-to-face meeting. PairUp is a
          stateless, anonymous space where your personality does the talking,
          not your photo.
          <span>
            <br />
            <br />
          </span>
          "Skip the nerves. Start the conversation."
          
        </p>
      </section>
      <footer className="w-full py-6 bg-black text-white/60 text-center font-special">
        <p>&copy; {new Date().getFullYear()} PairUp All rights reserved.</p>
      </footer>
    </>
  );
}

export default Home;

/*

<div className="pt-30">
          <div className="flex justify-center items-center text-center">
            <h1 className="text-[50px] font-bold text-fuchsia-950 italic">
              What/Why PairUP
            </h1>
            <img src={thinking} alt="emoji" className="rounded-md" />
            <span className="text-[50px] font-bold text-fuchsia-950 italic">???</span>
          </div>
        </div>


*/
