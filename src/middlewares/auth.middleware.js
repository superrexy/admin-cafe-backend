const { PrismaClient } = require("@prisma/client");
const jwt = require("jsonwebtoken");
const prisma = new PrismaClient();

module.exports = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw {
        statusCode: 401,
        message: "UNAUTHORIZED",
      };
    }

    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      throw {
        statusCode: 401,
        message: "UNAUTHORIZED",
      };
    }

    jwt.verify(token, process.env.JWT_TOKEN_SECRET, async (err, decoded) => {
      try {
        if (err) throw { statusCode: 401, message: "UNAUTHORIZED" };
        const user = await prisma.users.findFirst({
          where: {
            id: decoded.id,
          },
        });

        if (!user) throw { statusCode: 401, message: "UNAUTHORIZED" };
        req.user = user;
        next();
      } catch (error) {
        return res.status(error.statusCode || 401).json({
          status: false,
          message: error.message || "Internal Server Error",
        });
      }
    });
  } catch (error) {
    return res.status(error.statusCode || 401).json({
      status: false,
      message: error.message || "Internal Server Error",
    });
  }
};
