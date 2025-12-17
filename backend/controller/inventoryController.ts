import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import pool from "../config/db";

export const getAllInventory = async (req: NextRequest): Promise<NextResponse> => {
  try {
    const query = `
      SELECT
        inventory_id,
        item_name,
        stock_quantity,
        price,
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
    const stock_quantity = Number(body?.stock_quantity ?? body?.stock ?? 0);
    const priceRaw = body?.price;
    const price = priceRaw === null || priceRaw === undefined || priceRaw === "" ? null : Number(priceRaw);
    const status = String(body?.status ?? "In Stock");

    if (!item_name) {
      return NextResponse.json({ success: false, error: "Item name is required" }, { status: 400 });
    }

    if (!Number.isFinite(stock_quantity) || stock_quantity < 0) {
      return NextResponse.json({ success: false, error: "Stock quantity must be a non-negative number" }, { status: 400 });
    }

    if (price !== null && (!Number.isFinite(price) || price < 0)) {
      return NextResponse.json({ success: false, error: "Price must be a non-negative number" }, { status: 400 });
    }

    const allowedStatuses = new Set(["In Stock", "Low Stock", "Out of Stock"]);
    const normalizedStatus = allowedStatuses.has(status) ? status : "In Stock";

    const dbStatus =
      stock_quantity === 0
        ? "Out of Stock"
        : stock_quantity <= 10
          ? "Low Stock"
          : normalizedStatus === "Out of Stock"
            ? "In Stock"
            : normalizedStatus;

    const inventory_id = randomUUID();

    const query = `
      INSERT INTO inventory (
        inventory_id,
        item_name,
        stock_quantity,
        price,
        status,
        created_at,
        updated_at
      )
      VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
      RETURNING
        inventory_id,
        item_name,
        stock_quantity,
        price,
        status,
        created_at,
        updated_at
    `;

    const result = await pool.query(query, [inventory_id, item_name, stock_quantity, price, dbStatus]);

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
