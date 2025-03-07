"use client";
import React, { useRef, useEffect } from "react";
import Card from "@/components/Card-Scroll/Card";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
import Lenis from "lenis";
import "@/styles/cards/card-tools.css";

gsap.registerPlugin(ScrollTrigger);

const cards = [
  {
    title: "Style Weaver",
    content: `An application that would accumulate design styles specified within the designed format, Figma, convert it to the code equivalent, and generate a foundational stylesheet for a developer to start a new development on a website, improving efficiency by a minimum of 20%.`,
    index: 0,
  },
  {
    title: "Scrapey",
    content: `An application that automated a process of scraping every single page of a specific client websites with the goal of looking for any JavaScript tags or iframes on the pages, gather that data and generate a CSV file with the element, path to the page, and listed out scripts that were on all pages of a site.`,
    index: 1,
  },
  {
    title: "Aqua-Tots Swim School",
    content: "https://www.aquatotsfranchise.com/ developed this brand specific website using HTML, CSS, JavaScript, and SQL to achieve its complex design",
    index: 2,
  },
  {
    title: "Wow that's a baseball!",
    content: "Filler filler blah blah",
    index: 3,
  },
];

export default function CardContainer() {
  const container = useRef<HTMLDivElement>(null);

  // Initialize Lenis and sync with ScrollTrigger
  useEffect(() => {
    const lenis = new Lenis({
      smoothWheel: true,
      syncTouch: true,
      lerp: 0.1,
      duration: 1.2,
    });

    // Sync Lenis with ScrollTrigger
    lenis.on("scroll", ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0); // Prevent lag between Lenis and GSAP

    return () => {
      lenis.destroy();
      gsap.ticker.remove((time) => lenis.raf(time * 1000));
    };
  }, []);

  useGSAP(
    () => {
      if (!container.current) return;
      const cardElements = container.current.querySelectorAll(".card") as NodeListOf<HTMLElement>;
      if (cardElements.length === 0) return;

      // Pin the intro section
      ScrollTrigger.create({
        trigger: ".intro",
        start: "top top", // Pin when intro hits top of viewport
        endTrigger: cardElements[cardElements.length - 1],
        end: "top 20%", // Unpin when last card is near top
        pin: true,
        pinSpacing: false,
      });

      // Animate cards
      cardElements.forEach((card, index) => {
        const cardInner = card.querySelector(".card-inner");
        if (!cardInner) return;

        // Pin each card except the last one
        if (index !== cardElements.length - 1) {
          ScrollTrigger.create({
            trigger: card,
            start: "top 20%", // Start pinning when card is near top
            endTrigger: ".outro",
            end: "top 80%", // Unpin when outro is near bottom
            pin: true,
            pinSpacing: false,
          });
        }

        // Smooth y translation for card inner content
        gsap.fromTo(
          cardInner,
          { y: 0 }, // Start at natural position
          {
            y: -card.offsetHeight, // Move up based on card height
            ease: "none",
            scrollTrigger: {
              trigger: card,
              start: "top 20%",
              endTrigger: ".outro",
              end: "top 80%",
              scrub: 1, // Smooth scrubbing with slight delay
            },
          }
        );
      });

      // Refresh ScrollTrigger after setup
      ScrollTrigger.refresh();

      return () => {
        ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      };
    },
    { scope: container }
  );

  return (
    <div className="app" ref={container}>
      <section className="hero">
        <strong className="fnt-1">Projects</strong>
      </section>
      <section className="intro"></section>
      <section className="cards">
        {cards.map((card) => (
          <Card key={card.index} {...card} index={card.index} />
        ))}
      </section>
      <section className="outro">
        <div className="fnt-1">Filler filler blah blah</div>
      </section>
    </div>
  );
}