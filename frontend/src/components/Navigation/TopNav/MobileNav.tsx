'use client';

import Image from "next/image";
import Link from "next/link";
import React from "react";
import Close from "@/../public/assets/close.svg";
import Menu from "@/../public/assets/menu.svg";
import "@/styles/navbar/mobile-nav.css"

interface Props {
  setNavbar: (value: boolean) => void;
  navbar: boolean;
}

const mobileLinks = [
  { href: "#top", label: "Home" },
  { href: "#about", label: "About Me" },
  { href: "#projects", label: "Projects" },
  { href: "#contact", label: "Contact Me" },
];

const MobileNav = ({ setNavbar, navbar }: Props) => {
  return (
    <>
      <div className="xl:hidden">
        <div className="flex items-center justify-between">
          <button 
          aria-label={navbar ? "Close menu" : "Open menu"}
          aria-expanded={navbar}
          className="p-2"
          onClick={() => setNavbar(!navbar)}>
            {navbar ? (
              <Image src={Close} alt="Close Button" width={35} height={35} />
            ) : (
              <Image src={Menu} alt="Open Menu" width={35} height={35} />
            )}
          </button>
        </div>
        <div
          className={`fixed h-0 inset-0 z-50 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
            navbar ? "opacity-100 active" : "opacity-0 pointer-events-none"
          }`}
        >
          <div className={`fixed top-20 right-0 w-1/3 h-auto mbl-nav shadow-lg transform transition-transform duration-300 flex flex-col items-end ${
            navbar ? "translate-x-0 block" : "translate-x-full hidden"
          }`}>
            {mobileLinks.map((link) => (
              <Link
                className="px-6 py-6"
                href={link.href}
                key={link.href}
                onClick={() => setNavbar((navbar = false))}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default MobileNav;
