// app/api/comments/route.ts
import { NextRequest, NextResponse } from "next/server";
import { appendComment, getComments, SheetComment } from "@/lib/googleSheets";

/** GET: コメント一覧を返す */
export async function GET(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const comments = await getComments(id);
    return NextResponse.json({ ok: true, comments });
  } catch (err: any) {
    console.error("GET /api/comments error:", err);
    return NextResponse.json(
      { ok: false, error: "Failed to load comments" },
      { status: 500 }
    );
  }
}

/** POST: コメントを追加 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const blogId: string = (body?.blogId ?? "").trim();
    const text: string = (body?.text ?? "").trim();
    const author: string = (body?.author ?? "匿名ユーザー").trim();

    if (!text) {
      return NextResponse.json(
        { ok: false, error: "text is required" },
        { status: 400 }
      );
    }

    const id = Date.now().toString();

    // JST（Asia/Tokyo）ISO風：new Date().toISOString()はUTCなので手動変換
    const createdAt = new Date().toLocaleString("sv-SE", { timeZone: "Asia/Tokyo", hour12: false }).replace(" ", "T") + "+09:00";

    // シート保存
    const comment: SheetComment = { blogId, id, text, author, createdAt, likes: 0 };
    await appendComment(comment);

    return NextResponse.json({ ok: true, comment });
  } catch (err: any) {
    console.error("POST /api/comments error:", err);
    return NextResponse.json(
      { ok: false, error: "Failed to append comment" },
      { status: 500 }
    );
  }
}
