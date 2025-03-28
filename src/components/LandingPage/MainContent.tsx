import React from "react";
import { Podcast } from "lucide-react";
import { Button } from "@/components/ui/button";
import CollectionItemCard from "@/components/CollectionItemCard";
import { CollectionItem } from "@/api/collection";

interface MainContentProps {
  loading: boolean;
  hasCollectionSelected: boolean;
  collectionItems: CollectionItem[];
  onAddItem: () => void;
}

const MainContent: React.FC<MainContentProps> = ({
  loading,
  hasCollectionSelected,
  collectionItems,
  onAddItem,
}) => {
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
  if (collectionItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center space-y-4 mt-10">
        <Podcast className="w-12 h-12 text-muted-foreground" />
        <h2 className="text-xl font-semibold">No items added</h2>
        <p className="text-sm text-muted-foreground">
          You have not added any animes yet. Add one below.
        </p>
        <Button onClick={onAddItem} className="bg-primary text-primary-foreground">
          Add Anime
        </Button>
      </div>
    );
  }
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 transition-all px-4 py-4">
      {collectionItems.map((item) => (
        <CollectionItemCard key={item.id} item={item} />
      ))}
    </div>
  );
};

export default MainContent;