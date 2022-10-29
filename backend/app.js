const express = require("express");
const app = express();
const errorMiddleware = require("./middleware/error");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
app.use(express.json());
app.use(cookieParser());
// Route imports
const user = require("./routes/userRoute");
const product = require("./routes/productRoute");
const order = require("./routes/orderRoute")

app.use("/api/v1", user);
app.use("/api/v1", product);
app.use("/api/v1", order);
app.use(bodyParser.urlencoded({ extended: true }));
// app.use( fileUpload({useTempFiles: true}));
app.use( fileUpload());

// Middleware for error
app.use(errorMiddleware);

module.exports = app;
