import json

from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select

from app.database import get_session
from app.dependencies import get_current_user
from app.models import ChatHistory, User
from app.schemas import ChatRequest, ChatResponse
from app.services.rag import answer_question

router = APIRouter(prefix="/chat", tags=["chat"])


@router.post("/ask", response_model=ChatResponse)
def ask_question(
    payload: ChatRequest,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    try:
        result = answer_question(
            question=payload.question,
            user_id=current_user.id,
            document_id=payload.document_id,
        )
    except RuntimeError as e:
        raise HTTPException(status_code=503, detail=str(e))

    # simpan riwayat chat
    history_entry = ChatHistory(
        user_id=current_user.id,
        document_id=payload.document_id,
        question=payload.question,
        answer=result["answer"],
        sources=json.dumps(result["sources"]),
    )
    session.add(history_entry)
    session.commit()

    return ChatResponse(answer=result["answer"], sources=result["sources"])


@router.get("/history/{document_id}")
def get_chat_history(
    document_id: int,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    history = session.exec(
        select(ChatHistory)
        .where(ChatHistory.user_id == current_user.id, ChatHistory.document_id == document_id)
        .order_by(ChatHistory.created_at)
    ).all()
    return history