// to run server

import app from "./app";
import { prisma } from "./lib/prisma";

const PORT = 3000;

async function connectDB() {
    try {
        // Test database connection
        await prisma.$connect();

        console.log("Database connected successfully.")

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`)
        });
    } catch (error) {
        console.error("Failed to connect to database")
        console.error(error);
    }
}

connectDB();