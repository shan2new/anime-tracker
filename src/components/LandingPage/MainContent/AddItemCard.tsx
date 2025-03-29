import React from "react";
import { PlusCircleIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AddItemCardProps {
  onClick: () => void;
}

const AddItemCard: React.FC<AddItemCardProps> = ({ onClick }) => {
  return (
    <div
      onClick={onClick}
      className="border border-dotted rounded-md overflow-hidden hover:shadow-md cursor-pointer transition flex items-center justify-center w-full h-full flex-1 bg-gray-100"
    >
      <Button variant="ghost" size="icon" className="flex items-center justify-center">
        <PlusCircleIcon size={32} />
      </Button>
    </div>
  );
};

export default AddItemCard;