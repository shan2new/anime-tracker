import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";
import { BookTextIcon, PlusCircleIcon } from "lucide-react"; // Import icon for the Add Collection button

import { getCollections, createCollectionAPI, Collection } from "../api/collection";
import CollectionItemCard from "@/components/CollectionItemCard";


const LandingPage: React.FC = () => {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [selectedCollection, setSelectedCollection] = useState<Collection | null>(null);

  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  // Fetch user’s collections from your API
  const fetchCollections = async () => {
    try {
      const data = await getCollections();
      setCollections(data);
      if (data.length > 0) {
        // By default, select the first collection
        setSelectedCollection(data[0]);
      }
    } catch (error) {
      console.error("Error fetching collections:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCollections();
  }, []);

  const handleCreateCollection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCollectionName.trim()) return;
    try {
      const created = await createCollectionAPI(newCollectionName);
      setCollections([created]); // For single-collection scenario
      setSelectedCollection(created);
      setNewCollectionName("");
      setShowCreateModal(false);
      setShowEmojiPicker(false);
    } catch (error) {
      console.error("Error creating collection:", error);
    }
  };

  const onEmojiClick = (emojiData: EmojiClickData) => {
    setNewCollectionName((prev) => prev + emojiData.emoji);
    setShowEmojiPicker(false);
  };

  const handleSelectCollection = (col: Collection) => {
    setSelectedCollection(col);
  };

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {/* Side Navigation */}
      <div className="hidden md:flex md:flex-col w-64 border-r border-border">
        <ScrollArea className="p-4 space-y-4">
          <div className="flex flex-col space-y-4">
            <div>
              <h2 className="text-lg font-semibold mb-2">My Collections</h2>
              <div className="w-full">
                {collections.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No collections yet.
                  </p>
                ) : (
                  collections.map((col) => (
                    <Button
                      key={col.id}
                      variant="ghost"
                      className={`justify-start w-full flex items-center space-x-1 ${
                        selectedCollection?.id === col.id ? "bg-gray-100" : ""
                      }`}
                      onClick={() => handleSelectCollection(col)}
                    >
                      <BookTextIcon size={16} />
                      <span>{col.name || "Untitled"}</span>
                    </Button>
                  ))
                )}
              </div>
            </div>
            <div className="items-center justify-items-center">
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center"
              onClick={() => setShowCreateModal(true)}
            >
              <PlusCircleIcon size={16} /> {/* Icon for Add Collection button */}
              <span className="text-xs">Add Collection</span>
            </Button>
            </div>
          </div>
        </ScrollArea>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <div className="flex items-center justify-between p-4">
          <h1 className="text-xl font-bold">
            {selectedCollection?.name || "Collection"} 
          </h1>
          {selectedCollection && (
            <Button onClick={() => console.log("Edit Collection")}>
              Edit Collection
            </Button>
          )}
        </div>

        {/* Content Area */}
        <div className="p-4 flex-1">
          {loading ? (
            <div className="flex items-center justify-center py-10">
              <p className="text-lg">Loading collection...</p>
            </div>
          ) : !selectedCollection ? (
            <div className="flex flex-col items-center justify-center space-y-4">
              <p className="text-lg text-muted-foreground">
                No collection selected. Create one or select from the side nav.
              </p>
            </div>
          ) : selectedCollection.items.length === 0 ? (
            <Card className="border border-border rounded-md p-6 max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle className="text-2xl">
                  {selectedCollection.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg text-muted-foreground text-center">
                  No items in this collection.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {selectedCollection.items.map((item) => (
                <CollectionItemCard key={item.id} item={item} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Create Collection Modal */}
      {showCreateModal && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-surface p-6 rounded-md w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">Create Collection</h2>
            <form onSubmit={handleCreateCollection} className="space-y-4">
              <Input
                type="text"
                placeholder="Collection name"
                value={newCollectionName}
                onChange={(e) => setNewCollectionName(e.target.value)}
                className="w-full px-4 py-3 border border-border rounded bg-background text-foreground"
                required
              />
              <div className="flex items-center justify-between">
                <Button
                  type="button"
                  variant="outline"
                  className="mr-2"
                  onClick={() => setShowEmojiPicker((prev) => !prev)}
                >
                  {showEmojiPicker ? "Hide Emojis" : "Add Emoji"}
                </Button>
                <div className="space-x-2">
                  <Button variant="outline" onClick={() => setShowCreateModal(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-primary text-primary-foreground">
                    Create
                  </Button>
                </div>
              </div>
              {showEmojiPicker && (
                <div className="mt-4">
                  <EmojiPicker onEmojiClick={onEmojiClick} />
                </div>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LandingPage;