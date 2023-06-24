const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const app = express();
const morgan = require("morgan");
const cookieParser = require("cookie-parser");

const errorHandler = require("./middleware/errorHandler");
const notFound = require("./middleware/notFound");
const userRouter = require("./routes/userRoutes");
const productRouter = require("./routes/productRoutes");
const reviewRouter = require("./routes/reviewRoutes");
const CategoryRouter = require("./routes/categoryRoutes");
const brandRouter = require("./routes/brandRoutes");
const storeRouter = require("./routes/storeRoutes");

const couponRouter = require("./routes/couponRoutes");

const cartRouter = require('./routes/cartRoutes');

const DataBase = process.env.DATA_BASE_URL;

mongoose
  .connect(DataBase, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("DataBase Connected Successfully");
  })
  .catch((err) => {
    console.log(err);
  });

app.use(express.json());
app.use(morgan("dev"));
app.use(cookieParser());

app.use("/api/v1/carts",cartRouter);

app.use("/api/v1/users", userRouter);
app.use("/api/v1/products", productRouter);

app.use("/api/v1/categories", CategoryRouter);

app.use("/api/v1/brand", brandRouter);

app.use("/api/v1/store", storeRouter);

app.use("/api/v1/reviews", reviewRouter);

app.use("/api/v1/coupon", couponRouter);

app.use(notFound);

app.use(errorHandler);

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Back End Server is Running On Port ${port}`);
});
