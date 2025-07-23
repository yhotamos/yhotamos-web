export function FormattedDate({ isoDate, isTime = false }: { isoDate: string | Date | number; isTime?: boolean }) {
  const date = new Date(isoDate);

  const formatted = date.toLocaleString();

  if (isTime) {
    return <span>{formatted}</span>;
  }

  return <span>{formatted.split(" ")[0]}</span>;
}

export function DiffDate({ isoDate }: { isoDate: string | Date | number }) {
  const date = new Date(isoDate);
  const diff = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000 / 60 / 60 / 24);

  return <span>{diff}日前</span>;
}
