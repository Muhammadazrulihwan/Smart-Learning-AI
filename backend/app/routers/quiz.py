import json

from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select

from app.database import get_session
from app.dependencies import get_current_user
from app.models import Quiz, QuizResult, User
from app.schemas import (
    QuizGenerateRequest,
    QuizQuestionPublic,
    QuizSubmitRequest,
    QuizSubmitResponse,
)
from app.services.quiz_generation import generate_quiz_questions

router = APIRouter(prefix="/quiz", tags=["quiz"])


@router.post("/generate", response_model=list[QuizQuestionPublic])
def generate_quiz(
    payload: QuizGenerateRequest,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    try:
        questions_data = generate_quiz_questions(
            document_id=payload.document_id,
            user_id=current_user.id,
            num_questions=payload.num_questions,
        )
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except RuntimeError as e:
        raise HTTPException(status_code=503, detail=str(e))

    saved_quizzes = []
    for q in questions_data:
        quiz = Quiz(
            document_id=payload.document_id,
            user_id=current_user.id,
            topic=q.get("topic"),
            question_type="multiple_choice",
            question=q["question"],
            options=json.dumps(q["options"]),
            correct_answer=q["correct_answer"],
            explanation=q.get("explanation"),
        )
        session.add(quiz)
        saved_quizzes.append(quiz)

    session.commit()
    for quiz in saved_quizzes:
        session.refresh(quiz)

    return [
        QuizQuestionPublic(
            id=q.id,
            topic=q.topic,
            question_type=q.question_type,
            question=q.question,
            options=json.loads(q.options) if q.options else None,
        )
        for q in saved_quizzes
    ]


@router.get("/document/{document_id}", response_model=list[QuizQuestionPublic])
def list_quizzes_for_document(
    document_id: int,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    quizzes = session.exec(
        select(Quiz).where(Quiz.document_id == document_id, Quiz.user_id == current_user.id)
    ).all()

    return [
        QuizQuestionPublic(
            id=q.id,
            topic=q.topic,
            question_type=q.question_type,
            question=q.question,
            options=json.loads(q.options) if q.options else None,
        )
        for q in quizzes
    ]


@router.post("/{quiz_id}/submit", response_model=QuizSubmitResponse)
def submit_quiz_answer(
    quiz_id: int,
    payload: QuizSubmitRequest,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    quiz = session.get(Quiz, quiz_id)
    if not quiz or quiz.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Soal tidak ditemukan")

    is_correct = payload.user_answer.strip().lower() == quiz.correct_answer.strip().lower()

    result = QuizResult(
        quiz_id=quiz.id,
        user_id=current_user.id,
        user_answer=payload.user_answer,
        is_correct=is_correct,
    )
    session.add(result)
    session.commit()

    return QuizSubmitResponse(
        is_correct=is_correct,
        correct_answer=quiz.correct_answer,
        explanation=quiz.explanation,
    )