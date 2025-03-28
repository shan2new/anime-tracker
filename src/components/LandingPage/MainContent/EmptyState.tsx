import React from "react";
import { Plus, Tv2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  onAddAnime: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ onAddAnime }) => {
  return (
    <div className="flex flex-col items-center justify-center space-y-4 mt-10 h-full">
      <Tv2Icon className="w-12 h-12 text-muted-foreground" />
      <h2 className="text-xl font-semibold">Your collection is empty</h2>
      <p className="text-sm text-muted-foreground">
        Add anime to your collection to get started.
      </p>
      <Button onClick={onAddAnime} className="bg-primary text-primary-foreground">
        <Plus className="mr-2 h-4 w-4" />
        Add Anime
      </Button>
    </div>
  );
};

export default EmptyState;