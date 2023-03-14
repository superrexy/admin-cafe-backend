const midtransCient = require("midtrans-client");
const xendit = require("xendit-node");

module.exports = {
  paymentMidtrans: async (params) => {
    try {
      if (!params) {
        throw new Error("params is required");
      }

      const core = new midtransCient.CoreApi({
        isProduction: false,
        serverKey: process.env.MIDTRANS_SERVER_KEY,
        clientKey: process.env.MIDTRANS_CLIENT_KEY,
      });

      return core.charge(params).catch((error) => {
        throw error;
      });
    } catch (error) {
      throw error;
    }
  },
  paymentXendit: async (params) => {
    try {
      if (!params) {
        throw new Error("params is required");
      }

      const x = new xendit({
        secretKey: process.env.XENDIT_SECRET_API,
      });

      const { EWallet } = x;

      switch (params.channelCode) {
        case "ovo":
          params.channelCode = "ID_OVO";
          break;
        case "dana":
          params.channelCode = "ID_DANA";
          break;
        case "linkaja":
          params.channelCode = "ID_LINKAJA";
          break;
      }

      return new EWallet().createEWalletCharge({
        channelCode: params.channelCode,
        currency: "IDR",
        checkoutMethod: "ONE_TIME_PAYMENT",
        ...params,
      });
    } catch (error) {
      throw error;
    }
  },
};
