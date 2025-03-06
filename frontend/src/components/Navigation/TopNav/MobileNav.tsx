import Image from "next/image";
import Link from "next/link";
import React from "react";
import Logo from "@/../public/assets/logo/logo.webp";
import Close from "@/../public/assets/close.svg";
import Menu from "@/../public/assets/menu.svg";

interface Props {
  setNavbar: (value: boolean) => void;
  navbar: boolean;
}

const mobileLinks = [
  { href: "/", label: "Home" },
  { href: "/photo-gallery", label: "Photo Gallery" },
  { href: "/contact-us", label: "Contact Us" },
  { href: "/careers", label: "Careers" },
];

const MobileNav = ({ setNavbar, navbar }: Props) => {
  return (
    <>
      <div className="xl:hidden">
        <div className="flex items-center justify-between">
          <Link href="/" className="">
            <Image src={Logo} width={200} height={200} alt="MCR Logo" />
          </Link>
          <button className="p-2" onClick={() => setNavbar(!navbar)}>
            {navbar ? (
              <Image src={Close} alt="Close Button" width={35} height={35} />
            ) : (
              <Image src={Menu} alt="Open Menu" width={35} height={35} />
            )}
          </button>
        </div>
        <div
          className={navbar ? " xl:p-0 block flex flex-col w-full" : "hidden"}
        >
          <div className="bg-slate-100 mt-4 shadow-lg fixed h-screen w-screen left-0 z-50 flex flex-col items-center justify-start ">
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
