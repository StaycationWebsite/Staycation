import { NextRequest, NextResponse } from "next/server";
import { createBooking, getAllBookings } from "@/backend/controller/bookingController";
import { createEdgeRouter } from "next-connect";

interface RequestContext {}

const router = createEdgeRouter<NextRequest, RequestContext>();
router.post(createBooking);
router.get(getAllBookings);

export async function POST(request: NextRequest, ctx: RequestContext): Promise<NextResponse> {
  return router.run(request, ctx) as Promise<NextResponse>;
}

export async function GET(request: NextRequest, ctx: RequestContext): Promise<NextResponse> {
  return router.run(request, ctx) as Promise<NextResponse>;
}
