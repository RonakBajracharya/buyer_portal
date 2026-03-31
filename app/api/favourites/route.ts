import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/auth";
import { favouritesDB, PROPERTIES } from "@/lib/db";

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

// GET /api/favourites — list current user's favourites with property details
export async function GET(req: NextRequest) {
  const payload = getUserFromRequest(req);
  if (!payload) {
    return NextResponse.json(
      { success: false, message: "Not authenticated" },
      { status: 401 }
    );
  }

  const favs = favouritesDB.getByUser(payload.userId);
  const favPropertyIds = new Set(favs.map((f) => f.propertyId));

  // Return all properties annotated with isFavourite flag
  const properties = PROPERTIES.map((p) => ({
    ...p,
    isFavourite: favPropertyIds.has(p.id),
  }));

  return NextResponse.json({
    success: true,
    favourites: favs,
    properties,
  });
}

// POST /api/favourites — add a property to favourites
export async function POST(req: NextRequest) {
  const payload = getUserFromRequest(req);
  if (!payload) {
    return NextResponse.json(
      { success: false, message: "Not authenticated" },
      { status: 401 }
    );
  }

  let body: { propertyId?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { success: false, message: "Invalid request body" },
      { status: 400 }
    );
  }

  const { propertyId } = body;
  if (!propertyId || typeof propertyId !== "string") {
    return NextResponse.json(
      { success: false, message: "propertyId is required" },
      { status: 400 }
    );
  }

  // Validate property exists in catalogue
  const property = PROPERTIES.find((p) => p.id === propertyId);
  if (!property) {
    return NextResponse.json(
      { success: false, message: "Property not found" },
      { status: 404 }
    );
  }

  // Idempotent — don't add twice
  const existing = favouritesDB.find(payload.userId, propertyId);
  if (existing) {
    return NextResponse.json(
      { success: false, message: "Property is already in your favourites" },
      { status: 409 }
    );
  }

  const fav = favouritesDB.add({
    id: generateId(),
    userId: payload.userId,
    propertyId,
    addedAt: new Date().toISOString(),
  });

  return NextResponse.json({ success: true, favourite: fav }, { status: 201 });
}
