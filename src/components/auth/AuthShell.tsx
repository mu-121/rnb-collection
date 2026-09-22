"use client";

import Image from "next/image";
import Link from "next/link";
import { GoogleLogin } from "@react-oauth/google";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

type AuthShellProps = {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  showGoogle?: boolean;
};

export function AuthShell({
  title,
  subtitle,
  children,
  footer,
  showGoogle = false,
}: AuthShellProps) {
  const { loginWithGoogle } = useAuth();
  const router = useRouter();
  const [googleError, setGoogleError] = useState("");
  const [googleLoading, setGoogleLoading] = useState(false);
  const googleEnabled = Boolean(process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID);

  return (
    <div className="auth-page">
      <div className="auth-card">
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
          <Link href="/" className="auth-card__back">
            Back to shop
          </Link>
        </div>

        <div className="auth-card__brand">
          <h1>{title}</h1>
          <p className="auth-card__subtitle">{subtitle}</p>
        </div>

        {children}

        {showGoogle && googleEnabled ? (
          <div className="auth-google">
            <div className="auth-divider" aria-hidden="true">
              <span>or continue with</span>
            </div>
            <div className={`auth-google__btn${googleLoading ? " is-loading" : ""}`}>
              <GoogleLogin
                onSuccess={async (response) => {
                  if (!response.credential) {
                    setGoogleError("Google sign-in failed");
                    return;
                  }
                  setGoogleLoading(true);
                  setGoogleError("");
                  const result = await loginWithGoogle(response.credential);
                  setGoogleLoading(false);
                  if (!result.ok) {
                    setGoogleError(result.error);
                    return;
                  }
                  router.replace("/account");
                }}
                onError={() => setGoogleError("Google sign-in failed")}
                theme="outline"
                shape="rectangular"
                width="320"
                text="continue_with"
              />
            </div>
            {googleError ? (
              <p className="auth-error" role="alert">
                {googleError}
              </p>
            ) : null}
          </div>
        ) : null}

        {footer ? <div className="auth-footer">{footer}</div> : null}
      </div>
    </div>
  );
}

export function PasswordField({
  label,
  value,
  onChange,
  autoComplete,
  required = true,
  hint,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  autoComplete?: string;
  required?: boolean;
  hint?: string;
}) {
  const [visible, setVisible] = useState(false);
  return (
    <label className="auth-field">
      <span>{label}</span>
      <div className="auth-field__password">
        <input
          type={visible ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          autoComplete={autoComplete}
          required={required}
          minLength={required ? 8 : undefined}
        />
        <button
          type="button"
          className="auth-field__toggle"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? "Hide password" : "Show password"}
        >
          {visible ? "Hide" : "Show"}
        </button>
      </div>
      {hint ? <span className="auth-field__hint">{hint}</span> : null}
    </label>
  );
}
