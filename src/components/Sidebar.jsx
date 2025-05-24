import React, { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import { showGroupFormToast } from "./CreateGroupForm";
import { User } from "lucide-react";
import { getAuth } from "firebase/auth";
import moment from "moment";
import { onValue, ref, set } from "firebase/database";
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
    groups,
    selectedGroup,
    setSelectedGroup,
    getGroups,
    isGroupsLoading,
    createGroup,
    updateGroup,
  } = useChatStore();

  const [showOnlineOnly, setShowOnlineOnly] = useState(false);
  const [showGroups, setShowGroups] = useState(false);
  const auth = getAuth();
  const [lastSeenMap, setLastSeenMap] = useState({});

  useEffect(() => {
    getGroups();
    getUsers(selectedUser);
    getOnlineUsers(); // Fetch online users
  }, [getUsers, getOnlineUsers, getGroups, showGroups]);

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

  const handleCreateGroup = () => {
    showGroupFormToast({
      onSubmit: (groupData) => {
        if (!groupData.members.includes(auth.currentUser.uid)) {
          groupData.members.push(auth.currentUser.uid);
        }
        createGroup(groupData);
        setSelectedGroup(null);
        getGroups();
      },
    });
  };
  
  const handleGroupClick = (group) => {
    if (group.id === selectedGroup?.id) {
      setSelectedGroup(null);
      setSelectedUser(null);
    } else {
      setSelectedGroup(group);
    }
    setSelectedUser(null);
    setShowGroups(true);
  };
  const handleUserClick = (user) => {
    if (user.id === selectedUser?.id) {
      setSelectedUser(null);
      setSelectedGroup(null);
    } else {
      setSelectedUser(user);
    }
    setSelectedGroup(null);
    setShowGroups(false);
  };
  const handleCheckbox = (checked) => {
    setShowGroups(checked);
    if (checked) {
      setSelectedUser(null);
      setSelectedGroup(null);
    } else {
      setShowOnlineOnly(false);
      setSelectedUser(null);
      setSelectedGroup(null);
    }
  };

  const filteredUsers = showOnlineOnly
    ? users.filter((user) =>
        onlineUsers.some((onlineUser) => onlineUser.id === user.id)
      )
    : users;

  if (isUsersLoading || isGroupsLoading) return <SidebarSkeleton />;

  return (
    <aside className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200">
      <div className="border-b border-base-300 w-full p-5">
        <div className="flex items-center gap-2">
          <User className="size-6" />
          <span className="font-medium hidden lg:block">
            {showGroups ? "Groups" : "Contacts"}
          </span>
        </div>

        <div className="mt-3 hidden lg:flex items-center gap-4">
          {!showGroups ? (
            <label className="cursor-pointer flex items-center gap-2">
              <input
                type="checkbox"
                checked={showOnlineOnly}
                onChange={(e) => setShowOnlineOnly(e.target.checked)}
                className="checkbox checkbox-sm"
              />
              <span className="text-sm">Show online</span>
            </label>
          ) : null}
          <label className="cursor-pointer flex items-center gap-2">
            <input
              type="checkbox"
              checked={showGroups}
              onChange={(e) => {
                handleCheckbox(e.target.checked);
              }}
              className="checkbox checkbox-sm"
            />
            <span className="text-sm">Groups</span>
          </label>
          {showGroups ? (
            <div>
              {!selectedGroup ? (
                <button
                  onClick={handleCreateGroup}
                  className="btn btn-sm btn-primary"
                >
                  Create group
                </button>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
      {!showGroups ? (
        <div className="overflow-y-auto w-full py-3">
          {filteredUsers.map((user) => {
            const isOnline = onlineUsers?.some(
              (onlineUser) => onlineUser.id === user.id
            );
            return (
              <button
                key={user.id}
                onClick={() => handleUserClick(user)}
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
                    onError={(e) => {
                      e.target.onerror = null; // Prevent infinite loop
                      e.target.src = "/avatare.png"; // Yeh aapki default image ka path hoga
                    }}
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
      ) : (
        <div className="overflow-y-auto w-full py-3">
          {groups.map((group) => {
            return (
              <button
                key={group.id}
                onClick={() => handleGroupClick(group)}
                className={`
                w-full p-3 flex items-center gap-3
                hover:bg-base-300 transition-colors
                ${
                  selectedGroup?.id === group.id
                    ? "bg-base-300 ring-1 ring-base-300"
                    : ""
                }
              `}
              >
                <div className="relative mx-auto lg:mx-0">
                  <img
                    src={group.groupPic || "/avatar.png"}
                    alt={group.name}
                    className="size-12 object-cover rounded-full"
                    onError={(e) => {
                      e.target.onerror = null; // Prevent infinite loop
                      e.target.src = "/group.png"; // Yeh aapki default image ka path hoga
                    }}
                  />
                </div>
                <div className="hidden lg:block text-left min-w-0">
                  <div className="font-medium truncate">{group.name}</div>
                </div>
              </button>
            );
          })}
        </div>
      )}
      {/* {isGroupsLoading && <SidebarSkeleton />}
      <div className="border-t border-base-300 w-full p-5">
        <div className="flex items-center gap-2">
          <User className="size-6" />
          <span className="font-medium hidden lg:block">Groups</span>
        </div>

        <div className="mt-3 hidden lg:flex items-center gap-4">
          <label className="cursor-pointer flex items-center gap-2">
            <button onClick={handleCreateGroup}>Create group</button>
          </label>
        </div>
      </div>
      <div className="overflow-y-auto w-full py-3">
        {groups.map((group) => {
          return (
            <button
              key={group.id}
              onClick={() => setSelectedGroup(group)}
              className={`
                w-full p-3 flex items-center gap-3
                hover:bg-base-300 transition-colors
                ${
                  selectedUser?.id === group.id
                    ? "bg-base-300 ring-1 ring-base-300"
                    : ""
                }
              `}
            >
              <div className="relative mx-auto lg:mx-0">
                <img
                  src={group.groupPic || "/avatar.png"}
                  alt={group.name}
                  className="size-12 object-cover rounded-full"
                />
              </div>
              <div className="hidden lg:block text-left min-w-0">
                <div className="font-medium truncate">{group.name}</div>
              </div>
            </button>
          );
        })}
      </div> */}
    </aside>
  );
};

export default Sidebar;
