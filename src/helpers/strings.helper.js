module.exports = {
  generateRandomString: function (length) {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

    for (var i = 0; i < length; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
  },
  e164: function (phone) {
    if (phone.startsWith("0")) {
      phone = phone.replace("0", "+62");
    }

    return phone;
  },
};
