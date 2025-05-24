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
  Timestamp,
  doc,
  updateDoc,
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
  // groups
  groups: [],
  isGroupsLoading: false,
  selectedGroup: null,


  setSelectedGroup: (selectedGroup) => set({ selectedGroup }),

  createGroup: async (groupData) => {
    const { selectedGroup } = gets();
    try {
      const groupRef = await addDoc(collection(db, "groups"), {
        ...groupData,
        createdAt: serverTimestamp(),
        createdBy: auth.currentUser.uid,
      });
      set({ selectedGroup: { id: groupRef.id, ...groupData } });
      toast.success("Group created successfully");
    } catch (error) {
      toast.error("Failed to create group");
    }
  },
  updateGroup: async (groupId, groupData) => {
    try {
      const groupRef = doc(db, "groups", groupId);
      await updateDoc(groupRef, {
        ...groupData,
        updatedAt: serverTimestamp(),
      });
      toast.success("Group updated successfully");
    } catch (error) {
      console.error("Error updating group: ", error);
      toast.error("Failed to update group");
    }
  },
  getGroups: async () => {
    set({ isGroupsLoading: true });
    try {
      const groupsCollection = collection(db, "groups");
      const groupsSnapshot = await getDocs(groupsCollection);
      const groupsList = groupsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      set({ groups: groupsList, isGroupsLoading: false });
    } catch (error) {
      toast.error("Failed to load groups");
    } finally {
      set({ isGroupsLoading: false });
    }
  },
  getGroupMessages: (groupId) => {
    set({ isMessagesLoading: true });
    const messagesCollection = collection(db, "messages");
    const messagesQuery = query(
      messagesCollection,
      where("groupId", "==", groupId)
    );
    // Real-time updates
    const unsubscribe = onSnapshot(
      messagesQuery,
      (querySnapshot) => {
        let messagesList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        messagesList.sort((a, b) => {
          const dateA = a.createdAt?.seconds || 0;
          const dateB = b.createdAt?.seconds || 0;
          return dateA - dateB; // oldest first
        });
        set({ messages: messagesList });
        set({ isMessagesLoading: false });
      },
      (error) => {
        toast.error("Failed to load messages");
        set({ isMessagesLoading: false });
      }
    );
    return unsubscribe;
  },
  sendGroupMessage: async (messageData) => {
    const { selectedGroup } = gets();
    try {
      await addDoc(collection(db, "messages"), {
        ...messageData,
        groupId: selectedGroup.id, // Assuming selectedGroup has an id
        createdAt: Timestamp.now(),
        senderId: auth.currentUser.uid,
        senderName: auth.currentUser.displayName || "Unknown User",
        senderProfilePic: auth.currentUser.photoURL,
      });
    } catch (error) {
      toast.error("Failed to send message");
    }
  }
  ,

  getUsers: async (userId) => {
    set({ isUsersLoading: true });
    try {
      const usersCollection = collection(db, "users");
      const usersSnapshot = await getDocs(usersCollection);
      const usersList = usersSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));      
      const filteredUserList = usersList.filter(user => user.id !== auth.currentUser.uid);
      
      set({ users: filteredUserList, isUsersLoading: false });
      
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
      // where("receiverId", "==", auth.currentUser.uid),
      // where("senderId", "==", userId),
      // where("receiverId", "==", userId),
      // where("senderId", "==", auth.currentUser.uid),
    );
    // Real-time updates
    const unsubscribe = onSnapshot(
      messagesQuery,
      (querySnapshot) => {
        let messagesList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        messagesList = messagesList.filter(msg => 
          (msg.receiverId === userId || msg.receiverId === auth.currentUser.uid) &&
          (msg.senderId === userId || msg.senderId === auth.currentUser.uid)
        );
        
        messagesList.sort((a, b) => {
          const dateA = a.createdAt?.seconds || 0;
          const dateB = b.createdAt?.seconds || 0;
          return dateA - dateB; // oldest first
        });
        set({ messages: messagesList });
        set({ isMessagesLoading: false });
      },
      (error) => {
        toast.error("Failed to load messages");
        set({ isMessagesLoading: false });
      }
    );
    return unsubscribe;
  },

  sendMessage: async (messageData) => {
    const { selectedUser } = gets();
    try {
      await addDoc(collection(db, "messages"), {
        ...messageData,
        receiverId: selectedUser.id, // Assuming selectedUser  has an id
        createdAt: Timestamp.now(),
        senderId: auth.currentUser.uid,
      });
    } catch (error) {
      toast.error("Failed to send message");
    }
  },


  // New method to get online users
  getOnlineUsers: () => {
    const usersRef = ref(realtimeDb, "users");
  
    onValue(usersRef, (snapshot) => {
      const users = snapshot.val();
      const onlineUsers = Object.keys(users)
      .map((uid) => ({
        id: uid,
        fullName: users[uid].fullName,
        online: users[uid].online || false,
        lastSeen: users[uid].lastSeen || null,
      })).filter((user) => user.online && user.id !== auth.currentUser.uid);
  
      set({ onlineUsers }); // Online users state ko update karna
    }, (error) => {
      toast.error("Failed to load online users");
    });
  },
  
}));
