from fastapi import APIRouter, Depends
from sqlmodel import Session

from app.database import get_session
from app.dependencies import get_current_user
from app.models import User
from app.schemas import StudyPlanItem
from app.services.study_plan import generate_study_plan

router = APIRouter(prefix="/study-plan", tags=["study-plan"])


@router.get("/me", response_model=list[StudyPlanItem])
def get_my_study_plan(
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    """
    Analisis seluruh riwayat kuis user, urutkan topik dari yang paling lemah
    ke paling kuat, kembalikan sebagai rekomendasi urutan belajar (FR-10, FR-11).
    """
    plans = generate_study_plan(current_user.id, session)
    return [
        StudyPlanItem(topic=p.topic, priority=p.priority, recommendation=p.recommendation)
        for p in plans
    ]