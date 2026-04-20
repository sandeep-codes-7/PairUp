import uuid
from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Cookie, Response
from typing import Optional
from models.schemas import ConnectRequest, UserSession
from core.matchmaker import waiting_room
from core.connection_manager import manager
import json

router = APIRouter()

@router.post("/api/chat/connect")
async def connect_user(request: ConnectRequest, response: Response, anon_id: Optional[str] = Cookie(None)):
    
    # Handle the ID
    if anon_id and anon_id in waiting_room:
        user_id = anon_id
    else:
        user_id = str(uuid.uuid4())

    # Attach Metadata to the Session
    session = UserSession(
        id=user_id, 
        name=request.name, 
        gender=request.gender, 
        interests=request.interests
    )
    waiting_room[user_id] = session

    # Set cookie
    response.set_cookie(key="anon_id", value=user_id, max_age=3600, path="/", httponly=False)

    return {
        "userId": user_id,
        "nickname": request.name,
        "message": f"Looking for users with interests: {', '.join(request.interests)}"
    }


# @router.post("/api/chat/connect")
# async def connect_user(request: ConnectRequest):
#     # ALWAYS generate a new ID so multiple tabs work perfectly
#     user_id = str(uuid.uuid4())

#     # Attach Metadata to the Session
#     session = UserSession(
#         id=user_id, 
#         name=request.name, 
#         gender=request.gender, 
#         interests=request.interests
#     )
#     waiting_room[user_id] = session

#     return {
#         "userId": user_id,
#         "nickname": request.name,
#         "message": f"Looking for users with interests: {', '.join(request.interests)}"
#     }

@router.websocket("/ws/{user_id}")
async def websocket_endpoint(websocket: WebSocket, user_id: str):
    await manager.connect(websocket, user_id)
    username = "Anonymous" # Fallback
    
    try:
        while True:
            # Wait for messages from the client
            data = await websocket.receive_text()
            message_data = json.loads(data)
            
            msg_type = message_data.get("type")
            room_id = message_data.get("roomId")
            sender = message_data.get("sender", "Anonymous")
            username = sender

            if msg_type == "JOIN":
                await manager.broadcast_to_room({
                    "type": "JOIN",
                    "sender": sender,
                    "content": f"{sender} joined!"
                }, room_id)
                
            elif msg_type == "CHAT":
                await manager.broadcast_to_room({
                    "type": "CHAT",
                    "sender": sender,
                    "content": message_data.get("content")
                }, room_id)

    except WebSocketDisconnect:
        # User disconnected
        room_id = manager.disconnect(user_id)
        # Remove from waiting room if they were still waiting
        if user_id in waiting_room:
            del waiting_room[user_id]
            
        if room_id:
            await manager.broadcast_to_room({
                "type": "LEAVE",
                "sender": username,
                "content": f"{username} left!"
            }, room_id)