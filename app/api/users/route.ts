import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getAllUsers, findUserByEmail } from "@/backend/controller/userController";

// GET all users or current user
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { message: "Not authenticated" },
        { status: 401 }
      );
    }

    // Check if requesting all users (admin endpoint)
    const { searchParams } = new URL(req.url);
    const all = searchParams.get("all");

    if (all === "true") {
      // Get all users (you might want to add admin check here)
      const users = await getAllUsers();
      return NextResponse.json({ users });
    }

    // Get current user's data from database
    const user = await findUserByEmail(session.user.email);

    if (!user) {
      return NextResponse.json(
        { message: "User not found in database" },
        { status: 404 }
      );
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error("Error fetching user data:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}