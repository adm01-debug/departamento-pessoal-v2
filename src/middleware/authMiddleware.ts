import { NextRequest, NextResponse } from "next/server";
export async function authMiddleware(req: NextRequest, next: () => Promise<NextResponse>): Promise<NextResponse> {
  console.log("[authMiddleware] Processing request:", req.method, req.url);
  const start = Date.now();
  try { const res = await next(); console.log("[authMiddleware] Completed in", Date.now() - start, "ms"); return res; }
  catch (error) { console.error("[authMiddleware] Error:", error); return NextResponse.json({ error: "Internal error" }, { status: 500 }); }
}
export default authMiddleware;
