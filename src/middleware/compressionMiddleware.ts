import { NextRequest, NextResponse } from "next/server";
export async function compressionMiddleware(req: NextRequest, next: () => Promise<NextResponse>): Promise<NextResponse> {
  console.log("[compressionMiddleware] Processing request:", req.method, req.url);
  const start = Date.now();
  try { const res = await next(); console.log("[compressionMiddleware] Completed in", Date.now() - start, "ms"); return res; }
  catch (error) { console.error("[compressionMiddleware] Error:", error); return NextResponse.json({ error: "Internal error" }, { status: 500 }); }
}
export default compressionMiddleware;
