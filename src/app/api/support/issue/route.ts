import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { appendIssue } from "@/lib/googleSheets";
import type { IssueEntry } from "@/components/types/feedback";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const body: IssueEntry = await req.json();
    const { toolName, type, title, detail } = body;
    const isBug = type === "bug";

    if (!toolName || !type || !title || !detail) {
      return NextResponse.json({ ok: false, error: "必須項目が不足しています" }, { status: 400 });
    }

    if (isBug && (!body.browser || !body.bugType)) {
      return NextResponse.json({ ok: false, error: "ブラウザと問題の種類を選択してください" }, { status: 400 });
    }

    const TYPE_LABELS: Record<string, string> = {
      bug: "バグ報告",
      suggestion: "改善提案",
      impression: "感想",
      other: "その他",
    };
    const GITHUB_LABELS: Record<string, string[]> = {
      bug: ["bug"],
      suggestion: ["enhancement"],
      impression: [],
      other: [],
    };
    const typeLabel = TYPE_LABELS[type] ?? type;

    // GitHub Issues に POST
    const issueBodyLines = [
      `## 概要`,
      detail,
      "",
    ];
    if (isBug) {
      issueBodyLines.push(
        `## 環境`,
        `- ブラウザ: ${body.browser}`,
        `- 問題の種類: ${body.bugType}`,
        "",
      );
    }
    if (body.attachmentName) {
      issueBodyLines.push(`## 添付ファイル`, `${body.attachmentName}（メール添付）`, "");
    }
    if (body.contact) {
      issueBodyLines.push(`## 連絡先`, body.contact);
    }
    const issueBody = issueBodyLines.join("\n");

    const githubToken = process.env.GITHUB_TOKEN;
    let githubIssueUrl = "";
    if (githubToken) {
      const githubRes = await fetch(`https://api.github.com/repos/yhotta240/${toolName}/issues`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${githubToken}`,
          "Content-Type": "application/json",
          Accept: "application/vnd.github+json",
          "X-GitHub-Api-Version": "2022-11-28",
        },
        body: JSON.stringify({
          title: `[${typeLabel}] ${title}`,
          body: issueBody,
          labels: GITHUB_LABELS[type] ?? [],
        }),
      });
      if (githubRes.ok) {
        const data = await githubRes.json();
        githubIssueUrl = data.html_url ?? "";
      }
    }

    // メール本文
    const subject = `【ツール・${typeLabel}】${title}`;
    const lines: string[] = [
      "ツールに関するお問い合わせを受信しました．",
      "",
      "【基本情報】",
      `ツール名：${toolName}`,
      `種別：${typeLabel}`,
      ...(isBug ? [`ブラウザ：${body.browser}`, `問題の種類：${body.bugType}`] : []),
      "",
      "【件名】",
      title,
      "",
      "【お問い合わせ内容】",
      detail,
    ];
    if (body.contact) lines.push("", "【ご連絡先】", body.contact);
    if (body.attachmentName) lines.push("", "【添付ファイル】", body.attachmentName);
    if (githubIssueUrl) lines.push("", "【GitHub Issue】", githubIssueUrl);

    const text = lines.join("\n");
    const attachments = body.attachmentData && body.attachmentName
      ? [{ filename: body.attachmentName, content: body.attachmentData }]
      : undefined;

    await Promise.all([
      appendIssue(body),
      resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL!,
        to: process.env.RESEND_TO_EMAIL!,
        subject,
        text,
        attachments,
      }),
    ]);

    return NextResponse.json({ ok: true, githubIssueUrl });
  } catch (err) {
    console.error("[issue] error:", err);
    return NextResponse.json({ ok: false, error: "送信に失敗しました" }, { status: 500 });
  }
}
