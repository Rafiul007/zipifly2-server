const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
const port = 3002;
const mongodb = require("./config/connection");
const userRoutes = require("./Routes/userRoutes");
const parcelRoutes = require("./Routes/parcelRoutes");
const deliverymanRoutes = require("./Routes/deliverymanRoutes");
const orderRoutes = require("./Routes/orderRoutes");
app.use(cors({ origin: true, credentials: true }));

// use the body-parser middleware to parse JSON and URL-encoded data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
mongodb();
// default catch all handler
app.all('*', (req, res) => res.status(404).json(new ErrorResponseObject('route not defined')));
app.use("/user", userRoutes);
app.use("/parcel", parcelRoutes);
app.use("/deliveryman", deliverymanRoutes);
app.use("/orders", orderRoutes);
app.listen(port, () => console.log(`Server running on port ${port}`));
