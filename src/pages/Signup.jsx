import React, { useState } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onloadend = async () => {
      setUploading(true);
      try {
        const formData = new FormData();
        formData.append("file", reader.result);
        formData.append("upload_preset", "unsigned_upload"); // Set this in Cloudinary

        const res = await fetch(
          "https://api.cloudinary.com/v1_1/dsdsgexvg/image/upload",
          {
            method: "POST",
            body: formData,
          }
        );

        const data = await res.json();
        if (data.secure_url) {
          setPhotoURL(data.secure_url);
        } else {
          alert("Upload failed: No URL returned.");
        }
      } catch (error) {
        alert("Upload failed: " + error.message);
      } finally {
        setUploading(false);
      }
    };
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!name || !email || !password) {
      alert("Please fill all fields.");
      return;
    }

    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCred.user, {
        displayName: name,
        photoURL: photoURL || "",
      });

      localStorage.setItem("isOnboarded", "false");
      navigate("/onboarding");
    } catch (err) {
      console.error("Signup Error", err);
      alert("Signup failed. Please try again.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12 p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">Signup</h2>
      <form onSubmit={handleSignup} className="space-y-4">
        <input
          type="text"
          placeholder="Name"
          className="w-full px-4 py-2 border rounded"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          className="w-full px-4 py-2 border rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full px-4 py-2 border rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="file"
          accept="image/*"
          className="w-full"
          onChange={handleImageUpload}
        />
        {uploading && <p className="text-sm text-gray-500">Uploading image...</p>}
        {photoURL && (
          <img
            src={photoURL}
            alt="Preview"
            className="w-16 h-16 rounded-full object-cover mt-2"
          />
        )}
        <button
          type="submit"
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 w-full"
          disabled={uploading}
        >
          {uploading ? "Uploading..." : "Signup"}
        </button>
      </form>
    </div>
  );
}
