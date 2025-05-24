import { X } from "lucide-react";
import { useChatStore } from "../store/useChatStore";
import { useEffect, useState } from "react";
import { ref, onValue, set } from "firebase/database";
import { realtimeDb } from "../firebase"; // Apna Firebase config import karo
import moment from "moment";
import { showGroupFormToast } from "./CreateGroupForm";
import { getAuth } from "firebase/auth";
import toast from "react-hot-toast";

const ChatHeader = () => {
  const {
    selectedUser,
    setSelectedUser,
    onlineUsers,
    selectedGroup,
    setSelectedGroup,
    getGroups,
    updateGroup,
    deleteGroup,
  } = useChatStore();
  const [lastSeen, setLastSeen] = useState(null);
  const auth = getAuth();

  //  Last seen formatting without moment.js
  const formatLastSeen = (timestamp) => {
    const lastSeenTime = moment(timestamp);
    const isToday = lastSeenTime.isSame(moment(), "day");

    return isToday
      ? `Offline until Today  ${lastSeenTime.format(" h:mm A")}`
      : `Offline until  ${lastSeenTime.format(" D MMMM, YYYY - h:mm A")}`;
  };

  //  Fetch real-time lastSeen from Firebase
  useEffect(() => {
    if (selectedUser) {
      const userRef = ref(realtimeDb, `users/${selectedUser.id}/lastSeen`);
      const unsubscribe = onValue(userRef, (snapshot) => {
        if (snapshot.exists()) {
          setLastSeen(snapshot.val());
        }
      });
      return () => unsubscribe(); // Clean-up on unmount
    }
  }, [selectedUser]);

  const isOnline = onlineUsers.some(
    (onlineUser) => onlineUser.id === selectedUser?.id
  );
  const handleClose = () => {
    setSelectedUser(null);
    setSelectedGroup(null);
  };

  const handleUpdateGroup = (groupId, oldvalues) => {
    showGroupFormToast({
      defaultValues: oldvalues,
      onSubmit: (groupData) => {
        if (!groupData.members.includes(auth.currentUser.uid)) {
          groupData.members.push(auth.currentUser.uid);
        }
        updateGroup(groupId, groupData);
        getGroups();
        setSelectedGroup(null);
      },
    });
  };
  const handleDeleteGroup = (groupId) => {
    toast((t) => (
      <div className="p-4 bg-white shadow-lg rounded-lg">
        <h3 className="font-semibold text-lg mb-2">Delete Group</h3>
        <p className="mb-4">
          Are you sure you want to delete this group? This action cannot be
          undone.
        </p>
        <p className="text-sm text-gray-500 mb-4">
          <strong>Group Name:</strong> {selectedGroup?.name || "N/A"}
        </p>
        <p className="text-sm text-gray-500 mb-4">
          <strong>Members:</strong> {selectedGroup?.members.length || 0} members
        </p>

        <div className="flex justify-end gap-2">
          <button
            onClick={() => {
              toast.dismiss(t.id);
              deleteGroup(groupId);
              setSelectedGroup(null);
              setSelectedUser(null);
            }}
            className="bg-red-600 text-white px-4 py-2 rounded-lg"
          >
            Yes, Delete
          </button>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="bg-gray-600 text-white px-4 py-2 rounded-lg"
          >
            Cancel
          </button>
        </div>
      </div>
    ));
  };

  return (
    <div className="p-2.5 border-b border-base-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="avatar">
            <div className="size-10 rounded-full relative">
              {selectedGroup ? (
                <img
                  src={selectedGroup?.groupPic || "/group.png"}
                  alt={selectedGroup?.groupName}
                  onError={(e) => {
                    e.target.onerror = null; // Prevent infinite loop
                    e.target.src = "/group.png"; // Yeh aapki default image ka path hoga
                  }}
                />
              ) : (
                <img
                  src={selectedUser?.profilePic || "/avatar.png"}
                  alt={selectedUser?.fullName}
                  onError={(e) => {
                    e.target.onerror = null; // Prevent infinite loop
                    e.target.src = "/avatar.png"; // Yeh aapki default image ka path hoga
                  }}
                />
              )}
            </div>
          </div>

          {/* User info */}
          <div>
            <h3 className="font-medium">
              {selectedUser ? selectedUser.fullName : selectedGroup.name}
            </h3>
            {/* <p className="text-sm text-base-content/70">
              {isOnline ? "Online" : formatLastSeen(lastSeen)}
            </p> */}
          </div>
        </div>

        {/* update and delete group buttons */}
        <div className="flex gap-2 justify-end items-center">
          <div className="hidden lg:flex gap-2">
            {selectedGroup && (
              <>
                <button
                  className="btn btn-sm btn-primary"
                  onClick={() => {
                    const oldValues = {
                      name: selectedGroup.groupName,
                      groupPic: selectedGroup.groupPic,
                      members: selectedGroup.members,
                    };
                    handleUpdateGroup(selectedGroup.id, oldValues);
                  }}
                >
                  Update Group
                </button>
                <button
                  className="btn btn-sm btn-error"
                  onClick={() => {
                    handleDeleteGroup(selectedGroup.id);
                  }}
                >
                  Delete Group
                </button>
              </>
            )}
          </div>

          {/* Close button */}
          <button onClick={handleClose} className="btn btn-ghost btn-circle">
            <X />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;
