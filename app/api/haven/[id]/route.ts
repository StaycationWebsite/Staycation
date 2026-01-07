import { getHavenById } from "@/backend/controller/roomController";
import { NextRequest, NextResponse } from "next/server";
import { createEdgeRouter } from "next-connect";

interface RequestContext {
  params: {
    id: string;
  }
}

const router = createEdgeRouter<NextRequest, RequestContext>();
router.get(getHavenById);

export async function GET(request: NextRequest, ctx: { params: Promise<{ id: string }> }): Promise<NextResponse> {
  const params = await ctx.params;
  return router.run(request, { params }) as Promise<NextResponse>;
}