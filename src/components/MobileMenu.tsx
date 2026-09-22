"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/shop", label: "Shop" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
] as const;

type MobileMenuProps = {
  open: boolean;
  onClose: () => void;
};

export default function MobileMenu({ open, onClose }: MobileMenuProps) {
  const { isAuthenticated, loading, logout } = useAuth();

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  return (
    <div
      className="mobile-menu"
      data-open={open}
      aria-hidden={!open}
    >
      <button
        type="button"
        className="mobile-menu__backdrop"
        aria-label="Close menu"
        tabIndex={open ? 0 : -1}
        onClick={onClose}
      />
      <div className="mobile-menu__panel" role="dialog" aria-modal="true" aria-label="Mobile navigation">
        <nav className="mobile-menu__nav" aria-label="Mobile">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="mobile-menu__link"
              tabIndex={open ? 0 : -1}
              onClick={onClose}
            >
              {link.label}
            </Link>
          ))}
          {!loading && isAuthenticated ? (
            <>
              <Link
                href="/account"
                className="mobile-menu__link"
                tabIndex={open ? 0 : -1}
                onClick={onClose}
              >
                Account
              </Link>
              <button
                type="button"
                className="mobile-menu__link mobile-menu__link--button"
                tabIndex={open ? 0 : -1}
                onClick={() => {
                  logout();
                  onClose();
                }}
              >
                Logout
              </button>
            </>
          ) : !loading ? (
            <>
              <Link
                href="/login"
                className="mobile-menu__link"
                tabIndex={open ? 0 : -1}
                onClick={onClose}
              >
                Login
              </Link>
              <Link
                href="/register"
                className="mobile-menu__link"
                tabIndex={open ? 0 : -1}
                onClick={onClose}
              >
                Register
              </Link>
            </>
          ) : null}
        </nav>
        <Link
          href="/shop"
          className="mobile-menu__cta"
          tabIndex={open ? 0 : -1}
          onClick={onClose}
        >
          Shop all items
        </Link>
      </div>
    </div>
  );
}

export { LINKS };
