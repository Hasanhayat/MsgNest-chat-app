import { useEffect } from "react";
import { getAuth } from "firebase/auth";
import { getDatabase, ref, set, onDisconnect, serverTimestamp } from "firebase/database";
import { useChatStore } from "../store/useChatStore";
import Sidebar from "../components/Sidebar";
import ChatContainer from "../components/ChatContainer";
import NoChatSelected from "../components/NoChatSelected";

const HomePage = () => {
  const { selectedUser, getOnlineUsers } = useChatStore();
  const auth = getAuth();
  const db = getDatabase();

  useEffect(() => {
    if (!auth.currentUser) return;

    const userRef = ref(db, `users/${auth.currentUser.uid}`);

    // User ko online mark karna
    set(userRef, {
      online: true,
      lastSeen: serverTimestamp(),
      displayName: auth.currentUser.displayName || "Unknown User",
    });

    // Jab user disconnect ho ya tab close kare to offline karna
    onDisconnect(userRef).set({
      online: false,
      lastSeen: serverTimestamp(),
    });

    return () => {
      set(userRef, {
        online: false,
        lastSeen: serverTimestamp(),
      });
    };
  }, [auth]);

  return (
    <div className="h-screen bg-base-200">
      <div className="flex items-center justify-center pt-20 px-4">
        <div className="bg-base-100 rounded-lg shadow-xl w-full max-w-6xl h-[calc(100vh-6rem)]">
          <div className="flex h-full rounded-lg overflow-hidden">
            <Sidebar />
            {!selectedUser ? <NoChatSelected /> : <ChatContainer />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
