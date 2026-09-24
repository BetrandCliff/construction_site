import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageMotion from "@/components/PageMotion";
export const metadata: Metadata = {
  title: "BuildVision | Construction & Architectural Design",
  description:
    "Professional construction, architectural design and interactive 3D visualization services.",
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main><PageMotion>{children}</PageMotion></main>
        <Footer />
      </body>
    </html>
  );
}
