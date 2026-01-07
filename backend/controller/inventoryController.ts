import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { getToken } from "next-auth/jwt";
import pool from "../config/db";

const ALLOWED_CATEGORIES = new Set([
  "Guest Amenities",
  "Bathroom Supplies",
  "Cleaning Supplies",
  "Linens & Bedding",
  "Kitchen Supplies",
]);

const ALLOWED_STATUSES = new Set(["In Stock", "Low Stock", "Out of Stock"]);

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
    const session = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    const userId = session?.sub || session?.id;

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "You must be signed in to add inventory items" },
        { status: 401 }
      );
    }

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

    if (!ALLOWED_CATEGORIES.has(category)) {
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

    const normalizedStatus = ALLOWED_STATUSES.has(statusRaw) ? (statusRaw as string) : "";

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

    const client = await pool.connect();

    const extractClientIp = (): string => {
      const headerCandidates = [
        "x-real-ip",
        "cf-connecting-ip",
        "x-client-ip",
        "x-forwarded-for",
        "fastly-client-ip",
        "true-client-ip",
        "x-cluster-client-ip",
        "x-forwarded",
        "forwarded",
      ];

      for (const header of headerCandidates) {
        const value = req.headers.get(header);
        if (value) {
          if (header === "x-forwarded-for" || header === "forwarded" || header === "x-forwarded") {
            const first = value.split(",")[0]?.trim();
            if (first) {
              return first;
            }
          } else {
            return value.trim();
          }
        }
      }

      return "unknown";
    };

    const ipAddress = extractClientIp();
    const userAgent = req.headers.get("user-agent") || "unknown";

    try {
      await client.query("BEGIN");

      const result = await client.query(query, [
        item_id,
        item_name,
        category,
        current_stock,
        minimum_stock,
        unit_type,
        dbStatus,
      ]);

      const actionDescription = `Added inventory item ${item_name}`;

      await client.query(
        `
        INSERT INTO activity_logs (
          user_id,
          action_type,
          action_description,
          target_type,
          target_id,
          old_value,
          new_value,
          ip_address,
          user_agent,
          created_at
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, timezone('Asia/Manila', now()))
      `,
        [
          userId,
          "inventory_create",
          actionDescription.slice(0, 255),
          "inventory",
          item_id,
          null,
          String(current_stock),
          ipAddress,
          userAgent.slice(0, 255),
        ]
      );

      await client.query("COMMIT");

      return NextResponse.json(
        {
          success: true,
          data: result.rows[0],
          message: "Inventory item created successfully",
        },
        { status: 201 }
      );
    } catch (innerError) {
      await client.query("ROLLBACK");
      throw innerError;
    } finally {
      client.release();
    }
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

export const updateInventoryItem = async (req: NextRequest): Promise<NextResponse> => {
  try {
    const session = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    const userId = session?.sub || session?.id;

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "You must be signed in to update inventory items" },
        { status: 401 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const item_id = String(body?.item_id ?? "").trim();
    const item_name = String(body?.item_name ?? body?.name ?? "").trim();
    const category = String(body?.category ?? "").trim();
    const current_stock = Number(body?.current_stock ?? body?.stock ?? NaN);
    const minimum_stock = Number(body?.minimum_stock ?? body?.min_stock ?? NaN);
    const unit_type = String(body?.unit_type ?? "").trim();
    const statusRaw = String(body?.status ?? "").trim();

    if (!item_id) {
      return NextResponse.json({ success: false, error: "Item ID is required" }, { status: 400 });
    }

    if (!item_name) {
      return NextResponse.json({ success: false, error: "Item name is required" }, { status: 400 });
    }

    if (!ALLOWED_CATEGORIES.has(category)) {
      return NextResponse.json({ success: false, error: "Invalid category" }, { status: 400 });
    }

    if (!Number.isFinite(current_stock) || current_stock < 0) {
      return NextResponse.json({ success: false, error: "Current stock must be a non-negative number" }, { status: 400 });
    }

    if (!Number.isFinite(minimum_stock) || minimum_stock < 0) {
      return NextResponse.json({ success: false, error: "Minimum stock must be a non-negative number" }, { status: 400 });
    }

    if (!unit_type) {
      return NextResponse.json({ success: false, error: "Unit type is required" }, { status: 400 });
    }

    const normalizedStatus = ALLOWED_STATUSES.has(statusRaw) ? statusRaw : "";
    const derivedStatus =
      current_stock <= 0 ? "Out of Stock" : current_stock <= 10 ? "Low Stock" : "In Stock";
    const dbStatus = normalizedStatus || derivedStatus;

    const client = await pool.connect();

    const extractClientIp = (): string => {
      const headerCandidates = [
        "x-real-ip",
        "cf-connecting-ip",
        "x-client-ip",
        "x-forwarded-for",
        "fastly-client-ip",
        "true-client-ip",
        "x-cluster-client-ip",
        "x-forwarded",
        "forwarded",
      ];

      for (const header of headerCandidates) {
        const value = req.headers.get(header);
        if (value) {
          if (header === "x-forwarded-for" || header === "forwarded" || header === "x-forwarded") {
            const first = value.split(",")[0]?.trim();
            if (first) {
              return first;
            }
          } else {
            return value.trim();
          }
        }
      }

      return "unknown";
    };

    const ipAddress = extractClientIp();
    const userAgent = req.headers.get("user-agent") || "unknown";

    try {
      await client.query("BEGIN");

      const existing = await client.query(
        `
        SELECT item_id, item_name, category, current_stock, minimum_stock, unit_type, status
        FROM inventory
        WHERE item_id = $1
        FOR UPDATE
      `,
        [item_id]
      );

      if (existing.rowCount === 0) {
        await client.query("ROLLBACK");
        return NextResponse.json({ success: false, error: "Inventory item not found" }, { status: 404 });
      }

      const updateResult = await client.query(
        `
        UPDATE inventory
        SET item_name = $2,
            category = $3,
            current_stock = $4,
            minimum_stock = $5,
            unit_type = $6,
            status = $7,
            updated_at = NOW()
        WHERE item_id = $1
        RETURNING item_id, item_name, category, current_stock, minimum_stock, unit_type, last_restocked, status, updated_at
      `,
        [item_id, item_name, category, current_stock, minimum_stock, unit_type, dbStatus]
      );

      const updatedRow = updateResult.rows[0];

      await client.query(
        `
        INSERT INTO activity_logs (
          user_id,
          action_type,
          action_description,
          target_type,
          target_id,
          old_value,
          new_value,
          ip_address,
          user_agent,
          created_at
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, timezone('Asia/Manila', now()))
      `,
        [
          userId,
          "inventory_update",
          `Updated inventory item ${item_name}`.slice(0, 255),
          "inventory",
          item_id,
          JSON.stringify(existing.rows[0]).slice(0, 100),
          JSON.stringify(updatedRow).slice(0, 100),
          ipAddress,
          userAgent.slice(0, 255),
        ]
      );

      await client.query("COMMIT");

      return NextResponse.json({
        success: true,
        data: updatedRow,
        message: "Inventory item updated successfully",
      });
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  } catch (error: any) {
    console.log("❌ Error updating inventory item:", error);
    return NextResponse.json(
      {
        success: false,
        error: error?.message || "Failed to update inventory item",
      },
      { status: 500 }
    );
  }
};

export const deleteInventoryItem = async (req: NextRequest): Promise<NextResponse> => {
  try {
    const session = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    const userId = session?.sub || session?.id;

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "You must be signed in to delete inventory items" },
        { status: 401 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const item_id = String(body?.item_id ?? "").trim();

    if (!item_id) {
      return NextResponse.json({ success: false, error: "Item ID is required" }, { status: 400 });
    }

    const client = await pool.connect();

    const extractClientIp = (): string => {
      const headerCandidates = [
        "x-real-ip",
        "cf-connecting-ip",
        "x-client-ip",
        "x-forwarded-for",
        "fastly-client-ip",
        "true-client-ip",
        "x-cluster-client-ip",
        "x-forwarded",
        "forwarded",
      ];

      for (const header of headerCandidates) {
        const value = req.headers.get(header);
        if (value) {
          if (header === "x-forwarded-for" || header === "forwarded" || header === "x-forwarded") {
            const first = value.split(",")[0]?.trim();
            if (first) {
              return first;
            }
          } else {
            return value.trim();
          }
        }
      }

      return "unknown";
    };

    const ipAddress = extractClientIp();
    const userAgent = req.headers.get("user-agent") || "unknown";

    try {
      await client.query("BEGIN");
      const existing = await client.query(
        `SELECT item_id, item_name, category, current_stock FROM inventory WHERE item_id = $1`,
        [item_id]
      );

      if (existing.rowCount === 0) {
        await client.query("ROLLBACK");
        return NextResponse.json({ success: false, error: "Inventory item not found" }, { status: 404 });
      }

      await client.query(`DELETE FROM inventory WHERE item_id = $1`, [item_id]);

      await client.query(
        `
        INSERT INTO activity_logs (
          user_id,
          action_type,
          action_description,
          target_type,
          target_id,
          old_value,
          new_value,
          ip_address,
          user_agent,
          created_at
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, timezone('Asia/Manila', now()))
      `,
        [
          userId,
          "inventory_delete",
          `Deleted inventory item ${existing.rows[0].item_name}`.slice(0, 255),
          "inventory",
          item_id,
          JSON.stringify(existing.rows[0]).slice(0, 100),
          null,
          ipAddress,
          userAgent.slice(0, 255),
        ]
      );

      await client.query("COMMIT");

      return NextResponse.json({
        success: true,
        message: "Inventory item deleted successfully",
      });
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  } catch (error: any) {
    console.log("❌ Error deleting inventory item:", error);
    return NextResponse.json(
      {
        success: false,
        error: error?.message || "Failed to delete inventory item",
      },
      { status: 500 }
    );
  }
};
