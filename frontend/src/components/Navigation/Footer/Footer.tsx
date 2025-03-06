import Link from "next/link";
import React from "react";
import Image from "next/image";
import Logo from "@/../public/assets/logo/logo.webp";

const links = [
  { href: "/", label: "Home" },
  { href: "/photo-gallery", label: "Photo Gallery" },
  { href: "/contact-us", label: "Contact Us" },
];

const Footer = () => {
  return (
    <section className="ftr-nav w-full py-16">
      <div className="mn-w">
        <div className="flex flex-col xl:flex-row xl:justify-between items-center">
          <Link href="/" className="flex items-center pb-8">
            <Image src={Logo} width={200} height={200} alt="MCR Logo" />
          </Link>
          <ul className="flex xl:flex-row flex-col gap-4 items-center">
            {links.map((link) => (
              <Link href={link.href} key={link.href}>
                {link.label}
              </Link>
            ))}
          </ul>
          <div className="pt-8">
            <Link className="btn v1" href="/contact-us/">
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Footer;
