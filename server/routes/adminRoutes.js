const express = require('express')
const router = express.Router()
const { getAllUsers, deleteUser, updateUser,adminLogin,addUser } = require('../controllers/adminController')
const { protect} = require('../middleware/authMiddleware')


router.post('/admin-login', adminLogin)
router.get('/users',protect, getAllUsers)
router.delete('/users/:id',protect, deleteUser)
router.put('/users/:id',protect, updateUser)
router.post('/users',protect, addUser);



module.exports = router
