import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { loginStart, loginSuccess, loginFailure } from '../redux/AuthSlice'
import axios from '../Utils/Axios'
import { useNavigate } from 'react-router-dom'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [emailError, setEmailError] = useState('')
  const [isEmailValid, setIsEmailValid] = useState(false)

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { loading, error } = useSelector((state) => state.auth)

 
  const checkEmail = (value) => {
    setEmail(value)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const isValid = emailRegex.test(value.trim())

    if (!isValid) {
      setEmailError('Enter a valid email')
      setIsEmailValid(false)
    } else {
      setEmailError('')
      setIsEmailValid(true)
    }
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    if (!isEmailValid || !password) return

    dispatch(loginStart())
    try {
      const res = await axios.post('/auth/login', { email, password })
      dispatch(loginSuccess(res.data))
      navigate('/')
    } catch (err) {
      dispatch(loginFailure(err.response?.data?.message || 'Login failed'))
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-extrabold text-center text-blue-600 mb-2">User Login</h1>
        <p className="text-center text-gray-500 mb-6">Please enter your credentials to continue</p>

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={email}
            onChange={(e) => checkEmail(e.target.value)}
            required
          />
          {emailError && <p className="text-red-500 text-sm">{emailError}</p>}

          <input
            type="password"
            placeholder="Password"
            className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <button
            type="submit"
            className="bg-blue-600 text-white p-3 rounded-md hover:bg-blue-700 transition duration-200 disabled:opacity-50"
            disabled={loading || !isEmailValid || !password}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>

          <button
            type="button"
            className="text-blue-600 hover:underline text-sm mt-1"
            onClick={() => navigate('/register')}
          >
            Don&apos;t have an account? Register
          </button>
        </form>
      </div>
    </div>
  )
}

export default Login
