import { getAllHavens } from "@/backend/controller/roomController";
import { NextRequest, NextResponse } from "next/server";
import { createEdgeRouter } from "next-connect";

type RequestContext = Record<string, never>;

const router = createEdgeRouter<NextRequest, RequestContext>();
router.get(getAllHavens);

export async function GET(request: NextRequest, ctx: RequestContext): Promise<NextResponse> {
  return router.run(request, ctx) as Promise<NextResponse>;
}