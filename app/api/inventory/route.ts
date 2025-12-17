import { createInventoryItem, getAllInventory } from "@/backend/controller/inventoryController";
import { createEdgeRouter } from "next-connect";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

interface RequestContext {}

const router = createEdgeRouter<NextRequest, RequestContext>();

router.get(getAllInventory);
router.post(createInventoryItem);

export async function GET(request: NextRequest, ctx: RequestContext): Promise<NextResponse> {
  return router.run(request, ctx) as Promise<NextResponse>;
}

export async function POST(request: NextRequest, ctx: RequestContext): Promise<NextResponse> {
  return router.run(request, ctx) as Promise<NextResponse>;
}
