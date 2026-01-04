import { NextRequest, NextResponse } from "next/server";
export async function loggingMiddleware(req: NextRequest, next: () => Promise<NextResponse>): Promise<NextResponse> {
  console.log("[loggingMiddleware] Processing request:", req.method, req.url);
  const start = Date.now();
  try { const res = await next(); console.log("[loggingMiddleware] Completed in", Date.now() - start, "ms"); return res; }
  catch (error) { console.error("[loggingMiddleware] Error:", error); return NextResponse.json({ error: "Internal error" }, { status: 500 }); }
}
export default loggingMiddleware;
