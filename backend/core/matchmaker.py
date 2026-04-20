import asyncio
import uuid
from typing import Dict
from models.schemas import UserSession
from core.connection_manager import manager

# Our Waiting Room
waiting_room: Dict[str, UserSession] = {}

async def match_users_task():
    """Background task that runs every 1 second to find matches."""
    while True:
        await asyncio.sleep(1)
        
        if len(waiting_room) < 2:
            continue

        users = list(waiting_room.values())
        matched_ids = set()

        for i in range(len(users)):
            u1 = users[i]
            if u1.id in matched_ids: continue

            for j in range(i + 1, len(users)):
                u2 = users[j]
                if u2.id in matched_ids: continue

                u1_interests = {interest.lower().strip() for interest in u1.interests}
                u2_interests = {interest.lower().strip() for interest in u2.interests}
                
                # Check if they share at least one common interest
                common_interests = u1_interests.intersection(u2_interests)

                if not common_interests:
                    # No common interests, skip this user and check the next one
                    continue 

                # --- WE FOUND A MATCH ---
                room_id = str(uuid.uuid4())

                # Remove from waiting room
                del waiting_room[u1.id]
                del waiting_room[u2.id]
                matched_ids.add(u1.id)
                matched_ids.add(u2.id)

                # Assign to room in manager
                manager.add_user_to_room(u1.id, room_id)
                manager.add_user_to_room(u2.id, room_id)

                # Notify both users
                await manager.send_personal_message(
                    {"type": "MATCHED", "roomId": room_id, "partnerName": u2.name}, u1.id
                )
                await manager.send_personal_message(
                    {"type": "MATCHED", "roomId": room_id, "partnerName": u1.name}, u2.id
                )
                break # Move to the next u1