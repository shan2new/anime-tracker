import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import Session from 'supertokens-web-js/recipe/session';
import MobileSearchDialog from '@/components/Navbar/MobileSearchDialog'
import { LogOutIcon, SearchIcon, Settings2Icon } from "lucide-react";
import { toast } from "sonner";

const NavBar: React.FC = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  const handleSelectAnime = (id: number) => {
    setLoading(false);
    navigate(`/anime/${id}`);
    setSearch("");
    setSearchResults([]);
  };

  async function logout() {
    await Session.signOut();
    navigate("/login");
  }

  return (
    <nav className="w-full bg-surface">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Left: Logo */}
        <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate("/")}>
          <span className="righteous-regular md:text-3xl text-2xl" style={{ color: '#995500' }}>
            ANIME
          </span>
          <span className="righteous-regular md:text-3xl text-2xl px-2 rounded border-2" style={{ color: '#FFA733', borderColor: '#E58A14' }}>
            TRACKER
          </span>
          {/* Mobile: Show search icon that opens MobileSearchDialog */}
          <div className="sm:hidden">
            <Button
              variant="ghost"
              onClick={() => setShowMobileSearch(true)}
              className="p-2"
            >
              <SearchIcon size={48} />
            </Button>
          </div>
        </div>
        {/* Center: Search for desktop */}
        <div className="w-100">
          <div className="relative hidden sm:block">
            <Input
              type="text"
              placeholder="Search anime..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-3 rounded-lg border border-border bg-background text-foreground font-normal focus:outline-none focus:ring-2 focus:ring-ring transition"
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
                    <span>{anime.title.english || anime.title.romaji}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        {/* Right: Profile */}
        <div className="justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="w-10 h-10 rounded-full bg-primary text-primary-foreground focus:ring-2 focus:ring-ring transition transform hover:scale-105"
              >
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
            <DropdownMenuContent className="w-40 bg-background border border-border rounded-lg shadow-lg" align="center">
              <DropdownMenuItem onSelect={() => toast.info("Unsupported. Coming soon!")} className="w-100 text-center">
                <Settings2Icon />  Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={logout} className="text-center">
                <LogOutIcon/> Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      {/* Mobile Search Dialog */}
      <MobileSearchDialog
        open={showMobileSearch}
        onOpenChange={setShowMobileSearch}
        onSelectAnime={handleSelectAnime}
      />
    </nav>
  );
};

export default NavBar;