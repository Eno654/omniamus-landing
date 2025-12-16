import "./globals.css";

export const metadata = {
  title: "Omniamus — Truth. Reward. Freedom.",
  description: "A creator-first content marketplace where attention has measurable value. Privacy by design.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
