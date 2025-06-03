import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";
import fs from "fs";
import path from "path";
import cookieParser from "cookie-parser";
import mainRouter from "./routes.js";
import { fileURLToPath } from "url";
import * as Sentry from "@sentry/node";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//enviroment variables section
dotenv.config();
const PORT = process.env.DB_PORT || 5000;
//generate app
const app = express();

const logDirectory = path.join(__dirname, "logs");
if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory);
}

const accessLogStream = fs.createWriteStream(
  path.join(logDirectory, "access.log"),
  { flags: "a" }
);

// Dùng morgan ghi log ra file
app.use(
  morgan(":date[iso] :method :url :status :response-time ms", {
    stream: accessLogStream,
  })
);

//middleware
app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());
app.use(
  express.urlencoded({
    extended: true,
  })
);
const allowedOrigins = ["http://localhost:5173", "http://localhost:5174"];

app.use(
  cors({
    credentials: true, // Allow cookies and credentials
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS", // Allowed HTTP methods
    preflightContinue: false, // Do not forward OPTIONS requests
    optionsSuccessStatus: 204, // Return 204 for OPTIONS requests
  })
);

app.use(mainRouter);
app.get("/debug-sentry", (req, res) => {
  throw new Error("Lỗi test gửi về Sentry từ backend");
});

Sentry.setupExpressErrorHandler(app);
//special function to catch unhandled error.
app.use((err, req, res, next) => {
  console.log("There was an exception");
  console.log("Exception detail: ", err);

  res.status(err.status || 500).json({
    msg: err.message || "Internal Server Error",
    success: false,
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port:${PORT}`);
});
