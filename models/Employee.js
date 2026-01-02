const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,     // ❗ prevent duplicate name
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,     // ❗ prevent duplicate email
    lowercase: true,
    trim: true,
  },
  age: Number,
  department: String,
  role: String,
  salary: Number,
  joinDate: {
    type: String,     // ❗ store as String not Date to avoid timestamp bug
  },
  flagged: {
    type: Boolean,
    default: false,
  }
});

module.exports = mongoose.model("Employee", employeeSchema);
