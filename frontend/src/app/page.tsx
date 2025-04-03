"use client";


import CardContainer from "@/components/Card-Scroll/CardContainer";
import Mainstage from "@/components/Mainstage/Mainstage";
import Grid from "@/components/Mainstage/Grid";
import About from "@/components/About/About";
import ContactForm from "@/components/Contact/ContactForm";
import Social from "@/components/Navigation/Footer/Social";
import Skills from "@/components/Proficiency/Skills";

export default function Home() {

  return (
      <>
        <Grid />
        <Mainstage />
        <About />
        <Skills />
        <CardContainer />
        <ContactForm />
        <Social />
        
      </>
  );
}
