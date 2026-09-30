"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import HoverText from "./HoverText";
import MobileMenu, { LINKS } from "./MobileMenu";
import SiteSearch from "./SiteSearch";

function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="7.25" cy="7.25" r="4.75" stroke="currentColor" strokeWidth="1.4" />
      <path d="M10.75 10.75 13.5 13.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

function CartIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="9" cy="21" r="1"></circle>
      <circle cx="20" cy="21" r="1"></circle>
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
    </svg>
  );
}

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { isAuthenticated, loading, logout } = useAuth();
  const { cartCount } = useCart();

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
            <button
              type="button"
              className="site-header__search"
              aria-label="Search"
              onClick={() => setSearchOpen(true)}
            >
              <SearchIcon />
            </button>

            <div className="site-header__auth" aria-label="Account">
              {!loading && isAuthenticated ? (
                <>
                  <Link href="/account" className="site-header__auth-link">
                    <HoverText>Account</HoverText>
                  </Link>
                  <button
                    type="button"
                    className="site-header__auth-link site-header__auth-link--button"
                    onClick={logout}
                  >
                    <HoverText>Logout</HoverText>
                  </button>
                </>
              ) : !loading ? (
                <>
                  <Link href="/login" className="site-header__auth-link">
                    <HoverText>Login</HoverText>
                  </Link>
                  <Link
                    href="/register"
                    className="site-header__auth-link site-header__auth-link--muted"
                  >
                    <HoverText>Register</HoverText>
                  </Link>
                </>
              ) : null}
            </div>

            <Link href="/cart" className="site-header__search" aria-label="Cart" style={{ position: 'relative' }}>
              <CartIcon />
              {cartCount > 0 && (
                <span style={{ position: 'absolute', top: -5, right: -10, background: '#005AFA', color: '#fff', fontSize: '10px', borderRadius: '50%', padding: '2px 6px' }}>
                  {cartCount}
                </span>
              )}
            </Link>

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

      <SiteSearch open={searchOpen} onClose={() => setSearchOpen(false)} />
      <div id="mobile-navigation">
        <MobileMenu open={menuOpen} onClose={closeMenu} />
      </div>
    </>
  );
}
