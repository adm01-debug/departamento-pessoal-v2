import { NextRequest, NextResponse } from "next/server";
export async function webhookMiddleware(req: NextRequest, next: () => Promise<NextResponse>): Promise<NextResponse> {
  console.log("[webhookMiddleware] Processing request:", req.method, req.url);
  const start = Date.now();
  try { const res = await next(); console.log("[webhookMiddleware] Completed in", Date.now() - start, "ms"); return res; }
  catch (error) { console.error("[webhookMiddleware] Error:", error); return NextResponse.json({ error: "Internal error" }, { status: 500 }); }
}
export default webhookMiddleware;
