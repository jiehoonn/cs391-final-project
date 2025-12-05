import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
// import Header from "@/components/Header";
import SessionProvider from "@/components/SessionProvider";
import React from "react";

export const metadata: Metadata = {
    title: "Assignment Tracker",
    description: "Plan and organize your tasks in one space.",
};

const inter = Inter({subsets: ["latin"] });

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={`${inter.className} antialiased min-h-screen`}>
                <SessionProvider>
                    {/* <Header/> */}
                    {children}
                </SessionProvider>
            </body>
        </html>
    );
}
