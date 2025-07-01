import React, { useEffect, useState } from "react";
import { useUser } from "../context/UserContext";
import { updateProfile } from "firebase/auth";
import { auth } from "../firebase";

export default function Profile() {
  const { user } = useUser();
  const [name, setName] = useState(user?.displayName || "");
  const [email] = useState(user?.email || "");
  const [dob, setDob] = useState("");
  const [photo, setPhoto] = useState(user?.photoURL || "");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const storedDOB = localStorage.getItem("foodyUserDOB");
    if (storedDOB) setDob(storedDOB);
  }, []);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setLoading(true);

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64Image = reader.result.split(",")[1];
      try {
        const res = await fetch("https://upload.imagekit.io/api/v1/files/upload", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Basic " + btoa("public_nCxU+BbE/5JyOSXxGE+kCa9PA38="), // Replace with your Public API Key (Base64 encoded)
          },
          body: JSON.stringify({
            file: `data:${file.type};base64,${base64Image}`,
            fileName: file.name,
            folder: "/foodygaadi",
          }),
        });

        const data = await res.json();

        if (data.url) {
          setPhoto(data.url);

          // ✅ Update Firebase photoURL
          await updateProfile(auth.currentUser, { photoURL: data.url });

          // ✅ Save in localStorage
          localStorage.setItem("foodyUserPhoto", data.url);

          alert("Profile photo updated!");
        } else {
          alert("Upload failed: No URL found");
        }
      } catch (err) {
        console.error(err);
        alert("Upload failed");
      } finally {
        setLoading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    try {
      await updateProfile(auth.currentUser, {
        displayName: name,
        photoURL: photo,
      });
      localStorage.setItem("foodyUserPhoto", photo);
      localStorage.setItem("foodyUserDOB", dob);
      alert("Profile updated successfully!");
    } catch (error) {
      console.error(error);
      alert("Error updating profile.");
    }
  };

  return (
    <>
      <div className="max-w-xl mx-auto px-4 py-10">
        <h2 className="text-2xl font-bold mb-6">👤 My Profile</h2>
        <div className="bg-white p-6 rounded-xl shadow space-y-4">
          <div className="flex items-center space-x-4">
            <img
              src={photo || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
              alt="Profile"
              className="w-16 h-16 rounded-full object-cover"
            />
            <div>
              <input type="file" onChange={handleImageChange} className="text-sm" />
              {loading && <p className="text-xs text-gray-500">Uploading...</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full mt-1 border px-3 py-2 rounded text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              value={email}
              disabled
              className="w-full mt-1 border px-3 py-2 rounded text-sm bg-gray-100 text-gray-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
            <input
              type="date"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              className="w-full mt-1 border px-3 py-2 rounded text-sm"
            />
          </div>

          <button
            onClick={handleSave}
            className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600 transition"
          >
            Save Profile
          </button>
        </div>
      </div>
    </>
  );
}
