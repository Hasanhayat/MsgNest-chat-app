import toast from "react-hot-toast";
import Select from "react-select";
import { useChatStore } from "../store/useChatStore";
import { useEffect } from "react";

export const showGroupFormToast = ({ onSubmit, defaultValues = {} }) => {
  let groupName = defaultValues.name || "";
  let groupPic = defaultValues.groupPic || "";
  let selectedMembers = defaultValues.members || [];
  const { users } = useChatStore.getState();

  toast((t) => (
    <div className="bg-zinc-900 text-white p-4 rounded-lg w-[300px]">
      <h2 className="text-xl font-bold mb-2">
        {defaultValues.name ? "Update Group" : "Create Group"}
      </h2>
      <input
        type="text"
        placeholder="Group name"
        className="w-full mb-2 p-2 rounded bg-zinc-800 border border-zinc-700"
        defaultValue={groupName}
        onChange={(e) => (groupName = e.target.value)}
      />
      <input
        type="text"
        placeholder="Image URL"
        className="w-full mb-2 p-2 rounded bg-zinc-800 border border-zinc-700"
        defaultValue={groupPic}
        onChange={(e) => (groupPic = e.target.value)}
      />
      <Select
        isMulti
        options={users.map((u) => ({
          value: u.uid,
          label: u.fullName,
        }))}
        defaultValue={users
          .filter((u) => selectedMembers.includes(u.uid))
          .map((u) => ({ value: u.uid, label: u.name }))}
        onChange={(selected) => {
          selectedMembers = selected.map((s) => s.value);
        }}
        className="text-black mb-3"
      />
      <div className="flex justify-end gap-2">
        <button
          className="bg-green-600 text-white px-3 py-1 rounded"
          onClick={() => {
            toast.dismiss(t.id);
            onSubmit({
              name: groupName,
              groupPic: groupPic || "/group.png",
              members: selectedMembers.length > 0 ? selectedMembers : [],
            });
          }}
        >
          Save
        </button>
        <button
          className="bg-gray-600 text-white px-3 py-1 rounded"
          onClick={() => toast.dismiss(t.id)}
        >
          Cancel
        </button>
      </div>
    </div>
  ));
};
