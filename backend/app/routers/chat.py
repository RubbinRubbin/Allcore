from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from ..services.openai_service import create_chat_completion

router = APIRouter(prefix="/api", tags=["chat"])


class Message(BaseModel):
    role: str
    content: str


class ChatRequest(BaseModel):
    messages: list[Message]
    stream: bool = True


@router.post("/chat")
async def chat(request: ChatRequest):
    """
    Chat endpoint with streaming support.
    """
    try:
        messages = [{"role": m.role, "content": m.content} for m in request.messages]

        if request.stream:
            return StreamingResponse(
                create_chat_completion(messages, stream=True),
                media_type="text/event-stream"
            )
        else:
            response = create_chat_completion(messages, stream=False)
            return {"response": response}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "healthy", "service": "Allcore Fiscal Assistant API"}
