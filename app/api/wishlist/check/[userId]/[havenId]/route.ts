import { NextRequest, NextResponse } from "next/server";
import { createEdgeRouter } from "next-connect";
import { checkWishlistStatus } from "@/backend/controller/wishlistController";

interface RequestContext {
  params: Promise<{
    userId: string;
    havenId: string;
  }>
}

const router = createEdgeRouter<NextRequest, RequestContext>();
router.get(checkWishlistStatus);

export async function GET(request: NextRequest, ctx: RequestContext): Promise<NextResponse> {
  return router.run(request, ctx) as Promise<NextResponse>;
}

