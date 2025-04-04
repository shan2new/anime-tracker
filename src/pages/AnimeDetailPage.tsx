// src/pages/AnimeDetailPage.tsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchAnimeById } from "../api/anilist";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import moment from "moment";
import { Loader } from "@/components/ui/loader";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { getCollections, addItemToCollectionAPI } from "../api/collection";

interface Anime {
  id: number;
  title: { romaji: string; english?: string };
  description?: string;
  season?: string;
  seasonYear?: number;
  genres?: string[];
  episodes?: number;
  coverImage?: {
    extraLarge: string;
    large: string;
    medium: string;
  };
  nextAiringEpisode?: { airingAt: number };
}

const AnimeDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [anime, setAnime] = useState<Anime | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // For Add to Collection modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userCollections, setUserCollections] = useState<any[]>([]);
  const [loadingCollections, setLoadingCollections] = useState(false);

  useEffect(() => {
    const loadAnime = async () => {
      if (!id) return;
      try {
        const data = await fetchAnimeById(Number(id));
        setAnime(data);
      } catch (error) {
        console.error("Failed to fetch anime", error);
      } finally {
        setLoading(false);
      }
    };
    loadAnime();
  }, [id]);

  const fetchUserCollections = async () => {
    setLoadingCollections(true);
    try {
      const collections = await getCollections();
      setUserCollections(collections);
    } catch (error) {
      console.error("Error fetching collections:", error);
    } finally {
      setLoadingCollections(false);
    }
  };

  // When modal opens, fetch collections
  useEffect(() => {
    if (isModalOpen) {
      fetchUserCollections();
    }
  }, [isModalOpen]);

  if (loading) {
    return <Loader />;
  }
  if (!anime) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background text-foreground p-4">
        <p className="text-lg">Anime not found.</p>
      </div>
    );
  }

  const handleAddToCollection = async (collectionId: number) => {
    try {
      const payload = {
        anilistId: anime.id,
        animeTitle: anime.title.english || anime.title.romaji,
        coverImage: anime.coverImage,
      };
      await addItemToCollectionAPI(collectionId, payload);
      toast.success("Anime added to collection");
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error adding to collection:", error);
      toast.error("Failed to add anime to collection");
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-4">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <Button
            onClick={() => navigate("/")}
            className="bg-secondary text-secondary-foreground hover:bg-secondary-dark transition transform hover:scale-105"
          >
            ← Back
          </Button>
          <div className="text-sm text-muted-foreground">ID: {anime.id}</div>
        </div>
        <Card className="bg-surface shadow-lg rounded-lg animate-fadeIn">
          <CardContent className="p-6 space-y-6">
            <header className="flex flex-col md:flex-row items-center gap-6">
              <div className="flex-shrink-0">
                {anime.coverImage && (
                  <img
                    src={
                      anime.coverImage.extraLarge ||
                      anime.coverImage.large ||
                      anime.coverImage.medium
                    }
                    alt={anime.title.english || anime.title.romaji}
                    className="w-32 h-48 rounded-md shadow-md object-cover"
                  />
                )}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-primary">
                  {anime.title.english || anime.title.romaji}
                </h1>
                <div className="mt-2 space-y-1">
                  {anime.season && (
                    <p className="text-sm text-muted-foreground">
                      Season: {anime.season}
                    </p>
                  )}
                  {anime.seasonYear && (
                    <p className="text-sm text-muted-foreground">
                      Season Year: {anime.seasonYear}
                    </p>
                  )}
                  {anime.episodes && (
                    <p className="text-sm text-muted-foreground">
                      Total Episodes: {anime.episodes}
                    </p>
                  )}
                  {anime.genres && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {anime.genres.map((genre, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 text-xs bg-primary text-primary-foreground rounded-full transition transform hover:scale-105"
                        >
                          {genre}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </header>
            <hr className="border-border" />
            <section className="space-y-4">
              <h2 className="text-xl font-semibold">Overview</h2>
              <p className="text-base leading-relaxed">
                {anime.description || "No description available."}
              </p>
              {anime.nextAiringEpisode && (
                <p className="text-sm text-muted-foreground">
                  Next episode airs at:{" "}
                  {moment(anime.nextAiringEpisode.airingAt * 1000).format(
                    "dddd Do MMM YYYY [at] hh:mma"
                  )}
                </p>
              )}
            </section>
            <div className="flex flex-col gap-4">
              <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogTrigger asChild>
                  <Button
                    className="w-full py-3 bg-secondary text-secondary-foreground hover:bg-secondary-dark transition transform hover:scale-105"
                  >
                    Add to Collection
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Select a Collection</DialogTitle>
                    <DialogDescription>
                      Choose one of your collections to add this anime.
                    </DialogDescription>
                  </DialogHeader>
                  {loadingCollections ? (
                    <p className="text-center">Loading collections...</p>
                  ) : userCollections.length === 0 ? (
                    <p className="text-center text-muted-foreground">
                      You have no collections.
                    </p>
                  ) : (
                    <div className="mt-4 space-y-2">
                      {userCollections.map((col) => (
                        <Button
                          key={col.id}
                          variant="outline"
                          onClick={() => handleAddToCollection(col.id)}
                          className="w-full justify-start"
                        >
                          {col.name || "Untitled Collection"}
                        </Button>
                      ))}
                    </div>
                  )}
                  <DialogClose asChild>
                    <Button variant="outline" className="mt-4 w-full">
                      Cancel
                    </Button>
                  </DialogClose>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AnimeDetailPage;