"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState, type FormEvent } from "react";
import { GuestRoute } from "@/components/auth/AuthGuards";
import AuthPageLayout from "@/components/auth/AuthPageLayout";
import { AuthShell } from "@/components/auth/AuthShell";
import OtpInput from "@/components/auth/OtpInput";
import { useAuth } from "@/context/AuthContext";

function VerifyEmailForm() {
  const { verifyEmail, resendVerification } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    const fromQuery = searchParams.get("email");
    if (fromQuery) setEmail(fromQuery);
  }, [searchParams]);

  useEffect(() => {
    if (cooldown <= 0) return;
    const id = window.setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => window.clearTimeout(id);
  }, [cooldown]);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (otp.length !== 6) {
      setError("Enter the 6-digit code from your email");
      return;
    }
    setLoading(true);
    setError("");
    setMessage("");
    const result = await verifyEmail(email.trim(), otp);
    setLoading(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setMessage("Email verified successfully. Redirecting to login...");
    window.setTimeout(() => router.replace("/login"), 900);
  }

  async function onResend() {
    if (!email.trim() || cooldown > 0) return;
    setError("");
    setMessage("");
    const result = await resendVerification(email.trim());
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setMessage("If an unverified account exists, a new code has been sent.");
    setCooldown(60);
  }

  return (
    <AuthShell
      title="Verify email"
      subtitle="Enter the 6-digit code we sent to your inbox"
      footer={
        <p>
          <Link href="/login">Back to login</Link>
        </p>
      }
    >
      <form className="auth-form" onSubmit={onSubmit} noValidate>
        <label className="auth-field">
          <span>Email</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
          />
        </label>
        <div className="auth-field">
          <span>Verification code</span>
          <OtpInput value={otp} onChange={setOtp} error={Boolean(error)} disabled={loading} />
        </div>
        {error ? (
          <p className="auth-error" role="alert">
            {error}
          </p>
        ) : null}
        {message ? <p className="auth-success">{message}</p> : null}
        <button className="auth-submit" type="submit" disabled={loading || otp.length !== 6}>
          {loading ? "Verifying..." : "Verify email"}
        </button>
        <button
          type="button"
          className="auth-secondary"
          onClick={onResend}
          disabled={!email.trim() || cooldown > 0}
        >
          {cooldown > 0 ? `Resend code in ${cooldown}s` : "Resend code"}
        </button>
      </form>
    </AuthShell>
  );
}

export default function VerifyEmailPage() {
  return (
    <GuestRoute>
      <AuthPageLayout>
        <Suspense
          fallback={
            <div className="auth-page">
              <div className="auth-card">Loading...</div>
            </div>
          }
        >
          <VerifyEmailForm />
        </Suspense>
      </AuthPageLayout>
    </GuestRoute>
  );
}
