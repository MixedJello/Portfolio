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
    content: `This portfolio website is built with Next.js and Go, providing a central hub for my projects and professional background. It delivers an interactive experience powered by Matter.js, enabling physics-based animations that highlight my creative side. On the backend, I developed a custom email server in Go with SMTP integration, automating autoresponder emails for seamless communication. This implementation improves reliability and reduces dependency on third-party email services.`,
    language: ['Nextjs', 'Go'],
    link: 'https://github.com/MixedJello/Portfolio',
    index: 0,
  },
  {
    title: "Style Weaver",
    content: `Developed an application that extracts design styles from Figma, converts them into structured CSS code, and generates a foundational stylesheet—reducing manual styling efforts and accelerating development startup time by 20% or more. This tool streamlines the design-to-development workflow, ensuring consistency and efficiency across projects.`,
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
    content: "Designed and developed the Aquatots Franchise website (aquatotsfranchise.com) using HTML, CSS, JavaScript, and SQL to deliver a brand-specific, visually engaging, and high-performance web experience. Implemented a custom SQL-driven backend to manage dynamic content efficiently, ensuring scalability and seamless user interactions.",
    language: ['html', 'css', 'javascript', 'sql'],
    link: 'https://www.aquatotsfranchise.com/',
    index: 3,
  },
  {
    title: "Wind River Environmental",
    content: "Designed and developed the WR Environmental website (wrenvironmental.com) using HTML, CSS, JavaScript, and SQL to create a brand-specific, high-performance digital experience. Built a custom SQL-driven backend to manage dynamic content, ensuring scalability and seamless data handling. Optimized the site's UI/UX and responsiveness, enhancing accessibility across all devices.",
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
            start: "top 5%", // Start pinning when card is near top
            endTrigger: ".outro",
            end: "top 100%", // Unpin when outro is near bottom
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
              start: "top 5%",
              endTrigger: ".outro",
              end: "top 100%",
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