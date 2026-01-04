import { NextRequest, NextResponse } from "next/server";
export async function uploadMiddleware(req: NextRequest, next: () => Promise<NextResponse>): Promise<NextResponse> {
  console.log("[uploadMiddleware] Processing request:", req.method, req.url);
  const start = Date.now();
  try { const res = await next(); console.log("[uploadMiddleware] Completed in", Date.now() - start, "ms"); return res; }
  catch (error) { console.error("[uploadMiddleware] Error:", error); return NextResponse.json({ error: "Internal error" }, { status: 500 }); }
}
export default uploadMiddleware;
