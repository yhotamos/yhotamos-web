import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { appendFeedback } from "@/lib/googleSheets";
import type { FeedbackEntry } from "@/components/types/feedback";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const body: FeedbackEntry = await req.json();
    const { type, title, detail } = body;

    if (!type || !title || !detail) {
      return NextResponse.json({ ok: false, error: "必須項目が不足しています" }, { status: 400 });
    }

    const TYPE_LABELS: Record<string, string> = {
      typo: "誤字・誤情報の報告",
      impression: "感想",
      other: "その他",
    };
    const typeLabel = TYPE_LABELS[type] ?? type;

    const subject = `【サイト・${typeLabel}】${title}`;

    const lines: string[] = [
      "サイトに関するお問い合わせを受信しました．",
      "",
      "【基本情報】",
      `種別：${typeLabel}`,
      "",
      "【件名】",
      title,
      "",
      "【お問い合わせ内容】",
      detail,
    ];

    if (body.contact) {
      lines.push("", "【ご連絡先】", body.contact);
    }

    const text = lines.join("\n");

    await Promise.all([
      appendFeedback(body),
      resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL!,
        to: process.env.RESEND_TO_EMAIL!,
        subject,
        text,
      }),
    ]);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[feedback] error:", err);
    return NextResponse.json({ ok: false, error: "送信に失敗しました" }, { status: 500 });
  }
}
