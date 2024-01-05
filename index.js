const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
const port = 3002;
const mongodb = require("./config/connection");
const userRoutes = require("./Routes/userRoutes");
const parcelRoutes = require("./Routes/parcelRoutes");
app.use(cors({ origin: true, credentials: true }));

// use the body-parser middleware to parse JSON and URL-encoded data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
mongodb();
app.use("/user", userRoutes);
app.use("/parcel", parcelRoutes);
app.listen(port, () => console.log(`Server running on port ${port}`));
