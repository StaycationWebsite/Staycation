import { NextRequest, NextResponse } from "next/server";
import { getAllActivityLogs, createActivityLog, deleteActivityLog } from "@/backend/controller/activityLogController";

export async function GET(request: NextRequest): Promise<NextResponse> {
  return getAllActivityLogs(request);
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  return createActivityLog(request);
}

export async function DELETE(request: NextRequest): Promise<NextResponse> {
  return deleteActivityLog(request);
}
