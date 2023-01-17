module.exports = (req, res, next) => {
  try {
    if (req.user.role !== "admin") {
      throw {
        statusCode: 401,
        message: "UNAUTHORIZED",
      };
    }

    next();
  } catch (error) {
    return res.status(error.statusCode || 401).json({
      status: false,
      message: error.message || "Internal Server Error",
    });
  }
};
