import { NextRequest, NextResponse } from "next/server";
export async function notificationMiddleware(req: NextRequest, next: () => Promise<NextResponse>): Promise<NextResponse> {
  console.log("[notificationMiddleware] Processing request:", req.method, req.url);
  const start = Date.now();
  try { const res = await next(); console.log("[notificationMiddleware] Completed in", Date.now() - start, "ms"); return res; }
  catch (error) { console.error("[notificationMiddleware] Error:", error); return NextResponse.json({ error: "Internal error" }, { status: 500 }); }
}
export default notificationMiddleware;
