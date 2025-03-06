"use client";
import Image from "next/image";
import React, { useState } from "react";
import MainNav from "@/components/Navigation/TopNav/MainNav";
import Logo from "@/../public/assets/logo/logo.webp";
import Link from "next/link";
import MobileNav from "@/components/Navigation/TopNav/MobileNav";
import "@/styles/navbar/navbar-tools.css";

const Navbar = () => {
  const [navbar, setNavbar] = useState(false);
  return (
    <section className="navbar">
      <div className="shadow-sm nv-bar w-full p-4">
        <div className="mn-w">
          <div className="flex justify-between">
            <Link href="/" className="hidden xl:flex items-center">
              <Image src={Logo} width={200} height={200} alt="Tyler McGue Logo" />
            </Link>
            <div className="flex flex-col w-full items-center justify-center xl:items-end justify-between">
              <ul className="mn-nav hidden xl:flex gap-3">
                <MainNav />
              </ul>
              <ul className="mbl-nav w-full xl:hidden">
                <MobileNav setNavbar={setNavbar} navbar={navbar} />
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Navbar;
