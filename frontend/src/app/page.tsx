"use client";

import Test from "@/components/Test";
import CardContainer from "@/components/Card-Scroll/CardContainer";
import Mainstage from "@/components/Mainstage/Mainstage";

export default function Home() {

  return (
      <>
        <Mainstage />
        <CardContainer />
        <Test />
      </>
  );
}
