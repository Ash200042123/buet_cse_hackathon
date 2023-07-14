const mongoose = require('mongoose');

const registerSchema = new mongoose.Schema({
  first_name: {
    type: String,
    required: true,
  },
  phoneno: {
    type: Number,
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
  vaccine_id: {
    type: String,
    required: false,
  },
  vaccine_date: {
    type: Date,
    required: false,
  },
});

const Register = mongoose.model('Register', registerSchema);

module.exports = Register;
