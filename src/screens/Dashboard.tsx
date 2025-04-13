import { useState, useEffect } from "react";
import { FaUser } from "react-icons/fa";
import { getUserChats, getUserNameById } from "../utils/firebaseQuery";
import { useLongPress } from "use-long-press";
import { getAuth } from "firebase/auth";
import { Firestore, getFirestore } from "firebase/firestore"; // Import Firestore

type User = [string, string]; // [userId, userName]

interface ChatRoom {
  user1: string;
  user2: string;
  lastMessage?: string;
}

export default function Dashboard() {
  const [username, setUsername] = useState<string>("");
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showDialog, setShowDialog] = useState<boolean>(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  const [chatList, setChatList] = useState<ChatRoom[]>([]);
  const currentUserId = getAuth().currentUser?.uid;

  const db = getFirestore(); // Initialize Firestore

  useEffect(() => {
    const storedUsers = localStorage.getItem("filteredUsers");

    if (storedUsers) {
      setFilteredUsers(JSON.parse(storedUsers));
    } else {
      if (currentUserId) {
        const fetchChats = async () => {
          try {
            const chats = await getUserChats(db, currentUserId);
            console.log("Fetched chats:", chats);

            const users: User[] = [];
            for (const chat of chats) {
              const otherUserId =
                chat.user1 === currentUserId ? chat.user2 : chat.user1;
              const userName = await getUserNameById(db, otherUserId);
              users.push([otherUserId, userName]);
            }

            console.log("Users:", users);
            setFilteredUsers(users);

            localStorage.setItem("filteredUsers", JSON.stringify(users));
          } catch (error) {
            console.error("Error fetching chats:", error);
          }
        };

        fetchChats();
      }
    }
  }, [currentUserId, db]);

  // useEffect(() => {
  //   if (currentUserId) {
  //     const fetchChats = async () => {
  //       try {
  //         const chats = await getUserChats(db, currentUserId);
  //         console.log("Fetched chats:", chats); // Check if chats are fetched properly

  //         const users: User[] = [];
  //         for (const chat of chats) {
  //           const otherUserId =
  //             chat.user1 === currentUserId ? chat.user2 : chat.user1;
  //           const name = await getUserNameById(db, otherUserId);
  //           users.push([otherUserId, name]);
  //         }
  //         console.log("Users:", users); // Check the users array before setting state
  //         setFilteredUsers(users);
  //       } catch (error) {
  //         console.error("Error fetching chats:", error);
  //       }
  //     };

  //     fetchChats();
  //   }
  // }, [currentUserId, db]);

  const handleSearch = () => {
    setIsLoading(true);
    setTimeout(() => {
      const filtered = filteredUsers.filter(([_, name]) =>
        name.toLowerCase().includes(username.toLowerCase())
      );
      setFilteredUsers(filtered);
      setIsLoading(false);
    }, 1000);
  };

  // const handleDelete = (userId: string) => {
  //   setFilteredUsers((prev) => prev.filter(([id]) => id !== userId));
  //   setShowDialog(false);
  //   if (selectedUser?.[0] === userId) setSelectedUser(null);
  // };

  // // useLongPress hook outside the map function
  // const handleLongPress = (userId: string, userName: string) => {
  //   const bind = useLongPress(() => {
  //     setUserToDelete([userId, userName]);
  //     setShowDialog(true);
  //   });

  //   return bind;
  // };

  return (
    <div className="w-screen h-screen flex bg-gray-200">
      {/* Chat List Sidebar */}
      <div className="w-1/3 max-w-sm bg-white shadow-md flex flex-col">
        <div className="p-4 border-b">
          <h1 className="text-2xl font-semibold">Chats</h1>
        </div>

        <div className="p-3 border-b flex gap-2 items-center">
          <input
            type="text"
            placeholder="Search user..."
            className="flex-1 border rounded-md p-2"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <button
            className="bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700"
            onClick={handleSearch}
            disabled={isLoading}
          >
            Search
          </button>
        </div>

        {isLoading && (
          <div className="flex-1 flex items-center justify-center">
            <div className="animate-spin h-8 w-8 border-4 border-gray-300 border-t-blue-600 rounded-full"></div>
          </div>
        )}

        <div className="overflow-y-auto flex-1 p-2 space-y-2">
          {filteredUsers.map(([userId, userName]) => {
            // const bind = handleLongPress(userId, userName); // Bind the long press hook outside the map

            return (
              <div
                key={userId}
                // {...bind()}
                onClick={() => setSelectedUser([userId, userName])}
                className={`p-3 rounded-md cursor-pointer flex items-center gap-3 hover:bg-gray-100 ${
                  selectedUser?.[0] === userId ? "bg-blue-100" : "bg-white"
                }`}
              >
                <div className="w-10 h-10 bg-blue-600 text-white flex items-center justify-center rounded-full">
                  <FaUser />
                </div>
                <span className="text-md text-black">{userName}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Chat Window */}
      <div className="flex-1 bg-gray-50 flex flex-col">
        {selectedUser ? (
          <>
            <div className="p-4 border-b bg-white shadow-sm flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 text-white flex items-center justify-center rounded-full">
                <FaUser />
              </div>
              <h2 className="text-xl text-black font-semibold">
                {selectedUser[1]}
              </h2>
            </div>

            <div className="flex-1 p-4 overflow-y-auto">
              <div className="text-gray-500 text-center mt-10">
                Start chatting with <strong>{selectedUser[1]}</strong>
              </div>
            </div>

            <div className="p-3 border-t flex gap-2 bg-white">
              <input
                type="text"
                className="flex-1 border p-2 rounded-md"
                placeholder="Type a message..."
              />
              <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                Send
              </button>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400 text-lg">
            Select a user to start chatting
          </div>
        )}
      </div>

      {/* Delete Confirmation */}
      {showDialog && userToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-md text-center max-w-sm">
            <h3 className="text-xl font-semibold mb-2">Delete Chat</h3>
            <p className="mb-4">
              Are you sure you want to delete chat with{" "}
              <strong>{userToDelete[1]}</strong>?
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowDialog(false)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>
              <button
                // onClick={() => handleDelete(userToDelete[0])}
                className="px-4 py-2 bg-red-600 text-white rounded"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
