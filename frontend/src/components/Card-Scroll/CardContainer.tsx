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
    title: "This Site",
    content: `I developed this website to leverage a modern tech stack of Next.js and Go and display all of my projects in one area. This site features an interactive experience with Matter.js, a physics engine that powers playful, physics-based animations, to show my fun creative side. On the backend, I implemented a custom email server in Go, complete with SMTP integration to send autoresponder emails, which added both a practical feature and an enjoyable challenge to the project.`,
    language: ['Nextjs', 'Go'],
    link: 'https://github.com/MixedJello/Portfolio',
    index: 0,
  },
  {
    title: "Style Weaver",
    content: `An application that would accumulate design styles specified within the designed format, Figma, convert it to the code equivalent, and generate a foundational stylesheet for a developer to start a new development on a website, improving efficiency by a minimum of 20%.`,
    language: ['Csharp', 'python'],
    link: 'https://github.com/MixedJello/StyleWeaver',
    index: 1,
  },
  {
    title: "Scrapey",
    content: `An application that automated a process of scraping every single page of a specific client websites with the goal of looking for any JavaScript tags or iframes on the pages, gather that data and generate a CSV file with the element, path to the page, and listed out scripts that were on all pages of a site.`,
    language: ['Csharp'],
    link: 'https://github.com/MixedJello/Scrapey/',
    index: 2,
  },
  {
    title: "Aqua-Tots Swim School",
    content: "https://www.aquatotsfranchise.com/ developed this brand specific website using HTML, CSS, JavaScript, and SQL to achieve its complex design",
    language: ['html', 'css', 'javascript', 'sql'],
    link: 'https://www.aquatotsfranchise.com/',
    index: 3,
  },
  {
    title: "Wind River Environmental",
    content: "https://www.wrenvironmental.com/ developed this brand specific website using HTML, CSS, JavaScript, and SQL to achieve its complex design",
    language: ['html', 'css', 'javascript', 'sql'],
    link: 'https://www.wrenvironmental.com/',
    index: 4,
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
    <div id="projects" className="app" ref={container}>
      <div className="hero text-center">
        <strong className="fnt-1">Projects</strong>
      </div>
      <section className="intro"></section>
      <section className="cards space-y-30 md:space-y-0">
        {cards.map((card) => (
          <Card key={card.index} {...card} index={card.index} />
        ))}
      </section>
      <div className="outro">
      </div>
    </div>
  );
}