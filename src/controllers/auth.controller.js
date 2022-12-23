const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const upload = require("../helpers/uploadFile.helper");
const mail = require("../helpers/mail.helper");

const prisma = new PrismaClient();
const store = upload.single("image");

module.exports = {
  register: async (req, res) => {
    try {
      const {
        first_name,
        last_name,
        email,
        password,
        phone_number,
        address,
        birth_date,
      } = req.body;

      // Check if user already exists
      const checkDuplicate = await prisma.users.findFirst({
        where: {
          email: email,
        },
      });

      if (checkDuplicate) {
        throw {
          statusCode: 400,
          message: "EMAIL_ALREADY_EXISTS",
        };
      }

      // Create new user
      // Hash Password
      const genSalt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, genSalt);

      const newUser = await prisma.users.create({
        data: {
          first_name,
          last_name,
          email,
          password: hashedPassword,
          phone_number,
          address,
          birth_date: new Date(birth_date),
        },
      });

      // Remove password from response
      delete newUser.password;

      // Generate Token
      const payload = { id: newUser.id, email: newUser.email };
      const token = jwt.sign(payload, process.env.JWT_TOKEN_SECRET, {
        expiresIn: process.env.JWT_TOKEN_EXPIRED,
      });

      res.status(201).json({
        status: true,
        message: "USER_SUCCESS_REGISTER",
        data: {
          user: newUser,
          token,
        },
      });
    } catch (error) {
      return res.status(error.statusCode || 500).json({
        status: false,
        message: error.message || "Internal Server Error",
      });
    }
  },
  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      // Check if user exists
      const user = await prisma.users.findFirst({
        where: {
          email: email,
        },
      });

      if (user) {
        // Check if password is correct
        const checkPassword = await bcrypt.compare(password, user.password);

        if (checkPassword) {
          // Remove password from response
          delete user.password;

          // Generate Token
          const payload = { id: user.id, email: user.email };
          const token = jwt.sign(payload, process.env.JWT_TOKEN_SECRET, {
            expiresIn: process.env.JWT_TOKEN_EXPIRED,
          });

          res.status(200).json({
            status: true,
            message: "USER_SUCCESS_LOGIN",
            data: {
              user,
              token,
            },
          });
        } else {
          throw {
            statusCode: 400,
            message: "WRONG_PASSWORD",
          };
        }
      } else {
        throw {
          statusCode: 400,
          message: "USER_NOT_FOUND",
        };
      }
    } catch (error) {
      return res.status(error.statusCode || 500).json({
        status: false,
        message: error.message || "Internal Server Error",
      });
    }
  },
  uploadProfile: async (req, res) => {
    /*
          #swagger.consumes = ['multipart/form-data']
          #swagger.parameters['image'] = {
              in: 'formData',
              type: 'file',
              required: 'true',
              description: 'Image Profile User',
        } */

    /* #swagger.security = [{
               "Bearer": []
        }] */
    try {
      store(req, res, async (err) => {
        try {
          if (err) {
            throw {
              statusCode: 400,
              message: err.message,
            };
          }

          if (!req.file) {
            throw {
              statusCode: 400,
              message: "IMAGE_REQUIRED",
            };
          }

          // Get user id
          const user_id = req.user.id;

          // Update user profile
          const updatedUser = await prisma.users.update({
            where: {
              id: user_id,
            },
            data: {
              image_profile: req.file ? req.file.path : null,
            },
          });

          // Remove password from response
          delete updatedUser.password;

          res.status(200).json({
            status: true,
            message: "USER_SUCCESS_UPDATE_IMAGE_PROFILE",
            data: updatedUser,
          });
        } catch (error) {
          return res.status(error.statusCode || 500).json({
            status: false,
            message: error.message || "Internal Server Error",
          });
        }
      });
    } catch (error) {
      return res.status(error.statusCode || 500).json({
        status: false,
        message: error.message || "Internal Server Error",
      });
    }
  },
  requestTokenResetPassword: async (req, res) => {
    try {
      const { email } = req.body;

      // Check if user exists
      const user = await prisma.users.findFirst({
        where: {
          email: email,
        },
      });

      if (!user) {
        throw {
          statusCode: 400,
          message: "USER_NOT_FOUND",
        };
      }

      // Generate Token
      const genOtp = Math.floor(100000 + Math.random() * 900000).toString();
      const genSalt = await bcrypt.genSalt(10);
      const hashToken = await bcrypt.hash(genOtp, genSalt);

      //   Generate Expired
      const expired_at = new Date();
      expired_at.setMinutes(expired_at.getMinutes() + 15);

      //   Create token reset password
      await prisma.user_reset_password.upsert({
        where: {
          email,
        },
        update: {
          email,
          token: hashToken,
          expired_at,
        },
        create: {
          email,
          token: hashToken,
          expired_at,
        },
      });

      // Send Email
      const mailOptions = {
        from: "Admin Cafe <admin.cafe@mailtrap.com>",
        to: email,
        subject: "Kode Lupa Kata Sandi",
        text: `Gunakan kode ini untuk mengatur ulang kata sandi akun Anda: ${genOtp}. Kode hanya berlaku 15 menit.`,
        html: `<p>Gunakan kode ini untuk mengatur ulang kata sandi akun Anda: <strong>${genOtp}</strong>. Kode hanya berlaku 15 menit.</p>`,
      };

      await mail.sendMail(mailOptions);

      res.status(200).json({
        status: true,
        message: "USER_SUCCESS_REQUEST_TOKEN_RESET_PASSWORD",
      });
    } catch (error) {
      console.log(error);
      return res.status(error.statusCode || 500).json({
        status: false,
        message: error.message || "Internal Server Error",
      });
    }
  },
  resetPassword: async (req, res) => {
    try {
      const { email, token, password, is_verify = false } = req.body;

      // Check if user exists
      const user = await prisma.users.findFirst({
        where: {
          email: email,
        },
      });

      if (!user) {
        throw {
          statusCode: 400,
          message: "USER_NOT_FOUND",
        };
      }

      // Check if token exists
      const tokenResetPassword = await prisma.user_reset_password.findFirst({
        where: {
          email: email,
        },
      });

      if (!tokenResetPassword) {
        throw {
          statusCode: 400,
          message: "TOKEN_NOT_FOUND",
        };
      }

      //   Is Verify Token
      if (is_verify) {
        // Check if token is expired
        const isExpired = new Date(tokenResetPassword.expired_at) < new Date();

        if (isExpired) {
          throw {
            statusCode: 400,
            message: "TOKEN_IS_EXPIRED",
          };
        }

        // Check if token is valid
        const isTokenValid = await bcrypt.compare(
          token,
          tokenResetPassword.token
        );

        if (!isTokenValid) {
          throw {
            statusCode: 400,
            message: "TOKEN_IS_INVALID",
          };
        }

        res.status(200).json({
          status: true,
          message: "TOKEN_IS_VALID",
        });
      } else {
        // Check if token is expired
        const isExpired = new Date(tokenResetPassword.expired_at) < new Date();

        if (isExpired) {
          throw {
            statusCode: 400,
            message: "TOKEN_IS_EXPIRED",
          };
        }

        // Check if token is valid
        const isTokenValid = await bcrypt.compare(
          token,
          tokenResetPassword.token
        );

        if (!isTokenValid) {
          throw {
            statusCode: 400,
            message: "TOKEN_IS_INVALID",
          };
        }

        // Hash password
        const genSalt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, genSalt);

        // Update user password
        await prisma.users.update({
          where: {
            id: user.id,
          },
          data: {
            password: hashPassword,
          },
        });

        // Delete token reset password
        await prisma.user_reset_password.delete({
          where: {
            email: email,
          },
        });

        res.status(200).json({
          status: true,
          message: "USER_SUCCESS_RESET_PASSWORD",
        });
      }
    } catch (error) {
      return res.status(error.statusCode || 500).json({
        status: false,
        message: error.message || "Internal Server Error",
      });
    }
  },
  profile: async (req, res) => {
    /* #swagger.security = [{
               "Bearer": []
        }] */
    try {
      // Get user id
      const user_id = req.user.id;

      const user = await prisma.users.findFirst({
        where: {
          id: user_id,
        },
      });

      //   Delete password
      delete user.password;

      return res.status(200).json({
        status: true,
        message: "SUCCESS_GET_DATA",
        data: user,
      });
    } catch (error) {
      return res.status(error.statusCode || 500).json({
        status: false,
        message: error.message || "Internal Server Error",
      });
    }
  },
  updateProfile: async (req, res) => {
    try {
      /* #swagger.security = [{
               "Bearer": []
        }] */
      const { first_name, last_name, phone_number, address, birth_date } =
        req.body;

      // Ger User ID
      const user_id = req.user.id;

      const user = await prisma.users.update({
        where: {
          id: user_id,
        },
        data: {
          first_name,
          last_name,
          phone_number,
          address,
          birth_date: new Date(birth_date),
        },
      });

      return res.status(200).json({
        status: true,
        message: "SUCCESS_UPDATE_USER_PROFILE",
        data: user,
      });
    } catch (error) {
      return res.status(error.statusCode || 500).json({
        status: false,
        message: error.message || "Internal Server Error",
      });
    }
  },
};
