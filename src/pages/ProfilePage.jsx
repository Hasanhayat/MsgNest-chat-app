import { useState, useEffect } from "react";
import { Camera, Mail, User } from "lucide-react";
import { getAuth, updateProfile, deleteUser, EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth";
import { db, realtimeDb } from "../firebase";
import { doc, updateDoc, deleteDoc } from "firebase/firestore";
import { ref, remove } from "firebase/database";
import axios from "axios";
import toast from "react-hot-toast";

const ProfilePage = () => {
  const [selectedImg, setSelectedImg] = useState(null);
  const [authUser, setAuthUser] = useState(null);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [password, setPassword] = useState(null);

  const auth = getAuth();

  useEffect(() => {
    if (auth.currentUser) {
      setAuthUser(auth.currentUser);
      document.title = `Profile - ${auth.currentUser.displayName || "User"}`;
    }
  }, [auth.currentUser]);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUpdatingProfile(true);
    toast.loading("Profile is Updating");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "msgnest");
    formData.append("cloud_name", "dlkvzmnrt");

    try {
      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/dlkvzmnrt/image/upload",
        formData
      );

      let imageUrl = response.data.secure_url;

      imageUrl = response.data.secure_url.replace(
        "/upload/",
        "/upload/c_thumb,w_200,h_200/"
      );

      await updateProfile(auth.currentUser, { photoURL: imageUrl });

      const userDocRef = doc(db, "users", auth.currentUser.uid);
      await updateDoc(userDocRef, { profilePic: imageUrl });

      setSelectedImg(imageUrl);
      setAuthUser({ ...authUser, photoURL: imageUrl });
      toast.dismiss();
    } catch (error) {
      toast.error("Failed to upload image");
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!authUser) return;

    toast((t) => (
      <div>
        <p>
          Are you sure you want to delete your account? This action cannot be
          undone.
        </p>
        <div className="flex flex-col gap-4 mt-4">
           <input
            type="password"
            placeholder="Enter your password"
            onChange={(e) => setPassword(e.target.value)}
            // value={password}
            className="p-2 border rounded-lg w-full"
          />
          <div className="flex justify-end gap-2">
            <button
              onClick={() => {
                toast.dismiss(t.id);
                confirmDeleteAccount();
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
      </div>
    ));
  };

  const confirmDeleteAccount = async () => {
      if (!password) return toast.error("Please enter your password.");
      toast.loading("Deleting");


    try {
      const credential = EmailAuthProvider.credential(authUser.email, password);
      await reauthenticateWithCredential(authUser, credential);

      const userDocRef = doc(db, "users", authUser.uid);
      const userStatusRef = ref(realtimeDb, `users/${authUser.uid}`);

      await deleteDoc(userDocRef); // Firestore se delete
      await remove(userStatusRef); // Realtime DB se delete

      await deleteUser(authUser); // Auth se delete
      toast.dismiss();
      toast.success("Account deleted successfully.");
    } catch (error) {
      toast.dismiss();
      console.error("Error deleting account:", error);
      toast.error("Failed to delete account. Please try again.");
    }
  };
  return (
    <div className="min-h-screen pt-20">
      <div className="max-w-2xl mx-auto p-4 py-8">
        <div className="bg-base-300 rounded-xl p-6 space-y-8">
          <div className="text-center">
            <h1 className="text-2xl font-semibold">Profile</h1>
            <p className="mt-2">Your profile information</p>
          </div>

          {/* avatar upload section */}

          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <img
                src={selectedImg || authUser?.photoURL || "/avatar.png"}
                alt="Profile"
                className="size-32 rounded-full object-cover border-4"
              />
              <label
                htmlFor="avatar-upload"
                className={`
                  absolute bottom-0 right-0 
                  bg-base-content hover:scale-105
                  p-2 rounded-full cursor-pointer 
                  transition-all duration-200
                  ${
                    isUpdatingProfile ? "animate-pulse pointer-events-none" : ""
                  }
                `}
              >
                <Camera className="w-5 h-5 text-base-200" />
                <input
                  type="file"
                  id="avatar-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isUpdatingProfile}
                />
              </label>
            </div>
            <p className="text-sm text-zinc-400">
              {isUpdatingProfile
                ? "Uploading..."
                : "Click the camera icon to update your photo"}
            </p>
          </div>

          <div className="space-y-6">
            <div className="space-y-1.5">
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <User className="w-4 h-4" />
                Full Name
              </div>
              <p className="px-4 py-2.5 bg-base-200 rounded-lg border">
                {authUser?.displayName}
              </p>
            </div>

            <div className="space-y-1.5">
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Address
              </div>
              <p className="px-4 py-2.5 bg-base-200 rounded-lg border">
                {authUser?.email}
              </p>
            </div>
          </div>

          <div className="mt-6 bg-base-300 rounded-xl p-6">
            <h2 className="text-lg font-medium mb-4">Account Information</h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between py-2 border-b border-zinc-700">
                <span>Member Since</span>
                <span>{authUser?.metadata?.creationTime?.split("T")[0]}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span>Account Status</span>
                <span className="text-green-500">Active</span>
              </div>
            </div>
          </div>

          <button
            onClick={handleDeleteAccount}
            className="mt-6 w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition-all"
          >
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
