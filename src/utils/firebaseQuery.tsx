import {
  getDocs,
  collection,
  query,
  where,
  Firestore,
} from "firebase/firestore";
import { doc, getDoc } from "firebase/firestore";

import { NavigateFunction } from "react-router-dom";

export async function getUserChats(
  db: Firestore,
  userId: string
): Promise<Record<string, any>[]> {
  const chatRooms: Record<string, any>[] = [];

  try {
    const user1Query = query(
      collection(db, "chats"),
      where("user1", "==", userId)
    );
    const user1Snapshot = await getDocs(user1Query);
    user1Snapshot.forEach((doc) => chatRooms.push(doc.data()));

    const user2Query = query(
      collection(db, "chats"),
      where("user2", "==", userId)
    );
    const user2Snapshot = await getDocs(user2Query);
    user2Snapshot.forEach((doc) => chatRooms.push(doc.data()));

    chatRooms.forEach((c) => console.log(c));
    return chatRooms;
  } catch (error) {
    console.error("Error fetching chats:", error);
    return [];
  }
}

export async function searchUserByEmail(
  db: Firestore,
  username: string,
  navigate: NavigateFunction,
  currentUserId: string,
  onComplete: (message: string) => void
) {
  try {
    const formattedUsername = username.endsWith(".com")
      ? username
      : `${username}@chat.com`;

    const userQuery = query(
      collection(db, "users"),
      where("username", "==", formattedUsername)
    );
    const snapshot = await getDocs(userQuery);

    if (!snapshot.empty) {
      const doc = snapshot.docs[0];
      const otherUserId = doc.id;
      const otherUserName = doc.get("name") || "Unknown User";

      // navigate to /chats/:currentUserId/:otherUserId
      navigate(`/chats/${currentUserId}/${otherUserId}`);

      // Update local storage or context as needed
      const localChatsKey = `chats_${currentUserId}`;
      const localChats = JSON.parse(
        localStorage.getItem(localChatsKey) || "[]"
      );

      const exists = localChats.some(
        (chat: any) => chat.userId === otherUserId
      );
      if (!exists) {
        localChats.push({ userId: otherUserId, userName: otherUserName });
        localStorage.setItem(localChatsKey, JSON.stringify(localChats));
      }

      onComplete("");
    } else {
      onComplete("No User Found!");
    }
  } catch (error) {
    console.error("Error searching user:", error);
    onComplete("Unexpected Error!");
  }
}

export const getUserNameById = async (
  db: Firestore,
  userId: string
): Promise<string> => {
  const userDoc = await getDoc(doc(db, "users", userId));
  if (userDoc.exists()) {
    return userDoc.data().name || "Unknown";
  }
  return "Unknown";
};
