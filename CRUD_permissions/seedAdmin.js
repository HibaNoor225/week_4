const User = require('./models/User'); 
const seedAdmin = async () => {
  const existingAdmin = await User.findOne({ email: 'admin@gmail.com' });
  if (!existingAdmin) {
    const admin = new User({
      username: 'admin',
      email: 'admin@gmail.com',
      password: 'Admin@123', 
      role: 'admin'
    });

    await admin.save();
    console.log(' Admin user created');
  } else {
    console.log(' Admin user already exists');
  }

};
module.exports=seedAdmin;
