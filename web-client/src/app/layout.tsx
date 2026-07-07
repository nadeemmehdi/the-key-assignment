import type { Metadata } from "next";
import "./globals.css";
import { messages } from "@/shared/i18n/messages";
import { DemoPreferencesProvider } from "@/shared/providers/demo-preferences-provider";
import { QueryProvider } from "@/shared/providers/query-provider";

const defaultCopy = messages.en;

export const metadata: Metadata = {
  title: defaultCopy.appMetaTitle,
  description: defaultCopy.appMetaDescription
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <QueryProvider>
          <DemoPreferencesProvider>{children}</DemoPreferencesProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
