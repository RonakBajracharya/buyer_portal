import fs from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");
const USERS_FILE = path.join(DATA_DIR, "users.json");
const FAVOURITES_FILE = path.join(DATA_DIR, "favourites.json");

// ── Types ─────────────────────────────────────────────────────────────────────

export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: "buyer" | "admin";
  createdAt: string;
}

export interface Favourite {
  id: string;
  userId: string;
  propertyId: string;
  addedAt: string;
}

export interface Property {
  id: string;
  title: string;
  location: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  imageUrl: string;
  type: string;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
}

function readJSON<T>(file: string, fallback: T): T {
  ensureDataDir();
  if (!fs.existsSync(file)) return fallback;
  try {
    return JSON.parse(fs.readFileSync(file, "utf-8")) as T;
  } catch {
    return fallback;
  }
}

function writeJSON<T>(file: string, data: T): void {
  ensureDataDir();
  fs.writeFileSync(file, JSON.stringify(data, null, 2), "utf-8");
}

// ── Users ─────────────────────────────────────────────────────────────────────

export const usersDB = {
  getAll(): User[] {
    return readJSON<User[]>(USERS_FILE, []);
  },
  findById(id: string): User | undefined {
    return this.getAll().find((u) => u.id === id);
  },
  findByEmail(email: string): User | undefined {
    return this.getAll().find(
      (u) => u.email.toLowerCase() === email.toLowerCase()
    );
  },
  create(user: User): User {
    const users = this.getAll();
    users.push(user);
    writeJSON(USERS_FILE, users);
    return user;
  },
};

// ── Favourites ────────────────────────────────────────────────────────────────

export const favouritesDB = {
  getAll(): Favourite[] {
    return readJSON<Favourite[]>(FAVOURITES_FILE, []);
  },
  getByUser(userId: string): Favourite[] {
    return this.getAll().filter((f) => f.userId === userId);
  },
  find(userId: string, propertyId: string): Favourite | undefined {
    return this.getAll().find(
      (f) => f.userId === userId && f.propertyId === propertyId
    );
  },
  add(fav: Favourite): Favourite {
    const favs = this.getAll();
    favs.push(fav);
    writeJSON(FAVOURITES_FILE, favs);
    return fav;
  },
  remove(userId: string, propertyId: string): boolean {
    const favs = this.getAll();
    const newFavs = favs.filter(
      (f) => !(f.userId === userId && f.propertyId === propertyId)
    );
    if (newFavs.length === favs.length) return false;
    writeJSON(FAVOURITES_FILE, newFavs);
    return true;
  },
};

// ── Static property catalogue (mock MLS data) ────────────────────────────────

export const PROPERTIES: Property[] = [
  {
    id: "prop-001",
    title: "Skyline Penthouse",
    location: "Lower Parel, Mumbai",
    price: 45000000,
    bedrooms: 4,
    bathrooms: 4,
    sqft: 3200,
    imageUrl: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80",
    type: "Penthouse",
  },
  {
    id: "prop-002",
    title: "Sea-View Apartment",
    location: "Bandra West, Mumbai",
    price: 28500000,
    bedrooms: 3,
    bathrooms: 2,
    sqft: 1850,
    imageUrl: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80",
    type: "Apartment",
  },
  {
    id: "prop-003",
    title: "Heritage Villa",
    location: "Juhu, Mumbai",
    price: 72000000,
    bedrooms: 5,
    bathrooms: 5,
    sqft: 5400,
    imageUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
    type: "Villa",
  },
  {
    id: "prop-004",
    title: "Modern Studio Loft",
    location: "Worli, Mumbai",
    price: 9800000,
    bedrooms: 1,
    bathrooms: 1,
    sqft: 680,
    imageUrl: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80",
    type: "Studio",
  },
  {
    id: "prop-005",
    title: "Garden Duplex",
    location: "Powai, Mumbai",
    price: 18500000,
    bedrooms: 3,
    bathrooms: 3,
    sqft: 2100,
    imageUrl: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80",
    type: "Duplex",
  },
  {
    id: "prop-006",
    title: "Waterfront Residency",
    location: "Marine Drive, Mumbai",
    price: 55000000,
    bedrooms: 4,
    bathrooms: 3,
    sqft: 2900,
    imageUrl: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80",
    type: "Apartment",
  },
];
