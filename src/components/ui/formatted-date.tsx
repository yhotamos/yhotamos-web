"use client";

import { useSyncExternalStore } from "react";

type DateValue = string | Date | number;

function parseDate(value: DateValue) {
  if (typeof value === "string") {
    const parts = value.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})$/);
    if (parts) {
      return new Date(`${parts[1]}-${parts[2].padStart(2, "0")}-${parts[3].padStart(2, "0")}T00:00:00Z`);
    }
  }
  return new Date(value);
}

function subscribe() {
  return () => {};
}

export function FormattedDate({ isoDate, isTime = false }: { isoDate: DateValue; isTime?: boolean }) {
  const date = parseDate(isoDate);
  const options = { timeZone: "Asia/Tokyo" };

  if (isTime) {
    return <span>{date.toLocaleString("ja-JP", options)}</span>;
  }

  return <span>{date.toLocaleDateString("ja-JP", options)}</span>;
}

export function DiffDate({ isoDate }: { isoDate: DateValue }) {
  const date = parseDate(isoDate);
  // 保存されたHTMLと初回描画を一致させ，経過日数はブラウザーで計算する．
  const diff = useSyncExternalStore(
    subscribe,
    () => Math.floor((Date.now() - date.getTime()) / 86_400_000),
    () => null,
  );

  return <span>{diff === null ? null : `${diff}日前`}</span>;
}
