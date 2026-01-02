exports.checkAuth = (context) => {
  if (!context.user) throw new Error("Not Authenticated");
};

exports.checkAdmin = (context) => {
  if (context.user.role !== "admin") {
    throw new Error("Not Authorized");
  }
};
