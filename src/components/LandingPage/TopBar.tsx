import React from "react";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";

interface TopBarProps {
  collectionName?: string;
  onEditClick: () => void;
}

const TopBar: React.FC<TopBarProps> = ({ collectionName, onEditClick }) => {
  if(!collectionName) {
    return <></>
  }
  return (
    <div className="flex items-center justify-between p-4 border-b border-border">
      <h1 className="text-2xl font-semibold tracking-tight">
        {collectionName || "Collection"}
      </h1>
      {collectionName && (
        <Button variant="outline" size="icon" className="p-2" onClick={onEditClick}>
          <Edit size={16} />
        </Button>
      )}
    </div>
  );
};

export default TopBar;