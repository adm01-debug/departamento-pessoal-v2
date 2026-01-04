import { NextRequest, NextResponse } from "next/server";
export async function auditMiddleware(req: NextRequest, next: () => Promise<NextResponse>): Promise<NextResponse> {
  console.log("[auditMiddleware] Processing request:", req.method, req.url);
  const start = Date.now();
  try { const res = await next(); console.log("[auditMiddleware] Completed in", Date.now() - start, "ms"); return res; }
  catch (error) { console.error("[auditMiddleware] Error:", error); return NextResponse.json({ error: "Internal error" }, { status: 500 }); }
}
export default auditMiddleware;
