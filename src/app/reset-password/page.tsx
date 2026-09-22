"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState, type FormEvent } from "react";
import { GuestRoute } from "@/components/auth/AuthGuards";
import AuthPageLayout from "@/components/auth/AuthPageLayout";
import { AuthShell, PasswordField } from "@/components/auth/AuthShell";
import { useAuth } from "@/context/AuthContext";

function ResetPasswordForm() {
  const { resetPassword } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [resetToken, setResetToken] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = searchParams.get("token");
    if (token) setResetToken(token);
  }, [searchParams]);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (password.length < 8 || !/[A-Za-z]/.test(password) || !/[0-9]/.test(password)) {
      setError("Password must be at least 8 characters and include a letter and a number");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (!resetToken) {
      setError("Missing reset token. Request a new password reset.");
      return;
    }
    setLoading(true);
    setError("");
    setMessage("");
    const result = await resetPassword(resetToken, password, confirmPassword);
    setLoading(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setMessage("Password reset successfully. Redirecting to login...");
    window.setTimeout(() => router.replace("/login"), 1000);
  }

  return (
    <AuthShell
      title="Reset password"
      subtitle="Choose a new password for your RNB Collections account"
      footer={
        <p>
          <Link href="/login">Back to login</Link>
          {" · "}
          <Link href="/forgot-password">Request a new code</Link>
        </p>
      }
    >
      <form className="auth-form" onSubmit={onSubmit} noValidate>
        {!resetToken ? (
          <p className="auth-error" role="alert">
            Missing reset token. Please start again from forgot password.
          </p>
        ) : null}
        <PasswordField
          label="New password"
          value={password}
          onChange={setPassword}
          autoComplete="new-password"
          hint="At least 8 characters, with a letter and a number"
        />
        <PasswordField
          label="Confirm password"
          value={confirmPassword}
          onChange={setConfirmPassword}
          autoComplete="new-password"
        />
        {error ? (
          <p className="auth-error" role="alert">
            {error}
          </p>
        ) : null}
        {message ? <p className="auth-success">{message}</p> : null}
        <button
          className="auth-submit"
          type="submit"
          disabled={loading || !resetToken}
        >
          {loading ? "Saving..." : "Reset password"}
        </button>
      </form>
    </AuthShell>
  );
}

export default function ResetPasswordPage() {
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
          <ResetPasswordForm />
        </Suspense>
      </AuthPageLayout>
    </GuestRoute>
  );
}
