import { NextRequest, NextResponse } from "next/server";
import pool from "@/backend/config/db";

export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(req.url);
    const bookingId = searchParams.get("booking_id");

    if (!bookingId) {
      return NextResponse.json(
        { success: false, error: "Booking ID is required" },
        { status: 400 }
      );
    }

    const query = `
      SELECT * FROM bookings
      WHERE booking_id = $1
    `;

    const result = await pool.query(query, [bookingId]);

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: "Booking not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      booking: result.rows[0],
    });
  } catch (error: any) {
    console.error("Error fetching booking:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to fetch booking",
      },
      { status: 500 }
    );
  }
}
