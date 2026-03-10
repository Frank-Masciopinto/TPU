export function timeAgo(isoString) {
  if (!isoString) return "";
  const date = new Date(isoString);
  if (isNaN(date.getTime())) return "";

  const now = Date.now();
  const ms = now - date.getTime();

  if (ms < 0 || ms < 60000) return "just now";
  if (ms < 3600000) return `${Math.floor(ms / 60000)}m ago`;
  if (ms < 86400000) return `${Math.floor(ms / 3600000)}h ago`;
  if (ms < 604800000) return `${Math.floor(ms / 86400000)}d ago`;

  const currentYear = new Date().getFullYear();
  const dateYear = date.getFullYear();

  if (dateYear === currentYear) {
    return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(date);
  }

  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(date);
}
