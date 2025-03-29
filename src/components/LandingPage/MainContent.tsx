import React, { useState } from "react";
import AnimeList from "./MainContent/AnimeList";
import EmptyState from "./MainContent/EmptyState";
import AddAnimeDialog from "./MainContent/AddAnimeDialog";
import { CollectionItem } from "@/api/collection";
import CollectionEmptyState from "./MainContent/CollectionEmptyState";

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
  collectionCreateHandler: () => void;
}

const MainContent: React.FC<MainContentProps> = ({
  loading,
  hasCollectionSelected,
  collectionItems,
  onAddAnimeToCollection,
  collectionCreateHandler,
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
    return <CollectionEmptyState collectionCreateHandler={collectionCreateHandler} />;
  }

  return (
    <>
      {collectionItems.length === 0 ? (
        <EmptyState onAddAnime={onOpenAddAnimeDialog} />
      ) : (
          <AnimeList items={collectionItems} onAddNew={onOpenAddAnimeDialog} />
      )}
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