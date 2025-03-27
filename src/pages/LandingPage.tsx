// src/pages/LandingPage.tsx
import React from "react";
import { useWatchList } from "../context/WatchListContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import moment from "moment";

const LandingPage: React.FC = () => {
  const { watchList, removeFromWatchList } = useWatchList();
  const navigate = useNavigate();

  const handleCardClick = (id: number) => {
    navigate(`/anime/${id}`);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="max-w-3xl mx-auto p-4">
        <h1 className="text-4xl font-extrabold mb-8 text-primary text-center">
          Your Watch List
        </h1>
        {watchList.length === 0 ? (
          <p className="text-lg text-muted-foreground text-center">
            You haven't added any anime yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {watchList.map((anime) => (
              <Card
                key={anime.id}
                onClick={() => handleCardClick(anime.id)}
                className="bg-surface shadow-md hover:shadow-xl transition-all transform hover:scale-105 cursor-pointer rounded-lg overflow-hidden"
              >
                <CardContent className="flex flex-col md:flex-row items-center gap-4 p-4">
                  {anime.coverImage && (
                    <img
                      src={
                        anime.coverImage.extraLarge ||
                        anime.coverImage.large ||
                        anime.coverImage.medium
                      }
                      alt={anime.title.english || anime.title.romaji}
                      className="w-20 h-28 rounded-md shadow-md object-cover flex-shrink-0"
                    />
                  )}
                  <div className="flex-1">
                    <h2 className="text-xl font-semibold">
                      {anime.title.english || anime.title.romaji}
                    </h2>
                    <div className="mt-1 space-y-1 text-sm text-muted-foreground">
                      {anime.season && anime.seasonYear && (
                        <p>
                          Season: {anime.season} ({anime.seasonYear})
                        </p>
                      )}
                      {anime.nextAiringEpisode ? (
                        <div className="mt-1">
                          <span className="inline-block bg-primary text-primary-foreground text-md font-bold px-3 py-1 rounded-full">
                            {moment(
                              anime.nextAiringEpisode.airingAt * 1000
                            ).format("dddd Do MMM YYYY [at] hh:mma")}
                          </span>
                        </div>
                      ) : (
                        <p className="mt-1">Completed airing</p>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Button
                      variant="destructive"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFromWatchList(anime.id);
                      }}
                      className="transition transform hover:scale-105"
                    >
                      Remove
                    </Button>
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCardClick(anime.id);
                      }}
                      className="transition transform hover:scale-105"
                    >
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default LandingPage;