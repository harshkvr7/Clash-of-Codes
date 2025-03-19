import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const connectionString = process.env.DATABASE_URL;

const client = new pg.Client({
    connectionString,
});

await client.connect();

export default client;