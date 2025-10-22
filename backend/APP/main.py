from fastapi import FastAPI, WebSocket
from fastapi.responses import HTMLResponse
import requests
import redis
import redis.asyncio as aioredis

r=redis.Redis(host='redis', port=6379, decode_responses=True)

app = FastAPI()

html = """
<!DOCTYPE html>
<html>
    <head>
        <title>WebSocket Test</title>
    </head>
    <body>
        <h1>WebSocket Example</h1>
        <input id="msgInput" type="text" placeholder="Type a message"/>
        <button onclick="sendMessage()">Send</button>
        <ul id="messages"></ul>

        <script>
            let ws = new WebSocket("ws://localhost:8000/ws");

            ws.onmessage = function(event) {
                let messages = document.getElementById("messages")
                let li = document.createElement("li")
                li.innerText = event.data
                messages.appendChild(li)
            };

            function sendMessage() {
                let input = document.getElementById("msgInput")
                ws.send(input.value)
                input.value = ""
            }
        </script>
    </body>
</html>
"""

@app.get("/")
async def get():
    return HTMLResponse(html)

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    while True:
        data = await websocket.receive_text()
        await websocket.send_text(f"You wrote: {data}")
        
        
        
        
# app = FastAPI()

# @app.get("/fetch_buses")
# def fetch_buses():
#     url = "https://api.transitfeeds.com/v1/getLatestFeedVersion?key=PMAK-68b5809ea965370001b5d1df-0ec2ee57228afcd9cfd837625b7ab58da1"
#     response = requests.get(url)
#     return {"data": response.json()}





# from fastapi import FastAPI
# from pydantic import BaseModel
# from typing import List

# app = FastAPI()

# # Pydantic model for a single bus record
# class Bus(BaseModel):
#     vehicle_id: str
#     trip_id: str
#     route_id: str
#     lat: float
#     lon: float
#     timestamp: int
#     speed: float
#     ghost_score: float
#     is_ghost: bool
#     flags: List[str]

# # In-memory storage
# buses_db: List[Bus] = []

# @app.post("/buses/bulk")
# def add_bulk_buses(bus_list: List[Bus]):
#     """
#     Accepts bulk bus records in JSON and stores them.
#     """
#     buses_db.extend(bus_list)  # add all at once
#     return {"message": f"{len(bus_list)} buses added successfully", "total": len(buses_db)}

# @app.get("/buses")
# def get_buses():
#     """
#     Returns all bus records stored so far.
#     """
#     return {"buses": buses_db}




# # # This code snippet is setting up a WebSocket endpoint using FastAPI. Here's a breakdown of what it
# # # does:
# # from fastapi import FastAPI, WebSocket, WebSocketDisconnect

# # app = FastAPI()

# # @app.websocket("/")
# # async def websocket_endpoint(websocket: WebSocket):

# #     await websocket.accept('http://localhost:3100')  # Accept the incoming WebSocket connection
# #     try:
# #         while True:
# #             data = await websocket.receive_text()  # Receive text messages
# #             await websocket.send_text(f"Message received: {data}") # Echo back the message
# #     except WebSocketDisconnect:
# #         print("Client disconnected")





# from fastapi import FastAPI, WebSocket, WebSocketDisconnect

# app = FastAPI()

# # Connection manager to handle multiple clients
# class ConnectionManager:
#     def __init__(self):
#         self.active_connections = []

#     async def connect(self, websocket: WebSocket):
#         await websocket.accept()
#         self.active_connections.append(websocket)

#     def disconnect(self, websocket: WebSocket):
#         self.active_connections.remove(websocket)

#     async def broadcast(self, message: str):
#         for connection in self.active_connections:
#             await connection.send_text(message)

# manager = ConnectionManager()

# @app.websocket("/ws/vehicles")
# async def websocket_endpoint(websocket: WebSocket):
#     await manager.connect(websocket)
#     try:
#         while True:
#             data = await websocket.receive_text()  # You may send/receive ping or keepalive here
#             await manager.broadcast(f"Received update: {data}")
#     except WebSocketDisconnect:
#         manager.disconnect(websocket)
