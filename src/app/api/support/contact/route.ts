import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { appendContact } from "@/lib/googleSheets";
import type { ContactEntry } from "@/components/types/contact";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const body: ContactEntry = await req.json();
    const { name, email, subject, message } = body;

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ ok: false, error: "必須項目が不足しています" }, { status: 400 });
    }

    await Promise.all([
      appendContact({ name, email, subject, message }),
      resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL!,
        to: process.env.RESEND_TO_EMAIL!,
        replyTo: email,
        subject: `[お問い合わせ] ${subject}`,
        text: `名前: ${name}\nメール: ${email}\n件名: ${subject}\n\n${message}`,
      }),
    ]);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[contact] error:", err);
    return NextResponse.json({ ok: false, error: "送信に失敗しました" }, { status: 500 });
  }
}
