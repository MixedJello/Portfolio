"use client";

import React, { useState } from "react";
import MainNav from "@/components/Navigation/TopNav/MainNav";
import MobileNav from "@/components/Navigation/TopNav/MobileNav";
import "@/styles/navbar/navbar-tools.css";

const Navbar = () => {
  const [navbar, setNavbar] = useState(false);
  return (
    <section className="navbar xl:w-1/3 flex justify-center">
      <div className="shadow-sm nv-bar p-4 ">
          <div className="flex flex-col w-full items-center justify-center xl:items-end justify-between">
            <ul className="mn-nav hidden xl:flex gap-3 ">
              <MainNav />
            </ul>
            <ul className="mbl-nav w-full xl:hidden">
              <MobileNav setNavbar={setNavbar} navbar={navbar} />
            </ul>
          </div>
        </div>
    </section>
  );
};

export default Navbar;
