import ChatContainer from "../components/ChatContainer";
import NoChatSelected from "../components/NoChatSelected";
import Sidebar from "../components/Sidebar";
import { db } from "../firebase";
import { useChatStore } from "../store/useChatStore";

const HomePage = () => {
  const { selectedUser, getOnlineUsers } = useChatStore();
  const auth = getAuth();

  useEffect(() => {
    const userRef = ref(db, "users/" + auth.currentUser.uid);
    set(userRef, {
      online: true,
      lastSeen: serverTimestamp(),
    });

    // Set user as offline when they disconnect
    onDisconnect(userRef).set({
      online: false,
    });

    // Cleanup function to set user offline when the component unmounts
    return () => {
      set(userRef, {
        online: false,
      });
    };
  }, [getOnlineUsers, db]);

  return (
    <div className="h-screen bg-base-200">
      <div className="flex items-center justify-center pt-20 px-4">
        <div className="bg-base- 100 rounded-lg shadow-xl w-full max-w-6xl h-[calc(100vh-6rem)]">
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
