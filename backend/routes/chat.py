"""AI chatbot routes."""

from fastapi import APIRouter, Depends, HTTPException, status
from motor.motor_asyncio import AsyncIOMotorDatabase

from models.chat import ChatRequest, ChatResponse, ChatSessionResponse
from services import ai_service
from utils.database import get_db
from utils.helpers import serialize_doc

router = APIRouter(prefix="/chat", tags=["chat"])


@router.post("", response_model=ChatResponse)
async def chat(payload: ChatRequest, db: AsyncIOMotorDatabase = Depends(get_db)) -> ChatResponse:
    """Send a message to the assistant; a session_id is created when omitted."""
    result = await ai_service.get_chat_reply(
        db, payload.message, payload.session_id, payload.user_phone
    )
    return ChatResponse(**result)


@router.get("/session/{session_id}", response_model=ChatSessionResponse)
async def get_session(
    session_id: str, db: AsyncIOMotorDatabase = Depends(get_db)
) -> ChatSessionResponse:
    """Fetch the stored conversation for a chat session."""
    conversation = await db.chat_conversations.find_one({"session_id": session_id})
    if conversation is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Chat session not found.")
    data = serialize_doc(conversation)
    return ChatSessionResponse(
        session_id=data["session_id"],
        messages=data.get("messages", []),
        status=data.get("status", "active"),
        created_at=conversation.get("created_at"),
        updated_at=conversation.get("updated_at"),
    )
