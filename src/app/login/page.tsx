"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { GuestRoute } from "@/components/auth/AuthGuards";
import AuthPageLayout, { AuthFooterLinks } from "@/components/auth/AuthPageLayout";
import { AuthShell, PasswordField } from "@/components/auth/AuthShell";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (!email.trim() || !password) {
      setError("Email and password are required");
      return;
    }
    setLoading(true);
    setError("");
    const result = await login(email.trim(), password);
    setLoading(false);
    if (!result.ok) {
      if (result.needsVerification) {
        router.push(
          `/verify-email?email=${encodeURIComponent(email.trim())}&sent=1`,
        );
        return;
      }
      setError(result.error);
      return;
    }
    router.replace("/account");
  }

  return (
    <GuestRoute>
      <AuthPageLayout>
        <AuthShell
          title="Welcome back"
          subtitle="Sign in to your RNB Collections account"
          showGoogle
          footer={
            <AuthFooterLinks
              prompt="New here?"
              href="/register"
              label="Create an account"
            />
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
                placeholder="you@example.com"
                required
              />
            </label>
            <PasswordField
              label="Password"
              value={password}
              onChange={setPassword}
              autoComplete="current-password"
            />
            <div className="auth-row">
              <Link href="/forgot-password">Forgot password?</Link>
            </div>
            {error ? (
              <p className="auth-error" role="alert">
                {error}
              </p>
            ) : null}
            <button className="auth-submit" type="submit" disabled={loading}>
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>
        </AuthShell>
      </AuthPageLayout>
    </GuestRoute>
  );
}
