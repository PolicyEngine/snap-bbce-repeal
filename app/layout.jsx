import "./globals.css";

export const metadata = {
  title: "SNAP BBCE repeal analysis | PolicyEngine",
  description:
    "Impact analysis of repealing SNAP Broad-Based Categorical Eligibility (BBCE): who loses eligibility, budgetary savings, distributional effects, and state-by-state breakdowns.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://unpkg.com/@policyengine/design-system/dist/tokens.css"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
