import React, { useState } from "react";
import axios from "../Utils/Axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const AddUser = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    isAdmin: false,
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
    setErrors({ ...errors, [name]: "" }); 
  };

 const validate = () => {
  const newErrors = {};
  const nameRegex= /^[A-Za-z\s]{2,50}$/
  if (!nameRegex.test(formData.name.trim())) {
    newErrors.name = "Enter a valid name";
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(formData.email.trim())) {
    newErrors.email = "Enter a valid email address";
  }

  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
  if (!passwordRegex.test(formData.password)) {
    newErrors.password =
      "Password must be at least 6 characters with letters,numbers and symbols";
  }

  return newErrors;
};


  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      await axios.post("/admin/users", formData);
      await Swal.fire("Success", "User created successfully", "success");
      navigate("/admin");
    } catch (err) {
      Swal.fire(
        "Error",
        err.response?.data?.message || "Failed to create user",
        "error"
      );
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16 bg-white p-8 shadow-xl rounded-2xl border border-gray-100 relative">
      
      <button
        onClick={() => navigate("/admin")}
        className="absolute -top-4 -left-4 bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-1 rounded-lg shadow text-sm"
      >
        ← Back
      </button>

      <h2 className="text-3xl font-bold text-blue-700 mb-6 text-center">Add New User</h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div>
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
              errors.name ? "border-red-500 focus:ring-red-400" : "focus:ring-blue-500"
            }`}
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
        </div>

        <div>
          <input
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
              errors.email ? "border-red-500 focus:ring-red-400" : "focus:ring-blue-500"
            }`}
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
        </div>

        <div>
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
              errors.password ? "border-red-500 focus:ring-red-400" : "focus:ring-blue-500"
            }`}
          />
          {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
        </div>

        <label className="flex items-center gap-3 text-gray-700">
          <input
            type="checkbox"
            name="isAdmin"
            checked={formData.isAdmin}
            onChange={handleChange}
            className="accent-blue-600 w-4 h-4"
          />
          <span className="text-sm font-medium">Is Admin?</span>
        </label>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200 font-semibold"
        >
          Add User
        </button>
      </form>
    </div>
  );
};

export default AddUser;
