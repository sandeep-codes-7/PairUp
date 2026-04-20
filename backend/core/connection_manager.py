from fastapi import WebSocket
from typing import Dict, Set

class ConnectionManager:
    def __init__(self):
        # Maps user_id -> WebSocket
        self.active_users: Dict[str, WebSocket] = {}
        # Maps room_id -> Set of user_ids
        self.rooms: Dict[str, Set[str]] = {}
        # Maps user_id -> room_id (to easily find where a user is)
        self.user_rooms: Dict[str, str] = {}

    async def connect(self, websocket: WebSocket, user_id: str):
        await websocket.accept()
        self.active_users[user_id] = websocket

    def disconnect(self, user_id: str):
        if user_id in self.active_users:
            del self.active_users[user_id]
        
        # Remove user from their room
        room_id = self.user_rooms.get(user_id)
        if room_id and room_id in self.rooms:
            self.rooms[room_id].discard(user_id)
            if not self.rooms[room_id]:  # Clean up empty rooms
                del self.rooms[room_id]
            del self.user_rooms[user_id]
        return room_id

    def add_user_to_room(self, user_id: str, room_id: str):
        if room_id not in self.rooms:
            self.rooms[room_id] = set()
        self.rooms[room_id].add(user_id)
        self.user_rooms[user_id] = room_id

    async def send_personal_message(self, message: dict, user_id: str):
        websocket = self.active_users.get(user_id)
        if websocket:
            await websocket.send_json(message)

    async def broadcast_to_room(self, message: dict, room_id: str):
        if room_id in self.rooms:
            for user_id in self.rooms[room_id]:
                websocket = self.active_users.get(user_id)
                if websocket:
                    await websocket.send_json(message)

manager = ConnectionManager()