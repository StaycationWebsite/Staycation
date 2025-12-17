import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import pool from "../config/db";

export const getAllInventory = async (req: NextRequest): Promise<NextResponse> => {
  try {
    const query = `
      SELECT
        item_id,
        item_name,
        category,
        current_stock,
        minimum_stock,
        unit_type,
        last_restocked,
        status,
        created_at,
        updated_at
      FROM inventory
      ORDER BY created_at DESC
    `;

    const result = await pool.query(query);

    return NextResponse.json({
      success: true,
      data: result.rows,
      count: result.rows.length,
    });
  } catch (error: any) {
    console.log("❌ Error getting inventory:", error);
    return NextResponse.json(
      {
        success: false,
        error: error?.message || "Failed to get inventory",
      },
      { status: 500 }
    );
  }
};

export const createInventoryItem = async (req: NextRequest): Promise<NextResponse> => {
  try {
    const body = await req.json().catch(() => ({}));

    const item_name = String(body?.item_name ?? body?.name ?? "").trim();
    const category = String(body?.category ?? "").trim();
    const current_stock = Number(body?.current_stock ?? body?.stock ?? 0);
    const minimum_stock = Number(body?.minimum_stock ?? body?.min_stock ?? 0);
    const unit_type = String(body?.unit_type ?? "").trim();
    const statusRaw = String(body?.status ?? "").trim();

    if (!item_name) {
      return NextResponse.json({ success: false, error: "Item name is required" }, { status: 400 });
    }

    const allowedCategories = new Set([
      "Guest Amenities",
      "Bathroom Supplies",
      "Cleaning Supplies",
      "Linens & Bedding",
      "Kitchen Supplies",
    ]);

    if (!allowedCategories.has(category)) {
      return NextResponse.json(
        { success: false, error: "Category must be one of the allowed values" },
        { status: 400 }
      );
    }

    if (!Number.isFinite(current_stock) || current_stock < 0) {
      return NextResponse.json(
        { success: false, error: "Current stock must be a non-negative number" },
        { status: 400 }
      );
    }

    if (!Number.isFinite(minimum_stock) || minimum_stock < 0) {
      return NextResponse.json(
        { success: false, error: "Minimum stock must be a non-negative number" },
        { status: 400 }
      );
    }

    if (!unit_type) {
      return NextResponse.json({ success: false, error: "Unit type is required" }, { status: 400 });
    }

    const allowedStatuses = new Set(["In Stock", "Low Stock", "Out of Stock"]);
    const normalizedStatus = allowedStatuses.has(statusRaw) ? (statusRaw as string) : "";

    const derivedStatus =
      !Number.isFinite(current_stock) || current_stock <= 0
        ? "Out of Stock"
        : current_stock <= 10
          ? "Low Stock"
          : "In Stock";

    const dbStatus = derivedStatus || normalizedStatus || "In Stock";

    const item_id = randomUUID();

    const query = `
      INSERT INTO inventory (
        item_id,
        item_name,
        category,
        current_stock,
        minimum_stock,
        unit_type,
        last_restocked,
        status,
        created_at,
        updated_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, NOW(), $7, NOW(), NOW())
      RETURNING
        item_id,
        item_name,
        category,
        current_stock,
        minimum_stock,
        unit_type,
        last_restocked,
        status,
        created_at,
        updated_at
    `;

    const result = await pool.query(query, [
      item_id,
      item_name,
      category,
      current_stock,
      minimum_stock,
      unit_type,
      dbStatus,
    ]);

    return NextResponse.json({
      success: true,
      data: result.rows[0],
      message: "Inventory item created successfully",
    }, { status: 201 });
  } catch (error: any) {
    console.log("❌ Error creating inventory item:", error);
    return NextResponse.json(
      {
        success: false,
        error: error?.message || "Failed to create inventory item",
      },
      { status: 500 }
    );
  }
};
