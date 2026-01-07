import { deleteHaven, updateHaven, getHavenById } from "@/backend/controller/roomController";
import { NextRequest, NextResponse } from "next/server";
import { createEdgeRouter } from "next-connect";

interface RequestContext {
  params: Promise<{
    id: string
  }>
}

const router = createEdgeRouter<NextRequest, RequestContext>();
router.get(getHavenById);
router.put(updateHaven);
router.delete(deleteHaven);

export async function GET(request: NextRequest, ctx: RequestContext): Promise<NextResponse> {
  return router.run(request, ctx) as Promise<NextResponse>;
}

export async function PUT(request: NextRequest, ctx: RequestContext): Promise<NextResponse> {
  return router.run(request, ctx) as Promise<NextResponse>;
}

export async function DELETE(request: NextRequest, ctx: RequestContext): Promise<NextResponse> {
  return router.run(request, ctx) as Promise<NextResponse>;
}
