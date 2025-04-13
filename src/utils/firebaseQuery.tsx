import {
  getDocs,
  collection,
  query,
  where,
  Firestore,
} from "firebase/firestore";
import { getOrCreateChatRoom } from "./chat";
import { doc, getDoc } from "firebase/firestore";

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
  currentUserId: string
): Promise<[string, string] | null> {
  try {
    const formattedUsername = username.endsWith(".com")
      ? username
      : `${username}@username.com`;

    const userQuery = query(
      collection(db, "users"),
      where("username", "==", formattedUsername)
    );
    const snapshot = await getDocs(userQuery);

    if (!snapshot.empty) {
      const doc = snapshot.docs[0];
      const otherUserId = doc.id;
      const chatId = await getOrCreateChatRoom(db, currentUserId, otherUserId);
      console.log(chatId);
      const otherUserName = doc.get("name") || "Unknown User";

      const localChatsKey = `chats_${currentUserId}`;
      const localChats: [string, string][] = JSON.parse(
        localStorage.getItem(localChatsKey) || "[]"
      );

      const exists = localChats.some(([id]) => id === otherUserId);

      if (!exists) {
        const newChat: [string, string] = [otherUserId, otherUserName];
        localChats.push(newChat);
        localStorage.setItem(localChatsKey, JSON.stringify(localChats));
        return newChat;
      } else {
        return [otherUserId, otherUserName];
      }
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error searching user:", error);
    return null;
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
