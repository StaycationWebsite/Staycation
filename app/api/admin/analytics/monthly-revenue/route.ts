import { NextRequest, NextResponse } from "next/server";
import { getMonthlyRevenue } from "@/backend/controller/analyticsController";
import { createEdgeRouter } from "next-connect";

interface RequestContext {}

const router = createEdgeRouter<NextRequest, RequestContext>();
router.get(getMonthlyRevenue);

export async function GET(request: NextRequest, ctx: RequestContext): Promise<NextResponse> {
  return router.run(request, ctx) as Promise<NextResponse>;
}
