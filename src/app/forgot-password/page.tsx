"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { GuestRoute } from "@/components/auth/AuthGuards";
import AuthPageLayout from "@/components/auth/AuthPageLayout";
import { AuthShell } from "@/components/auth/AuthShell";
import OtpInput from "@/components/auth/OtpInput";
import { useAuth } from "@/context/AuthContext";

export default function ForgotPasswordPage() {
  const { forgotPassword, verifyResetOtp } = useAuth();
  const router = useRouter();
  const [step, setStep] = useState<"email" | "otp">("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown <= 0) return;
    const id = window.setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => window.clearTimeout(id);
  }, [cooldown]);

  async function onSendEmail(event: FormEvent) {
    event.preventDefault();
    if (!email.trim()) {
      setError("Email is required");
      return;
    }
    setLoading(true);
    setError("");
    setMessage("");
    const result = await forgotPassword(email.trim());
    setLoading(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setMessage("If an account exists for this email, a reset code has been sent.");
    setStep("otp");
    setCooldown(60);
  }

  async function onResend() {
    if (!email.trim() || cooldown > 0) return;
    setError("");
    setMessage("");
    const result = await forgotPassword(email.trim());
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setMessage("If an account exists for this email, a reset code has been sent.");
    setCooldown(60);
  }

  async function onVerifyOtp(event: FormEvent) {
    event.preventDefault();
    if (otp.length !== 6) {
      setError("Enter the 6-digit code from your email");
      return;
    }
    setLoading(true);
    setError("");
    const result = await verifyResetOtp(email.trim(), otp);
    setLoading(false);
    if (!result.ok || !result.resetToken) {
      setError(!result.ok ? result.error : "Invalid code");
      return;
    }
    router.push(`/reset-password?token=${encodeURIComponent(result.resetToken)}`);
  }

  return (
    <GuestRoute>
      <AuthPageLayout>
        <AuthShell
          title="Forgot password"
          subtitle={
            step === "email"
              ? "Enter your email to receive a reset code"
              : "Enter the 6-digit code from your email"
          }
          footer={
            <p>
              <Link href="/login">Back to login</Link>
            </p>
          }
        >
          {step === "email" ? (
            <form className="auth-form" onSubmit={onSendEmail} noValidate>
              <label className="auth-field">
                <span>Email</span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  placeholder="you@example.com"
                  required
                />
              </label>
              {error ? (
                <p className="auth-error" role="alert">
                  {error}
                </p>
              ) : null}
              {message ? <p className="auth-success">{message}</p> : null}
              <button className="auth-submit" type="submit" disabled={loading}>
                {loading ? "Sending..." : "Send reset code"}
              </button>
            </form>
          ) : (
            <form className="auth-form" onSubmit={onVerifyOtp} noValidate>
              <label className="auth-field">
                <span>Email</span>
                <input type="email" value={email} readOnly />
              </label>
              <div className="auth-field">
                <span>Reset code</span>
                <OtpInput
                  value={otp}
                  onChange={setOtp}
                  error={Boolean(error)}
                  disabled={loading}
                />
              </div>
              {error ? (
                <p className="auth-error" role="alert">
                  {error}
                </p>
              ) : null}
              {message ? <p className="auth-success">{message}</p> : null}
              <button
                className="auth-submit"
                type="submit"
                disabled={loading || otp.length !== 6}
              >
                {loading ? "Checking..." : "Continue"}
              </button>
              <button
                type="button"
                className="auth-secondary"
                onClick={onResend}
                disabled={cooldown > 0}
              >
                {cooldown > 0 ? `Resend code in ${cooldown}s` : "Resend code"}
              </button>
              <button
                type="button"
                className="auth-text-btn"
                onClick={() => {
                  setStep("email");
                  setOtp("");
                  setError("");
                  setMessage("");
                }}
              >
                Use a different email
              </button>
            </form>
          )}
        </AuthShell>
      </AuthPageLayout>
    </GuestRoute>
  );
}
