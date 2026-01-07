import { NextRequest, NextResponse } from "next/server";
import { getUserWishlist } from "@/backend/controller/wishlistController";
import { createEdgeRouter } from "next-connect";

interface RequestContext {
  params: Promise<{
    userId: string;
  }>
}

const router = createEdgeRouter<NextRequest, RequestContext>();
router.get(getUserWishlist);

export async function GET(request: NextRequest, ctx: RequestContext): Promise<NextResponse> {
  return router.run(request, ctx) as Promise<NextResponse>;
}
