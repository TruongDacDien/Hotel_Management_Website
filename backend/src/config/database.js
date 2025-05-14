import mysql from "mysql2";
import dotenv from "dotenv";
dotenv.config();

class Database {
    constructor() {
        this.pool = this.connect();
    }

    connect() {
        const pool = mysql.createPool({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            port: process.env.DB_PORT,
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0,
        });

        // Kiểm tra kết nối
        pool.getConnection((err, connection) => {
            if (err) {
                console.error("Database connection failed:", err);
            } else {
                console.log("Connected to MySQL Database!");
                connection.release();
            }
        });

        return pool.promise();
    }

    static getInstance() {
        if (!Database.instance) {
            Database.instance = new Database();
        }
        return Database.instance;
    }

    getPool() {
        return this.pool;
    }
}

const databaseInstance = Database.getInstance();
export default databaseInstance;
