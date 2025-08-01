// app/layout.tsx
import "@radix-ui/themes/styles.css";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import { Theme } from "@radix-ui/themes";
import Nav from ".././components/Nav";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Theme
          appearance="dark"
          accentColor="indigo"
          grayColor="slate"
          panelBackground="solid"
          radius="large"
          scaling="95%"
        >
          <Nav />
          {children}
        </Theme>
      </body>
    </html>
  );
}
