require("dotenv").config();

var mongoose = require("mongoose");
var dbURI = process.env.MONGODB_URI;

mongoose.set("strictQuery", true);

mongoose.connect(dbURI);
mongoose.connection.on("connected", function () {
  console.log("Mongoose connected to " + dbURI);
});
mongoose.connection.on("error", function (err) {
  console.log("Mongoose connection error: " + err);
});
mongoose.connection.on("disconnected", function () {
  console.log("Mongoose disconnected");
});

var gracefullShutdown = function (msg, callback) {
  mongoose.connection.close(function () {
    console.log("Mongoose disconnected through " + msg);
    callback();
  });
};

process.once("SIGUSR2", function () {
  gracefullShutdown("nodemon restart", function () {
    process.kill(process.pid, "SIGUSR2");
  });
});

process.once("SIGINT", function () {
  gracefullShutdown("app termination", function () {
    process.exit(0);
  });
});

process.on("SIGTERM", function () {
  gracefulShutdown("Railway app shutdown", function () {
    process.exit(0);
  });
});
require("./locations");
