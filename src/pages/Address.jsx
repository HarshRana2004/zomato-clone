import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function Address() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    pincode: "",
    landmark: "",
  });

  useEffect(() => {
    const saved = localStorage.getItem("foodyAddress");
    if (saved) setForm(JSON.parse(saved));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    if (!form.name || !form.phone || !form.address || !form.pincode) {
      alert("Please fill all required fields");
      return;
    }
    localStorage.setItem("foodyAddress", JSON.stringify(form));
    navigate("/checkout");
  };

  return (
    <>
      <Navbar />
      <div className="max-w-xl mx-auto px-4 py-10">
        <h2 className="text-2xl font-bold mb-6">Delivery Address</h2>
        <div className="space-y-4">
          <InputField label="Name" name="name" value={form.name} onChange={handleChange} required />
          <InputField label="Phone Number" name="phone" value={form.phone} onChange={handleChange} required />
          <TextAreaField label="Full Address" name="address" value={form.address} onChange={handleChange} required />
          <InputField label="Pincode" name="pincode" value={form.pincode} onChange={handleChange} required />
          <InputField label="Landmark (optional)" name="landmark" value={form.landmark} onChange={handleChange} />

          <button
            onClick={handleSave}
            className="mt-4 w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded"
          >
            Save & Continue
          </button>
        </div>
      </div>
    </>
  );
}

function InputField({ label, ...props }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        {...props}
        className="w-full border px-3 py-2 rounded text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
      />
    </div>
  );
}

function TextAreaField({ label, ...props }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <textarea
        {...props}
        rows={3}
        className="w-full border px-3 py-2 rounded text-sm resize-none focus:outline-none focus:ring-2 focus:ring-red-400"
      />
    </div>
  );
}
