import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://relevantresearch.org";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: "Relevant Research - Web Development, Data Analysis & Public Impact",
  description:
    "We help scholars amplify their research visibility and influence through web development, data analysis, and strategic public impact solutions.",
  openGraph: {
    title: "Relevant Research - Web Development, Data Analysis & Public Impact",
    description:
      "We help scholars amplify their research visibility and influence through web development, data analysis, and strategic public impact solutions.",
    url: BASE_URL,
    siteName: "Relevant Research",
    images: [
      {
        url: "/assets/images/relevant_research.png",
        width: 1200,
        height: 630,
        alt: "Relevant Research Social Card",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Relevant Research - Web Development, Data Analysis & Public Impact",
    description:
      "We help scholars amplify their research visibility and influence through web development, data analysis, and strategic public impact solutions.",
    images: ["/assets/images/relevant_research.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
