import Controls from "@/components/controls";
import { AppProviders } from "./providers";
import { geist, inter, montserrat } from "@/fonts";
import Nav from "@/components/nav";
import "./globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${montserrat.className} ${montserrat.variable} ${geist.variable} w-full h-auto scroll-smooth antialiased bg-white text-black dark:bg-black dark:text-white fill-black dark:fill-white`}
      >
        <AppProviders>
          {children}
          <Nav />
          <Controls />
        </AppProviders>
      </body>
    </html>
  );
}
