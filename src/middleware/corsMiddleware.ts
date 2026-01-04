import { NextRequest, NextResponse } from "next/server";
export async function corsMiddleware(req: NextRequest, next: () => Promise<NextResponse>): Promise<NextResponse> {
  console.log("[corsMiddleware] Processing request:", req.method, req.url);
  const start = Date.now();
  try { const res = await next(); console.log("[corsMiddleware] Completed in", Date.now() - start, "ms"); return res; }
  catch (error) { console.error("[corsMiddleware] Error:", error); return NextResponse.json({ error: "Internal error" }, { status: 500 }); }
}
export default corsMiddleware;
