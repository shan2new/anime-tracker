import React from "react";
import CollectionItemCard from "@/components/CollectionItemCard";
import { CollectionItem } from "@/api/collection";
import AddItemCard from "./AddItemCard";

interface AnimeListProps {
  items: CollectionItem[];
  onAddNew: () => void;
}

const AnimeList: React.FC<AnimeListProps> = ({ items, onAddNew }) => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6 transition-all px-4 py-4">
      {items.map((item) => (
        <CollectionItemCard key={item.id} item={item} />
      ))}
      <AddItemCard onClick={onAddNew}/>
    </div>
  );
};

export default AnimeList;