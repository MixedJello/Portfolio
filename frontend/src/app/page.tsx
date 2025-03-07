"use client";

import Test from "@/components/Test";
import CardContainer from "@/components/Card-Scroll/CardContainer";
import Mainstage from "@/components/Mainstage/Mainstage";
import Grid from "@/components/Mainstage/Grid";

export default function Home() {

  return (
      <>
        <Grid />
        <Mainstage />
        <CardContainer />
        <Test />
      </>
  );
}
