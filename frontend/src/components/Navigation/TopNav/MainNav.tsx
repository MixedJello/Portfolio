import Link from "next/link";
import React from "react";

const links = [
  { href: "#top", label: "Home" },
  { href: "#AboutMe", label: "About Me" },
  { href: "#projects", label: "Projects" },
  { href: "#contact", label: "Contact Me" },
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
