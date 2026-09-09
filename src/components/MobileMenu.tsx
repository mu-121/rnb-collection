"use client";

import Link from "next/link";
import { useEffect } from "react";

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
