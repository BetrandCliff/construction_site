import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageMotion from "@/components/PageMotion";
import ToastProvider from "@/components/ToastProvider";
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
      <body><ToastProvider>
        <Navbar />
        <main><PageMotion>{children}</PageMotion></main>
        <Footer />
      </ToastProvider></body>
    </html>
  );
}
