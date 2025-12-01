import { Playfair_Display } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import SessionProvider from "@/components/SessionProvider";
import React from "react";

const playfair = Playfair_Display({subsets: ["latin"] });

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={`${playfair.className} antialiased min-h-screen bg-pink-50`}>
                <SessionProvider>
                    <Header/>
                    {children}
                </SessionProvider>
            </body>
        </html>
    );
}
