import { NextRequest, NextResponse } from "next/server";
export async function sanitizeMiddleware(req: NextRequest, next: () => Promise<NextResponse>): Promise<NextResponse> {
  console.log("[sanitizeMiddleware] Processing request:", req.method, req.url);
  const start = Date.now();
  try { const res = await next(); console.log("[sanitizeMiddleware] Completed in", Date.now() - start, "ms"); return res; }
  catch (error) { console.error("[sanitizeMiddleware] Error:", error); return NextResponse.json({ error: "Internal error" }, { status: 500 }); }
}
export default sanitizeMiddleware;
