import Link from "next/link";
import React from "react";

const links = [
  { href: "/", label: "Home" },
  { href: "/photo-gallery", label: "Photo Gallery" },
  { href: "/contact-us", label: "Contact Us" },
];

const MainNav = () => {
  return (
    <>
      {links.map((link) => (
        <li key={link.href}>
          <Link href={link.href}>
          {link.label}
        </Link>
        </li>
      ))}
    </>
  );
};

export default MainNav;
