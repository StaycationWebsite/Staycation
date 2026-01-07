import {
  createInventoryItem,
  deleteInventoryItem,
  getAllInventory,
  updateInventoryItem,
} from "@/backend/controller/inventoryController";
import { createEdgeRouter } from "next-connect";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

type RequestContext = Record<string, never>;

const router = createEdgeRouter<NextRequest, RequestContext>();

router.get(getAllInventory);
router.post(createInventoryItem);
router.put(updateInventoryItem);
router.delete(deleteInventoryItem);

export async function GET(request: NextRequest, ctx: RequestContext): Promise<NextResponse> {
  return router.run(request, ctx) as Promise<NextResponse>;
}

export async function POST(request: NextRequest, ctx: RequestContext): Promise<NextResponse> {
  return router.run(request, ctx) as Promise<NextResponse>;
}

export async function PUT(request: NextRequest, ctx: RequestContext): Promise<NextResponse> {
  return router.run(request, ctx) as Promise<NextResponse>;
}

export async function DELETE(request: NextRequest, ctx: RequestContext): Promise<NextResponse> {
  return router.run(request, ctx) as Promise<NextResponse>;
}
