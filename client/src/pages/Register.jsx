import React, { useState } from 'react'
import axios from '../Utils/Axios';
import Swal from "sweetalert2";
import { useDispatch } from 'react-redux'
import { loginStart, loginSuccess, loginFailure } from '../redux/AuthSlice'
import { useNavigate } from 'react-router-dom'

const Register = () => {
  const [formData, setFormData] = useState({username: '',email: '',password: ''})
  const [confirmPassword, setConfirmPassword] = useState('')

  const [errors, setErrors] = useState({email: '',password: '',confirmPassword: ''})

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const validateName =(name)=>{
    const nameRegex = /^[A-Za-z\s]{2,50}$/
    return nameRegex.test(name.trim())

  }

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email.trim())
  }

  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/
    return passwordRegex.test(password)
  }

  const validateConfirmPassword = (password, confirmPassword) => {
    return password === confirmPassword
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    if (name === 'email') {
      setErrors((prev) => ({
        ...prev,
        email: validateEmail(value) ? '' : 'Enter a valid email'
      }))
    }
    if(name=='username'){
      setErrors((prev)=>({
        ...prev,
        name:validateName(value)? '' :'Enter a valid name'
      }))
    }

    if (name === 'password') {
      setErrors((prev) => ({
        ...prev,
        password: validatePassword(value)
          ? ''
          : 'Password must be at least 6 characters with letters,numbers and symbols',
        confirmPassword: validateConfirmPassword(value, confirmPassword)
          ? ''
          : 'Passwords do not match'
      }))
    }
  }

  const handleConfirmPasswordChange = (e) => {
    const value = e.target.value
    setConfirmPassword(value)

    setErrors((prev) => ({
      ...prev,
      confirmPassword: validateConfirmPassword(formData.password, value)
        ? ''
        : 'Passwords do not match'
    }))
  }

  const isFormValid = () => {
    return (
      validateName(formData.username) &&
      validateEmail(formData.email) &&
      validatePassword(formData.password) &&
      validateConfirmPassword(formData.password, confirmPassword)
    )
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!isFormValid()) return

    dispatch(loginStart())
    try {
      const res = await axios.post('/api/auth/register', formData)
      dispatch(loginSuccess(res.data))
      await Swal.fire('success','user registeration successfully completed','success');
      navigate('/')
    } catch (err) {
      dispatch(loginFailure(err.response?.data?.message || 'Something went wrong'))
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white shadow-md rounded-xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-blue-600 mb-6">Register</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            required
            className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
            required
            className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm">{errors.confirmPassword}</p>
          )}

          <button
            type="submit"
            className="bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition duration-200 disabled:opacity-50"
            disabled={!isFormValid()}
          >
            Register
          </button>

          <button
            type="button"
            className="text-blue-600 hover:underline text-sm mt-1"
            onClick={() => navigate('/login')}
          >
            Already have an account? Login
          </button>
        </form>
      </div>
    </div>
  )
}

export default Register
