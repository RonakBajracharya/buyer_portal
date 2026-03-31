export interface ValidationError {
  field: string;
  message: string;
}

export function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export function validatePassword(password: string): ValidationError[] {
  const errors: ValidationError[] = [];
  if (password.length < 8) {
    errors.push({ field: "password", message: "Password must be at least 8 characters" });
  }
  return errors;
}

export function validateRegistration(data: {
  name?: unknown;
  email?: unknown;
  password?: unknown;
}): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!data.name || typeof data.name !== "string" || data.name.trim().length < 2) {
    errors.push({ field: "name", message: "Name must be at least 2 characters" });
  }

  if (!data.email || typeof data.email !== "string" || !validateEmail(data.email)) {
    errors.push({ field: "email", message: "A valid email address is required" });
  }

  if (!data.password || typeof data.password !== "string") {
    errors.push({ field: "password", message: "Password is required" });
  } else {
    errors.push(...validatePassword(data.password));
  }

  return errors;
}

export function validateLogin(data: {
  email?: unknown;
  password?: unknown;
}): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!data.email || typeof data.email !== "string" || !validateEmail(data.email)) {
    errors.push({ field: "email", message: "A valid email address is required" });
  }

  if (!data.password || typeof data.password !== "string" || data.password.length === 0) {
    errors.push({ field: "password", message: "Password is required" });
  }

  return errors;
}
