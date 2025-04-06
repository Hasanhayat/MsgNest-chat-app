import { useGSAP } from "@gsap/react";
import gsap from "gsap";

const AuthImagePattern = ({ title, subtitle }) => {
  useGSAP(() => {
    gsap.from("#box2" , {
      x: 1000,
      duration: 2,
      delay: 0,
      ease: "power2.out", 
      scale: 0.5,
      opacity: 0,
    });

  })
  return (
    <div className="hidden lg:flex items-center justify-center bg-base-200 p-12">
      <div className="max-w-md text-center">
        <div className="grid grid-cols-3 gap-3 mb-8" id="box2">
          {[...Array(9)].map((_, i) => (
            <div
              key={i}
              className={`aspect-square rounded-2xl bg-primary/10 transition-colors duration-500 hover:bg-primary ${
                i % 2 === 0 ? "animate-pulse" : ""
              }`}
            />
          ))}
        </div>

        <h2 className="text-2xl font-bold mb-4">{title}</h2>
        <p className="text-base-content/60">{subtitle}</p>
      </div>
    </div>
  );
};

export default AuthImagePattern;
