import { NextRequest, NextResponse } from "next/server";
export async function cacheMiddleware(req: NextRequest, next: () => Promise<NextResponse>): Promise<NextResponse> {
  console.log("[cacheMiddleware] Processing request:", req.method, req.url);
  const start = Date.now();
  try { const res = await next(); console.log("[cacheMiddleware] Completed in", Date.now() - start, "ms"); return res; }
  catch (error) { console.error("[cacheMiddleware] Error:", error); return NextResponse.json({ error: "Internal error" }, { status: 500 }); }
}
export default cacheMiddleware;
