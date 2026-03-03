import "./globals.css";

export const metadata = {
  title: "SNAP BBCE repeal analysis | PolicyEngine",
  description:
    "Impact analysis of repealing SNAP Broad-Based Categorical Eligibility (BBCE): who loses eligibility, budgetary savings, distributional effects, and state-by-state breakdowns.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
