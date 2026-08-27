"""Analisis performa kuis & generate rekomendasi belajar personal (Fase 5)."""
from sqlmodel import Session, select

from app.models import Quiz, QuizResult, StudyPlan


def _get_topic_performance(user_id: int, session: Session) -> list[dict]:
    """Hitung akurasi per topik berdasarkan seluruh riwayat QuizResult milik user."""
    rows = session.exec(
        select(QuizResult, Quiz)
        .join(Quiz, QuizResult.quiz_id == Quiz.id)
        .where(QuizResult.user_id == user_id)
    ).all()

    topic_stats: dict[str, dict] = {}
    for quiz_result, quiz in rows:
        topic = quiz.topic or "Umum"
        stats = topic_stats.setdefault(topic, {"total": 0, "correct": 0})
        stats["total"] += 1
        if quiz_result.is_correct:
            stats["correct"] += 1

    performance = []
    for topic, stats in topic_stats.items():
        accuracy = stats["correct"] / stats["total"] if stats["total"] else 0
        performance.append(
            {"topic": topic, "total": stats["total"], "correct": stats["correct"], "accuracy": accuracy}
        )

    return performance


def _build_recommendation(accuracy: float) -> str:
    percent = round(accuracy * 100)
    if accuracy < 0.5:
        return (
            f"Skor kamu di topik ini baru {percent}%. Prioritaskan untuk belajar ulang "
            f"materinya dan coba kerjakan latihan soal tambahan."
        )
    elif accuracy < 0.8:
        return (
            f"Skor kamu di topik ini {percent}%, sudah cukup baik tapi masih ada ruang "
            f"perbaikan. Coba review kembali bagian yang sering salah."
        )
    else:
        return f"Skor kamu di topik ini sudah {percent}%, kamu sudah cukup menguasai topik ini. Pertahankan!"


def generate_study_plan(user_id: int, session: Session) -> list[StudyPlan]:
    """
    Analisis seluruh hasil kuis user, urutkan topik dari yang paling lemah,
    simpan sebagai rekomendasi StudyPlan (menggantikan plan lama).
    """
    performance = _get_topic_performance(user_id, session)

    # hapus study plan lama milik user ini, akan digantikan yang baru
    old_plans = session.exec(select(StudyPlan).where(StudyPlan.user_id == user_id)).all()
    for plan in old_plans:
        session.delete(plan)

    if not performance:
        session.commit()
        return []

    # urutkan dari akurasi TERENDAH (paling lemah = prioritas tertinggi/paling perlu dipelajari)
    performance.sort(key=lambda p: p["accuracy"])

    new_plans = []
    for i, perf in enumerate(performance, start=1):
        plan = StudyPlan(
            user_id=user_id,
            topic=perf["topic"],
            priority=i,
            recommendation=_build_recommendation(perf["accuracy"]),
        )
        session.add(plan)
        new_plans.append(plan)

    session.commit()
    for plan in new_plans:
        session.refresh(plan)

    return new_plans


def determine_difficulty(user_id: int, document_id: int, session: Session) -> str:
    """
    Tentukan tingkat kesulitan soal berikutnya berdasarkan performa user
    di dokumen ini sebelumnya (FR-12: adaptive difficulty).
    Belum ada riwayat -> default "menengah".
    """
    results = session.exec(
        select(QuizResult)
        .join(Quiz, QuizResult.quiz_id == Quiz.id)
        .where(QuizResult.user_id == user_id, Quiz.document_id == document_id)
    ).all()

    if not results:
        return "menengah"

    accuracy = sum(1 for r in results if r.is_correct) / len(results)

    if accuracy >= 0.8:
        return "sulit"
    elif accuracy >= 0.5:
        return "menengah"
    else:
        return "mudah"