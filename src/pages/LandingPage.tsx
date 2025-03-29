import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  getCollections,
  createCollectionAPI,
  updateCollectionAPI,
  deleteCollectionAPI,
  Collection,
} from "../api/collection";
import { Button } from "@/components/ui/button";
import { Check, Trash2 } from "lucide-react";
import SideNav from "@/components/LandingPage/SideNav";
import TopBar from "@/components/LandingPage/TopBar";
import MainContent from "@/components/LandingPage/MainContent";

interface AnimeResult {
  id: number;
  title: { english?: string; romaji: string };
  coverImage?: { extraLarge?: string; large?: string; medium?: string };
}

const LandingPage: React.FC = () => {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [selectedCollection, setSelectedCollection] = useState<Collection | null>(null);
  const [loading, setLoading] = useState(true);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState("");
  
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingName, setEditingName] = useState("");
  const [updating, setUpdating] = useState(false);

  const [collectionToDelete, setCollectionToDelete] = useState<number | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const fetchCollections = async () => {
    try {
      const data = await getCollections();
      setCollections(data);
      if (data.length > 0) setSelectedCollection(data[0]);
    } catch (error) {
      console.error("Error fetching collections:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCollections();
  }, []);

  // Create
  const handleCreateCollection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCollectionName.trim()) return;
    try {
      const created = await createCollectionAPI(newCollectionName);
      setCollections((prev) => [...prev, created]);
      setSelectedCollection(created);
      setNewCollectionName("");
      setShowCreateModal(false);
    } catch (error) {
      console.error("Error creating collection:", error);
    }
  };

  // Update
  const handleUpdateCollection = async (id: number, newName: string) => {
    try {
      setUpdating(true);
      const updated = await updateCollectionAPI(id, newName);
      setCollections((prev) =>
        prev.map((col) => (col.id === id ? { ...col, name: updated.name } : col))
      );
      if (selectedCollection?.id === id) {
        setSelectedCollection({ ...selectedCollection, name: updated.name });
      }
    } catch (error) {
      console.error("Error updating collection:", error);
    } finally {
      setUpdating(false);
      setShowEditModal(false);
    }
  };

  // Delete
  const handleDeleteCollectionConfirmed = async (id: number) => {
    try {
      await deleteCollectionAPI(id);
      setCollections((prev) => prev.filter((col) => col.id !== id));
      if (selectedCollection?.id === id) {
        setSelectedCollection(null);
      }
    } catch (error) {
      console.error("Error deleting collection:", error);
    } finally {
      setShowDeleteConfirm(false);
      setCollectionToDelete(null);
    }
  };

  const handleSelectCollection = (col: Collection) => {
    setSelectedCollection(col);
  };
  const handleOpenCreateModal = () => {
    setShowCreateModal(true);
  };
  const handleEditCollection = (col: Collection) => {
    setEditingName(col.name || "");
    setShowEditModal(true);
  };
  const handleDeleteCollection = (col: Collection) => {
    setCollectionToDelete(col.id);
    setShowDeleteConfirm(true);
  };

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <SideNav
        collections={collections}
        selectedCollectionId={selectedCollection?.id || null}
        onSelectCollection={handleSelectCollection}
        onCreateCollection={handleOpenCreateModal}
        onEditCollection={handleEditCollection}
        onDeleteCollection={handleDeleteCollection}
      />
      <div className="flex-1 flex flex-col">
        <TopBar
          collectionName={selectedCollection?.name}
          onEditClick={() => setShowEditModal(true)}
        />
        <MainContent
          loading={loading}
          hasCollectionSelected={!!selectedCollection}
          collectionItems={selectedCollection?.items || []}
          collectionCreateHandler={handleOpenCreateModal}      
          onAddAnimeToCollection={async (pending: AnimeResult[]) => {console.log(pending)}}    
        />
      </div>

      {/* Create Collection Dialog */}
      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Collection</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreateCollection} className="space-y-4 mt-4">
            <Input
              type="text"
              placeholder="Collection name"
              value={newCollectionName}
              onChange={(e) => setNewCollectionName(e.target.value)}
              required
            />
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowCreateModal(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-primary text-primary-foreground">
                Create
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Collection Dialog */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Collection</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <Input
              type="text"
              value={editingName}
              onChange={(e) => setEditingName(e.target.value)}
              placeholder="Collection name"
            />
            <div className="flex justify-end space-x-2">
              <Button
                variant="destructive"
                size="icon"
                onClick={() => {
                  if (selectedCollection) handleDeleteCollectionConfirmed(selectedCollection.id);
                  setShowEditModal(false);
                }}
              >
                <Trash2 size={16} />
              </Button>
              <Button
                onClick={async () => {
                  if (selectedCollection)
                    await handleUpdateCollection(selectedCollection.id, editingName);
                }}
                className="bg-primary text-primary-foreground"
              >
                {updating ? (
                  <div className="w-6 h-6 border-2 border-t-2 border-t-primary rounded-full animate-spin" />
                ) : (
                  <Check size={16} />
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground mt-4">
            Are you sure you want to delete this collection? This action cannot be undone.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteConfirm(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (collectionToDelete !== null) {
                  handleDeleteCollectionConfirmed(collectionToDelete);
                }
              }}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LandingPage;