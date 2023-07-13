const mongoose = require('mongoose');

const registerSchema = new mongoose.Schema({
  first_name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  NID: {
    type: Number,
    required: true,
  },
  addr1: {
    type: String,
    required: true,
  },
});

const Register = mongoose.model('Register', registerSchema);

module.exports = Register;
