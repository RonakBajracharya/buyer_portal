"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import { useToast } from "@/components/Toast";
import PropertyCard, { PropertyData } from "@/components/PropertyCard";

type FilterTab = "all" | "favourites";

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading, logout } = useAuth();
  const toast = useToast();

  const [properties, setProperties] = useState<PropertyData[]>([]);
  const [fetching, setFetching] = useState(true);
  const [filter, setFilter] = useState<FilterTab>("all");
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [user, loading, router]);

  const fetchProperties = useCallback(async () => {
    try {
      const res = await fetch("/api/favourites");
      if (res.status === 401) { router.replace("/login"); return; }
      const data = await res.json();
      if (data.success) setProperties(data.properties);
    } catch {
      toast("Failed to load properties", "error");
    } finally {
      setFetching(false);
    }
  }, [router, toast]);

  useEffect(() => {
    if (user) fetchProperties();
  }, [user, fetchProperties]);

  const handleToggleFavourite = async (id: string, isFavourite: boolean) => {
    // Optimistic update
    setProperties((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isFavourite: !isFavourite } : p))
    );

    try {
      if (isFavourite) {
        const res = await fetch(`/api/favourites/${id}`, { method: "DELETE" });
        const data = await res.json();
        if (data.success) {
          toast("Removed from favourites", "info");
        } else {
          throw new Error(data.message);
        }
      } else {
        const res = await fetch("/api/favourites", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ propertyId: id }),
        });
        const data = await res.json();
        if (data.success) {
          toast("Added to favourites ♥", "success");
        } else {
          throw new Error(data.message);
        }
      }
    } catch (err) {
      // Revert on failure
      setProperties((prev) =>
        prev.map((p) => (p.id === id ? { ...p, isFavourite } : p))
      );
      toast(err instanceof Error ? err.message : "Something went wrong", "error");
    }
  };

  const handleLogout = async () => {
    await logout();
    router.replace("/login");
  };

  const displayed =
    filter === "all" ? properties : properties.filter((p) => p.isFavourite);
  const favouriteCount = properties.filter((p) => p.isFavourite).length;

  if (loading || !user) return null;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--warm-white)",
        opacity: mounted ? 1 : 0,
        transition: "opacity 0.4s ease",
      }}
    >
      {/* ── Nav ── */}
      <nav
        style={{
          background: "white",
          borderBottom: "1px solid var(--stone-light)",
          padding: "0 2rem",
          height: "64px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "sticky",
          top: 0,
          zIndex: 100,
        }}
      >
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.7rem" }}>
          <div
            style={{
              width: "32px",
              height: "32px",
              border: "1.5px solid var(--ink)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
              <path d="M9 1L1 7v10h5v-5h6v5h5V7L9 1z" stroke="#0f0e0c" strokeWidth="1.2" strokeLinejoin="round" />
            </svg>
          </div>
          <span
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "1.35rem",
              letterSpacing: "0.04em",
              fontWeight: 400,
            }}
          >
            Estatly
          </span>
        </div>

        {/* User info + logout */}
        <div style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
          <div style={{ textAlign: "right" }}>
            <div
              style={{
                fontSize: "0.85rem",
                fontWeight: 500,
                color: "var(--ink)",
              }}
            >
              {user.name}
            </div>
            <div
              style={{
                fontSize: "0.7rem",
                color: "var(--stone)",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
              }}
            >
              {user.role}
            </div>
          </div>

          {/* Avatar */}
          <div
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              background: "var(--ink)",
              color: "var(--gold-light)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "1rem",
              fontWeight: 500,
            }}
          >
            {user.name.charAt(0).toUpperCase()}
          </div>

          <button
            onClick={handleLogout}
            style={{
              background: "none",
              border: "1.5px solid var(--stone-light)",
              borderRadius: "6px",
              padding: "0.4rem 0.9rem",
              fontSize: "0.8rem",
              cursor: "pointer",
              color: "var(--stone)",
              fontFamily: "'DM Sans', sans-serif",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "var(--ink)";
              e.currentTarget.style.color = "var(--ink)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "var(--stone-light)";
              e.currentTarget.style.color = "var(--stone)";
            }}
          >
            Sign out
          </button>
        </div>
      </nav>

      {/* ── Hero strip ── */}
      <div
        style={{
          background: "var(--ink)",
          padding: "3rem 2rem",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background glow */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: "radial-gradient(ellipse at 70% 50%, rgba(201,168,76,0.07) 0%, transparent 60%)",
          }}
        />
        <div style={{ maxWidth: "1200px", margin: "0 auto", position: "relative" }}>
          <p
            style={{
              fontSize: "0.75rem",
              color: "var(--stone)",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              marginBottom: "0.5rem",
            }}
          >
            Buyer Portal
          </p>
          <h1
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "clamp(1.8rem, 3vw, 2.5rem)",
              color: "var(--cream)",
              fontWeight: 300,
              marginBottom: "0.5rem",
            }}
          >
            Good to see you,{" "}
            <em style={{ color: "var(--gold-light)", fontStyle: "italic" }}>
              {user.name.split(" ")[0]}
            </em>
          </h1>
          <p style={{ color: "var(--stone)", fontSize: "0.875rem" }}>
            {favouriteCount > 0
              ? `You have ${favouriteCount} propert${favouriteCount === 1 ? "y" : "ies"} saved to your shortlist.`
              : "Browse our curated listings and save properties you love."}
          </p>
        </div>
      </div>

      {/* ── Main content ── */}
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "2rem" }}>

        {/* Filter tabs + count */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "1.75rem",
            flexWrap: "wrap",
            gap: "1rem",
          }}
        >
          <div style={{ display: "flex", gap: "0", borderBottom: "2px solid var(--stone-light)" }}>
            {(["all", "favourites"] as FilterTab[]).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                style={{
                  padding: "0.6rem 1.2rem",
                  background: "none",
                  border: "none",
                  borderBottom: filter === f ? "2px solid var(--ink)" : "2px solid transparent",
                  marginBottom: "-2px",
                  cursor: "pointer",
                  fontSize: "0.85rem",
                  fontWeight: filter === f ? 500 : 400,
                  color: filter === f ? "var(--ink)" : "var(--stone)",
                  fontFamily: "'DM Sans', sans-serif",
                  transition: "color 0.2s",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.4rem",
                }}
              >
                {f === "favourites" ? (
                  <>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill={filter === "favourites" ? "var(--ink)" : "none"} stroke="currentColor" strokeWidth="2">
                      <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
                    </svg>
                    My Favourites
                    {favouriteCount > 0 && (
                      <span
                        style={{
                          background: "var(--gold)",
                          color: "white",
                          borderRadius: "10px",
                          padding: "1px 7px",
                          fontSize: "0.7rem",
                          fontWeight: 600,
                        }}
                      >
                        {favouriteCount}
                      </span>
                    )}
                  </>
                ) : (
                  "All Properties"
                )}
              </button>
            ))}
          </div>

          <p style={{ fontSize: "0.8rem", color: "var(--stone)" }}>
            {fetching ? "Loading..." : `${displayed.length} listing${displayed.length !== 1 ? "s" : ""}`}
          </p>
        </div>

        {/* Grid */}
        {fetching ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gap: "1.5rem",
            }}
          >
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : displayed.length === 0 ? (
          <EmptyState filter={filter} onBrowse={() => setFilter("all")} />
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gap: "1.5rem",
            }}
          >
            {displayed.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                onToggleFavourite={handleToggleFavourite}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div
      style={{
        background: "white",
        borderRadius: "10px",
        overflow: "hidden",
        border: "1px solid var(--stone-light)",
      }}
    >
      <div
        style={{
          height: "200px",
          background: "linear-gradient(90deg, var(--cream) 25%, var(--stone-light) 50%, var(--cream) 75%)",
          backgroundSize: "200% 100%",
          animation: "shimmer 1.4s infinite",
        }}
      />
      <style>{`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
      <div style={{ padding: "1.25rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        {[120, 80, 60].map((w) => (
          <div
            key={w}
            style={{
              height: "14px",
              width: `${w}px`,
              background: "var(--cream)",
              borderRadius: "4px",
            }}
          />
        ))}
      </div>
    </div>
  );
}

function EmptyState({ filter, onBrowse }: { filter: FilterTab; onBrowse: () => void }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "5rem 2rem",
        textAlign: "center",
      }}
    >
      <div
        style={{
          width: "72px",
          height: "72px",
          borderRadius: "50%",
          background: "var(--cream)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "1.5rem",
        }}
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--stone)" strokeWidth="1.5">
          <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
        </svg>
      </div>
      <h3
        style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: "1.4rem",
          fontWeight: 400,
          marginBottom: "0.5rem",
        }}
      >
        {filter === "favourites" ? "No favourites yet" : "No properties found"}
      </h3>
      <p style={{ color: "var(--stone)", fontSize: "0.85rem", marginBottom: "1.5rem" }}>
        {filter === "favourites"
          ? "Browse listings and tap the heart icon to save properties you love."
          : "Check back soon for new listings."}
      </p>
      {filter === "favourites" && (
        <button
          onClick={onBrowse}
          style={{
            background: "var(--ink)",
            color: "var(--cream)",
            border: "none",
            borderRadius: "6px",
            padding: "0.7rem 1.5rem",
            fontSize: "0.85rem",
            cursor: "pointer",
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          Browse all listings
        </button>
      )}
    </div>
  );
}
