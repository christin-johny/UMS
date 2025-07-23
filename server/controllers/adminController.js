const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.adminLogin = async (req, res) => {
  const { email, password } = req.body
 
  try {
    const user = await User.findOne({email })
   

    if (!user || !user.isAdmin) {
      return res.status(403).json({ message: 'Access denied: Admins only' })
    }
    
    const isMatch = await bcrypt.compare(password, user.password)
    
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }
    
    const token = jwt.sign(
      { id: user._id, isAdmin: true },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )
    res.status(200).json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: true,
      },
    })
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: 'Server error' })
  }
}

exports.getAllUsers = async (req, res) => {
  const search = req.query.q || '';
  const page = parseInt(req.query.page) || 1;
  const limit =5;
  const skip = (page - 1) * limit;

  const query = {
    $or: [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
    ],
  };

  try {
    const [users, total] = await Promise.all([
      User.find(query).select('-password').skip(skip).limit(limit),
      User.countDocuments(query),
    ]);

    res.json({
      users,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch users' });
  }
};


exports.deleteUser = async (req, res) => {
  await User.findByIdAndDelete(req.params.id)
  res.json({ message: 'User deleted' })
}

exports.updateUser = async (req, res) => {
  const user = await User.findById(req.params.id)
  if (!user) return res.status(404).json({ message: 'User not found' })
    const existingUser = await User.findOne({email:user.email});
    if(existingUser){
      return res.status(400).json({message:'User already with this email alreadyexists !'})
    }
  user.name = req.body.name || user.name
  user.email = req.body.email || user.email
  user.isAdmin = req.body.isAdmin ?? user.isAdmin

  const updated = await user.save()
  res.json({ message: 'User updated', user: updated })
}

exports.addUser = async (req,res)=>{
  const {name,email,password,isAdmin} = req.body;
  try{
    const existingUser = await User.findOne({email});
    if(existingUser){
      return res.status(400).json({message:'User already exists!'})
    }
    const hashedPassword = await bcrypt.hash(password,10);
    const newUser = await User.create({
      name,
      email,
      password:hashedPassword,
      isAdmin:isAdmin || false

    });
    res.status(201).json({
      message:'user created successfully'
    })
  }catch(error){
    console.error('Error creating user:', error);
    res.status(500).json({message:'server error'})
  }

}