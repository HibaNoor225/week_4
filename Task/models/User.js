const mongoose = require('mongoose');

// Define the schema
const userSchema = new mongoose.Schema({
  name: {type: String,required: true},
  email: {type: String,required: true,unique: true},
  role: {type: String,default: 'user'
  },
  gender: {type: String}
});

module.exports = mongoose.model('User', userSchema);
