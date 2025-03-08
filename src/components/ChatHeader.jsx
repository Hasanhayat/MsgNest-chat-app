import { X } from "lucide-react";
import { useChatStore } from "../store/useChatStore";
import moment from "moment";

const ChatHeader = () => {
  const { selectedUser, setSelectedUser, onlineUsers } = useChatStore();

  // Last seen formatting function
  const formatLastSeen = (timestamp) => {
    const lastSeenTime = moment(timestamp);
    const isToday = lastSeenTime.isSame(moment(), "day");

    return isToday
      ? `Offline until Today  ${lastSeenTime.format(" h:mm A")}`
      : `Offline until  ${lastSeenTime.format(" D MMMM, YYYY - h:mm A")}`;
  };

  const isOnline = onlineUsers.some(
    (onlineUser) => onlineUser.id === selectedUser?.id
  );

  return (
    <div className="p-2.5 border-b border-base-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="avatar">
            <div className="size-10 rounded-full relative">
              <img
                src={selectedUser?.profilePic || "/avatar.png"}
                alt={selectedUser?.fullName}
              />
            </div>
          </div>

          {/* User info */}
          <div>
            <h3 className="font-medium">{selectedUser?.fullName}</h3>
            <p className="text-sm text-base-content/70">
              {isOnline ? "Online" : formatLastSeen(selectedUser?.lastSeen)}
            </p>
          </div>
        </div>

        {/* Close button */}
        <button onClick={() => setSelectedUser(null)}>
          <X />
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;
