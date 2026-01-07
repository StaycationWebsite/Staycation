import { NextRequest, NextResponse } from "next/server";
import { getMessages } from "@/backend/controller/messageController";
import { createEdgeRouter } from "next-connect";

interface RequestContext {
  params: Promise<{
    conversationId: string;
  }>
}

const router = createEdgeRouter<NextRequest, RequestContext>();
router.get(getMessages);

export async function GET(request: NextRequest, ctx: RequestContext): Promise<NextResponse> {
  return router.run(request, ctx) as Promise<NextResponse>;
}
