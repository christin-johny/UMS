import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../redux/AuthSlice'

const Home = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.auth)


  const handleLogout = () => {
    dispatch(logout())
    navigate('/login')
  }

  return (
    <div className="min-h-screen flex flex-col">
     
      <nav className="bg-blue-800 text-white p-4 shadow-md flex justify-between items-center">
        <h1 className="text-2xl font-bold">UMS</h1>

        <div className="space-x-4">
          {user && !user.isAdmin? (
            <>
              <Link to="/profile" className="hover:underline">
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 px-4 py-1 rounded"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:underline">
                Login
              </Link>
              <Link to="/register" className="hover:underline">
                Register
              </Link>
            </>
          )}
        </div>
      </nav>

      <section className="flex-1 bg-gray-100 flex items-center justify-center p-8 text-center">
        <div>
          <h2 className="text-4xl font-bold mb-4 text-blue-700">Welcome {user && !user.isAdmin ? user.name : ''}!</h2>
          <p className="text-lg text-gray-700 mb-6">
            {user && !user.isAdmin
              ? 'You are logged in and can access your dashboard.'
              : 'Please log in or register to use the application.'}
          </p>
          {!user && (
            <Link to="/register">
              <button className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition">
                Get Started
              </button>
            </Link>
          )}
        </div>
      </section>
    </div>
  )
}

export default Home
