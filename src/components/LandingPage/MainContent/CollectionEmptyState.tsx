import React from "react";
import { PlusCircleIcon, Tv} from "lucide-react";
import { Button } from "@/components/ui/button";


const CollectionEmptyState: React.FC<{ collectionCreateHandler: React.MouseEventHandler<HTMLButtonElement> }> = ({ collectionCreateHandler }) => {
  return (
    <div className="flex flex-col items-center justify-center space-y-4 md:mt-10 h-full">
      <Tv className="w-12 h-12 text-muted-foreground" />
      <p className="text-sm text-muted-foreground">
        Create a collection to get started.
      </p>
      <Button

        onClick={collectionCreateHandler}
      >
        <PlusCircleIcon className="w-4 h-4" /> 
        Create
      </Button>
    </div>
  );
};

export default CollectionEmptyState;