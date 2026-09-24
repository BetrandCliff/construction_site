// import './globals.css';
// import Header from '@/components/Header';
// import Footer from '@/components/Footer';
// export const metadata={title:'BuildVision | Construction & 3D Design',description:'Construction, architecture and interactive 3D design portfolio.'};
// export default function RootLayout({children}:{children:React.ReactNode}){return <><Header/><main>{children}</main><Footer/></>}


import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "BuildVision | Construction & Architectural Design",
  description:
    "Professional construction, architectural design and interactive 3D visualization services.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
       
      <body>
        <Navbar />
        {children}

        <footer className="bg-gray-950 text-white py-12 mt-16">
          <div className="container flex flex-col md:flex-row justify-between gap-6">
            <div>
              <h3 className="text-xl font-bold">BuildSpace</h3>
              <p className="text-gray-400 mt-2">Construction & Architectural Design</p>
            </div>
            <p className="text-gray-400">© 2026 BuildSpace. All rights reserved.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}