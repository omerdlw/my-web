import { NavigationProvider } from "@/contexts/navigation-context";
import { FavoritesProvider } from "@/contexts/favorites-context";
import { DatabaseProvider } from "@/contexts/database-context";
import { SettingsProvider } from "@/contexts/settings-context";
import { ModalProvider } from "@/contexts/modal-context";
import Controls from "@/components/controls";
import Nav from "@/components/nav";
import "./globals.css";
import { montserrat } from "@/fonts";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${montserrat.className} w-full h-auto scroll-smooth antialiased bg-white text-black dark:bg-black dark:text-white fill-black dark:fill-white`}
      >
        <SettingsProvider>
          <DatabaseProvider>
            <NavigationProvider>
              <ModalProvider>
                <FavoritesProvider>
                  {children}
                  <Nav />
                  <Controls />
                </FavoritesProvider>
              </ModalProvider>
            </NavigationProvider>
          </DatabaseProvider>
        </SettingsProvider>
      </body>
    </html>
  );
}
