import { NavigationProvider } from "@/contexts/navigation-context";
import { FavoritesProvider } from "@/contexts/favorites-context";
import { DatabaseProvider } from "@/contexts/database-context";
import { SettingsProvider } from "@/contexts/settings-context";
import { ModalProvider } from "@/contexts/modal-context";
import { ArchiveProvider } from "@/contexts/archive-context";
import React from "react";

const providers = [
  SettingsProvider,
  DatabaseProvider,
  NavigationProvider,
  FavoritesProvider,
  ModalProvider,
  ArchiveProvider,
];

export const AppProviders = ({ children }) => {
  return providers.reduceRight((acc, Provider) => {
    return <Provider>{acc}</Provider>;
  }, children);
};
