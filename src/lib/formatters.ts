export function formatBudget(amount: number): string {
  return "$" + amount.toLocaleString("en-US");
}

export function formatDuration(days: number): string {
  return days === 1 ? "1 day" : `${days} days`;
}

export function formatTripDate(dateStr: string): string {
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return "Invalid Date";
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}
