const mongoose = require('mongoose');
const bcrypt = require('bcrypt');


const userSchema = new mongoose.Schema({
  username: {type: String,required: true},

  email: {type: String,required: true,unique: true,lowercase: true,},

  password: {type: String,required: true},
  role: {type: String,default: 'user'}
}, {
  timestamps: true  
});

//  Hash the password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    const hashed = await bcrypt.hash(this.password,10);
    this.password = hashed;
    next();
  } catch (err) {
    next(err);
  }
});

//  Instance method to compare password
userSchema.methods.comparePassword = async function (inputPassword) {
  return await bcrypt.compare(inputPassword, this.password);
};

module.exports = mongoose.models.User || mongoose.model('User', userSchema);

