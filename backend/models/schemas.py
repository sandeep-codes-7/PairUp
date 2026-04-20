from pydantic import BaseModel
from typing import List, Optional

class ConnectRequest(BaseModel):
    name: str
    gender: str
    interests: List[str]

class UserSession(BaseModel):
    id: str
    name: str
    gender: str
    interests: List[str]

class ChatMessage(BaseModel):
    content: Optional[str] = None
    sender: str
    type: str # 'CHAT', 'JOIN', 'LEAVE', 'MATCHED'
    roomId: Optional[str] = None
    partnerName: Optional[str] = None