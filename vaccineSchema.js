const mongoose = require('mongoose');

const vaccineSchema = new mongoose.Schema({
  vaccine_id: {
    type: String,
    required: true,
  },
  vaccine_name: {
    type: String,
    required: true,
  },
  
});

const Vaccine = mongoose.model('Vaccine', vaccineSchema);

module.exports = Vaccine;
