import { NextRequest, NextResponse } from "next/server";
export async function validationMiddleware(req: NextRequest, next: () => Promise<NextResponse>): Promise<NextResponse> {
  console.log("[validationMiddleware] Processing request:", req.method, req.url);
  const start = Date.now();
  try { const res = await next(); console.log("[validationMiddleware] Completed in", Date.now() - start, "ms"); return res; }
  catch (error) { console.error("[validationMiddleware] Error:", error); return NextResponse.json({ error: "Internal error" }, { status: 500 }); }
}
export default validationMiddleware;
