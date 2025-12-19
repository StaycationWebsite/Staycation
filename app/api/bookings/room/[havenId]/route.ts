"use server";

import { NextRequest, NextResponse } from "next/server";
import { getRoomBookings } from "@/backend/controller/bookingController";
import { createEdgeRouter } from "next-connect";

interface RequestContext {
  params: Promise<{
    havenId: string;
  }>
}

const router = createEdgeRouter<NextRequest, RequestContext>();

router.get(getRoomBookings);

export async function GET(req: NextRequest, ctx: RequestContext): Promise<NextResponse> {
  return router.run(req, ctx) as Promise<NextResponse>;
}
