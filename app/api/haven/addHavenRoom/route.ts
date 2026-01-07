import { createHaven } from "@/backend/controller/roomController";
import { NextRequest, NextResponse } from "next/server";
import { createEdgeRouter } from "next-connect";

interface RequestContext {}

const router = createEdgeRouter<NextRequest, RequestContext>();
router.post(createHaven);

export async function POST(request: NextRequest, ctx: RequestContext): Promise<NextResponse> {
  return router.run(request, ctx) as Promise<NextResponse>;
}   