export const fmt = (n) =>
  `KSh ${Number(n || 0).toLocaleString(
    "en-KE",
    {
      minimumFractionDigits: 2
    }
  )}`;