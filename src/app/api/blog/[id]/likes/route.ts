// app/api/comments/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getLikes, updateLikes } from "@/lib/googleSheets";

/** GET: コメント一覧を返す */
export async function GET(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const likes = await getLikes(id);
    return NextResponse.json({ ok: true, likes });
  } catch (err: any) {
    console.error("GET /api/comments error:", err);
    return NextResponse.json(
      { ok: false, error: "Failed to load comments" },
      { status: 500 }
    );
  }
}

// /** POST: コメントを追加 */
export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const likes = await updateLikes(id);
    return NextResponse.json({ ok: true, likes });
  } catch (err) {
    return NextResponse.json({ ok: false, error: "Failed to update likes" }, { status: 500 });
  }
}
