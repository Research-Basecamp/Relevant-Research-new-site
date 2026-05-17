import { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://relevantresearch.org",
  ),
  title: "Our Team | Relevant Research",
  description:
    "Meet our expert team of web developers, data scientists, and public impact strategists working together to create meaningful change.",
  keywords: [
    "team",
    "staff",
    "experts",
    "data science",
    "web development",
    "public impact",
  ],
  openGraph: {
    title: "Our Team | Relevant Research",
    description:
      "Meet our expert team of web developers, data scientists, and public impact strategists working together to create meaningful change.",
    type: "website",
    siteName: "Relevant Research",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Our Team | Relevant Research",
    description:
      "Meet our expert team of web developers, data scientists, and public impact strategists working together to create meaningful change.",
  },
};

export default function TeamLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
