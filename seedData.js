require("dotenv").config();
const mongoose = require("mongoose");
const Employee = require("./models/Employee");
const User = require("./models/User");

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("MongoDB connected!");

    // Clear old data
    await Employee.deleteMany();
    await User.deleteMany();

    // Seed Users
    await User.insertMany([
      { email: "admin@test.com", password: "1234", role: "admin" },   // Admin user
      { email: "emp@test.com", password: "1234", role: "employee" }   // Normal employee user
    ]);

    // Seed Employees
    await Employee.insertMany([
      {
        name: "John Doe",
        age: 30,
        department: "Engineering",
        role: "Developer",
        salary: 60000,
        joinDate: new Date("2021-05-20") // store as Date
      },
      {
        name: "Jane Smith",
        age: 25,
        department: "Marketing",
        role: "Manager",
        salary: 50000,
        joinDate: new Date("2022-01-15")
      },
      {
        name: "Alice Johnson",
        age: 35,
        department: "Sales",
        role: "Executive",
        salary: 70000,
        joinDate: new Date("2019-10-30")
      }
    ]);

    console.log("Users & Employees seeded successfully!");
    mongoose.disconnect();
  })
  .catch(err => {
    console.error("Error:", err);
    mongoose.disconnect();
  });
