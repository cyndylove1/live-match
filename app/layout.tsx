import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "react-toastify/dist/ReactToastify.css";
import { ConnectionStatus } from "@/components/ConnectionStatus";
import { ToastContainer } from "react-toastify";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Live Match Center",
  description: "Real-time football match updates and chat",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-50`}>
        <ToastContainer
          limit={1}
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={true}
          closeOnClick
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
        <div className="min-h-screen">
          <header className="bg-white shadow">
            <div className="container mx-auto px-4 py-4">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="md:text-2xl text-xl font-bold text-gray-800">
                    ⚽ Live Match Center
                  </h1>
                  <p className="text-gray-600 text-sm">
                    Real-time football match updates
                  </p>
                </div>
                <ConnectionStatus />
              </div>
            </div>
          </header>

          <main className="container mx-auto px-4 py-8">{children}</main>

          <footer className="bg-white border-t mt-8">
            <div className="container mx-auto px-4 py-6">
              <div className="text-center text-gray-600 text-sm">
                <p>Live Match Center • Real-time football updates</p>
                <p className="mt-1">
                  Matches update every minute • Chat with other fans
                </p>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
