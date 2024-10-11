import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "image-thing",
  description: "Upload and manage image files with Pinata",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
