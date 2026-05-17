"use client";

import { useState, useEffect, useCallback } from "react";
import type { ReadonlyURLSearchParams } from "next/navigation";

interface Options {
  searchParams: ReadonlyURLSearchParams;
  tab: string;
  selectedTags: string[];
  onClearTags?: () => void;
  onSwitchToAll?: () => void;
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

export function useBlogDateFilter({ searchParams, tab, selectedTags, onClearTags, onSwitchToAll }: Options) {
  const [selectedYear, setSelectedYear] = useState<number | null>(() => {
    const y = searchParams.get("year");
    return y ? Number(y) : null;
  });
  const [selectedMonth, setSelectedMonth] = useState<number | null>(() => {
    const m = searchParams.get("month");
    return m ? Number(m) : null;
  });
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const y = searchParams.get("year");
    const m = searchParams.get("month");
    setSelectedYear(y ? Number(y) : null);
    setSelectedMonth(m ? Number(m) : null);
  }, [searchParams]);

  const reset = useCallback(() => {
    setSelectedYear(null);
    setSelectedMonth(null);
    setSearchQuery("");
  }, []);

  const handleMonthClick = useCallback(
    (year: number, month: number) => {
      const isSame = selectedYear === year && selectedMonth === month;
      const newYear = isSame ? null : year;
      const newMonth = isSame ? null : month;
      setSelectedYear(newYear);
      setSelectedMonth(newMonth);
      onClearTags?.();
      onSwitchToAll?.();
      pushURL(buildAllTabParams(newYear, newMonth));
    },
    [selectedYear, selectedMonth, onClearTags, onSwitchToAll],
  );

  const handleYearChange = useCallback((year: number | null) => {
    setSelectedYear(year);
    setSelectedMonth(null);
    pushURL(buildAllTabParams(year, null));
  }, []);

  const handleMonthSelectChange = useCallback(
    (month: number | null) => {
      setSelectedMonth(month);
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
