"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

import AnimatedLogo from "components/animated-logo/AnimatedLogo";
import { motion } from "framer-motion";
import classNames from "classnames";
import { usePathname } from "next/navigation";
import classes from "./Header.module.css";

export default function DashboardHeader() {
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);

    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const links = [
    { href: "/", label: "Home" },
    { href: "/orders", label: "Suggested Orders" },
  ];

  console.log({ pathname });
  return (
    <>
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={classes.header}
      >
        <Link href="/" className={classes.logo}>
          {mounted && <AnimatedLogo delay={0.6} />}
        </Link>
        <nav className={classes.navLinks}>
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={classNames({
                [classes.scrolled]: scrolled,
                [classes.active]: pathname === link.href,
              })}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <button className={classes.logoutButton}>Log out</button>
      </motion.header>
    </>
  );
}
