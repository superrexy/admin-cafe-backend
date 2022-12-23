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
      const rooms = await prisma.rooms.findMany({});

      return res.status(200).json({
        status: true,
        message: "SUCCESS_GET_DATA",
        data: rooms,
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

      const room = await prisma.rooms.findFirst({
        where: {
          id: Number(id),
        },
      });

      if (!room) {
        throw {
          statusCode: 404,
          message: "DATA_NOT_FOUND",
        };
      }

      return res.status(200).json({
        status: true,
        message: "SUCCESS_GET_DATA",
        data: room,
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

          const { nama, fasilitas, kapasitas, waktu, harga } = req.body;

          if (!req.file) {
            throw {
              statusCode: 400,
              message: "IMAGE_REQUIRED",
            };
          }

          const room = await prisma.rooms.create({
            data: {
              nama,
              fasilitas,
              kapasitas,
              waktu,
              harga: Number(harga),
              image: req.file ? req.file.path : null,
            },
          });

          return res.status(201).json({
            status: true,
            message: "SUCCESS_CREATE_DATA",
            data: room,
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
          const { nama, fasilitas, kapasitas, waktu, harga } = req.body;

          const checkRoom = await prisma.rooms.findFirst({
            where: {
              id: Number(id),
            },
          });

          if (!checkRoom) {
            throw {
              statusCode: 404,
              message: "DATA_NOT_FOUND",
            };
          }

          let room = await prisma.rooms.update({
            where: {
              id: Number(id),
            },
            data: {
              nama,
              fasilitas,
              kapasitas,
              waktu,
              harga: Number(harga),
            },
          });

          if (req.file) {
            deleteFile(checkRoom.image);

            room = await prisma.rooms.update({
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
            data: room,
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

      const checkRoom = await prisma.rooms.findFirst({
        where: {
          id: Number(id),
        },
      });

      if (!checkRoom) {
        throw {
          statusCode: 404,
          message: "DATA_NOT_FOUND",
        };
      }

      deleteFile(checkRoom.image);

      await prisma.rooms.delete({
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
