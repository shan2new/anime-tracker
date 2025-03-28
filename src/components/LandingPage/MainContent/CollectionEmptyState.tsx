import React from "react";
import { Tv2Icon } from "lucide-react";


const CollectionEmptyState: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center space-y-4 mt-10 h-full">
      <Tv2Icon className="w-12 h-12 text-muted-foreground" />
      <p className="text-sm text-muted-foreground">
        Create a collection to get started.
      </p>
    </div>
  );
};

export default CollectionEmptyState;