import bcrypt from "bcryptjs";
import { Request, Response } from "express";
import { supabase } from "../lib/supabase";

// User response helper - frontend User type ekata match wena format ekata convert karanawa
const formatUser = (user: any) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  avatar: user.avatar || "/user.png",
  access: [user.roles?.name || "Cashier"],
  role: user.roles?.name || "Cashier",
  is_active: user.is_active,
  createdAt: user.created_at,
  updatedAt: user.updated_at,
  lastActive: user.updated_at
    ? new Date(user.updated_at).toISOString().split("T")[0]
    : new Date().toISOString().split("T")[0],
  dateAdded: user.created_at
    ? new Date(user.created_at).toISOString().split("T")[0]
    : new Date().toISOString().split("T")[0],
});

/* ---------- GET /api/users ---------- */
export const getUsers = async (_req: Request, res: Response) => {
  try {
    const { data: users, error } = await supabase
      .from("users")
      .select("*, roles(name)")
      .not("name", "ilike", "Super Admin")
      .not("email", "ilike", "admin@gmail.com")
      .order("created_at", { ascending: false });

    if (error) throw error;
    res.json((users || []).map(formatUser));
  } catch (err: any) {
    console.error("getUsers error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ---------- POST /api/users ---------- */
export const createUser = async (req: Request, res: Response) => {
  try {
    const { name, email, role, access, password, avatar } = req.body;

    if (!name || !email) {
      return res.status(400).json({ message: "Name and email are required" });
    }

    const roleName = role || (Array.isArray(access) && access[0]) || "Cashier";

    // Find or create role
    let { data: roleRecord } = await supabase
      .from("roles")
      .select("id")
      .eq("name", roleName)
      .single();

    if (!roleRecord) {
      const { data: newRole, error: roleError } = await supabase
        .from("roles")
        .insert({ name: roleName })
        .select()
        .single();
      if (roleError || !newRole) throw roleError || new Error("Failed to create role");
      roleRecord = newRole;
    }

    if (!roleRecord) {
      return res.status(500).json({ message: "Failed to resolve role" });
    }

    const rawPassword = password || "FlowPilot@123";
    const hashed = await bcrypt.hash(rawPassword, 10);
    const now = new Date().toISOString();

    const { data: user, error } = await supabase
      .from("users")
      .insert({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password_hash: hashed,
        role_id: roleRecord.id,
        avatar: avatar || "/user.png",
        is_active: true,
        created_at: now,
        updated_at: now,
      })
      .select("*, roles(name)")
      .single();

    if (error) {
      if (error.code === "23505") {
        return res.status(409).json({ message: "Email already in use" });
      }
      throw error;
    }

    res.status(201).json(formatUser(user));
  } catch (err: any) {
    console.error("createUser error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ---------- PUT /api/users/:id ---------- */
export const updateUser = async (req: Request, res: Response) => {
  try {
    const userId = parseInt(String(req.params.id), 10);
    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const { name, email, role, access, password, is_active, avatar } = req.body;
    const updateData: Record<string, any> = {
      updated_at: new Date().toISOString(),
    };

    if (name !== undefined) updateData.name = name.trim();
    if (email !== undefined) updateData.email = email.trim().toLowerCase();
    if (avatar !== undefined) updateData.avatar = avatar;
    if (is_active !== undefined) updateData.is_active = Boolean(is_active);

    if (password) {
      updateData.password_hash = await bcrypt.hash(password, 10);
    }

    const roleName = role || (Array.isArray(access) && access[0]);
    if (roleName) {
      let { data: roleRecord } = await supabase
        .from("roles")
        .select("id")
        .eq("name", roleName)
        .single();

      if (!roleRecord) {
        const { data: newRole, error: roleError } = await supabase
          .from("roles")
          .insert({ name: roleName })
          .select()
          .single();
        if (roleError || !newRole) throw roleError || new Error("Failed to create role");
        roleRecord = newRole;
      }
      if (roleRecord) {
        updateData.role_id = roleRecord.id;
      }
    }

    const { data: user, error } = await supabase
      .from("users")
      .update(updateData)
      .eq("id", userId)
      .select("*, roles(name)")
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return res.status(404).json({ message: "User not found" });
      }
      if (error.code === "23505") {
        return res.status(409).json({ message: "Email already in use" });
      }
      throw error;
    }

    res.json(formatUser(user));
  } catch (err: any) {
    console.error("updateUser error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ---------- DELETE /api/users/:id ---------- */
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const userId = parseInt(String(req.params.id), 10);
    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const { error } = await supabase.from("users").delete().eq("id", userId);

    if (error) {
      if (error.code === "PGRST116") {
        return res.status(404).json({ message: "User not found" });
      }
      throw error;
    }

    res.status(204).send();
  } catch (err: any) {
    console.error("deleteUser error:", err);
    res.status(500).json({ message: "Server error" });
  }
};