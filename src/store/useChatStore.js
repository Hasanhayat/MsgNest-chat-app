// store/useChatStore.js
import { create } from "zustand";
import { realtimeDb } from "../firebase"; // Import Realtime Database instance
import { db } from "../firebase"; // Import Firestore instance
import { ref, onValue, get } from "firebase/database"; // Import Realtime Database functions
import {
  collection,
  getDocs,
  query,
  where,
  addDoc,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import toast from "react-hot-toast";
import { getAuth } from "firebase/auth";

const auth = getAuth()

export const useChatStore = create((set, gets) => ({
  messages: [],
  users: [],
  selectedUser: null,
  onlineUsers: [], // New state for online users
  isUsersLoading: false,
  isMessagesLoading: false,

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const usersCollection = collection(db, "users");
      const usersSnapshot = await getDocs(usersCollection);
      const usersList = usersSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      set({ users: usersList });
    } catch (error) {
      toast.error("Failed to load users");
    } finally {
      set({ isUsersLoading: false });
    }
  },
  
  setSelectedUser: (selectedUser) => set({ selectedUser }),


  getMessages: (userId) => {
    set({ isMessagesLoading: true });
    const messagesCollection = collection(db, "messages");
    const messagesQuery = query(
      messagesCollection,
      where("receiverId", "==", userId)
      
    );

    // Real-time updates
    const unsubscribe = onSnapshot(
      messagesQuery,
      (querySnapshot) => {
        const messagesList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        set({ messages: messagesList });
        set({ isMessagesLoading: false });
      },
      (error) => {
        toast.error("Failed to load messages");
        set({ isMessagesLoading: false });
      }
    );

    // Return the unsubscribe function to stop listening for updates
    return unsubscribe;
  },

  sendMessage: async (messageData) => {
    const { selectedUser } = gets();
    try {
      await addDoc(collection(db, "messages"), {
        ...messageData,
        receiverId: selectedUser.id, // Assuming selectedUser  has an id
        createdAt: serverTimestamp(),
        senderId: auth.currentUser.uid,
      });
    } catch (error) {
      console.log(selectedUser);
      toast.error("Failed to send message");
    }
  },


  // New method to get online users
  getOnlineUsers: () => {
    const usersRef = ref(realtimeDb, "users"); // Use the Realtime Database instance

    onValue(
      usersRef,
      (snapshot) => {
        const users = snapshot.val();
        const onlineUsers = Object.values(users).filter((user) => user.online);
        set({ onlineUsers }); // Update the onlineUsers state
      },
      (error) => {
        toast.error("Failed to load online users");
      }
    );
  },
}));
