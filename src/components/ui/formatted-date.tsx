function FormattedDate({ isoDate }: { isoDate: string }) {
  const date = new Date(isoDate);

  const formatted = `${date.getFullYear()}年${
    date.getMonth() + 1
  }月${date.getDate()}日 ${date.getHours().toString().padStart(2, "0")}:${date
    .getMinutes()
    .toString()
    .padStart(2, "0")}`;

  return <span>{formatted}</span>;
}

export default FormattedDate;
