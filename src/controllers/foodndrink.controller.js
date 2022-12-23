const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const upload = require("../helpers/uploadFile.helper");
const deleteFile = require("../helpers/file.helper");
const store = upload.single("image");

module.exports = {
  index: async (req, res) => {
    /* #swagger.security = [{
               "Bearer": []
        }] */
    try {
      const foodsndrinks = await prisma.foods_drinks.findMany();

      return res.status(200).json({
        status: true,
        message: "SUCCESS_GET_DATA",
        data: foodsndrinks,
      });
    } catch (error) {
      return res.status(error.statusCode || 500).json({
        status: false,
        message: error.message || "Internal Server Error",
      });
    }
  },
  show: async (req, res) => {
    /* #swagger.security = [{
               "Bearer": []
        }] */
    try {
      const { id } = req.params;

      const foodndrink = await prisma.foods_drinks.findFirst({
        where: {
          id: Number(id),
        },
      });

      if (!foodndrink) {
        throw {
          statusCode: 404,
          message: "DATA_NOT_FOUND",
        };
      }

      return res.status(200).json({
        status: true,
        message: "SUCCESS_GET_DATA",
        data: foodndrink,
      });
    } catch (error) {
      return res.status(error.statusCode || 500).json({
        status: false,
        message: error.message || "Internal Server Error",
      });
    }
  },
  create: async (req, res) => {
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

          const { nama, harga, deskripsi } = req.body;

          if (!req.file) {
            throw {
              statusCode: 400,
              message: "IMAGE_REQUIRED",
            };
          }

          const foodndrink = await prisma.foods_drinks.create({
            data: {
              nama,
              harga: Number(harga),
              deskripsi,
              image: req.file ? req.file.path : null,
            },
          });

          return res.status(201).json({
            status: true,
            message: "SUCCESS_CREATE_DATA",
            data: foodndrink,
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
  update: async (req, res) => {
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

          const { id } = req.params;
          const { nama, harga, deskripsi } = req.body;

          const foodndrinkCheck = await prisma.foods_drinks.findFirst({
            where: {
              id: Number(id),
            },
          });

          if (!foodndrinkCheck) {
            throw {
              statusCode: 404,
              message: "DATA_NOT_FOUND",
            };
          }

          let foodndrink = await prisma.foods_drinks.update({
            where: {
              id: Number(id),
            },
            data: {
              nama,
              harga: Number(harga),
              deskripsi,
            },
          });

          if (req.file) {
            // Delete Old File
            deleteFile(foodndrinkCheck.image);

            foodndrink = await prisma.foods_drinks.update({
              where: {
                id: Number(id),
              },
              data: {
                image: req.file ? req.file.path : null,
              },
            });
          }

          return res.status(200).json({
            status: true,
            message: "SUCCESS_UPDATE_DATA",
            data: foodndrink,
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
  destroy: async (req, res) => {
    /* #swagger.security = [{
               "Bearer": []
        }] */
    try {
      const { id } = req.params;

      const foodndrinkCheck = await prisma.foods_drinks.findFirst({
        where: {
          id: Number(id),
        },
      });

      if (!foodndrinkCheck) {
        throw {
          statusCode: 404,
          message: "DATA_NOT_FOUND",
        };
      }

      //   Delete Image
      deleteFile(foodndrinkCheck.image);

      await prisma.foods_drinks.delete({
        where: {
          id: Number(id),
        },
      });

      return res.status(200).json({
        status: true,
        message: "SUCCESS_DELETE_DATA",
      });
    } catch (error) {
      return res.status(error.statusCode || 500).json({
        status: false,
        message: error.message || "Internal Server Error",
      });
    }
  },
};
