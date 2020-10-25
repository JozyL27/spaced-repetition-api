const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const { NODE_ENV } = require("./config");
const errorHandler = require("./middleware/error-handler");
const authRouter = require("./auth/auth-router");
const languageRouter = require("./language/language-router");
const userRouter = require("./user/user-router");
const compression = require("compression");

const app = express();
const compressionOptions = {
  level: 6,
  threshold: 10 * 1000,
  filter: (req, res) => {
    if (req.headers["x-no-compression"]) {
      return false;
    }
    return compression.filter(req, res);
  },
};

app.use(
  morgan(NODE_ENV === "production" ? "tiny" : "common", {
    skip: () => NODE_ENV === "test",
  })
);
app.use(cors());
app.use(compression(compressionOptions));
app.use(helmet());

app.use("/api/auth", authRouter);
app.use("/api/language", languageRouter);
app.use("/api/user", userRouter);

app.use(errorHandler);

module.exports = app;
