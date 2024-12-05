import express from "express";
require("dotenv").config();
import cors from "cors";
import connectDB from "./src/config/connectDB";
import initRoutes from "./src/routes";

const app = express();

app.use(
    cors({
        origin: process.env.CLIENT_URL,
        methods: ["POST", "GET", "PUT", "DELETE"],
    })
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

initRoutes(app);
connectDB();

const port = process.env.PORT || 8888;
const listener = app.listen(port, async () => {
    console.log(`Server is running on the port ${listener.address().port}`);
});
