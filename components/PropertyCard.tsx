"use client";

import { useState } from "react";

export interface PropertyData {
  id: string;
  title: string;
  location: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  imageUrl: string;
  type: string;
  isFavourite: boolean;
}

interface PropertyCardProps {
  property: PropertyData;
  onToggleFavourite: (id: string, isFavourite: boolean) => Promise<void>;
}

function formatPrice(price: number): string {
  if (price >= 10000000) return `₹${(price / 10000000).toFixed(1)} Cr`;
  if (price >= 100000) return `₹${(price / 100000).toFixed(0)} L`;
  return `₹${price.toLocaleString("en-IN")}`;
}

export default function PropertyCard({ property, onToggleFavourite }: PropertyCardProps) {
  const [loading, setLoading] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [heartHovered, setHeartHovered] = useState(false);

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (loading) return;
    setLoading(true);
    await onToggleFavourite(property.id, property.isFavourite);
    setLoading(false);
  };

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "white",
        borderRadius: "10px",
        overflow: "hidden",
        border: "1px solid var(--stone-light)",
        transition: "transform 0.25s ease, box-shadow 0.25s ease",
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
        boxShadow: hovered
          ? "0 12px 32px rgba(15,14,12,0.12)"
          : "0 2px 8px rgba(15,14,12,0.05)",
        position: "relative",
      }}
    >
      {/* Image */}
      <div style={{ position: "relative", height: "200px", overflow: "hidden" }}>
        <img
          src={property.imageUrl}
          alt={property.title}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transition: "transform 0.4s ease",
            transform: hovered ? "scale(1.04)" : "scale(1)",
          }}
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80";
          }}
        />

        {/* Type badge */}
        <div
          style={{
            position: "absolute",
            top: "12px",
            left: "12px",
            background: "rgba(15,14,12,0.75)",
            backdropFilter: "blur(4px)",
            color: "var(--cream)",
            fontSize: "0.7rem",
            padding: "3px 10px",
            borderRadius: "20px",
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            fontWeight: 500,
          }}
        >
          {property.type}
        </div>

        {/* Heart button */}
        <button
          onClick={handleToggle}
          onMouseEnter={() => setHeartHovered(true)}
          onMouseLeave={() => setHeartHovered(false)}
          disabled={loading}
          aria-label={property.isFavourite ? "Remove from favourites" : "Add to favourites"}
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            width: "36px",
            height: "36px",
            borderRadius: "50%",
            border: "none",
            background: property.isFavourite
              ? "var(--gold)"
              : "rgba(255,255,255,0.9)",
            backdropFilter: "blur(4px)",
            cursor: loading ? "wait" : "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.2s",
            transform:
              heartHovered && !loading ? "scale(1.15)" : "scale(1)",
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
          }}
        >
          {loading ? (
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke={property.isFavourite ? "white" : "var(--stone)"}
              strokeWidth="2.5"
              style={{ animation: "spin 0.7s linear infinite" }}
            >
              <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
              <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4" />
            </svg>
          ) : (
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill={property.isFavourite ? "white" : "none"}
              stroke={property.isFavourite ? "var(--gold)" : "var(--stone)"}
              strokeWidth="2"
            >
              <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
            </svg>
          )}
        </button>
      </div>

      {/* Content */}
      <div style={{ padding: "1.25rem" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: "0.5rem",
          }}
        >
          <h3
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "1.15rem",
              fontWeight: 500,
              lineHeight: 1.3,
              flex: 1,
              paddingRight: "0.5rem",
            }}
          >
            {property.title}
          </h3>
          <span
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "1.1rem",
              fontWeight: 600,
              color: "var(--gold-muted)",
              whiteSpace: "nowrap",
            }}
          >
            {formatPrice(property.price)}
          </span>
        </div>

        <p
          style={{
            fontSize: "0.8rem",
            color: "var(--stone)",
            marginBottom: "1rem",
            display: "flex",
            alignItems: "center",
            gap: "0.3rem",
          }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          {property.location}
        </p>

        {/* Stats row */}
        <div
          style={{
            display: "flex",
            gap: "0",
            borderTop: "1px solid var(--cream)",
            paddingTop: "0.875rem",
          }}
        >
          {[
            {
              icon: (
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              ),
              value: property.bedrooms,
              label: "Beds",
            },
            {
              icon: (
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 12h16M4 6h16M4 18h7" />
                </svg>
              ),
              value: property.bathrooms,
              label: "Baths",
            },
            {
              icon: (
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                </svg>
              ),
              value: `${property.sqft.toLocaleString()}`,
              label: "Sq.ft",
            },
          ].map((stat, i) => (
            <div
              key={stat.label}
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "0.2rem",
                borderRight: i < 2 ? "1px solid var(--cream)" : "none",
                padding: "0 0.5rem",
              }}
            >
              <div style={{ color: "var(--stone)", display: "flex", alignItems: "center" }}>
                {stat.icon}
              </div>
              <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--ink)" }}>
                {stat.value}
              </span>
              <span style={{ fontSize: "0.68rem", color: "var(--stone)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
