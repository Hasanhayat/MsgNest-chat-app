import toast from "react-hot-toast";
import { useChatStore } from "../store/useChatStore";
import { useEffect, useState } from "react";

export const showGroupFormToast = ({ onSubmit, defaultValues = {} }) => {
  toast.custom((t) => (
    <GroupFormContent t={t} onSubmit={onSubmit} defaultValues={defaultValues} />
  ));
};

const GroupFormContent = ({ t, onSubmit, defaultValues }) => {
  const { users } = useChatStore();

  // Form state with reset capability
  const [groupName, setGroupName] = useState(defaultValues.name || "");
  const [groupPic, setGroupPic] = useState(defaultValues.groupPic || "");
  const [selectedMembers, setSelectedMembers] = useState(
    defaultValues.members || []
  );

  // Function to reset form fields to empty after submit
  const resetForm = () => {
    setGroupName("");
    setGroupPic("");
    setSelectedMembers([]);
  };

  const handleSave = () => {
    onSubmit({
      name: groupName,
      groupPic: groupPic || "/group.png",
      members: selectedMembers,
    });
    toast.dismiss(t.id); // close toast after save
    resetForm(); // clear the form after submit
  };

  const handleCancel = () => {
    toast.dismiss(t.id); // just close toast without saving
    resetForm();
  };
  const handleOption = (user) => {
    selectedusers.push(user);
    console.log(selectedusers, selectedMembers);
  };

  return (
    <div className="bg-zinc-900 text-white p-5 rounded-2xl w-[300px] shadow-xl">
      <h2 className="text-2xl font-semibold mb-4">
        {defaultValues.name ? "Update Group" : "Create Group"}
      </h2>

      <div className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Enter group name"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          className="p-3 rounded-lg bg-zinc-800 border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 placeholder-gray-400"
        />

        <input
          type="text"
          placeholder="Enter image URL"
          value={groupPic}
          onChange={(e) => setGroupPic(e.target.value)}
          className="p-3 rounded-lg bg-zinc-800 border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 placeholder-gray-400"
        />

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Select Members
          </label>
          <div className="flex items-center gap-2 mb-2 flex-col overflow-y-scroll h-32 p-2 bg-zinc-800 border border-zinc-700 rounded-lg">
            {users.map((user) => (
              <>
                <input
                  key={user.id}
                  type="button"
                  value={user.fullName}
                  disabled={selectedMembers.includes(user.id)}
                  className="btn btn-square w-full"
                  onClick={() => {
                    setSelectedMembers((prev) =>
                      prev.includes(user.uid)
                        ? prev.filter((id) => id !== user.uid)
                        : [...prev, user.id]
                    );
                  }}
                />
              </>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button
            className="bg-green-600 hover:bg-green-700 transition text-white px-4 py-2 rounded-lg font-semibold"
            onClick={handleSave}
          >
            Save
          </button>
          <button
            className="bg-gray-700 hover:bg-gray-800 transition text-white px-4 py-2 rounded-lg font-medium"
            onClick={handleCancel}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
