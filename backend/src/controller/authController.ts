import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { supabase } from "../lib/supabase";

/* ─── POST /api/auth/login ────────────────────────────────────────── */
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // Find user with role
    const { data: user, error } = await supabase
      .from("users")
      .select("*, roles(name)")
      .eq("email", email.trim().toLowerCase())
      .single();
    // show error if user cannot find
    if (error || !user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    if (!user.is_active) {
      return res.status(403).json({
        message: "Your account has been deactivated. Please contact an admin.",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Generate JWT token
    const jwtSecret = process.env.JWT_SECRET || "fallback_secret_key";
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.roles?.name || "user",
      },
      jwtSecret,
      { expiresIn: "24h" }
    );

    // Set HTTP-only secure session cookie (no maxAge = deleted when browser closes)
    const isProduction = process.env.NODE_ENV === "production";
    res.cookie("token", token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      // No maxAge — this makes it a session cookie.
      // It will be automatically deleted when the browser is closed.
    });

    return res.status(200).json({
      message: "Login successful",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.roles?.name,
        isActive: user.is_active,
        mustChangePassword: user.must_change_password ?? false,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Internal server error occurred while processing login" });
  }
};

/* ─── POST /api/auth/create-admin ─────────────────────────────────── */
export const registerAdmin = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email, and password are required" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters long" });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Check if user already exists
    const { data: existingUser } = await supabase
      .from("users")
      .select("id")
      .eq("email", normalizedEmail)
      .single();

    if (existingUser) {
      return res.status(409).json({ message: "User with this email already exists" });
    }

    // Ensure 'Admin' role exists
    let { data: adminRole } = await supabase
      .from("roles")
      .select("id")
      .eq("name", "Admin")
      .single();

    if (!adminRole) {
      const { data: newRole, error: roleError } = await supabase
        .from("roles")
        .insert({ name: "Admin" })
        .select()
        .single();
      if (roleError || !newRole) throw roleError || new Error("Failed to create Admin role");
      adminRole = newRole;
    }

    if (!adminRole) {
      return res.status(500).json({ message: "Failed to resolve Admin role" });
    }

    const password_hash = await bcrypt.hash(password, 10);
    const now = new Date().toISOString();

    const { data: newAdmin, error: createError } = await supabase
      .from("users")
      .insert({
        name: name.trim(),
        email: normalizedEmail,
        password_hash,
        role_id: adminRole.id,
        is_active: true,
        created_at: now,
        updated_at: now,
      })
      .select("*, roles(name)")
      .single();

    if (createError) throw createError;

    return res.status(201).json({
      message: "Admin user created successfully",
      user: {
        id: newAdmin.id,
        name: newAdmin.name,
        email: newAdmin.email,
        role: newAdmin.roles?.name,
        isActive: newAdmin.is_active,
      },
    });
  } catch (error) {
    console.error("Create admin error:", error);
    return res.status(500).json({ message: "Internal server error occurred while creating admin" });
  }
};

/* ─── GET /api/auth/me ────────────────────────────────────────────── */
export const getMe = async (req: Request, res: Response) => {
  try {
    const token = req.cookies?.token || (req.headers.authorization?.startsWith("Bearer ") ? req.headers.authorization.split(" ")[1] : null);
    if (!token) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const jwtSecret = process.env.JWT_SECRET || "fallback_secret_key";
    const decoded = jwt.verify(token, jwtSecret) as { id: number; email: string; role: string };

    const { data: user, error } = await supabase
      .from("users")
      .select("*, roles(name)")
      .eq("id", decoded.id)
      .single();

    if (error || !user || !user.is_active) {
      return res.status(401).json({ message: "User not found or inactive" });
    }

    return res.status(200).json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.roles?.name,
        isActive: user.is_active,
        mustChangePassword: user.must_change_password ?? false,
      },
    });
  } catch {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

/* ─── POST /api/auth/change-password ──────────────────────────────── */
export const changePassword = async (req: Request, res: Response) => {
  try {
    const token = req.cookies?.token || (req.headers.authorization?.startsWith("Bearer ") ? req.headers.authorization.split(" ")[1] : null);
    if (!token) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const jwtSecret = process.env.JWT_SECRET || "fallback_secret_key";
    const decoded = jwt.verify(token, jwtSecret) as { id: number; email: string; role: string };

    const { currentPassword, newPassword } = req.body;

    if (!newPassword || typeof newPassword !== "string" || newPassword.trim().length < 6) {
      return res.status(400).json({ message: "New password must be at least 6 characters long" });
    }

    const { data: user, error } = await supabase
      .from("users")
      .select("*, roles(name)")
      .eq("id", decoded.id)
      .single();

    if (error || !user || !user.is_active) {
      return res.status(404).json({ message: "User not found or inactive" });
    }

    if (currentPassword) {
      const isCurrentValid = await bcrypt.compare(currentPassword, user.password_hash);
      if (!isCurrentValid) {
        return res.status(400).json({ message: "Current password is incorrect" });
      }
    }

    const isSamePassword = await bcrypt.compare(newPassword.trim(), user.password_hash);
    if (isSamePassword) {
      return res.status(400).json({ message: "New password must be different from current password" });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword.trim(), 10);

    const { data: updatedUser, error: updateError } = await supabase
      .from("users")
      .update({ password_hash: hashedNewPassword, must_change_password: false })
      .eq("id", user.id)
      .select("*, roles(name)")
      .single();

    if (updateError) throw updateError;

    return res.status(200).json({
      message: "Password changed successfully",
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.roles?.name,
        isActive: updatedUser.is_active,
        mustChangePassword: false,
      },
    });
  } catch (error) {
    console.error("Change password error:", error);
    return res.status(500).json({ message: "Failed to change password" });
  }
};

/* ─── POST /api/auth/logout ───────────────────────────────────────── */
export const logout = (_req: Request, res: Response) => {
  const isProduction = process.env.NODE_ENV === "production";
  res.clearCookie("token", {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
  });
  return res.status(200).json({ message: "Logged out successfully" });
};
