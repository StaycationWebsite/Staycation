import { NextRequest, NextResponse } from "next/server";
import { getRevenueByRoom } from "@/backend/controller/analyticsController";
import { createEdgeRouter } from "next-connect";

interface RequestContext {}

const router = createEdgeRouter<NextRequest, RequestContext>();
router.get(getRevenueByRoom);

export async function GET(request: NextRequest, ctx: RequestContext): Promise<NextResponse> {
  return router.run(request, ctx) as Promise<NextResponse>;
}
