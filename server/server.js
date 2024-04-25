const express = require("express");
const compression = require("compression");
const cors = require("cors");
const morgan = require("morgan");
const dotenv = require("dotenv");
dotenv.config();

const logger = require("./utils/logger.js");

const app = express();
if (process.env.NODE_ENV.match("development")) {
  app.use(morgan("dev"));
}

const path = require("path");

const connectDB = require("./config/db");
const helmet = require("helmet");
const expressMongoSanitize = require("express-mongo-sanitize");

const port = process.env.PORT || 3001;
connectDB();
app.use(
  cors({
    origin: "*",
  })
);
app.use(compression());

app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
app.use(helmet());
app.use(expressMongoSanitize());

const { Server } = require("socket.io");
const server = require("http").createServer(app);
const io = new Server(server, {
  transports: ["polling"],
  cors: { origin: "http://localhost:5173" },
});
require("./socketio.js")(io);

const userRoutes = require("./routes/userRoutes");
const medicineRoutes = require("./routes/medicineRoutes");
const pharmacyRoutes = require("./routes/pharmacyRoutes");
const departmentRoutes = require("./routes/departmentRoutes");
const hospitalRoutes = require("./routes/hospitalRoutes");
const doctorRoutes = require("./routes/doctorRoutes");
const patientRoutes = require("./routes/patientRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");
const notificationRoutes = require("./routes/notificationRoutes");

const { errorHandler } = require("./middlewares/errorMiddleware");

app.use("/api/v1/user", userRoutes);
app.use("/api/v1/department", departmentRoutes);
app.use("/api/v1/medicine", medicineRoutes);
app.use("/api/v1/pharmacy", pharmacyRoutes);
app.use("/api/v1/hospital", hospitalRoutes);
app.use("/api/v1/doctor", doctorRoutes);
app.use("/api/v1/patient", patientRoutes);
app.use("/api/v1/appointment", appointmentRoutes);
app.use("/api/v1/notification", notificationRoutes);

app.all("*", (req, res, next) => {
  res.status(404).json(`Can't find ${req.originalUrl} on this server!`);
});

app.use(errorHandler);

logger.warn(process.env.NODE_ENV);

if (process.env.NODE_ENV.match("production")) {
  process.env.URL_LINK = "url";
}

server.listen(port, () => {
  logger.info(`Server working on port: ${port}`);
});
