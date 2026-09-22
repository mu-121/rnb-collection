"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ProtectedRoute } from "@/components/auth/AuthGuards";
import AuthPageLayout from "@/components/auth/AuthPageLayout";
import { useAuth } from "@/context/AuthContext";

export default function AccountPage() {
  const { customer, logout } = useAuth();
  const router = useRouter();

  function onLogout() {
    logout();
    router.replace("/login");
  }

  return (
    <ProtectedRoute>
      <AuthPageLayout>
        <div className="auth-page">
          <div className="auth-card auth-card--wide">
            <div className="auth-card__top">
              <Link href="/" className="auth-card__logo" aria-label="RNB Collections home">
                <Image
                  src="/Images/logo.svg"
                  alt="RNB Collections"
                  width={132}
                  height={24}
                  priority
                />
              </Link>
              <Link href="/shop" className="auth-card__back">
                Back to shop
              </Link>
            </div>
            <div className="auth-card__brand">
              <p className="auth-card__eyebrow">RNB Collections</p>
              <h1>My account</h1>
              <p className="auth-card__subtitle">
                Manage your profile and shopping activity
              </p>
            </div>
            {customer ? (
              <div className="account-grid">
                <div>
                  <p className="account-label">Name</p>
                  <p className="account-value">{customer.name}</p>
                </div>
                <div>
                  <p className="account-label">Email</p>
                  <p className="account-value">{customer.email}</p>
                </div>
                <div>
                  <p className="account-label">Email verified</p>
                  <p className="account-value">
                    {customer.emailVerified ? "Verified" : "Not verified"}
                  </p>
                </div>
              </div>
            ) : null}
            <div className="account-actions">
              <Link href="/shop" className="auth-secondary">
                Continue shopping
              </Link>
              <button type="button" className="auth-submit" onClick={onLogout}>
                Log out
              </button>
            </div>
            <p className="auth-hint">
              Orders and profile details will appear here in a future update.
            </p>
          </div>
        </div>
      </AuthPageLayout>
    </ProtectedRoute>
  );
}
