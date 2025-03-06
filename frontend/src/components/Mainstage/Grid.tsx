import React, { useEffect, useState } from 'react'
import { gsap } from "gsap";
import "@/styles/mainstage/grid.css"

const useViewportSize = () => {
  const [size, setSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);

    //Cleanup event listener on unmount
    return () =>window.removeEventListener("resize", handleResize);
  }, []);
  return size;
}

//gsap.registerPlugin(ScrollTrigger)

export default function Grid() {
  interface GridLine {
    speed: number;
    width: number;
  }

  //Get vp height and width
  const { width, height } = useViewportSize();

  //Generate number of lines dependent on width and height
  const xLinesCount = Math.floor(width / 100);
  const yLinesCount = Math.floor(height / 100);
  const xLines: GridLine[] = Array.from({ length: xLinesCount }, () => ({
    speed: Math.random() * 3 + 2,
    width: Math.random() * 2 + 1,
  }));
  const yLines: GridLine[] = Array.from({ length: yLinesCount }, () => ({
    speed: Math.random() * 3 + 2,
    width: Math.random() * 2 + 1,
  }));

  useEffect(() => {
    gsap.fromTo(
      ".x-line",
      { opacity: 0, scaleX: 0 },
      { opacity: 1, scaleX: 1, duration: 1, stagger: 0.2, ease: "power2.out" }
    );
    gsap.fromTo(
      ".y-line",
      { opacity: 0, scaleY: 0 },
      { opacity: 1, scaleY: 1, duration: 1, stagger: 0.2, ease: "power2.out" }
    );
  }, []);

  return (
    <>
      <p>Viewport width: {width}</p>
      <p>Viewport height: {height}</p>
      {xLines.map((line, index) => {
        <div
          key={`x-${index}`}
          className="x-line"
          style={{
            top: `${(index/ xLinesCount) * 100}%`,
            height: `${line.width}px`,
          }}
          />
      })}
      {yLines.map((line, index) => {
        <div
          key={`y-${index}`}
          className="y-line"
          style={{
            left: `${(index/ yLinesCount) * 100}`,
            width: `${line.width}px`,
          }}
          />
      })}
    </>
  )
}
