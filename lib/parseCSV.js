/**
 * Parse a CSV string into an array of objects.
 * First row is treated as headers.
 * Numeric-looking values are converted to numbers.
 */
export default function parseCSV(text) {
  const lines = text.trim().split("\n");
  if (lines.length < 2) return [];
  const headers = lines[0].split(",").map((h) => h.trim());
  return lines.slice(1).map((line) => {
    const values = line.split(",").map((v) => v.trim());
    const row = {};
    headers.forEach((h, i) => {
      const v = values[i] ?? "";
      row[h] =
        v === "True"
          ? true
          : v === "False"
            ? false
            : v !== "" && !isNaN(v)
              ? Number(v)
              : v;
    });
    return row;
  });
}
