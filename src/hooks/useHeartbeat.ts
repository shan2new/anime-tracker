// src/hooks/useHeartbeat.ts
import { useEffect } from "react";
import { db } from "../firebaseConfig";
import { doc, setDoc, serverTimestamp, Firestore } from "firebase/firestore";

const useHeartbeat = (userId?: string) => {
  useEffect(() => {
    if (!userId || !db) return;
    
    const updateHeartbeat = async () => {
      try {
        await setDoc(doc(db as Firestore, "heartbeats", userId), {
          lastActive: serverTimestamp(),
        });
      } catch (error) {
        console.error("Error updating heartbeat:", error);
      }
    };

    updateHeartbeat();
    const interval = setInterval(updateHeartbeat, 30000);

    return () => clearInterval(interval);
  }, [userId]);
};

export default useHeartbeat;