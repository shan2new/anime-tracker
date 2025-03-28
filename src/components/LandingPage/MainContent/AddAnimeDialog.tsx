import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { searchAnime } from "@/api/anilist";
import { PlusIcon, Trash2Icon } from "lucide-react";

interface AnimeResult {
  id: number;
  title: { english?: string; romaji: string };
  coverImage?: { extraLarge?: string; large?: string; medium?: string };
}

interface AddAnimeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  existingItems: any[];
  onSave: (pending: AnimeResult[]) => Promise<void>;
}

const AddAnimeDialog: React.FC<AddAnimeDialogProps> = ({ open, onOpenChange, existingItems, onSave }) => {
  // Local state inside dialog
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<AnimeResult[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [pendingAdditions, setPendingAdditions] = useState<AnimeResult[]>([]);
  const [pendingExisting, setPendingExisting] = useState<any[]>([]);

  // When the dialog opens, prepopulate existing items.
  useEffect(() => {
    if (open) {
      setPendingExisting(existingItems);
      setPendingAdditions([]);
      setSearchQuery("");
      setSearchResults([]);
    }
    console.log("existingItems", existingItems);
  }, [open, existingItems]);

  // Debounced search
  useEffect(() => {
    const delay = setTimeout(async () => {
      if (searchQuery.trim()) {
        setSearchLoading(true);
        try {
          const results = await searchAnime(searchQuery);
          setSearchResults(results);
        } catch (error) {
          console.error("Search error:", error);
        } finally {
          setSearchLoading(false);
        }
      } else {
        setSearchResults([]);
      }
    }, 500);
    return () => clearTimeout(delay);
  }, [searchQuery]);

  const handleAddClick = (anime: AnimeResult) => {
    if (!pendingAdditions.find((item) => item.id === anime.id)) {
      setPendingAdditions((prev) => [anime, ...prev]);
    }
  };

  const handleRemoveClick = (anime: AnimeResult) => {
    setPendingAdditions((prev) => prev.filter((item) => item.id !== anime.id));
  };

  const handleRemoveExistingClick = (anime: AnimeResult) => {
    setPendingExisting((prev) => prev.filter((item) => item.id !== anime.id));
  };

  const handleSave = async () => {
    await onSave([...pendingAdditions]);
    onOpenChange(false);
    setPendingAdditions([]);
    setPendingExisting([]);
    setSearchQuery("");
    setSearchResults([]);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] max-h-[80vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>Add Anime</DialogTitle>
        </DialogHeader>
        {/* Search Input and Results */}
        <div className="mt-4 space-y-3">
          <div className="relative">
            <Input
              type="text"
              placeholder="Search anime..."
              disabled={true}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pr-20" // Add padding to the right to make space for the chip
            />
            <div className="absolute top-1/2 right-3 -translate-y-1/2 bg-yellow-300 text-yellow-900 text-xs font-semibold px-2 py-1 rounded-full">
              Coming Soon
            </div>
          </div>
          {pendingExisting.length > 0 && (
            <div className="mb-4">
              <div className="space-y-2">
                {pendingExisting.map((anime) => (
                  <div
                    key={anime.id}
                    className="flex items-center justify-between px-3 py-2 hover:bg-secondary cursor-pointer transition"
                  >
                    <div className="flex items-center space-x-2">
                      {anime.coverImage && (
                        <img
                          src={
                            anime ||
                            anime ||
                            anime
                          }
                          alt={anime.animeTitle}
                          className="w-8 h-12 object-cover rounded"
                        />
                      )}
                      <span>{anime.animeTitle}</span>
                    </div>
                    <Button
                      size="sm"
                      variant={'ghost'}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveExistingClick(anime);
                      }}
                    >
                      <Trash2Icon className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
              <Separator />
            </div>
          )}
          {searchLoading ? (
            <p className="text-sm text-muted-foreground">Searching...</p>
          ) : (
            <div className="space-y-2">
              {searchResults.length === 0 ? (
                <p className="text-sm p-3 text-muted-foreground">No results found.</p>
              ) : (
                searchResults.map((anime, index) => (
                  <React.Fragment key={anime.id}>
                    <div className="flex items-center justify-between px-3 py-2 hover:bg-secondary cursor-pointer transition">
                      <div className="flex items-center space-x-2">
                        {anime.coverImage && (
                          <img
                            src={
                              anime.coverImage.extraLarge ||
                              anime.coverImage.large ||
                              anime.coverImage.medium
                            }
                            alt={anime.title?.english || anime.title?.romaji}
                            className="w-8 h-12 object-cover rounded"
                          />
                        )}
                        <span>{anime.title?.english || anime.title?.romaji}</span>
                      </div>
                      {pendingAdditions.find((item) => item.id === anime.id) ? (
                        <Button
                          size="sm"
                          variant={'ghost'}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveClick(anime);
                          }}
                        >
                          <Trash2Icon className="w-4 h-4" />
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant={'ghost'}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddClick(anime);
                          }}
                        >
                          <PlusIcon className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                    {index < searchResults.length - 1 && <Separator />}
                  </React.Fragment>
                ))
              )}
            </div>
          )}
        </div>
        {pendingAdditions.length > 0 && (
          <div className="mt-4 flex justify-end">
            <Button onClick={handleSave} className="bg-primary text-primary-foreground">
              Save
            </Button>
          </div>
        )}
        <DialogFooter>
          <div className="mt-4 flex justify-end">
            <Button onClick={handleSave} className="bg-primary text-primary-foreground">
              Save
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddAnimeDialog;