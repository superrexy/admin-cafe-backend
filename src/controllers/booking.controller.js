const { PrismaClient } = require("@prisma/client");
const { paymentMidtrans, paymentXendit } = require("../helpers/payment.helper");
const { e164 } = require("../helpers/strings.helper");
const midtransClient = require("midtrans-client");

const prisma = new PrismaClient();

module.exports = {
  index: async (req, res) => {
    /* #swagger.security = [{
               "Bearer": []
        }] */
    try {
      var bookings;

      const { date } = req.query;
      const startDate = new Date(date);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);

      if (date && req.user.role === "admin") {
        bookings = await prisma.bookings.findMany({
          include: {
            booking_food: {
              include: {
                food_drink: {},
              },
            },
            room: {},
          },
          where: {
            is_paid: "SETTLEMENT",
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

      if (req.user.role === "admin") {
        bookings = await prisma.bookings.findMany({
          where: {
            is_paid: "SETTLEMENT",
          },
          include: {
            booking_food: {
              include: {
                food_drink: {},
              },
            },
            room: {},
          },
          orderBy: {
            created_at: "desc",
          },
        });
      } else {
        bookings = await prisma.bookings.findMany({
          include: {
            booking_food: {
              include: {
                food_drink: {},
              },
            },
            room: {},
          },
          where: {
            user_id: req.user.id,
          },
          orderBy: {
            created_at: "desc",
          },
        });
      }

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
      var booking;

      if (req.user.role === "admin") {
        booking = await prisma.bookings.findFirst({
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
      } else {
        booking = await prisma.bookings.findFirst({
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
      }

      if (!booking) {
        throw {
          statusCode: 404,
          message: "DATA_NOT_FOUND",
        };
      }

      if (req.user.role === "user") {
        if (booking.user_id !== req.user.id) {
          throw {
            statusCode: 403,
            message: "FORBIDDEN",
          };
        }
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
      var booking;
      const {
        nama_pemesan,
        email_pemesan,
        tgl_pemesanan,
        room_id,
        foodsndrinks,
        mobile_number,
        payment_type,
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

      if (checkRoom.quota === 0) {
        throw {
          statusCode: 400,
          message: "ROOM_IS_FULL",
        };
      }

      if (foodsndrinks?.length === 0) {
        throw {
          statusCode: 404,
          message: "FOOD_IS_REQUIRED",
        };
      }

      if (req.user.role === "admin") {
        booking = await prisma.bookings.create({
          data: {
            nama_pemesan,
            email_pemesan,
            tgl_pemesanan: new Date(tgl_pemesanan),
            room_id: Number(room_id),
            total: checkRoom.harga,
            is_paid: "SETTLEMENT",
            payment_type: "cash",
          },
        });
      } else {
        booking = await prisma.bookings.create({
          data: {
            nama_pemesan,
            email_pemesan,
            tgl_pemesanan: new Date(tgl_pemesanan),
            room_id: Number(room_id),
            total: checkRoom.harga,
            user_id: req.user.id,
            payment_type: payment_type,
          },
        });
      }

      if (booking.is_paid === "SETTLEMENT") {
        await prisma.rooms.update({
          where: {
            id: Number(room_id),
          },
          data: {
            quota: {
              decrement: 1,
            },
          },
        });
      }

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

      if (req.user.role === "admin") {
        return res.status(201).json({
          status: true,
          message: "SUCCESS_CREATE_DATA",
          data: {
            ...getBooking,
          },
        });
      }

      let transaction_id = "";
      let payment_url = "";

      const midtransPayments = ["gopay", "shopeepay"];
      const isMidtrans = midtransPayments.includes(payment_type.toLowerCase());

      const xenditPayments = ["ovo", "dana", "linkaja"];
      const isXendit = xenditPayments.includes(payment_type.toLowerCase());

      if (isMidtrans) {
        let parameter = {
          payment_type: payment_type,
          transaction_details: {
            order_id: `QSpace-${booking.id}-${new Date().getTime()}`,
            gross_amount: getBooking.total,
          },
        };

        if (payment_type.toLowerCase() === "gopay") {
          parameter.gopay = {
            enable_callback: true,
            callback_url: `qspace://deeplink.qspace.com/booking/${booking.id}`,
          };
        } else if (payment_type.toLowerCase() === "shopeepay") {
          parameter.shopeepay = {
            callback_url: `qspace://deeplink.qspace.com/booking/${booking.id}`,
          };
        }

        let payment = await paymentMidtrans(parameter);

        payment_url = payment.actions.find(
          (item) => item.name === "deeplink-redirect"
        ).url;

        transaction_id = payment.transaction_id;
      } else if (isXendit) {
        let parameter = {
          referenceID: `QSpace-${booking.id}-${new Date().getTime()}`,
          amount: getBooking.total,
          channelProperties: {
            successRedirectURL: `qspace://deeplink.qspace.com/booking/${booking.id}`,
          },
          channelCode: payment_type.toLowerCase(),
        };

        if (payment_type.toLowerCase() === "ovo") {
          if (!mobile_number) {
            throw {
              statusCode: 400,
              message: "MOBILE_NUMBER_IS_REQUIRED",
            };
          }

          parameter.channelProperties.mobileNumber = e164(mobile_number);
        }

        let payment = await paymentXendit(parameter);

        console.log(payment);

        if (payment_type.toLowerCase() !== "ovo") {
          payment_url = payment.actions.mobile_web_checkout_url;
        } else {
          payment_url = null;
        }

        transaction_id = payment.id;
      }

      await prisma.bookings.update({
        where: {
          id: booking.id,
        },
        data: {
          transaction_id: transaction_id,
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
        data: {
          ...getBooking,
          payment_url,
        },
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

      if (req.user.role === "user") {
        if (checkBooking.user_id !== req.user.id) {
          throw {
            statusCode: 403,
            message: "FORBIDDEN",
          };
        }
      }

      if (
        checkBooking.is_paid === "SETTLEMENT" &&
        checkBooking.is_finished === false
      ) {
        await prisma.rooms.update({
          where: {
            id: Number(room_id),
          },
          data: {
            quota: {
              increment: 1,
            },
          },
        });
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
  finishBooking: async (req, res) => {
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

      const booking = await prisma.bookings.update({
        where: {
          id: Number(id),
        },
        data: {
          is_finished: true,
        },
      });

      await prisma.rooms.update({
        where: {
          id: booking.room_id,
        },
        data: {
          quota: {
            increment: 1,
          },
        },
      });

      return res.status(200).json({
        status: true,
        message: "SUCCESS_UPDATE_DATA",
        data: booking,
      });
    } catch (error) {
      return res.status(error.statusCode || 500).json({
        status: false,
        message: error.message || "Internal Server Error",
      });
    }
  },
  midtransNotification: async (req, res) => {
    const apiClient = new midtransClient.Snap({
      isProduction: process.env.NODE_ENV === "production",
      serverKey: process.env.MIDTRANS_SERVER_KEY,
      clientKey: process.env.MIDTRANS_CLIENT_KEY,
    });

    apiClient.transaction
      .notification(req.body)
      .then(async (statusResponse) => {
        const orderId = statusResponse.order_id;
        const transactionStatus = statusResponse.transaction_status;

        const bookingId = orderId.split("-")[1];

        const booking = await prisma.bookings.update({
          where: {
            id: Number(bookingId),
          },
          data: {
            is_paid: transactionStatus.toUpperCase(),
          },
        });

        if (transactionStatus === "settlement") {
          if (booking.is_paid === "SETTLEMENT") {
            await prisma.rooms.update({
              where: {
                id: booking.room_id,
              },
              data: {
                quota: {
                  decrement: 1,
                },
              },
            });
          }

          req.io.emit(`booking_${bookingId}`, {
            status: "success",
          });
        } else if (
          transactionStatus === "cancel" ||
          transactionStatus === "deny" ||
          transactionStatus === "expire"
        ) {
          req.io.emit(`booking_${bookingId}`, {
            status: transactionStatus,
          });
        }

        res.status(200).json({
          status: true,
          message: "SUCCESS",
        });
      })
      .catch((error) => {
        return res.status(error.statusCode || 500).json({
          status: false,
          message: error.message || "Internal Server Error",
        });
      });
  },
  xenditNotifications: async (req, res) => {
    try {
      if (
        req.headers["x-callback-token"] !==
        process.env.XENDIT_TOKEN_VERIFICATION
      ) {
        throw {
          statusCode: 403,
          message: "FORBIDDEN",
        };
      }

      const { data } = req.body;
      let status = "";

      const bookingId = data.reference_id.split("-")[1];

      switch (data.status) {
        case "SUCCEEDED":
          status = "SETTLEMENT";
          break;
        case "PENDING":
          status = "PENDING";
          break;
        case "FAILED":
          status = "EXPIRED";
          break;
      }

      const booking = await prisma.bookings.update({
        where: {
          id: Number(bookingId),
        },
        data: {
          is_paid: status,
        },
      });

      if (status === "SETTLEMENT") {
        if (booking.is_paid === "SETTLEMENT") {
          await prisma.rooms.update({
            where: {
              id: booking.room_id,
            },
            data: {
              quota: {
                decrement: 1,
              },
            },
          });
        }

        req.io.emit(`booking_${bookingId}`, {
          status: "success",
        });
      }

      return res.status(200).json({
        status: true,
        message: "SUCCESS",
      });
    } catch (error) {
      return res.status(error.statusCode || 500).json({
        status: false,
        message: error.message || "Internal Server Error",
      });
    }
  },
};
