import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/auth";
import { favouritesDB, PROPERTIES } from "@/lib/db";

// DELETE /api/favourites/:propertyId — remove from favourites
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ propertyId: string }> }
) {
  const payload = getUserFromRequest(req);
  if (!payload) {
    return NextResponse.json(
      { success: false, message: "Not authenticated" },
      { status: 401 }
    );
  }

  const { propertyId } = await params;

  if (!propertyId) {
    return NextResponse.json(
      { success: false, message: "propertyId is required" },
      { status: 400 }
    );
  }

  // Validate property exists
  const property = PROPERTIES.find((p) => p.id === propertyId);
  if (!property) {
    return NextResponse.json(
      { success: false, message: "Property not found" },
      { status: 404 }
    );
  }

  // Enforce ownership — users can only remove their own favourites
  const existing = favouritesDB.find(payload.userId, propertyId);
  if (!existing) {
    return NextResponse.json(
      { success: false, message: "This property is not in your favourites" },
      { status: 404 }
    );
  }

  favouritesDB.remove(payload.userId, propertyId);

  return NextResponse.json({ success: true, message: "Removed from favourites" });
}
