"use client";

import { useState, useCallback } from "react";
import type { ReadonlyURLSearchParams } from "next/navigation";

interface Options {
  searchParams: ReadonlyURLSearchParams;
  tab: string;
  selectedTags: string[];
}

function pushURL(params: URLSearchParams) {
  window.history.replaceState(null, "", `/blog?${decodeURIComponent(params.toString())}`);
}

function buildAllTabParams(year: number | null, month: number | null): URLSearchParams {
  const params = new URLSearchParams();
  params.set("tab", "all");
  if (year !== null) params.set("year", String(year));
  if (month !== null) params.set("month", String(month));
  return params;
}

export function useBlogDateFilter({ searchParams, tab, selectedTags }: Options) {
  const year = searchParams.get("year");
  const month = searchParams.get("month");
  const selectedYear = year ? Number(year) : null;
  const selectedMonth = month ? Number(month) : null;
  const [searchQuery, setSearchQuery] = useState("");

  const reset = useCallback(() => {
    setSearchQuery("");
  }, []);

  const handleMonthClick = useCallback(
    (year: number, month: number) => {
      const isSame = selectedYear === year && selectedMonth === month;
      const newYear = isSame ? null : year;
      const newMonth = isSame ? null : month;
      pushURL(buildAllTabParams(newYear, newMonth));
    },
    [selectedYear, selectedMonth],
  );

  const handleYearChange = useCallback((year: number | null) => {
    pushURL(buildAllTabParams(year, null));
  }, []);

  const handleMonthSelectChange = useCallback(
    (month: number | null) => {
      pushURL(buildAllTabParams(selectedYear, month));
    },
    [selectedYear],
  );

  const handleClearDateFilter = useCallback(() => {
    reset();
    const params = new URLSearchParams();
    params.set("tab", tab);
    selectedTags.forEach((t) => params.append("tag", t));
    pushURL(params);
  }, [reset, tab, selectedTags]);

  return {
    selectedYear,
    selectedMonth,
    searchQuery,
    setSearchQuery,
    reset,
    handleMonthClick,
    handleYearChange,
    handleMonthSelectChange,
    handleClearDateFilter,
  };
}
