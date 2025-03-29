// src/hooks/useHeartbeat.ts
import { useEffect } from "react";
import { db } from "../firebaseConfig";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

const useHeartbeat = (userId?: string) => {
  useEffect(() => {
    if (!userId) return;
    
    const updateHeartbeat = async () => {
      try {
        // Write the current timestamp to a document in a "heartbeats" collection.
        await setDoc(doc(db, "heartbeats", userId), {
          lastActive: serverTimestamp(),
        });
      } catch (error) {
        console.error("Error updating heartbeat:", error);
      }
    };

    // Update immediately and then every 30 seconds
    updateHeartbeat();
    const interval = setInterval(updateHeartbeat, 30000);

    return () => clearInterval(interval);
  }, [userId]);
};

export default useHeartbeat;