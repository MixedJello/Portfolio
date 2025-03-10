"use client";
import React, { useEffect, useState } from 'react';
import { gsap } from "gsap";
import "@/styles/mainstage/grid.css";

const useViewportSize = () => {
  const [size, setSize] = useState({
    width: 0, // Default to 0 for SSR
    height: 0,
  });

  useEffect(() => {
    const handleResize = () => {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    
    handleResize(); // Set initial size on mount
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return size;
};

export default function Grid() {
  interface GridLine {
    speed: number;
    width: number;
  }

  const { width, height } = useViewportSize();
  const [isMounted, setIsMounted] = useState(false);

  // Set isMounted to true after the component mounts on the client
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Calculate line counts only when width and height are valid
  const xLinesCount = width > 0 ? Math.floor(width / 100) : 0;
  const yLinesCount = height > 0 ? Math.floor(height / 50) : 0;

  const xLines: GridLine[] = Array.from({ length: xLinesCount }, () => ({
    speed: Math.random() * 3 + 2,
    width: 1,
  }));
  const yLines: GridLine[] = Array.from({ length: yLinesCount }, () => ({
    speed: Math.random() * 3 + 2,
    width: 1,
  }));

  useEffect(() => {
    if (!isMounted || width <= 0 || height <= 0) return; // Skip until mounted and dimensions are valid

    gsap.fromTo(
      ".x-line",
      { opacity: 0, scaleX: 0 },
      { 
        opacity: 1, 
        scaleX: 1, 
        duration: 1, // Reduced for testing; adjust as needed
        stagger: 0.2, 
        ease: "power2.out",
      }
    );
    gsap.fromTo(
      ".y-line",
      { opacity: 0, scaleY: 0 },
      { 
        opacity: 1, 
        scaleY: 1, 
        duration: 1, 
        stagger: 0.2, 
        ease: "power2.out",
      }
    );
  }, [isMounted, width, height]);

  // Render nothing or a fallback during SSR until mounted
  if (!isMounted) return null; // Or a loading state like <div>Loading...</div>

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
            background: '#00f0ff',
          }}
        />
      ))}
      {yLines.map((line, index) => (
        <div
          key={`y-${index}`}
          className="y-line"
          style={{
            position: 'absolute',
            opacity: 0.5,
            left: `${(index / yLinesCount) * 100}%`,
            width: `${line.width}px`,
            height: '100%',
            background: '#00f0ff',
          }}
        />
      ))}
    </div>
  );
}