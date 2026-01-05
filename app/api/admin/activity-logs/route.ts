import { NextRequest, NextResponse } from "next/server";
import { getAllActivityLogs, createActivityLog, deleteActivityLog } from "@/backend/controller/activityLogController";
import { createEdgeRouter } from "next-connect";

interface RequestContext {}

const router = createEdgeRouter<NextRequest, RequestContext>();
router.get(getAllActivityLogs);
router.post(createActivityLog);
router.delete(deleteActivityLog);

export async function GET(request: NextRequest, ctx: RequestContext): Promise<NextResponse> {
  return router.run(request, ctx) as Promise<NextResponse>;
}

export async function POST(request: NextRequest, ctx: RequestContext): Promise<NextResponse> {
  return router.run(request, ctx) as Promise<NextResponse>;
}

export async function DELETE(request: NextRequest, ctx: RequestContext): Promise<NextResponse> {
  return router.run(request, ctx) as Promise<NextResponse>;
}
