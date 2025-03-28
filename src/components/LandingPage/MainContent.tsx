import React, { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import AnimeList from "./MainContent/AnimeList";
import EmptyState from "./MainContent/EmptyState";
import AddAnimeDialog from "./MainContent/AddAnimeDialog";
import { CollectionItem } from "@/api/collection";

interface AnimeResult {
  id: number;
  title: { english?: string; romaji: string };
  coverImage?: { extraLarge?: string; large?: string; medium?: string };
}

interface MainContentProps {
  loading: boolean;
  hasCollectionSelected: boolean;
  collectionItems: CollectionItem[];
  onAddAnimeToCollection: (pending: AnimeResult[]) => Promise<void>;
}

const MainContent: React.FC<MainContentProps> = ({
  loading,
  hasCollectionSelected,
  collectionItems,
  onAddAnimeToCollection,
}) => {
  const [showAddAnimeDialog, setShowAddAnimeDialog] = useState(false);

  const onOpenAddAnimeDialog = () => setShowAddAnimeDialog(true);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-10">
        <p className="text-lg">Loading collection...</p>
      </div>
    );
  }

  if (!hasCollectionSelected) {
    return (
      <div className="flex flex-col items-center justify-center space-y-4">
        <p className="text-sm text-muted-foreground">
          No collection selected. Create one or select from the side nav.
        </p>
      </div>
    );
  }

  return (
    <>
      {collectionItems.length === 0 ? (
        <EmptyState onAddAnime={onOpenAddAnimeDialog} />
      ) : (
        <>
          <AnimeList items={collectionItems} />
          <div className="flex justify-center mt-4">
            <Button
              onClick={onOpenAddAnimeDialog}
              className="bg-primary text-primary-foreground"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add More
            </Button>
          </div>
        </>
      )}
      {/* Always render the AddAnimeDialog */}
      <AddAnimeDialog
        open={showAddAnimeDialog}
        onOpenChange={setShowAddAnimeDialog}
        existingItems={collectionItems}
        onSave={onAddAnimeToCollection}
      />
    </>
  );
};

export default MainContent;