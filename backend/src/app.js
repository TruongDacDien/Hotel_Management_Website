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
import PayOS from "@payos/node";
import config from "./config/payos.js";

const { client_id, api_key, checksum_key } = config;
const payOS = new PayOS(client_id, api_key, checksum_key);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env variables
dotenv.config();
const PORT = 5000 || process.env.DB_PORT;

// Init app
const app = express();

// Setup log directory
const logDirectory = path.join(__dirname, "logs");
if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory);
}

const accessLogStream = fs.createWriteStream(
  path.join(logDirectory, "access.log"),
  { flags: "a" }
);

// Logging
app.use(
  morgan(":date[iso] :method :url :status :response-time ms", {
    stream: accessLogStream,
  })
);
app.use(morgan("dev"));

// Parse body
app.use(express.json());
app.use(cookieParser());
app.use(
  express.urlencoded({
    extended: true,
  })
);

// Setup CORS
const allowedOrigins = ["http://localhost:5173", "http://localhost:5174"];
const corsOptions = {
  credentials: true,
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
  preflightContinue: false,
  optionsSuccessStatus: 204,
};
app.use(cors(corsOptions));

// **Quan trọng:** thêm OPTIONS handler cho mọi route
app.options("*", cors(corsOptions));

// Mount main router
app.use(mainRouter);

// Test Sentry
app.get("/debug-sentry", (req, res) => {
  throw new Error("Lỗi test gửi về Sentry từ backend");
});

// Error handling
Sentry.setupExpressErrorHandler(app);

app.use((err, req, res, next) => {
  console.log("There was an exception");
  console.log("Exception detail: ", err);

  res.status(err.status || 500).json({
    msg: err.message || "Internal Server Error",
    success: false,
  });
});

// Hàm xác nhận webhook khi backend khởi động
const base_url="https://fd00-14-187-41-206.ngrok-free.app"; //Chạy ngrok http 5000
async function confirmWebhookOnStartup() {
  try {
    const result = await payOS.confirmWebhook(`${base_url}/api/payment/webhook`);
    console.log("✅ Webhook confirmed successfully:", result);
  } catch (err) {
    console.error("❌ Webhook confirmation failed:", err.message);
  }
}

// Gọi hàm xác nhận
confirmWebhookOnStartup();

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port:${PORT}`);
});
