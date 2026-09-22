"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { GuestRoute } from "@/components/auth/AuthGuards";
import AuthPageLayout, { AuthFooterLinks } from "@/components/auth/AuthPageLayout";
import { AuthShell, PasswordField } from "@/components/auth/AuthShell";
import { useAuth } from "@/context/AuthContext";

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (name.trim().length < 2) {
      setError("Please enter your full name");
      return;
    }
    if (password.length < 8 || !/[A-Za-z]/.test(password) || !/[0-9]/.test(password)) {
      setError("Password must be at least 8 characters and include a letter and a number");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    setError("");
    const result = await register({
      name: name.trim(),
      email: email.trim(),
      password,
      confirmPassword,
    });
    setLoading(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    router.push(`/verify-email?email=${encodeURIComponent(result.email || email.trim())}`);
  }

  return (
    <GuestRoute>
      <AuthPageLayout>
        <AuthShell
          title="Create account"
          subtitle="Join RNB Collections to track orders and manage your profile"
          showGoogle
          footer={
            <AuthFooterLinks
              prompt="Already have an account?"
              href="/login"
              label="Sign in"
            />
          }
        >
          <form className="auth-form" onSubmit={onSubmit} noValidate>
            <label className="auth-field">
              <span>Name</span>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
                placeholder="Your name"
                required
                minLength={2}
              />
            </label>
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
            <button className="auth-submit" type="submit" disabled={loading}>
              {loading ? "Creating account..." : "Create account"}
            </button>
          </form>
        </AuthShell>
      </AuthPageLayout>
    </GuestRoute>
  );
}
