import { Firestore, doc, getDoc, setDoc } from "firebase/firestore";

export async function getOrCreateChatRoom(
  db: Firestore,
  user1Id: string,
  user2Id: string
): Promise<string> {
  const chatId =
    user1Id < user2Id ? `${user1Id}${user2Id}` : `${user2Id}${user1Id}`;
  const chatDocRef = doc(db, "chats", chatId);

  try {
    const docSnap = await getDoc(chatDocRef);

    if (!docSnap.exists()) {
      const chatData = {
        user1: user1Id,
        user2: user2Id,
        connectedAt: new Date().toISOString(), // optional extra field
      };

      await setDoc(chatDocRef, chatData);
    }

    return chatId;
  } catch (error) {
    console.error("Failed to get or create chat room:", error);
    return "";
  }
}
