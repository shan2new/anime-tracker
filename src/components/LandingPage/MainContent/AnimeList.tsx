import React from "react";
import CollectionItemCard from "@/components/CollectionItemCard";
import { CollectionItem } from "@/api/collection";

interface AnimeListProps {
  items: CollectionItem[];
}

const AnimeList: React.FC<AnimeListProps> = ({ items }) => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 transition-all px-4 py-4">
      {items.map((item) => (
        <CollectionItemCard key={item.id} item={item} />
      ))}
    </div>
  );
};

export default AnimeList;