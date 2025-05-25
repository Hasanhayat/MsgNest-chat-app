import toast from "react-hot-toast";
import { useChatStore } from "../store/useChatStore";
import { useEffect, useRef, useState } from "react";

export const showGroupFormToast = ({ onSubmit, defaultValues = {} }) => {
  toast.custom((t) => (
    <GroupFormContent t={t} onSubmit={onSubmit} defaultValues={defaultValues} />
  ));
};

const GroupFormContent = ({ t, onSubmit, defaultValues }) => {
  const { users } = useChatStore();

  // Form state with reset capability
    const fileInputRef = useRef(null);
  useEffect(() => {
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Reset file input value    
    }
  }, [defaultValues]);
  
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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setGroupPic(reader.result); // Set the image preview
    };
    reader.readAsDataURL(file);     
  };

  const handleSave = () => {
      if (!groupName.trim()) {
      toast.error("Group name is required");
      return;
    }
    if (selectedMembers.length < 2) {
      toast.error("Please select at least one member");
      return;
    }
    if (groupPic) {
      // Upload image to Cloudinary
      const formData = new FormData();
      formData.append("file", groupPic);
      formData.append("upload_preset", "msgnest");
      formData.append("cloud_name", "dlkvzmnrt");
      fetch("https://api.cloudinary.com/v1_1/dlkvzmnrt/image/upload", {
        method: "POST",
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.secure_url) {
            setGroupPic(data.secure_url); // Set the uploaded image URL
          } else {
            toast.error("Failed to upload image");
            return;
          }
        })
        .catch((error) => {
          console.error("Image upload error: ", error);
          toast.error("Failed to upload image");
          return;
        });
    }
    onSubmit({
      name: groupName,
      groupPic: groupPic,
      members: selectedMembers,
    });
    toast.dismiss(t.id); // close toast after save
    resetForm(); // clear the form after submit
  };

  const handleCancel = () => {
    toast.dismiss(t.id); // just close toast without saving
    resetForm();
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
          type="file"
          accept="image/*"
          onChange={(e) => handleImageChange(e)}
          className="p-3 rounded-lg bg-zinc-800 border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 placeholder-gray-400"
        />

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Select Members
          </label>
          <div className="flex items-center gap-2 mb-2 flex-col overflow-y-scroll h-32 p-2 bg-zinc-800 border border-zinc-700 rounded-lg">
            {users.map((user) => (
              <div key={user.id} className="w-full">
                <input
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
              </div>
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
