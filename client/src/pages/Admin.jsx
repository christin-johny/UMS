import React, { useEffect, useState } from 'react'
import axios from '../Utils/Axios'
import Swal from 'sweetalert2'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { logout } from '../redux/AuthSlice'


const Admin = () => {
  const [users, setUsers] = useState([])
  const [search, setSearch] = useState('')
  const [editingUser, setEditingUser] = useState(null)
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const navigate = useNavigate();
  const dispatch =useDispatch()

  const fetchUsers = async () => {
  try {
    const res = await axios.get(`/admin/users?q=${search}&page=${page}`);
    setUsers(res.data.users);
    setTotalPages(res.data.totalPages);
  } catch (err) {
    console.error('Failed to fetch users: ', err);
  }
};


  useEffect(() => {
    fetchUsers()
  }, [search, page])

  useEffect(() => {
   setPage(1);
  }, [search]);



  const handleDelete = async (id) => {
  const result = await Swal.fire({
    title: 'Are you sure?',
    text: 'You won’t be able to revert this!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Yes, delete it!',
  })

  if (result.isConfirmed) {
    try {
      await axios.delete(`/admin/users/${id}`)
      await fetchUsers()
      Swal.fire('Deleted!', 'The user has been deleted.', 'success')
    } catch (error) {
      console.error(error); 
      Swal.fire('Error', 'Failed to delete user.', 'error')
    }
  }
}
  const handleLogout =()=>{
    dispatch(logout());
    navigate('/admin-login');
  }

  const handleEdit = (user) => {
    setEditingUser({ ...user })
  }

  const handleUpdate = async () => {
    try {
      await axios.put(`/admin/users/${editingUser._id}`, {
        name: editingUser.name,
        email: editingUser.email,
        isAdmin: editingUser.isAdmin,
      })
      
      setEditingUser(null)
      Swal.fire('success','User updated successfully','success')
      fetchUsers()
    } catch (err) {
      Swal.fire(
              "Error",
              err.response?.data?.message || "User with this email already exists!",
              "error"
            );
    }
  }

  return (
    <div className="p-6 min-h-screen bg-gray-100">
  <h1 className="text-3xl font-bold text-blue-700 mb-6 text-center">Admin Panel</h1>

  <div className="mb-6 flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6">
  <input
    type="text"
    placeholder="Search by name or email"
    className="border border-gray-300 rounded-md p-3 w-full max-w-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
    value={search}
    onChange={(e) => setSearch(e.target.value)}
  />

  <div className="flex gap-3">
    <button
      onClick={() => navigate('/admin/add-user')}
      className="bg-green-600 hover:bg-green-700 text-white font-medium px-4 py-2 rounded"
    >
      + Add User
    </button>
    <button
      onClick={handleLogout}
      className="bg-red-500 hover:bg-red-600 text-white font-medium px-4 py-2 rounded"
    >
      Logout
    </button>
  </div>
</div>


  <div className="overflow-x-auto">
    <table className="w-full bg-white border border-gray-300 rounded-md shadow-sm">
      <thead>
        <tr className="bg-blue-100 text-gray-700">
          <th className="border px-4 py-2">Name</th>
          <th className="border px-4 py-2">Email</th>
          <th className="border px-4 py-2">Admin</th>
          <th className="border px-4 py-2">Actions</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user) => (
          <tr key={user._id} className="text-center hover:bg-gray-50 transition">
            <td className="border px-4 py-2">{user.name}</td>
            <td className="border px-4 py-2">{user.email}</td>
            <td className="border px-4 py-2">{user.isAdmin ? '✅' : '❌'}</td>
            <td className="border px-4 py-2 space-x-2">
              <button
                onClick={() => handleEdit(user)}
                className="bg-yellow-400 hover:bg-yellow-500 text-white font-medium px-3 py-1 rounded"
              >
                Edit
              </button>
            {!user.isAdmin && <>
              
              <button
                onClick={() => handleDelete(user._id)}
                className="bg-red-600 hover:bg-red-700 text-white font-medium px-3 py-1 rounded"
              >
                Delete
              </button></>}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>


  {editingUser && (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl w-full max-w-sm shadow-lg space-y-4">
        <h2 className="text-xl font-semibold text-gray-800 text-center">Edit User</h2>
        <input
          type="text"
          className="border p-3 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={editingUser.name}
          onChange={(e) =>
            setEditingUser({ ...editingUser, name: e.target.value })
          }
        />
        <input
          type="email"
          className="border p-3 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={editingUser.email}
          onChange={(e) =>
            setEditingUser({ ...editingUser, email: e.target.value })
          }
        />
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input
            type="checkbox"
            checked={editingUser.isAdmin}
            onChange={(e) =>
              setEditingUser({ ...editingUser, isAdmin: e.target.checked })
            }
          />
          Is Admin
        </label>
        <div className="flex justify-end gap-3 pt-4">
          <button
            className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded"
            onClick={() => setEditingUser(null)}
          >
            Cancel
          </button>
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            onClick={handleUpdate}
          >
            Update
          </button>
        </div>
      </div>
    </div>
  )}
  <div className="flex justify-center mt-4 gap-4">
  <button
    onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
    disabled={page === 1}
    className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded disabled:opacity-50"
  >
    Previous
  </button>
  <span className="px-4 py-2 text-gray-700">
    Page {page} of {totalPages}
  </span>
  <button
    onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
    disabled={page === totalPages}
    className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded disabled:opacity-50"
  >
    Next
  </button>
</div>

</div>

  )
}

export default Admin
