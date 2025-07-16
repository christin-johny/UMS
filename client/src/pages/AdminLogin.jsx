import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { loginStart, loginSuccess, loginFailure } from '../redux/AuthSlice';
import { useNavigate } from 'react-router-dom';
import axios from '../Utils/Axios';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [serverError, setServerError] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const validateEmail = (value) => {
    setEmail(value);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value.trim())) {
      setEmailError('Enter a valid email');
      return false;
    } else {
      setEmailError('');
      return true;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateEmail(email)) return;

    dispatch(loginStart());
    setServerError('');
    try {
      const res = await axios.post('/api/admin/admin-login', { email, password });
      const { token, user } = res.data;

      if (!user.isAdmin) {
        dispatch(loginFailure('Access denied: Not an admin'));
        alert('Only admins can access this login');
        return;
      }

      dispatch(loginSuccess({ token, user }));
      navigate('/admin');
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Login failed';
      setServerError(errorMsg);
      dispatch(loginFailure(errorMsg));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md"
      >
        <h2 className="text-3xl font-extrabold text-center text-blue-700 mb-6">
          Admin Login
        </h2>

        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Email</label>
          <input
            type="email"
            placeholder="admin@example.com"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={email}
            onChange={(e) => validateEmail(e.target.value)}
            required
          />
          {emailError && (
            <p className="text-red-500 text-sm mt-1">{emailError}</p>
          )}
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2">Password</label>
          <input
            type="password"
            placeholder="••••••••"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {serverError && (
          <p className="text-red-500 text-sm text-center mb-4">{serverError}</p>
        )}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition duration-200 font-semibold"
          disabled={!email || !password || !!emailError}
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default AdminLogin;
