import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Register from './pages/Register'
import Login from './pages/Login'
import Profile from './pages/Profile'
import Admin from './pages/Admin'
import AdminLogin from './pages/AdminLogin'
import Home from './pages/Home'
import ProtectedRoute from './ProtectedRoute/PrivateRoute'
import PublicRoute from './ProtectedRoute/PublicRoute'
import AdminRoute from './ProtectedRoute/AdminRoute'
import AdminPublicRoute from './ProtectedRoute/AdminPublicRoute'
import AddUser from './pages/AddUser'

const App = () => {

  return (<>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/register' element={<PublicRoute><Register/></PublicRoute> }/>
        <Route path='/login' element={<PublicRoute><Login/></PublicRoute> }/>
        <Route path='/profile' element={<ProtectedRoute><Profile/></ProtectedRoute> }/>
        <Route path ={'/admin'} element={<AdminRoute><Admin/></AdminRoute> }/>
        <Route path="/admin-login" element={<AdminPublicRoute><AdminLogin /></AdminPublicRoute> } />
        <Route path='/admin/add-user' element={<AdminRoute> <AddUser/> </AdminRoute> }/>
      </Routes>
    </BrowserRouter></>
  )
}

export default App
