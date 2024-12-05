import { Server } from "socket.io";
require("dotenv").config();
let io;

const initSocketServer = (server) => {
    io = new Server(server, {
        cors: {
            origin: process.env.CLIENT_URL,
            methods: ["GET", "POST"],
        },
    });

    // Lắng nghe các kết nối WebSocket
    io.on("connection", (socket) => {
        console.log(`Client connected: ${socket.id}`);

        // Xử lý sự kiện từ client
        socket.on("notify-admin", (data) => {
            console.log("New campaign notification:", data);

            // Gửi thông báo đến tất cả admin
            io.emit("admin-notification", data);
        });

        // Xử lý ngắt kết nối
        socket.on("disconnect", () => {
            console.log(`Client disconnected: ${socket.id}`);
        });
    });

    return io;
};

export { initSocketServer, io };
