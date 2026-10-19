import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

/* GET /api/tables (optional ?available=true/false) */
export const getTables = async (req: Request, res: Response) => {
  try {
    const { available } = req.query;
    const where: any = {};
    if (available !== undefined) {
      where.isAvailable = available === "true";
    }

    const tables = await prisma.restaurantTable.findMany({
      where,
      orderBy: { id: "asc" },
    });
    res.json(tables);
  } catch (err: any) {
    console.error("getTables error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* GET /api/tables/:id */
export const getTableById = async (req: Request, res: Response) => {
  try {
    const id = parseInt(String(req.params.id), 10);
    if (isNaN(id)) return res.status(400).json({ message: "Invalid ID" });

    const table = await prisma.restaurantTable.findUnique({
      where: { id },
    });

    if (!table) return res.status(404).json({ message: "Table not found" });
    res.json(table);
  } catch (err: any) {
    console.error("getTableById error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* POST /api/tables */
export const createTable = async (req: Request, res: Response) => {
  try {
    const { tableNo, capacity, isAvailable } = req.body;

    const existing = await prisma.restaurantTable.findUnique({
      where: { tableNo: tableNo.trim() },
    });
    if (existing) {
      return res.status(409).json({ message: "Table number already exists" });
    }

    const table = await prisma.restaurantTable.create({
      data: {
        tableNo: tableNo.trim(),
        capacity: Number(capacity),
        isAvailable: isAvailable ?? true,
      },
    });

    res.status(201).json(table);
  } catch (err: any) {
    console.error("createTable error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* PUT /api/tables/:id */
export const updateTable = async (req: Request, res: Response) => {
  try {
    const id = parseInt(String(req.params.id), 10);
    if (isNaN(id)) return res.status(400).json({ message: "Invalid ID" });

    const { tableNo, capacity, isAvailable } = req.body;
    const data: any = {};
    if (tableNo !== undefined) data.tableNo = tableNo.trim();
    if (capacity !== undefined) data.capacity = Number(capacity);
    if (isAvailable !== undefined) data.isAvailable = Boolean(isAvailable);

    // If tableNo is changed, verify uniqueness
    if (data.tableNo) {
      const existing = await prisma.restaurantTable.findFirst({
        where: {
          tableNo: data.tableNo,
          NOT: { id },
        },
      });
      if (existing) {
        return res.status(409).json({ message: "Table number already exists" });
      }
    }

    const table = await prisma.restaurantTable.update({
      where: { id },
      data,
    });

    res.json(table);
  } catch (err: any) {
    if (err.code === "P2025") {
      return res.status(404).json({ message: "Table not found" });
    }
    console.error("updateTable error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* DELETE /api/tables/:id */
export const deleteTable = async (req: Request, res: Response) => {
  try {
    const id = parseInt(String(req.params.id), 10);
    if (isNaN(id)) return res.status(400).json({ message: "Invalid ID" });

    await prisma.restaurantTable.delete({
      where: { id },
    });

    res.status(204).send();
  } catch (err: any) {
    if (err.code === "P2025") {
      return res.status(404).json({ message: "Table not found" });
    }
    console.error("deleteTable error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
