"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";

type Tab = "login" | "register";

interface FieldError {
  field: string;
  message: string;
}

export default function LoginPage() {
  const router = useRouter();
  const { user, loading, login, register } = useAuth();

  const [tab, setTab] = useState<Tab>("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<FieldError[]>([]);
  const [globalError, setGlobalError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!loading && user) router.replace("/dashboard");
  }, [user, loading, router]);

  const fieldError = (field: string) =>
    errors.find((e) => e.field === field)?.message;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors([]);
    setGlobalError("");
    setSubmitting(true);

    let result: { success: boolean; error?: string };

    if (tab === "login") {
      result = await login(email, password);
    } else {
      result = await register(name, email, password);
    }

    setSubmitting(false);

    if (result.success) {
      router.push("/dashboard");
    } else {
      setGlobalError(result.error || "Something went wrong");
    }
  };

  const switchTab = (t: Tab) => {
    setTab(t);
    setErrors([]);
    setGlobalError("");
  };

  if (loading || user) return null;

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        background: "var(--warm-white)",
      }}
    >
      {/* ── Left panel: branding ── */}
      <div
        style={{
          background: "var(--ink)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "3rem",
          position: "relative",
          overflow: "hidden",
        }}
        className="hidden md:flex"
      >
        {/* Background texture */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `
              radial-gradient(ellipse at 20% 50%, rgba(201,168,76,0.08) 0%, transparent 60%),
              radial-gradient(ellipse at 80% 20%, rgba(201,168,76,0.05) 0%, transparent 50%)
            `,
          }}
        />

        {/* Logo */}
        <div style={{ position: "relative", zIndex: 1 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
            }}
          >
            <div
              style={{
                width: "36px",
                height: "36px",
                border: "1.5px solid var(--gold)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M9 1L1 7v10h5v-5h6v5h5V7L9 1z" stroke="#c9a84c" strokeWidth="1.2" strokeLinejoin="round" />
              </svg>
            </div>
            <span
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "1.5rem",
                color: "var(--cream)",
                letterSpacing: "0.05em",
                fontWeight: 400,
              }}
            >
              Estatly
            </span>
          </div>
        </div>

        {/* Hero copy */}
        <div style={{ position: "relative", zIndex: 1 }}>
          <div
            style={{
              width: "40px",
              height: "1px",
              background: "var(--gold)",
              marginBottom: "2rem",
            }}
          />
          <h1
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "clamp(2.5rem, 4vw, 3.5rem)",
              color: "var(--cream)",
              fontWeight: 300,
              lineHeight: 1.15,
              marginBottom: "1.5rem",
              letterSpacing: "-0.01em",
            }}
          >
            Your curated
            <br />
            <em style={{ color: "var(--gold-light)", fontStyle: "italic" }}>
              property
            </em>
            <br />
            shortlist awaits.
          </h1>
          <p
            style={{
              color: "var(--stone)",
              fontSize: "0.9rem",
              lineHeight: 1.7,
              maxWidth: "320px",
              fontWeight: 300,
            }}
          >
            Save properties, track your search, and connect with our brokers — all from one private portal.
          </p>
        </div>

        {/* Stat row */}
        <div
          style={{
            display: "flex",
            gap: "3rem",
            position: "relative",
            zIndex: 1,
            borderTop: "1px solid rgba(255,255,255,0.08)",
            paddingTop: "2rem",
          }}
        >
          {[
            { value: "₹2,400Cr", label: "Inventory" },
            { value: "340+", label: "Properties" },
            { value: "12 Yrs", label: "Experience" },
          ].map((s) => (
            <div key={s.label}>
              <div
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "1.4rem",
                  color: "var(--gold-light)",
                  fontWeight: 500,
                }}
              >
                {s.value}
              </div>
              <div style={{ color: "var(--stone)", fontSize: "0.75rem", marginTop: "0.2rem" }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Right panel: form ── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "2rem",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "400px",
            opacity: mounted ? 1 : 0,
            transform: mounted ? "translateY(0)" : "translateY(16px)",
            transition: "opacity 0.5s ease, transform 0.5s ease",
          }}
        >
          {/* Mobile logo */}
          <div
            className="md:hidden"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.6rem",
              marginBottom: "2.5rem",
            }}
          >
            <div
              style={{
                width: "30px",
                height: "30px",
                border: "1.5px solid var(--ink)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg width="14" height="14" viewBox="0 0 18 18" fill="none">
                <path d="M9 1L1 7v10h5v-5h6v5h5V7L9 1z" stroke="#0f0e0c" strokeWidth="1.2" strokeLinejoin="round" />
              </svg>
            </div>
            <span
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "1.3rem",
                letterSpacing: "0.05em",
              }}
            >
              Estatly
            </span>
          </div>

          {/* Heading */}
          <div style={{ marginBottom: "2.5rem" }}>
            <h2
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "2rem",
                fontWeight: 400,
                marginBottom: "0.4rem",
                letterSpacing: "-0.01em",
              }}
            >
              {tab === "login" ? "Welcome back" : "Create account"}
            </h2>
            <p style={{ color: "var(--stone)", fontSize: "0.85rem" }}>
              {tab === "login"
                ? "Sign in to access your property shortlist"
                : "Start curating your dream property collection"}
            </p>
          </div>

          {/* Tab switcher */}
          <div
            style={{
              display: "flex",
              background: "var(--cream)",
              borderRadius: "6px",
              padding: "3px",
              marginBottom: "2rem",
            }}
          >
            {(["login", "register"] as Tab[]).map((t) => (
              <button
                key={t}
                onClick={() => switchTab(t)}
                style={{
                  flex: 1,
                  padding: "0.5rem",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "0.85rem",
                  fontWeight: 500,
                  transition: "all 0.2s",
                  background: tab === t ? "white" : "transparent",
                  color: tab === t ? "var(--ink)" : "var(--stone)",
                  boxShadow: tab === t ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                {t === "login" ? "Sign In" : "Register"}
              </button>
            ))}
          </div>

          {/* Global error */}
          {globalError && (
            <div
              style={{
                background: "#fdf2f2",
                border: "1px solid #f5c6c6",
                borderRadius: "6px",
                padding: "0.75rem 1rem",
                marginBottom: "1.25rem",
                fontSize: "0.85rem",
                color: "var(--error)",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              <svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {globalError}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.1rem" }}>
            {tab === "register" && (
              <FormField
                label="Full Name"
                error={fieldError("name")}
              >
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Arjun Mehta"
                  autoComplete="name"
                  style={inputStyle}
                />
              </FormField>
            )}

            <FormField label="Email Address" error={fieldError("email")}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="arjun@example.com"
                autoComplete="email"
                style={inputStyle}
              />
            </FormField>

            <FormField label="Password" error={fieldError("password")}>
              <div style={{ position: "relative" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={tab === "register" ? "Min. 8 characters" : "Your password"}
                  autoComplete={tab === "login" ? "current-password" : "new-password"}
                  style={{ ...inputStyle, paddingRight: "3rem" }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: "absolute",
                    right: "0.75rem",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "var(--stone)",
                    padding: "2px",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  {showPassword ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24M1 1l22 22" />
                    </svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </FormField>

            <button
              type="submit"
              disabled={submitting}
              style={{
                marginTop: "0.5rem",
                padding: "0.875rem",
                background: submitting ? "var(--stone-light)" : "var(--ink)",
                color: submitting ? "var(--stone)" : "var(--cream)",
                border: "none",
                borderRadius: "6px",
                fontSize: "0.9rem",
                fontWeight: 500,
                cursor: submitting ? "not-allowed" : "pointer",
                transition: "all 0.2s",
                fontFamily: "'DM Sans', sans-serif",
                letterSpacing: "0.02em",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
              }}
            >
              {submitting ? (
                <>
                  <Spinner />
                  {tab === "login" ? "Signing in..." : "Creating account..."}
                </>
              ) : tab === "login" ? (
                "Sign In"
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          {/* Divider */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              margin: "1.5rem 0",
            }}
          >
            <div style={{ flex: 1, height: "1px", background: "var(--stone-light)" }} />
            <span style={{ fontSize: "0.75rem", color: "var(--stone)" }}>
              {tab === "login" ? "New here?" : "Already have an account?"}
            </span>
            <div style={{ flex: 1, height: "1px", background: "var(--stone-light)" }} />
          </div>

          <button
            onClick={() => switchTab(tab === "login" ? "register" : "login")}
            style={{
              width: "100%",
              padding: "0.75rem",
              background: "transparent",
              border: "1.5px solid var(--stone-light)",
              borderRadius: "6px",
              fontSize: "0.85rem",
              color: "var(--ink)",
              cursor: "pointer",
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 400,
              transition: "border-color 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--ink)")}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--stone-light)")}
          >
            {tab === "login" ? "Create a free account" : "Sign in instead"}
          </button>
        </div>
      </div>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "0.75rem 0.875rem",
  border: "1.5px solid var(--stone-light)",
  borderRadius: "6px",
  fontSize: "0.9rem",
  background: "white",
  color: "var(--ink)",
  outline: "none",
  transition: "border-color 0.2s",
  fontFamily: "'DM Sans', sans-serif",
};

function FormField({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
      <label
        style={{
          fontSize: "0.78rem",
          fontWeight: 500,
          color: "var(--ink)",
          letterSpacing: "0.03em",
          textTransform: "uppercase",
        }}
      >
        {label}
      </label>
      {children}
      {error && (
        <span style={{ fontSize: "0.78rem", color: "var(--error)" }}>{error}</span>
      )}
    </div>
  );
}

function Spinner() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      style={{ animation: "spin 0.7s linear infinite" }}
    >
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
    </svg>
  );
}
