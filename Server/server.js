const { connect } = require("mongoose");
const app = require("./app");
const connectDatabase = require("./db/database");

//Handlig uncaught exceptions
process.on("uncaughtException", (err) => {
  console.log(`error: ${err.message});
    }`);
  console.log(`shutting down the server for uncaught error`);
});

//config
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config({
    path: "config/.env",
  });
  console.log("Loaded PORT:", process.env.PORT);
}

connectDatabase()

//create server
const server = app.listen(process.env.PORT, () => {
  console.log(`server is running on ${process.env.PORT}`);
});

//unhandle promise rejection
// process.on("unhandledRejection", (err) => {
//   console.log(`shutting sever for ${err.message}`);
//   console.log(`shutting down server for unhandles promiserr rejection`);
//   server.close(() => {
//     process.exit();
//   });
// });
