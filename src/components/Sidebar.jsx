import React, { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import { User } from "lucide-react";
import { getAuth } from "firebase/auth";
import moment from "moment";
import { onValue, ref } from "firebase/database";
import { realtimeDb } from "../firebase";

const Sidebar = () => {
  const {
    getUsers,
    users,
    selectedUser,
    setSelectedUser,
    isUsersLoading,
    getOnlineUsers,
    onlineUsers,
  } = useChatStore();
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);
  const auth = getAuth();
  const [lastSeenMap, setLastSeenMap] = useState({});



  useEffect(() => {
    getUsers(selectedUser);
    getOnlineUsers(); // Fetch online users
  }, [getUsers, getOnlineUsers]);

  useEffect(() => {
    if (users.length) {
      const unsubscribes = users.map((user) => {
        const userRef = ref(realtimeDb, `users/${user.id}/lastSeen`);
        return onValue(userRef, (snapshot) => {
          if (snapshot.exists()) {
            setLastSeenMap((prev) => ({
              ...prev,
              [user.id]: snapshot.val(),
            }));
          }
        });
      });

      // Cleanup listeners
      return () => unsubscribes.forEach((unsub) => unsub());
    }
  }, [users]);
;

  // Last seen ko readable format mein convert karna
  const formatLastSeen = (timestamp) => {
    const now = moment(); // Current date and time
    const lastSeen = moment(timestamp);
  
    // Agar aaj ka din hai dikhayein
    if (now.isSame(lastSeen, "day")) {
      return `Today ${lastSeen.format("hh:mm A")}`;
    }
  
    // Warna pura date aur time
    return lastSeen.format("D MMMM, YY - hh:mm A");
  };
  

  const filteredUsers = showOnlineOnly
    ? users.filter((user) =>
        onlineUsers.some((onlineUser) => onlineUser.id === user.id)
      )
    : users;

  if (isUsersLoading) return <SidebarSkeleton />;

  return (
    <aside className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200">
      <div className="border-b border-base-300 w-full p-5">
        <div className="flex items-center gap-2">
          <User className="size-6" />
          <span className="font-medium hidden lg:block">Contacts</span>
        </div>

        <div className="mt-3 hidden lg:flex items-center gap-2">
          <label className="cursor-pointer flex items-center gap-2">
            <input
              type="checkbox"
              checked={showOnlineOnly}
              onChange={(e) => setShowOnlineOnly(e.target.checked)}
              className="checkbox checkbox-sm"
            />
            <span className="text-sm">Show online only</span>
          </label>
          <span className="text-xs text-zinc-500">
            ({onlineUsers?.length} online)
          </span>
        </div>
      </div>

      <div className="overflow-y-auto w-full py-3">
        {filteredUsers.map((user) => {
          const isOnline = onlineUsers?.some(
            (onlineUser) => onlineUser.id === user.id
          );
          return (
            <button
              key={user.id}
              onClick={() => setSelectedUser(user)}
              className={`
                w-full p-3 flex items-center gap-3
                hover:bg-base-300 transition-colors
                ${
                  selectedUser?.id === user.id
                    ? "bg-base-300 ring-1 ring-base-300"
                    : ""
                }
              `}
            >
              <div className="relative mx-auto lg:mx-0">
                <img
                  src={user.profilePic || "/avatar.png"}
                  alt={user.name}
                  className="size-12 object-cover rounded-full"
                />
                {isOnline && (
                  <span
                    className="absolute bottom-0 right-0 size-3 bg-green-500 
                  rounded-full ring-2 ring-zinc-900"
                  />
                )}
              </div>
              <div className="hidden lg:block text-left min-w-0">
                <div className="font-medium truncate">
                  {user.fullName}
                  {user.id === auth.currentUser.uid ? " (You)" : null}
                </div>
                <div className="text-sm text-zinc-400">
                  {isOnline
                    ? "Online"
                    : `${formatLastSeen(lastSeenMap[user.id])}`}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </aside>
  );
};

export default Sidebar;
