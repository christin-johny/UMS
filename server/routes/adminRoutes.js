const express = require('express')
const router = express.Router()
const { getAllUsers, deleteUser, updateUser,adminLogin,addUser } = require('../controllers/adminController')
const { protect, adminOnly } = require('../middleware/authMiddleware')


router.post('/admin-login', adminLogin)
//router.use(protect, adminOnly)

router.get('/users', getAllUsers)
router.delete('/users/:id', deleteUser)
router.put('/users/:id', updateUser)
router.post('/users', protect, addUser);



module.exports = router
