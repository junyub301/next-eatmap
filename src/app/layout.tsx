import "@/styles/globals.css";
import { Metadata } from "next";
import { NextLayout, NextProvider } from "./provider";

export const metadata: Metadata = {
    title: "Next EatMap",
    description: "Next.js 13을 이용한 맛집 앱",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body suppressHydrationWarning={true}>
                <NextProvider>
                    <NextLayout>{children}</NextLayout>
                </NextProvider>
            </body>
        </html>
    );
}
