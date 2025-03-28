import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { BookTextIcon, PlusCircleIcon, Trash2Icon } from "lucide-react";
import { Collection } from "@/api/collection";

interface SideNavProps {
  collections: Collection[];
  selectedCollectionId: number | null;
  onSelectCollection: (col: Collection) => void;
  onCreateCollection: () => void;
  onEditCollection: (col: Collection) => void;
  onDeleteCollection: (col: Collection) => void;
}

const SideNav: React.FC<SideNavProps> = ({
  collections,
  selectedCollectionId,
  onSelectCollection,
  onCreateCollection,
  onDeleteCollection,
}) => {
  return (
    <div className="hidden md:flex md:flex-col w-64 border-r border-border">
      <ScrollArea className="p-4 space-y-4 transition-all">
        <div className="flex flex-col space-y-4">
          <div>
            <h2 className="text-lg font-semibold mb-2">My Collections</h2>
            <div className="w-full">
              {collections.length === 0 ? (
                <p className="text-sm text-muted-foreground">No collections yet.</p>
              ) : (
                collections.map((col) => (
                  <div
                    key={col.id}
                    className={`relative group flex items-center justify-between w-full py-1rounded transition-colors hover:bg-gray-50 ${
                      selectedCollectionId === col.id ? "bg-gray-100" : ""
                    }`}
                  >
                    <Button
                      variant="ghost"
                      className="justify-start flex items-center space-x-1 w-full"
                      onClick={() => onSelectCollection(col)}
                    >
                      <BookTextIcon size={16} />
                      <span>{col.name || "Untitled"}</span>
                    </Button>
                    <div className="absolute right-2 hidden group-hover:flex">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteCollection(col);
                        }}
                      >
                        <Trash2Icon size={8} />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
          <div className="flex items-center justify-center">
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center"
              onClick={onCreateCollection}
            >
              <PlusCircleIcon size={16} />
              <span className="text-xs">Add Collection</span>
            </Button>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

export default SideNav;