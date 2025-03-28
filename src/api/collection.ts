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
      credentials: "include", // ensures cookies are sent
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

// src/api/collection.ts

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
