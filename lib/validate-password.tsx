import { createValidId } from "@/auth";
import { client } from "../sanity/lib/client";
import { writeClient } from "../sanity/lib/write-client";
import { hash, compare } from "bcryptjs";
import { z } from "zod";

export interface SanityRole {
  _id: string;
  code: string;
  name: string;
}

export interface SanityAuthor {
  _id: string;
  _type: "author";
  name: string;
  email: string;
  password: string;
  image: string;
  roles: Array<{
    _type: "reference";
    _ref: string;
    code: string;
  }>;
}

export interface AuthorWithExpandedRoles extends Omit<SanityAuthor, "roles"> {
  roles: Array<SanityRole>;
}

// Password validation schema
const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(100, "Password must be less than 100 characters")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[0-9]/, "Password must contain at least one number")
  .regex(
    /[^A-Za-z0-9]/,
    "Password must contain at least one special character"
  );

// Custom error types
export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}

export class AuthenticationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AuthenticationError";
  }
}

// Interface for password validation result
interface PasswordValidationResult {
  isValid: boolean;
  errors: string[];
}

// Validate password against requirements
export const validatePassword = (
  password: string
): PasswordValidationResult => {
  try {
    passwordSchema.parse(password);
    return { isValid: true, errors: [] };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        isValid: false,
        errors: error.errors.map((err) => err.message),
      };
    }
    return {
      isValid: false,
      errors: ["Invalid password format"],
    };
  }
};

// Hash password for storage
export const hashPassword = async (password: string): Promise<string> => {
  try {
    const validation = validatePassword(password);
    if (!validation.isValid) {
      throw new ValidationError(validation.errors.join(", "));
    }

    // Use bcryptjs to hash password with a salt round of 12
    const hashedPassword = await hash(password, 12);
    return hashedPassword;
  } catch (error) {
    if (error instanceof ValidationError) {
      throw error;
    }
    throw new Error("Password hashing failed");
  }
};

// Verify password against stored hash
export const verifyPassword = async (
  providedPassword: string,
  storedHash: string
): Promise<boolean> => {
  try {
    return await compare(providedPassword, storedHash);
  } catch (error) {
    throw new Error("Password verification failed");
  }
};

// Update password with validation
export const updatePassword = async (
  currentPassword: string,
  newPassword: string,
  storedHash: string
): Promise<string> => {
  try {
    // Verify current password
    const isValid = await verifyPassword(currentPassword, storedHash);
    if (!isValid) {
      throw new AuthenticationError("Current password is incorrect");
    }

    // Validate and hash new password
    const validation = validatePassword(newPassword);
    if (!validation.isValid) {
      throw new ValidationError(validation.errors.join(", "));
    }

    // Ensure new password is different from current
    if (await verifyPassword(newPassword, storedHash)) {
      throw new ValidationError(
        "New password must be different from current password"
      );
    }

    // Hash and return new password
    return await hashPassword(newPassword);
  } catch (error) {
    if (
      error instanceof ValidationError ||
      error instanceof AuthenticationError
    ) {
      throw error;
    }
    throw new Error("Password update failed");
  }
};

// Generate secure reset token
export const generateResetToken = (): string => {
  return crypto.randomUUID();
};

// Example usage with Sanity
export const createNewUser = async (
  email: string,
  password: string
): Promise<SanityAuthor> => {
  try {
    const hashedPassword = await hashPassword(password);

    const newUser = await writeClient.create<SanityAuthor>({
      _type: "author",
      _id: createValidId(email),
      email,
      password: hashedPassword,
      name: email.split("@")[0],
      image: "",
      roles: [
        {
          _type: "reference",
          _ref: "role-user",
          code: "user",
        },
      ],
    });

    return newUser;
  } catch (error) {
    if (error instanceof ValidationError) {
      throw error;
    }
    throw new Error("User creation failed");
  }
};

// Updated authorize function for NextAuth
export const authorizeUser = async (credentials: {
  email: string;
  password: string;
}): Promise<{
  id: string;
  name: string;
  email: string;
  image: string;
  roles: string[];
} | null> => {
  try {
    const author = await client.fetch<AuthorWithExpandedRoles | null>(
      `*[_type == "author" && email == $email][0]{
        _id,
        name,
        email,
        password,
        image,
        roles[]->{
            _id,
            code,
            name
        }
      }`,
      { email: credentials.email }
    );

    if (!author) {
      throw new AuthenticationError("Invalid credentials");
    }

    const isValidPassword = await verifyPassword(
      credentials.password,
      author.password
    );

    if (!isValidPassword) {
      throw new AuthenticationError("Invalid credentials");
    }

    return {
      id: author._id,
      name: author.name,
      email: author.email,
      image: author.image,
      roles: author.roles?.map((role: { code: string }) => role.code) || [
        "user",
      ],
    };
  } catch (error) {
    if (error instanceof AuthenticationError) {
      throw error;
    }
    console.error("Authentication failed:", error);
    return null;
  }
};
