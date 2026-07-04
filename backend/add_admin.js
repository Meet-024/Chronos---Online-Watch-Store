const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
dotenv.config();
const addAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/watchstore');
    console.log('MongoDB connected');
    const existing = await User.findOne({ email: 'meet@gmail.com' });
    if (existing) {
      console.log('User meet@gmail.com already exists. Updating role to admin...');
      existing.role = 'admin';
      existing.password = 'Meet@123'; 
      await existing.save();
      console.log('Updated successfully!');
    } else {
      await User.create({
        name: 'Meet',
        email: 'meet@gmail.com',
        password: 'Meet@123',
        role: 'admin',
      });
      console.log('Admin user created: meet@gmail.com / Meet@123');
    }
    process.exit();
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
};
addAdmin();