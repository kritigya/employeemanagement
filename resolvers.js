const Employee = require("./models/Employee");
const User = require("./models/User");
const jwt = require("jsonwebtoken");
const { checkAuth, checkAdmin } = require("./models/auth");

const resolvers = {
  Query: {
    employees: async (_, { page = 1, limit = 10, search = "", sortBy = "name", order = "asc" }, context) => {
      checkAuth(context);

      const skip = (page - 1) * limit;

      const filter = search
        ? {
            $or: [
              { name: new RegExp(search, "i") },
              { department: new RegExp(search, "i") },
              { role: new RegExp(search, "i") }
            ]
          }
        : {};

      const data = await Employee.find(filter)
        .skip(skip)
        .limit(limit)
        .sort({ [sortBy]: order === "desc" ? -1 : 1 });

      const total = await Employee.countDocuments(filter);

      return {
        data,
        total,
        totalPages: total === 0 ? 1 : Math.ceil(total / limit)
      };
    },

    employee: async (_, { id }, context) => {
      checkAuth(context);
      return await Employee.findById(id);
    },

   me: async (_, __, context) => {
      checkAuth(context);
      const user = await User.findById(context.user.userId);
      if (!user) throw new Error("No user found");

      const employee = await Employee.findOne({ email: user.email });
      if (!employee) throw new Error("Employee not found");

      return {
        id: user.id,
        email: user.email,
        role: user.role,
        name: employee.name,
        age: employee.age,
        department: employee.department,
        roleName: employee.role,
        salary: employee.salary,
        joinDate: employee.joinDate
      };
    }
  }, // <-- make sure Query ends here, no trailing comma errors


  Mutation: {
    login: async (_, { email, password }) => {
      const user = await User.findOne({ email });
      if (!user || user.password !== password) {
        throw new Error("Invalid credentials");
      }

      const token = jwt.sign(
        { userId: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );

      return { token, role: user.role };
    },

    logout: async (_, __, context) => {
      checkAuth(context);
      return true;
    },

    // 🔥 FIXED ADD EMPLOYEE
    addEmployee: async (_, { input }, context) => {
      checkAuth(context);
      checkAdmin(context);

      try {
        // prevent duplicate employee
        const existingEmployee = await Employee.findOne({
          $or: [{ name: input.name }, { email: input.email }]
        });

        if (existingEmployee) {
          throw new Error("Employee with same name or email already exists");
        }

        // prevent duplicate login
        const existingUser = await User.findOne({ email: input.email });
        if (existingUser) {
          throw new Error("User with this email already exists");
        }

        const employee = await Employee.create({
          name: input.name.trim(),
          email: input.email.toLowerCase().trim(),
          age: input.age,
          department: input.department,
          role: input.role,
          salary: input.salary,
          joinDate: input.joinDate
        });

        await User.create({
          email: input.email.toLowerCase().trim(),
          password: input.password,
          role: "employee"
        });

        return employee;
      } catch (err) {
        if (err.code === 11000) {
          if (err.keyPattern?.email) throw new Error("Email already exists");
          if (err.keyPattern?.name) throw new Error("Employee name already exists");
        }
        throw new Error(err.message);
      }
    },

updateEmployee: async (_, { id, input }, context) => {
  checkAuth(context);
  checkAdmin(context);
  return await Employee.findByIdAndUpdate(
    id,
    { $set: input },
    { new: true, runValidators: false }
  );
},
deleteEmployee: async (_, { id }, context) => {
  checkAuth(context);
  checkAdmin(context);

  const employee = await Employee.findById(id);
  if (!employee) throw new Error("Employee not found");

  await User.findOneAndDelete({ email: employee.email }); // 🔥 remove login user
  await Employee.findByIdAndDelete(id);

  return employee;
},


    flagEmployee: async (_, { id }, context) => {
      checkAuth(context);
      checkAdmin(context);
      const employee = await Employee.findById(id);
      employee.flagged = !employee.flagged;
      return await employee.save();
    }
  }
};

module.exports = resolvers;
