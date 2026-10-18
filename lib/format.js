
const currencyFormatter = new Intl.NumberFormat("en-ET", {
  style: "currency",
  currency: "ETB",
  maximumFractionDigits: 2,
});

const dateFormatter = new Intl.DateTimeFormat("en-GB", {
  dateStyle: "medium",
  timeStyle: "short",
});

export function formatETB(value) {
  const amount = Number(value);

  if (!Number.isFinite(amount)) {
    return "ETB 0.00";
  }

  return currencyFormatter.format(amount).replace("ETB", "ETB");
}

export function formatDate(value) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Date unavailable";
  }

  return dateFormatter.format(date);
}

export function formatRelativeTime(value, now = Date.now()) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Time unavailable";
  }

  const seconds = Math.round((date.getTime() - now) / 1000);
  const absoluteSeconds = Math.abs(seconds);

  if (absoluteSeconds < 60) {
    return seconds <= 0 ? "Just now" : "In a moment";
  }

  const minutes = Math.round(seconds / 60);

  if (Math.abs(minutes) < 60) {
    return minutes < 0
      ? `${Math.abs(minutes)} minute${Math.abs(minutes) === 1 ? "" : "s"} ago`
      : `In ${minutes} minute${minutes === 1 ? "" : "s"}`;
  }

  const hours = Math.round(minutes / 60);

  if (Math.abs(hours) < 24) {
    return hours < 0
      ? `${Math.abs(hours)} hour${Math.abs(hours) === 1 ? "" : "s"} ago`
      : `In ${hours} hour${hours === 1 ? "" : "s"}`;
  }

  const days = Math.round(hours / 24);

  return days < 0
    ? `${Math.abs(days)} day${Math.abs(days) === 1 ? "" : "s"} ago`
    : `In ${days} day${days === 1 ? "" : "s"}`;
}
