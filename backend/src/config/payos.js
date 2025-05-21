import dotenv from "dotenv";
dotenv.config();

export default{
    client_id: process.env.PAYOS_CLIENT_ID,
    api_key: process.env.PAYOS_API_KEY,
    checksum_key: process.env.PAYOS_CHECKSUM_KEY
};