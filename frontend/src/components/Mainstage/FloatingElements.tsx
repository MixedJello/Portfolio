import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function FloatingElements() {
  const elementsRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!elementsRef.current) return;
    const el = elementsRef.current;
    gsap.to(el, {
        y: "random(-20,20)",
        repeat: -1,
        yoyo: true,
        duration: 2,
        ease: "power1.inOut",
    });
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <div ref={elementsRef} className="absolute top-10 left-20 text-neon">
        🔷
      </div>
      <div ref={elementsRef} className="absolute top-40 left-60 text-neon">
        🟠
      </div>
    </div>
  );
}