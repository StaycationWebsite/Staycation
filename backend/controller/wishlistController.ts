import { NextRequest, NextResponse } from "next/server";
import pool from "../config/db";

export interface WishlistItem {
  id?: string;
  user_id: string;
  haven_id: string;
  created_at?: string;
}

// GET User's Wishlist
export const getUserWishlist = async (
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
): Promise<NextResponse> => {
  const { userId } = await params;

  try {
    const query = `
      SELECT
        w.id,
        w.user_id,
        w.haven_id,
        w.created_at,
        h.haven_name as room_name,
        h.tower,
        h.capacity,
        h.description,
        h.six_hour_rate as price,
        COALESCE(
          json_agg(hi.image_url ORDER BY hi.display_order)
          FILTER (WHERE hi.id IS NOT NULL),
          '[]'
        ) as images
      FROM wishlist w
      INNER JOIN havens h ON w.haven_id = h.uuid_id
      LEFT JOIN haven_images hi ON h.uuid_id = hi.haven_id
      WHERE w.user_id = $1
      GROUP BY w.id, h.haven_name, h.tower, h.capacity, h.description, h.six_hour_rate
      ORDER BY w.created_at DESC
    `;

    const result = await pool.query(query, [userId]);

    return NextResponse.json({
      success: true,
      data: result.rows,
    });
  } catch (error: any) {
    console.error("Error fetching wishlist:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch wishlist",
        error: error.message,
      },
      { status: 500 }
    );
  }
};

// ADD to Wishlist
export const addToWishlist = async (
  req: NextRequest
): Promise<NextResponse> => {
  try {
    const body = await req.json();
    const { user_id, haven_id } = body;

    if (!user_id || !haven_id) {
      return NextResponse.json(
        {
          success: false,
          message: "user_id and haven_id are required",
        },
        { status: 400 }
      );
    }

    // Check if already in wishlist
    const checkQuery = `
      SELECT id FROM wishlist
      WHERE user_id = $1 AND haven_id = $2
    `;
    const checkResult = await pool.query(checkQuery, [user_id, haven_id]);

    if (checkResult.rows.length > 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Item already in wishlist",
        },
        { status: 400 }
      );
    }

    // Add to wishlist
    const insertQuery = `
      INSERT INTO wishlist (user_id, haven_id)
      VALUES ($1, $2)
      RETURNING *
    `;
    const result = await pool.query(insertQuery, [user_id, haven_id]);

    return NextResponse.json({
      success: true,
      message: "Added to wishlist successfully",
      data: result.rows[0],
    });
  } catch (error: any) {
    console.error("Error adding to wishlist:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to add to wishlist",
        error: error.message,
      },
      { status: 500 }
    );
  }
};

// REMOVE from Wishlist
export const removeFromWishlist = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> => {
  const { id } = await params;

  try {
    const deleteQuery = `
      DELETE FROM wishlist
      WHERE id = $1
      RETURNING *
    `;
    const result = await pool.query(deleteQuery, [id]);

    if (result.rows.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Wishlist item not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Removed from wishlist successfully",
      data: result.rows[0],
    });
  } catch (error: any) {
    console.error("Error removing from wishlist:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to remove from wishlist",
        error: error.message,
      },
      { status: 500 }
    );
  }
};

// CHECK if item is in wishlist
export const checkWishlistStatus = async (
  req: NextRequest,
  { params }: { params: Promise<{ userId: string; havenId: string }> }
): Promise<NextResponse> => {
  const { userId, havenId } = await params;

  try {
    const query = `
      SELECT id FROM wishlist
      WHERE user_id = $1 AND haven_id = $2
    `;
    const result = await pool.query(query, [userId, havenId]);

    return NextResponse.json({
      success: true,
      isInWishlist: result.rows.length > 0,
      wishlistId: result.rows.length > 0 ? result.rows[0].id : null,
    });
  } catch (error: any) {
    console.error("Error checking wishlist status:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to check wishlist status",
        error: error.message,
      },
      { status: 500 }
    );
  }
};
