import React from 'react';
import Card from "@/components/Card-Scroll/Card";
import Image from 'next/image';
import HeroImg from "../../../public/assets/hero.jpg";
import { useRef, useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/all";
import Lenis from "lenis";
import "@/styles/cards/card-tools.css";

const cards = [
  {
    title: "Corniest of Dad Jokes",
    content: "Filler filler blah blah",
    index: 0
  },
  {
    title: "Super Cool Guy",
    content: "Filler filler blah blah",
    index: 1
  },
  {
    title: "But wait theres more!",
    content: "Filler filler blah blah",
    index: 2
  },
  {
    title: "Wow that's a baseball!",
    content: "Filler filler blah blah",
    index: 3
  },
]

gsap.registerPlugin(ScrollTrigger);

export default function CardContainer() {
  useEffect(() => {
    const lenis = new Lenis({
      smoothWheel: true, //Enables smooth scrolling on wheel events 
      syncTouch: true, //synchronizes touch gestures
      lerp: 0.1, //Adjusts the smoothness (higher = less smooth)
      duration: 1.2, //Adjusts the duration of scroll animations

    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);
  }, []);

  const container = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!container.current) return;
    const cardElements = container.current.querySelectorAll(".card");
    if (cardElements.length === 0) return;

    

    ScrollTrigger.create({
      trigger: cardElements[0],
      start: "top 35%",
      endTrigger: cardElements[cardElements.length - 1],
      end: "top 30%",
      pin: ".intro",
      pinSpacing: false,
    });

    cardElements.forEach((card, index) => {
      const isLast = index === cardElements.length -1;
      const cardInner = card.querySelector(".card-inner");

      if (!isLast) {
        ScrollTrigger.create({
          trigger: card,
          start: "top 35%",
          endTrigger: ".outro",
          end: "top 65%",
          pin: true,
          pinSpacing: false,
        });

        gsap.to(cardInner, {
          y: `-${(cards.length - index) * 14}vh`,
          ease: "none",
          scrollTrigger: {
            trigger: card,
            start: "top 35%",
            endTrigger: ".outro",
            end: "top 65%",
            scrub: true,
          }
        });
      }
    })
    return () => {
      ScrollTrigger.getAll().forEach((trigger) => 
      trigger.kill());
    }
  }, { scope: container });


  return (
    <>
        <div className="app" ref={container}>
          <section className="hero">
            {/* <Image src={HeroImg} width={500} height={500} alt="Hero Image" /> */}
          </section>
          <section className="intro"></section>
          <section className="cards">
            {cards.map((card) => (
              <Card key={card.index} {...card} index={card.index}/>
            ))}
          </section>
          <section className="outro">
            <div className="fnt-1">Filler filler blah blah</div>
          </section>
        </div>
    </>
  )
}
