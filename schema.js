const { gql } = require("apollo-server-express");

module.exports = gql`
  type Employee {
    id: ID!
    name: String
    email: String
    age: Int
    department: String
    role: String
    salary: Int
    joinDate: String
    flagged: Boolean
  }

  # New type for the logged-in user's profile
  type Me {
    id: ID!
    email: String
    role: String         # system role
    name: String
    age: Int
    department: String
    employeeRole: String
    salary: Int
    joinDate: String
  }

  input CreateEmployeeInput {
    name: String!
    email: String!
    password: String!
    age: Int
    department: String
    role: String
    salary: Int
    joinDate: String
  }

  input UpdateEmployeeInput {
    name: String
    email: String
    age: Int
    department: String
    role: String
    salary: Int
    joinDate: String
    flagged: Boolean
  }

  type EmployeePage {
    data: [Employee]
    total: Int
    totalPages: Int
  }

  type User {
    id: ID!
    email: String
    role: String
  }

  type AuthPayload {
    token: String
    role: String
  }

  type Query {
    employees(page: Int, limit: Int, search: String, sortBy: String, order: String): EmployeePage
    employee(id: ID!): Employee
    me: Me          # <-- updated to return Me type with all employee fields
  }

  type Mutation {
    login(email: String!, password: String!): AuthPayload
    addEmployee(input: CreateEmployeeInput!): Employee
    updateEmployee(id: ID!, input: UpdateEmployeeInput!): Employee
    deleteEmployee(id: ID!): Employee
    flagEmployee(id: ID!): Employee
    logout: Boolean
  }
`;
