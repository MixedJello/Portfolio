'use client';

import Link from "next/link";
import React from "react";
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

const OpenIcon = () => {
  return <svg className='opn-icn' viewBox="0 0 24 24">
<path fillRule="evenodd" clipRule="evenodd" d="M4 5C3.44772 5 3 5.44772 3 6C3 6.55228 3.44772 7 4 7H20C20.5523 7 21 6.55228 21 6C21 5.44772 20.5523 5 20 5H4ZM7 12C7 11.4477 7.44772 11 8 11H20C20.5523 11 21 11.4477 21 12C21 12.5523 20.5523 13 20 13H8C7.44772 13 7 12.5523 7 12ZM13 18C13 17.4477 13.4477 17 14 17H20C20.5523 17 21 17.4477 21 18C21 18.5523 20.5523 19 20 19H14C13.4477 19 13 18.5523 13 18Z"/>
</svg>

}
const CloseIcon = () => {
  return <svg className='cls-icn' viewBox="0 0 24 24">
<path stroke="none" d="M10.586 12 2.793 4.207l1.414-1.414L12 10.586l7.793-7.793 1.414 1.414L13.414 12l7.793 7.793-1.414 1.414L12 13.414l-7.793 7.793-1.414-1.414L10.586 12Z"/>
</svg>
}

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
              <CloseIcon/>
            ) : (
              <OpenIcon />
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
