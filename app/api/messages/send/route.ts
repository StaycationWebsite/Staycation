import { NextRequest, NextResponse } from "next/server";
import { sendMessage } from "@/backend/controller/messageController";
import { createEdgeRouter } from "next-connect";

type RequestContext = Record<string, never>;

const router = createEdgeRouter<NextRequest, RequestContext>();
router.post(sendMessage);

export async function POST(request: NextRequest, ctx: RequestContext): Promise<NextResponse> {
  return router.run(request, ctx) as Promise<NextResponse>;
}
