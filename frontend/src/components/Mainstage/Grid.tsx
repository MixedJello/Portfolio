"use client"
import React, { useEffect, useState } from 'react'
import { gsap } from "gsap";
import "@/styles/mainstage/grid.css"

const useViewportSize = () => {
  const [size, setSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });

  useEffect(() => {
    const handleResize = () => {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    
    handleResize(); // Set initial size
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return size;
}

export default function Grid() {
  interface GridLine {
    speed: number;
    width: number;
  }

  const { width, height } = useViewportSize();
  const xLinesCount = Math.floor(width / 100);
  const yLinesCount = Math.floor(height / 50);
  
  const xLines: GridLine[] = Array.from({ length: xLinesCount }, () => ({
    speed: Math.random() * 3 + 2,
    width: 1,
  }));
  const yLines: GridLine[] = Array.from({ length: yLinesCount }, () => ({
    speed: Math.random() * 3 + 2,
    width: 1,
  }));

  useEffect(() => {
    if (width > 0 && height > 0) { // Only run when we have valid dimensions
      gsap.fromTo(
        ".x-line",
        { opacity: 0, scaleX: 0 },
        { 
          opacity: 1, 
          scaleX: 1, 
          duration: 10, 
          stagger: 0.2, 
          ease: "power2.out",
          scrollTrigger: { // Add scroll trigger if desired
            trigger: ".x-line",
            start: "top bottom",
          }
        }
      );
      gsap.fromTo(
        ".y-line",
        { opacity: 0, scaleY: 0 },
        { 
          opacity: 1, 
          scaleY: 1, 
          duration: 10, 
          stagger: 0.2, 
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".y-line",
            start: "top bottom",
          }
        }
      );
    }
  }, [width, height]); // Re-run when viewport size changes

  return (
    <div className="grid-container">
      {xLines.map((line, index) => (
        <div
          key={`x-${index}`}
          className="x-line"
          style={{
            position: 'absolute',
            top: `${(index / xLinesCount) * 100}%`,
            height: `${line.width}px`,
            width: '100%',
            background: '#00f0ff', // Add visible color for testing
          }}
        />
      ))}
      {yLines.map((line, index) => (
        <div
          key={`y-${index}`}
          className="y-line"
          style={{
            position: 'absolute',
            opacity: .5,
            left: `${(index / yLinesCount) * 100}%`,
            width: `${line.width}px`,
            height: '100%',
            background: '#00f0ff', // Add visible color for testing
          }}
        />
      ))}
    </div>
  )
}