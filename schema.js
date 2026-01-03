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
    me: User
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
