"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useState } from "react";
import HoverText from "./HoverText";
import MobileMenu, { LINKS } from "./MobileMenu";

function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="7.25" cy="7.25" r="4.75" stroke="currentColor" strokeWidth="1.4" />
      <path d="M10.75 10.75 13.5 13.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = useCallback(() => setMenuOpen(false), []);
  const toggleMenu = useCallback(() => setMenuOpen((value) => !value), []);

  return (
    <>
      <header className="site-header">
        <div className="site-header__inner">
          <Link href="/" className="site-header__logo" aria-label="RnB Collection home">
            <Image
              src="/Images/logo.svg"
              alt="RnB Collection"
              width={136}
              height={25}
              priority
            />
          </Link>

          <nav className="site-header__nav" aria-label="Primary">
            {LINKS.map((link) => (
              <Link key={link.href} href={link.href} className="site-header__link">
                <HoverText>{link.label}</HoverText>
              </Link>
            ))}
          </nav>

          <div className="site-header__actions">
            <button type="button" className="site-header__search" aria-label="Search">
              <SearchIcon />
            </button>

            <Link href="/shop" className="site-header__cta">
              <HoverText>Shop all items</HoverText>
            </Link>

            <button
              type="button"
              className="site-header__menu-btn"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              aria-controls="mobile-navigation"
              onClick={toggleMenu}
            >
              <span />
            </button>
          </div>
        </div>
      </header>

      <div id="mobile-navigation">
        <MobileMenu open={menuOpen} onClose={closeMenu} />
      </div>
    </>
  );
}
