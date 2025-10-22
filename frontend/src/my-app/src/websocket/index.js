// import express from "express"
// import { WebSocketServer } from "ws"

// const app = express();
// const port = 8000;

// const server = app.listen(port, () => {
// console.log(`Server is running on http://localhost:${port}`);
// });

// const wss = new WebSocketServer({ server });

// wss.on("connection", (ws) => {
// ws.on("message", (msg) => {
// console.log("Received:", msg.toString());
// });
// ws.send(JSON.stringify({ message: "welcome to my server" }));
// });




    // import express from "express"
    // import { WebSocketServer } from "ws"


    //     export default function app() {
    //     const app = express();
    //     const port = 8080;

    //     const server = app.listen(port, () => {
    //         console.log(`Server is running on http://localhost:${port}`);
    //     });

    //     return { app, server };
    //     }

    // const wss = new WebSocketServer({ app: app().server, path: "/ws" });

    // wss.on("connection", (ws) => {
    // ws.on("message", (msg) => {
    // console.log("Received:", msg.toString());
    // });
    // ws.send(JSON.stringify({ message: "welcome to my server" }));
    // });




    // Create WebSocket connection.
// import express from "express"
// import { WebSocketServer } from "ws"

// const app = express();
// const port = 8000;

// const server = app.listen(port, () => {
//     console.log(`Server is running on http://localhost:${port}`);
// });

// const wss = new WebSocketServer({ server });

// wss.on("connection", (ws) => {
//     ws.on("message", (msg) => {
//         console.log("Received:", msg.toString());
//     });
//     ws.send(JSON.stringify({ message: "welcome to my server" }));
// });

// const socket = new WebSocket("ws://localhost:8000/ws");

// // Connection opened
// socket.onopen = () => {
//     console.log("Connected to server");
//     socket.send("Hello Server!");
// };

//     // Listen for messages
//     socket.onmessage = (event) => {
//     console.log("Message from server:", event.data);
//     };

//     // Handle errors
//     socket.onerror = (error) => {
//     console.error("WebSocket error:", error);
//     };

//     // Close connection
//     socket.onclose = () => {
//     console.log("Disconnected from server");
//     };





// const express = require('express');
// const { createServer } = require('node:http');

// const app = express();
// const server = createServer(app);

//     app.get('/', (req, res) => {
//     res.send('<h1>Hello world</h1>');
//     });

//     server.listen(3000, () => {
//     console.log('server running at http://localhost:3000');
//     });




const express = require('express');
const { createServer } = require('node:http');
const { join } = require('node:path');
const path = require('path');
const {Server} = require("socket.io");
const { Fetch } = require('socket.io-client');

const app = express();
const server = createServer(app);
const io = new Server(server,
            {
            cors:{
                origins: '*',
            },
        }
);

app.use(express.static(path.resolve('C:/Users/prath/ghostbus/backend/APP/ingester.py')));

io.on("connection", (socket) => {
    console.log("a user connected");
}); 

app.get('/', (req, res) => {
    return res.sendFile(path.resolve('C:/Users/prath/ghostbus/frontend/src/my-app/src/App.jsx'));
});
    server.listen(3100, () => {
    console.log('server running at http://localhost:3100');
    });
    