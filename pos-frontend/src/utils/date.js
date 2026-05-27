export const getTimestamp = () =>
  new Date().toLocaleString(
    "en-KE",
    {
      dateStyle: "medium",
      timeStyle: "short"
    }
  );