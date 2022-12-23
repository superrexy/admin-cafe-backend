const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports = {
  index: async (req, res) => {
    /* #swagger.security = [{
               "Bearer": []
        }] */
    try {
      const { date } = req.query;
      const startDate = new Date(date);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(startDate);
      endDate.setHours(23, 59, 59, 999);

      if (date) {
        const bookings = await prisma.bookings.findMany({
          include: {
            booking_food: {
              include: {
                food_drink: {},
              },
            },
            room: {},
          },
          where: {
            tgl_pemesanan: {
              gte: startDate.toISOString(),
              lte: endDate.toISOString(),
            },
          },
          orderBy: {
            tgl_pemesanan: "desc",
          },
        });

        return res.status(200).json({
          status: true,
          message: "SUCCESS_GET_DATA",
          data: bookings,
        });
      }

      const bookings = await prisma.bookings.findMany({
        include: {
          booking_food: {
            include: {
              food_drink: {},
            },
          },
          room: {},
        },
        orderBy: {
          tgl_pemesanan: "desc",
        },
      });

      return res.status(200).json({
        status: true,
        message: "SUCCESS_GET_DATA",
        data: bookings,
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

      const booking = await prisma.bookings.findFirst({
        where: {
          id: Number(id),
        },
        include: {
          booking_food: {
            include: {
              food_drink: {},
            },
          },
          room: {},
        },
      });

      if (!booking) {
        throw {
          statusCode: 404,
          message: "DATA_NOT_FOUND",
        };
      }

      return res.status(200).json({
        status: true,
        message: "SUCCESS_GET_DATA",
        data: booking,
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
      const {
        nama_pemesan,
        email_pemesan,
        tgl_pemesanan,
        is_paid,
        room_id,
        foodsndrinks,
      } = req.body;

      const checkRoom = await prisma.rooms.findFirst({
        where: {
          id: Number(room_id),
        },
      });

      if (!checkRoom) {
        throw {
          statusCode: 404,
          message: "ROOM_NOT_FOUND",
        };
      }

      if (foodsndrinks?.length === 0) {
        throw {
          statusCode: 404,
          message: "FOOD_IS_REQUIRED",
        };
      }

      const booking = await prisma.bookings.create({
        data: {
          nama_pemesan,
          email_pemesan,
          tgl_pemesanan: new Date(tgl_pemesanan),
          is_paid: Boolean(is_paid),
          room_id: Number(room_id),
          total: checkRoom.harga,
        },
      });

      await prisma.$transaction(async (tx) => {
        await Promise.all(
          foodsndrinks.map(async (item) => {
            let amount = item.amount;

            const getHargaFood = await prisma.foods_drinks.findFirst({
              where: {
                id: item.food_drink_id,
              },
            });

            if (!getHargaFood) {
              throw {
                statusCode: 404,
                message: "FOOD_NOT_FOUND",
              };
            }

            await tx.booking_food.create({
              data: {
                booking_id: booking.id,
                food_drink_id: getHargaFood.id,
                amount,
                total: getHargaFood.harga * amount,
                note: item.note || null,
              },
            });

            await tx.bookings.update({
              where: {
                id: booking.id,
              },
              data: {
                total: {
                  increment: getHargaFood.harga * amount,
                },
              },
            });
          })
        );
      });

      const getBooking = await prisma.bookings.findFirst({
        where: {
          id: booking.id,
        },
        include: {
          booking_food: {
            include: {
              food_drink: {},
            },
          },
          room: {},
        },
      });

      return res.status(201).json({
        status: true,
        message: "SUCCESS_CREATE_DATA",
        data: getBooking,
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
      const { id } = req.params;
      const {
        nama_pemesan,
        email_pemesan,
        tgl_pemesanan,
        is_paid,
        room_id,
        foodsndrinks,
      } = req.body;

      const checkBooking = await prisma.bookings.findFirst({
        where: {
          id: Number(id),
        },
      });

      if (!checkBooking) {
        throw {
          statusCode: 404,
          message: "DATA_NOT_FOUND",
        };
      }

      const checkRoom = await prisma.rooms.findFirst({
        where: {
          id: Number(room_id),
        },
      });

      if (!checkRoom) {
        throw {
          statusCode: 404,
          message: "ROOM_NOT_FOUND",
        };
      }

      const booking = await prisma.bookings.update({
        where: {
          id: Number(id),
        },
        data: {
          nama_pemesan,
          email_pemesan,
          tgl_pemesanan: new Date(tgl_pemesanan),
          is_paid: Boolean(is_paid),
          room_id: Number(room_id),
          total: checkRoom.harga,
        },
      });

      if (foodsndrinks?.length > 0) {
        //   Remove Food n Drink Booking
        await prisma.booking_food.deleteMany({
          where: {
            booking_id: booking.id,
          },
        });

        await prisma.$transaction(async (tx) => {
          await Promise.all(
            foodsndrinks.map(async (item) => {
              let amount = item.amount;

              const getHargaFood = await prisma.foods_drinks.findFirst({
                where: {
                  id: item.food_drink_id,
                },
              });

              if (!getHargaFood) {
                throw {
                  statusCode: 404,
                  message: "FOOD_NOT_FOUND",
                };
              }

              await tx.booking_food.create({
                data: {
                  booking_id: booking.id,
                  food_drink_id: getHargaFood.id,
                  amount,
                  total: getHargaFood.harga * amount,
                  note: item.note || null,
                },
              });

              await tx.bookings.update({
                where: {
                  id: booking.id,
                },
                data: {
                  total: {
                    increment: getHargaFood.harga * amount,
                  },
                },
              });
            })
          );
        });
      }

      const getBooking = await prisma.bookings.findFirst({
        where: {
          id: booking.id,
        },
        include: {
          booking_food: {
            include: {
              food_drink: {},
            },
          },
          room: {},
        },
      });

      return res.status(200).json({
        status: true,
        message: "SUCCESS_UPDATE_DATA",
        data: getBooking,
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

      const checkBooking = await prisma.bookings.findFirst({
        where: {
          id: Number(id),
        },
      });

      if (!checkBooking) {
        throw {
          statusCode: 404,
          message: "DATA_NOT_FOUND",
        };
      }

      await prisma.bookings.delete({
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
