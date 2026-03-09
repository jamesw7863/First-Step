import type { Metadata } from "next";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "InternList",
  description: "Daily internship digests for students across majors"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
