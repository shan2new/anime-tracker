// src/components/MobileSearchDialog.tsx
import React, { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { searchAnime } from "@/api/anilist";

interface MobileSearchDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSelectAnime: (id: number) => void;
}

interface AnimeResult {
    id: number;
    coverImage?: {
        extraLarge?: string;
        large?: string;
        medium?: string;
    }
    title: {
        english?: string;
        romaji?: string;
    };
}

const MobileSearchDialog: React.FC<MobileSearchDialogProps> = ({
    open,
    onOpenChange,
    onSelectAnime,
}) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<AnimeResult[]>([]);
    const [loading, setLoading] = useState(false);

    // Debounced search
    useEffect(() => {
        const delay = setTimeout(async () => {
            if (searchQuery.trim()) {
                setLoading(true);
                try {
                    const results = await searchAnime(searchQuery);
                    setSearchResults(results);
                } catch (error) {
                    console.error("Search error:", error);
                } finally {
                    setLoading(false);
                }
            } else {
                setSearchResults([]);
            }
        }, 500);
        return () => clearTimeout(delay);
    }, [searchQuery]);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px] max-h-[80vh] overflow-auto p-0">
                <div className="space-y-3">
                    <Input
                        type="text"
                        placeholder="Search anime..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-white border-b border-gray-300 rounded-none"
                    />
                    {loading && (
                        <p className="text-sm text-muted-foreground">Searching...</p>
                    )}
                    {!loading && searchQuery.trim() !== "" && searchResults.length === 0 && (
                        <p className="text-sm p-3 text-muted-foreground">
                            No results found.
                        </p>
                    )}
                    <div className="space-y-2">
                        {searchResults.map((anime, index) => (
                            <React.Fragment key={anime.id}>
                                <div
                                    className="flex items-center justify-between px-3 py-2 hover:bg-secondary cursor-pointer transition-colors"
                                    onClick={() => {
                                        onSelectAnime(anime.id);
                                        onOpenChange(false);
                                    }}
                                >
                                    <div className="flex items-center space-x-2">
                                        {anime.coverImage && (
                                            <img
                                                src={
                                                    anime.coverImage.extraLarge ||
                                                    anime.coverImage.large ||
                                                    anime.coverImage.medium
                                                }
                                                alt={anime.title.english || anime.title.romaji}
                                                className="w-8 h-12 object-cover rounded"
                                            />
                                        )}
                                        <span>{anime.title.english || anime.title.romaji}</span>
                                    </div>
                                </div>
                                {index < searchResults.length - 1 && <Separator />}
                            </React.Fragment>
                        ))}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default MobileSearchDialog;