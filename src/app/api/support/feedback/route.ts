import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { appendFeedback } from "@/lib/googleSheets";
import type { FeedbackCategory, FeedbackEntry } from "@/components/types/feedback";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const body: FeedbackEntry = await req.json();
    const { category, type, toolName, title, detail } = body;
    const isTool = category === "tool";
    const isBug = type === "bug";

    if (!category || !type || !title || !detail) {
      return NextResponse.json({ ok: false, error: "必須項目が不足しています" }, { status: 400 });
    }

    if (isTool && !toolName) {
      return NextResponse.json({ ok: false, error: "ツール名を選択してください" }, { status: 400 });
    }

    if (isTool && isBug && (!body.browser || !body.bugType)) {
      return NextResponse.json({ ok: false, error: "ブラウザと問題の種類を選択してください" }, { status: 400 });
    }

    const TYPE_LABELS: Record<string, string> = {
      typo: "誤字・誤情報の報告",
      impression: "感想",
      other: "その他",
      bug: "バグ報告",
      suggestion: "改善提案",
    };
    const typeLabel = TYPE_LABELS[type] ?? type;

    const CATEGORY_LABELS: Record<FeedbackCategory, string> = {
      site: "サイト全般",
      tool: "公開ツール",
    };

    const subject = isTool ? `【ツール・${typeLabel}】${title}` : `【サイト・${typeLabel}】${title}`;

    const lines: string[] = [
      `${isTool ? "ツール" : "サイト"}に関するお問い合わせを受信しました．`,
      "",

      "【基本情報】",
      `カテゴリ：${CATEGORY_LABELS[category]}`,
      ...(isTool ? [`ツール名：${toolName}`] : []),
      `種別：${typeLabel}`,

      ...(isTool && isBug ? [`ブラウザ：${body.browser}`, `問題の種類：${body.bugType}`] : []),

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

    if (body.attachmentName) {
      lines.push("", "【添付ファイル】", body.attachmentName);
    }

    const text = lines.join("\n");

    const attachments = body.attachmentData && body.attachmentName ? [{ filename: body.attachmentName, content: body.attachmentData }] : undefined;

    await Promise.all([
      appendFeedback(body),
      resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL!,
        to: process.env.RESEND_TO_EMAIL!,
        subject,
        text,
        attachments,
      }),
    ]);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[feedback] error:", err);
    return NextResponse.json({ ok: false, error: "送信に失敗しました" }, { status: 500 });
  }
}
