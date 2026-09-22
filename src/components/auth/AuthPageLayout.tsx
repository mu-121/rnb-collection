"use client";

import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

export default function AuthPageLayout({ children }: { children: ReactNode }) {
  return (
    <div className="auth-viewport">
      <aside className="auth-visual" aria-hidden="true">
        <Image
          src="/Images/wearix-019.jpg"
          alt=""
          fill
          priority
          sizes="(min-width: 960px) 48vw, 100vw"
          className="auth-visual__image"
        />
        <div className="auth-visual__veil" />
        <div className="auth-visual__copy">
          <p className="auth-visual__brand">RNB Collections</p>
          <p className="auth-visual__tagline">
            Premium wear for modern living
          </p>
        </div>
      </aside>
      <main className="auth-panel">{children}</main>
    </div>
  );
}

export function AuthFooterLinks({
  prompt,
  href,
  label,
}: {
  prompt: string;
  href: string;
  label: string;
}) {
  return (
    <p>
      {prompt} <Link href={href}>{label}</Link>
    </p>
  );
}
