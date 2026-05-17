import { ThemeProvider } from "@/components/theme-provider";
import { Navbar } from "@/components/navbar";
import { ConditionalFooter } from "@/components/conditional-footer";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <Navbar />
      <main>{children}</main>
      <ConditionalFooter />
    </ThemeProvider>
  );
}
