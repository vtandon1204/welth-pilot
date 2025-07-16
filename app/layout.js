import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/header";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Welth Pilot",
  description:
    "Smart AI-powered platform that tracks your expenses, predicts spending, and helps you save better.",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en" className={inter.className}>
        <body>
          {/* header */}
          <Header></Header>
          <main className="min-h-screen">{children}</main>

          <Toaster richColors />
          {/* footer */}
          <footer className="footer bg-blue-50 py-12">
            <div className="container mx-auto footer-container px-4 text-center text-gray-600">
              <p className="footer-text">
                © 2025 <strong>Welth Pilot</strong>. All rights reserved.
              </p>
              <p className="footer-subtext">
                Smart AI-driven finance for everyone.
              </p>
              <div className="footer-socials">
                <a
                  href="https://www.linkedin.com/in/vtandon1204/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  LinkedIn
                </a>
                <span>•</span>
                <a
                  href="https://github.com/vtandon1204"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  GitHub
                </a>
              </div>
            </div>
          </footer>
        </body>
      </html>
    </ClerkProvider>
  );
}
