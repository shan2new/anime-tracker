// src/components/NavBar.tsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { searchAnime } from "../api/anilist";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "../context/AuthContext";

const NavBar: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Debounce the search input (500ms)
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (search.trim()) {
        setLoading(true);
        searchAnime(search)
          .then((results) => setSearchResults(results))
          .catch((error) => console.error("Search failed", error))
          .finally(() => setLoading(false));
      } else {
        setSearchResults([]);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [search]);

  const handleSelectAnime = (id: number) => {
    navigate(`/anime/${id}`);
    setSearch("");
    setSearchResults([]);
  };

  return (
    <nav className="w-full bg-surface shadow-md">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Left: Header */}
        <div className="flex-1">
          <h1 className="text-3xl font-extrabold tracking-tight text-primary font-sans">
            Anime Tracker
          </h1>
        </div>
        {/* Center: Search */}
        <div className="flex-1 px-4">
          <div className="relative">
            <Input
              type="text"
              placeholder="Search anime..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition"
            />
            {(searchResults.length > 0 || loading) && (
              <ul className="absolute z-30 w-full bg-background border border-border mt-2 rounded-lg shadow-lg transition-all">
                {loading && (
                  <li className="px-4 py-2 text-center text-sm text-muted-foreground">
                    Loading...
                  </li>
                )}
                {searchResults.map((anime) => (
                  <li
                    key={anime.id}
                    onClick={() => handleSelectAnime(anime.id)}
                    className="flex items-center space-x-2 px-4 py-2 cursor-pointer hover:bg-secondary transition-colors"
                  >
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
                    <span>
                      {anime.title.english || anime.title.romaji}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        {/* Right: Profile Icon */}
        <div className="flex-1 flex justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="w-10 h-10 rounded-full bg-primary text-primary-foreground focus:ring-2 focus:ring-ring transition transform hover:scale-105"
              >
                {/* Profile Icon SVG */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5.121 17.804A13.937 13.937 0 0112 15c2.485 0 4.8.657 6.879 1.804M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-40 bg-background border border-border rounded-lg shadow-lg">
              <DropdownMenuItem onSelect={() => navigate("/settings")}>
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onSelect={() => {
                  logout();
                  navigate("/");
                }}
              >
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;