require("dotenv").config();
const express = require("express");
const cors = require("cors");
const db = require("./db_connect");

const app = express();
const PORT = process.env.DB_PORT || 5000;

app.use(cors());
app.use(express.json());

// Route kiểm tra server
app.get("/", (req, res) => {
    res.send("API is running...");
});

// Route lấy danh sách khách hàng từ Free Sql Database
app.get("/users", async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM KhachHang");
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Database Error" });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port:${PORT}`);
});
