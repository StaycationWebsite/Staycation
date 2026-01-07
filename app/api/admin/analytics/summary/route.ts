import { NextRequest, NextResponse } from "next/server";
import { getAnalyticsSummary } from "@/backend/controller/analyticsController";
import { createEdgeRouter } from "next-connect";

type RequestContext = Record<string, never>;

const router = createEdgeRouter<NextRequest, RequestContext>();
router.get(getAnalyticsSummary);

export async function GET(request: NextRequest, ctx: RequestContext): Promise<NextResponse> {
  return router.run(request, ctx) as Promise<NextResponse>;
}
