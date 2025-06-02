"use client";
import { useLoadUserQuery } from "@/redux/features/api/apiSlice";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import { Josefin_Sans, Poppins } from "next/font/google";
import React from "react";
import { Toaster } from "react-hot-toast";
import Loader from "./components/Loader/Loader";
import "./globals.css";
import Providers from "./Provider";
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
});

const josefin = Josefin_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-josefin",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${poppins.variable} ${josefin.variable} bg-white! bg-no-repeat dark:bg-linear-to-b dark:from-gray-900 dark:to-black duration-300`}
      >
        <Providers>
          <SessionProvider>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
              <Custom>{children}</Custom>
              <Toaster position="top-center" reverseOrder={false} />
            </ThemeProvider>
          </SessionProvider>
        </Providers>
      </body>
    </html>
  );
}

const Custom = ({ children }: { children: React.ReactNode }) => {
  const { isLoading } = useLoadUserQuery({});
  return <>{isLoading ? <Loader /> : <>{children}</>}</>;
};
