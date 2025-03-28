export interface CollectionItem {
  id: number;
  anilistId: number;
  animeTitle: string;
  coverImage?: {
    extraLarge: string;
    large: string;
    medium: string;
  };
}

export interface Collection {
  id: number;
  name?: string;
  items: CollectionItem[];
}

export const getCollections = async (): Promise<Collection[]> => {
  try {
    const response = await fetch("http://localhost:3000/api/collections", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    if (!response.ok) {
      throw new Error("Failed to fetch collections");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching collections:", error);
    throw error;
  }
};

export const createCollectionAPI = async (
  name: string
): Promise<Collection> => {
  try {
    const response = await fetch("http://localhost:3000/api/collections", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ name }),
    });
    if (!response.ok) {
      throw new Error("Failed to create collection");
    }
    return await response.json();
  } catch (error) {
    console.error("Error creating collection:", error);
    throw error;
  }
};

export const addItemToCollectionAPI = async (
  collectionId: number,
  payload: { anilistId: number; animeTitle: string }
): Promise<CollectionItem> => {
  try {
    const response = await fetch(
      `http://localhost:3000/api/collections/${collectionId}/items`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(payload),
      }
    );
    if (!response.ok) {
      throw new Error("Failed to add item to collection");
    }
    return await response.json();
  } catch (error) {
    console.error("Error adding item to collection:", error);
    throw error;
  }
};

export const updateCollectionAPI = async (
  id: number,
  name: string
): Promise<Collection> => {
  try {
    const response = await fetch(`http://localhost:3000/api/collections/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ name }),
    });
    if (!response.ok) {
      throw new Error("Failed to update collection");
    }
    return await response.json();
  } catch (error) {
    console.error("Error updating collection:", error);
    throw error;
  }
};

export const deleteCollectionAPI = async (
  id: number
): Promise<{ message: string }> => {
  try {
    const response = await fetch(`http://localhost:3000/api/collections/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    if (!response.ok) {
      throw new Error("Failed to delete collection");
    }
    return await response.json();
  } catch (error) {
    console.error("Error deleting collection:", error);
    throw error;
  }
};

export const removeItemFromCollectionAPI = async (
  collectionId: number,
  itemId: number
): Promise<{ message: string }> => {
  try {
    const response = await fetch(
      `http://localhost:3000/api/collections/${collectionId}/items/${itemId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    );
    if (!response.ok) {
      throw new Error("Failed to remove item from collection");
    }
    return await response.json();
  } catch (error) {
    console.error("Error removing item from collection:", error);
    throw error;
  }
};