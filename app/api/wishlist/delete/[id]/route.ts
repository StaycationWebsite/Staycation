import { NextRequest, NextResponse } from "next/server";
import { removeFromWishlist } from "@/backend/controller/wishlistController";
import { createEdgeRouter } from "next-connect";

interface RequestContext {
  params: Promise<{
    id: string;
  }>
}

const router = createEdgeRouter<NextRequest, RequestContext>();
router.delete(removeFromWishlist);

export async function DELETE(request: NextRequest, ctx: RequestContext): Promise<NextResponse> {
  return router.run(request, ctx) as Promise<NextResponse>;
}
