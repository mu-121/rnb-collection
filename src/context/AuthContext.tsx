"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  apiRequest,
  clearCustomerSession,
  getCachedCustomer,
  getToken,
  setCachedCustomer,
  setToken,
  setUnauthorizedHandler,
  type Customer,
} from "@/lib/api";

type AuthResult =
  | { ok: true }
  | { ok: false; error: string; needsVerification?: boolean };

type AuthContextValue = {
  customer: Customer | null;
  token: string | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<AuthResult>;
  register: (input: {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
  }) => Promise<AuthResult & { email?: string }>;
  logout: () => void;
  verifyEmail: (email: string, otp: string) => Promise<AuthResult>;
  resendVerification: (email: string) => Promise<AuthResult>;
  forgotPassword: (email: string) => Promise<AuthResult>;
  verifyResetOtp: (
    email: string,
    otp: string,
  ) => Promise<AuthResult & { resetToken?: string }>;
  resetPassword: (
    resetToken: string,
    password: string,
    confirmPassword?: string,
  ) => Promise<AuthResult>;
  loginWithGoogle: (credential: string) => Promise<AuthResult>;
  refreshProfile: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function toErrorMessage(error: unknown, fallback: string) {
  if (
    error &&
    typeof error === "object" &&
    "message" in error &&
    typeof (error as { message: unknown }).message === "string"
  ) {
    return (error as { message: string }).message;
  }
  return fallback;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [token, setTokenState] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const hydrated = useRef(false);

  const applySession = useCallback((nextToken: string, nextCustomer: Customer) => {
    setToken(nextToken);
    setCachedCustomer(nextCustomer);
    setTokenState(nextToken);
    setCustomer(nextCustomer);
  }, []);

  const clearSession = useCallback(() => {
    clearCustomerSession();
    setTokenState(null);
    setCustomer(null);
  }, []);

  const refreshProfile = useCallback(async () => {
    const data = await apiRequest<{ customer: Customer }>("/auth/profile", {
      auth: true,
    });
    setCachedCustomer(data.customer);
    setCustomer(data.customer);
  }, []);

  useEffect(() => {
    setUnauthorizedHandler(() => {
      setTokenState(null);
      setCustomer(null);
    });
    return () => setUnauthorizedHandler(null);
  }, []);

  useEffect(() => {
    if (hydrated.current) return;
    hydrated.current = true;

    async function restore() {
      const existing = getToken();
      if (!existing) {
        setLoading(false);
        return;
      }
      setTokenState(existing);
      const cached = getCachedCustomer();
      if (cached) setCustomer(cached);
      try {
        const data = await apiRequest<{ customer: Customer }>("/auth/profile", {
          auth: true,
        });
        setCachedCustomer(data.customer);
        setCustomer(data.customer);
      } catch {
        clearSession();
      } finally {
        setLoading(false);
      }
    }

    void restore();
  }, [clearSession]);

  const login = useCallback(
    async (email: string, password: string): Promise<AuthResult> => {
      try {
        const data = await apiRequest<{ token: string; customer: Customer }>(
          "/auth/login",
          { method: "POST", body: { email, password }, auth: false },
        );
        if (!data.customer || !data.token) {
          return { ok: false, error: "Invalid login response" };
        }
        applySession(data.token, data.customer);
        return { ok: true };
      } catch (error) {
        const status =
          error && typeof error === "object" && "status" in error
            ? Number((error as { status: unknown }).status)
            : 0;
        const errors =
          error && typeof error === "object" && "errors" in error
            ? (error as { errors?: unknown[] }).errors
            : [];
        const errorCode =
          Array.isArray(errors) &&
          errors.some(
            (item) =>
              item &&
              typeof item === "object" &&
              "errorCode" in item &&
              (item as { errorCode?: string }).errorCode === "EMAIL_NOT_VERIFIED",
          );
        const message = toErrorMessage(error, "Login failed");
        const needsVerification =
          status === 403 ||
          errorCode ||
          message.toLowerCase().includes("not verified");

        return { ok: false, error: message, needsVerification };
      }
    },
    [applySession],
  );

  const register = useCallback(
    async (input: {
      name: string;
      email: string;
      password: string;
      confirmPassword: string;
    }): Promise<AuthResult & { email?: string }> => {
      try {
        const data = await apiRequest<{
          email: string;
          emailVerificationRequired: boolean;
        }>("/auth/register", {
          method: "POST",
          body: input,
          auth: false,
        });
        return { ok: true, email: data.email || input.email };
      } catch (error) {
        return {
          ok: false,
          error: toErrorMessage(error, "Registration failed"),
        };
      }
    },
    [],
  );

  const logout = useCallback(() => {
    clearSession();
  }, [clearSession]);

  const verifyEmail = useCallback(
    async (email: string, otp: string): Promise<AuthResult> => {
      try {
        await apiRequest("/auth/verify-email", {
          method: "POST",
          body: { email, otp },
          auth: false,
        });
        return { ok: true };
      } catch (error) {
        return {
          ok: false,
          error: toErrorMessage(error, "Verification failed"),
        };
      }
    },
    [],
  );

  const resendVerification = useCallback(
    async (email: string): Promise<AuthResult> => {
      try {
        await apiRequest("/auth/resend-verification", {
          method: "POST",
          body: { email },
          auth: false,
        });
        return { ok: true };
      } catch (error) {
        return {
          ok: false,
          error: toErrorMessage(error, "Could not resend code"),
        };
      }
    },
    [],
  );

  const forgotPassword = useCallback(
    async (email: string): Promise<AuthResult> => {
      try {
        await apiRequest("/auth/forgot-password", {
          method: "POST",
          body: { email },
          auth: false,
        });
        return { ok: true };
      } catch (error) {
        return {
          ok: false,
          error: toErrorMessage(error, "Could not start password reset"),
        };
      }
    },
    [],
  );

  const verifyResetOtp = useCallback(
    async (
      email: string,
      otp: string,
    ): Promise<AuthResult & { resetToken?: string }> => {
      try {
        const data = await apiRequest<{ resetToken: string }>(
          "/auth/verify-reset-otp",
          { method: "POST", body: { email, otp }, auth: false },
        );
        return { ok: true, resetToken: data.resetToken };
      } catch (error) {
        return {
          ok: false,
          error: toErrorMessage(error, "Invalid or expired code"),
        };
      }
    },
    [],
  );

  const resetPassword = useCallback(
    async (
      resetToken: string,
      password: string,
      confirmPassword?: string,
    ): Promise<AuthResult> => {
      try {
        await apiRequest("/auth/reset-password", {
          method: "POST",
          body: { resetToken, password, confirmPassword },
          auth: false,
        });
        return { ok: true };
      } catch (error) {
        return {
          ok: false,
          error: toErrorMessage(error, "Could not reset password"),
        };
      }
    },
    [],
  );

  const loginWithGoogle = useCallback(
    async (credential: string): Promise<AuthResult> => {
      try {
        const data = await apiRequest<{ token: string; customer: Customer }>(
          "/auth/google",
          { method: "POST", body: { credential }, auth: false },
        );
        applySession(data.token, data.customer);
        return { ok: true };
      } catch (error) {
        return {
          ok: false,
          error: toErrorMessage(error, "Google sign-in failed"),
        };
      }
    },
    [applySession],
  );

  const isAuthenticated = Boolean(customer && token);

  const value = useMemo<AuthContextValue>(
    () => ({
      customer,
      token,
      loading,
      isAuthenticated,
      login,
      register,
      logout,
      verifyEmail,
      resendVerification,
      forgotPassword,
      verifyResetOtp,
      resetPassword,
      loginWithGoogle,
      refreshProfile,
    }),
    [
      customer,
      token,
      loading,
      isAuthenticated,
      login,
      register,
      logout,
      verifyEmail,
      resendVerification,
      forgotPassword,
      verifyResetOtp,
      resetPassword,
      loginWithGoogle,
      refreshProfile,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
