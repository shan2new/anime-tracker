// src/context/WatchListContext.tsx
import React, { createContext, useContext, useState, ReactNode } from "react";

interface Anime {
  id: number;
  title: { romaji: string; english?: string };
  nextAiringEpisode?: { airingAt: number };
  season: string;
  seasonYear: number;
  coverImage: {
    extraLarge: string;
    large: string;
    medium: string;
  };
}

interface WatchListContextType {
  watchList: Anime[];
  addToWatchList: (anime: Anime) => void;
  removeFromWatchList: (id: number) => void;
}

const WatchListContext = createContext<WatchListContextType | undefined>(undefined);

export const WatchListProvider = ({ children }: { children: ReactNode }) => {
  const [watchList, setWatchList] = useState<Anime[]>([]);

  const addToWatchList = (anime: Anime) => {
    setWatchList((prev) => {
      if (!prev.find((a) => a.id === anime.id)) {
        return [...prev, anime];
      }
      return prev;
    });
  };

  const removeFromWatchList = (id: number) => {
    setWatchList((prev) => prev.filter((anime) => anime.id !== id));
  };

  return (
    <WatchListContext.Provider value={{ watchList, addToWatchList, removeFromWatchList }}>
      {children}
    </WatchListContext.Provider>
  );
};

export const useWatchList = () => {
  const context = useContext(WatchListContext);
  if (!context) {
    throw new Error("useWatchList must be used within a WatchListProvider");
  }
  return context;
};