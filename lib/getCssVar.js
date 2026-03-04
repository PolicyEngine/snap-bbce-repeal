/**
 * Read a CSS custom property value from the document root.
 * Used for Recharts SVG props which cannot inherit CSS variables.
 */
export default function getCssVar(name) {
  if (typeof window === "undefined") return "";
  return getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim();
}
