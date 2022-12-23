require("dotenv").config();
const server = require("./app");

server.listen(process.env.APP_PORT || 3000, () => {
  console.log(`Server Ready on port ${process.env.APP_PORT || 3000}`);
});
