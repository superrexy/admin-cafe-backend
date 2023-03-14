const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports = {
  statistic: async (req, res) => {
    /* #swagger.security = [{
               "Bearer": []
        }] */
    try {
      const pegawai = await prisma.users.count({ where: { role: "admin" } });
      const ruangan = await prisma.rooms.count();
      const pesanan = await prisma.bookings.count({
        where: {
          tgl_pemesanan: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)),
            lte: new Date(new Date().setHours(23, 59, 59, 999)),
          },
        },
      });

      return res.status(200).json({
        status: true,
        message: "SUCCESS_GET_DATA",
        data: {
          pegawai_count: pegawai,
          room_count: ruangan,
          booking_count: pesanan,
        },
      });
    } catch (error) {
      return res.status(error.statusCode || 500).json({
        status: false,
        message: error.message || "Internal Server Error",
      });
    }
  },
};
