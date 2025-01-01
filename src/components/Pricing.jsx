import Section from "./Section";
import { smallSphere, stars } from "../assets";

const Pricing = () => {
  return (
    <Section className="overflow-hidden" id="pricing">
      <div className="container relative z-2">
        <div className="hidden relative justify-center mb-[6.5rem] lg:flex">
          <img
            src={smallSphere}
            className="relative z-1"
            width={255}
            height={255}
            alt="Sphere"
          />
          <div className="absolute top-1/2 left-1/2 w-[60rem] -translate-x-1/2 -translate-y-1/2 pointer-events-none">
            <img
              src={stars}
              className="w-full"
              width={950}
              height={400}
              alt="Stars"
            />
          </div>
        </div>

        <h1 className="text-center text-white text-4xl font-bold mt-8">newFrequency</h1>

        <div className="mt-16 px-8 text-white text-center text-xl italic">
          <p className="mb-6">Music was never meant to be controlled. That’s why we built newFrequency — a platform where artists truly own their creations, and fans become part of the journey.</p>

          <p className="mb-6">In this new era, music isn’t just something you listen to — it’s something you own, share, and preserve forever on the blockchain.</p>

          <p className="mb-6">The future of music is shaped by us — it’s yours to define. The creators, the innovators, the dreamers... the next great music revolution begins with you.</p>

          <p className="mb-6">Your challenge is simple:</p>
          <p className="mb-6 font-bold">Create. Share. Inspire.</p>

          <p className="mb-6">Mint your tracks, build your legacy, and unlock limitless potential.</p>

          <p className="mb-6">The stage is set. The keys are yours to discover.</p>

          <p className="mb-6 font-bold">Let the music begin. 🎵✨</p>
        </div>

        {/* Download Section */}
        <div className="mt-12 text-center">
          <a
            href="https://drive.google.com/file/d/1HLOgcOLwT-8yfxlLQvRcUFUk1xfWGuoq/view"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 text-white bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-semibold text-lg w-auto max-w-xs mx-auto"
          >
            <div className="flex items-center justify-center">
              <span className="material-icons">download</span>
              <span className="ml-2">newFrequency App for Android</span>
            </div>
          </a>
        </div>
      </div>
    </Section>
  );
};

export default Pricing;


