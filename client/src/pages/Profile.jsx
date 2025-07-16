import React, { useEffect, useState } from 'react'
import axios from '../Utils/Axios'
import { useDispatch } from 'react-redux'
import { logout } from '../redux/AuthSlice'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

const Profile = () => {
  const [profile, setProfile] = useState(null)
  const [selectedImage, setSelectedImage] = useState(null)
  const dispatch = useDispatch();
  const navigate = useNavigate()

  const { token } = useSelector((state) => state.auth)



  useEffect(() => {
const fetchProfile = async () => {
  try {
    const res = await axios.get('/api/auth/profile', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    setProfile(res.data)
  } catch (err) {
    console.error('Failed to fetch profile:', err)
  }
}
  if (token) {
    fetchProfile()
  }
}, [token])


  const handleImageChange = (e) => {
    setSelectedImage(e.target.files[0])
  }

  const handleUpload = async (e) => {
    e.preventDefault()
    if (!selectedImage) return

    const formData = new FormData()
    formData.append('image', selectedImage)

    try {
      const res = await axios.post('api/auth/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      setProfile({ ...profile, profileImage: res.data.profileImage })
    } catch (err) {
      console.error('Upload error:', err)
    }
  }
  const handleLogout =()=>{
    dispatch(logout());
    navigate('/login')
  }

  return (
<div className="p-6 max-w-xl mx-auto bg-white shadow-lg rounded-xl mt-10">
  <button
    onClick={() => navigate('/')}
    className="text-blue-600 hover:underline text-sm mb-4 inline-block"
  >
    ← Back to Home
  </button>

  <h1 className="text-3xl font-extrabold text-blue-700 mb-8 text-center">
    Your Profile
  </h1>

  {profile && (
    <div className="flex flex-col items-center text-center space-y-6">
      <div>
        <img
          src={
            profile.profileImage
              ? `http://localhost:3000${profile.profileImage}`
              : 'https://via.placeholder.com/150?text=No+Image'
          }
          alt="Profile"
          className="w-32 h-32 rounded-full object-cover border-4 border-blue-500 shadow"
        />
      </div>

      <div className="space-y-2">
        <p className="text-lg text-gray-800">
          <strong className="text-gray-900">Name:</strong> {profile.name}
        </p>
        <p className="text-lg text-gray-800">
          <strong className="text-gray-900">Email:</strong> {profile.email}
        </p>
      </div>

      {!profile.profileImage && (
        <form onSubmit={handleUpload} className="w-full space-y-4">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="block w-full text-sm text-gray-700
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-100 file:text-blue-700
              hover:file:bg-blue-200"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md font-semibold hover:bg-blue-700 transition duration-200"
          >
            Upload Image
          </button>
        </form>
      )}

      <button
        onClick={handleLogout}
        className="w-full bg-red-500 text-white py-2 rounded-md font-semibold hover:bg-red-600 transition duration-200"
      >
        Logout
      </button>
    </div>
  )}
</div>

  )
}

export default Profile
