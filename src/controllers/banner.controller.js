const { PrismaClient } = require("@prisma/client");
const deleteFile = require("../helpers/file.helper");
const upload = require("../helpers/uploadFile.helper");

const prisma = new PrismaClient();
const store = upload.single("image");

module.exports = {
  index: async (req, res) => {
    try {
      const banners = await prisma.banners.findMany({});

      return res.status(200).json({
        status: true,
        message: "SUCCCESS_GET_BANNERS",
        data: banners,
      });
    } catch (error) {
      return res.status(error.statusCode || 500).json({
        status: false,
        message: error.message || "Internal Server Error",
      });
    }
  },
  show: async (req, res) => {
    try {
      const { id } = req.params;
      const banner = await prisma.banners.findFirst({
        where: { id: Number(id) },
      });
      if (!banner) throw { statusCode: 404, message: "BANNER_NOT_FOUND" };

      return res.status(200).json({
        status: true,
        message: "SUCCCESS_GET_BANNER",
        data: banner,
      });
    } catch (error) {
      return res.status(error.statusCode || 500).json({
        status: false,
        message: error.message || "Internal Server Error",
      });
    }
  },
  store: async (req, res) => {
    try {
      store(req, res, async (err) => {
        try {
          if (err) {
            throw { statusCode: 400, message: err.message };
          }

          if (!req.file) throw { statusCode: 400, message: "IMAGE_REQUIRED" };

          const banner = await prisma.banners.create({
            data: {
              image: req.file.path,
            },
          });

          return res.status(201).json({
            status: true,
            message: "SUCCESS_CREATE_BANNER",
            data: banner,
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
    try {
      store(req, res, async (err) => {
        try {
          if (err) {
            throw { statusCode: 400, message: err.message };
          }

          const { id } = req.params;
          const banner = await prisma.banners.findFirst({
            where: { id: Number(id) },
          });
          if (!banner) throw { statusCode: 404, message: "BANNER_NOT_FOUND" };

          deleteFile(banner.image);

          const updateBanner = await prisma.banners.update({
            where: {
              id: Number(id),
            },
            data: {
              image: req.file.path,
            },
          });

          return res.status(200).json({
            status: true,
            message: "SUCCESS_UPDATE_BANNER",
            data: updateBanner,
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
    try {
      const { id } = req.params;
      const banner = await prisma.banners.findFirst({
        where: { id: Number(id) },
      });
      if (!banner) throw { statusCode: 404, message: "BANNER_NOT_FOUND" };

      deleteFile(banner.image);

      await prisma.banners.delete({
        where: {
          id: Number(id),
        },
      });

      return res.status(200).json({
        status: true,
        message: "SUCCESS_DELETE_BANNER",
      });
    } catch (error) {
      return res.status(error.statusCode || 500).json({
        status: false,
        message: error.message || "Internal Server Error",
      });
    }
  },
};
