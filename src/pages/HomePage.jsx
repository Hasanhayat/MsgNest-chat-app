import { serverTimestamp } from "firebase/database";
import ChatContainer from "../components/ChatContainer";
import NoChatSelected from "../components/NoChatSelected";
import Sidebar from "../components/Sidebar";
import { useChatStore } from "../store/useChatStore";
import { getAuth } from "firebase/auth";
import { useEffect } from "react";
import { getDatabase, ref, set, onDisconnect } from "firebase/database";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

const HomePage = () => {
  const { selectedUser, getOnlineUsers } = useChatStore();
  const auth = getAuth();
  const db = getDatabase(); // Realtime Database ka reference lena

  useEffect(() => {
    if (!auth.currentUser) return; // Agar user nahi hai to return karna

    const userRef = ref(db, `users/${auth.currentUser.uid}`);

    // User ko online mark karna
    set(userRef, {
      online: true,
      lastSeen: serverTimestamp(),
      displayName: auth.currentUser.displayName || "Unknown User",
    });

    // Disconnect hone par offline mark karna
    onDisconnect(userRef).set({
      online: false,
      lastSeen: serverTimestamp(),
    });

    // Component unmount hone par bhi offline mark karna
    return () => {
      set(userRef, {
        online: false,
        lastSeen: serverTimestamp(),
      });
    };
  }, [auth, getOnlineUsers]);
  useGSAP(() => {
    gsap.from("#box4" , {
      x: 2000,
      duration: 3,
      delay: 1,
    });
  })

  return (
    <div className="h-screen bg-base-200">
      <div className="flex items-center justify-center pt-20 px-4">
        <div className="bg-base-100 rounded-lg shadow-xl w-full max-w-6xl h-[calc(100vh-6rem)]" id="box4">
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
