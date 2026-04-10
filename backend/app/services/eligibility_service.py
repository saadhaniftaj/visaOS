"""Eligibility Service — Orchestrates the shared engine from the backend."""
import uuid
from decimal import Decimal
from app.config import get_settings
from app.schemas.eligibility import CriterionScore, LLCAssessment, EligibilityResponse

# Import shared engine
import sys
import os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "..", ".."))
from shared.engine.o1a_evaluator import O1AEvaluator
from shared.engine.e2_evaluator import E2Evaluator
from shared.engine.llc_sponsorship import LLCSponsorshipEvaluator

settings = get_settings()


class EligibilityService:
    """Orchestrates visa eligibility evaluation."""

    def __init__(self):
        self.o1a_evaluator = O1AEvaluator()
        self.e2_evaluator = E2Evaluator()
        self.llc_evaluator = LLCSponsorshipEvaluator()

    def evaluate(
        self,
        profile_id: uuid.UUID,
        user_id: uuid.UUID,
        visa_category: str,
        questionnaire_data: dict,
    ) -> dict:
        """Run the eligibility evaluation engine and return structured results."""
        if visa_category == "O1A":
            return self._evaluate_o1a(profile_id, user_id, questionnaire_data)
        elif visa_category == "E2":
            return self._evaluate_e2(profile_id, user_id, questionnaire_data)
        else:
            raise ValueError(f"Unsupported visa category: {visa_category}")

    def _evaluate_o1a(self, profile_id: uuid.UUID, user_id: uuid.UUID, data: dict) -> dict:
        """Evaluate O-1A eligibility across 8 criteria."""
        criteria_results = self.o1a_evaluator.evaluate(data)
        llc_data = data.get("llc_details", {})
        llc_result = self.llc_evaluator.evaluate(llc_data) if llc_data else None

        criteria_scores = []
        total_score = 0
        criteria_met = 0

        for cr in criteria_results:
            score = CriterionScore(
                criterion_id=cr["id"],
                criterion_name=cr["name"],
                score=cr["score"],
                max_score=100.0,
                met=cr["score"] >= 60,
                evidence_summary=cr["evidence_summary"],
                recommendations=cr["recommendations"],
            )
            criteria_scores.append(score)
            total_score += cr["score"]
            if cr["score"] >= 60:
                criteria_met += 1

        overall = round(total_score / len(criteria_results), 2) if criteria_results else 0

        if criteria_met >= 5:
            status = "strong"
        elif criteria_met >= 3:
            status = "moderate"
        elif criteria_met >= 2:
            status = "weak"
        else:
            status = "insufficient"

        recommendations = self._generate_o1a_recommendations(criteria_scores, criteria_met)

        llc_assessment = None
        if llc_result:
            llc_assessment = LLCAssessment(**llc_result)

        return {
            "profile_id": profile_id,
            "user_id": user_id,
            "visa_category": "O1A",
            "overall_score": Decimal(str(overall)),
            "criteria_met": criteria_met,
            "criteria_required": 3,
            "criteria_scores": [s.model_dump() for s in criteria_scores],
            "recommendations": recommendations,
            "llc_assessment": llc_assessment.model_dump() if llc_assessment else None,
            "engine_version": settings.ENGINE_VERSION,
            "status": status,
        }

    def _evaluate_e2(self, profile_id: uuid.UUID, user_id: uuid.UUID, data: dict) -> dict:
        """Evaluate E-2 investor eligibility."""
        e2_results = self.e2_evaluator.evaluate(data)
        llc_data = data.get("llc_details", {})
        llc_result = self.llc_evaluator.evaluate(llc_data) if llc_data else None

        criteria_scores = []
        total_score = 0
        criteria_met = 0

        for cr in e2_results:
            score = CriterionScore(
                criterion_id=cr["id"],
                criterion_name=cr["name"],
                score=cr["score"],
                max_score=100.0,
                met=cr["score"] >= 60,
                evidence_summary=cr["evidence_summary"],
                recommendations=cr["recommendations"],
            )
            criteria_scores.append(score)
            total_score += cr["score"]
            if cr["score"] >= 60:
                criteria_met += 1

        overall = round(total_score / len(e2_results), 2) if e2_results else 0

        if criteria_met >= 4:
            status = "strong"
        elif criteria_met >= 3:
            status = "moderate"
        elif criteria_met >= 2:
            status = "weak"
        else:
            status = "insufficient"

        recommendations = self._generate_e2_recommendations(criteria_scores, criteria_met)

        llc_assessment = None
        if llc_result:
            llc_assessment = LLCAssessment(**llc_result)

        return {
            "profile_id": profile_id,
            "user_id": user_id,
            "visa_category": "E2",
            "overall_score": Decimal(str(overall)),
            "criteria_met": criteria_met,
            "criteria_required": 4,
            "criteria_scores": [s.model_dump() for s in criteria_scores],
            "recommendations": recommendations,
            "llc_assessment": llc_assessment.model_dump() if llc_assessment else None,
            "engine_version": settings.ENGINE_VERSION,
            "status": status,
        }

    def _generate_o1a_recommendations(self, scores: list[CriterionScore], met: int) -> list[str]:
        recs = []
        if met < 3:
            recs.append(
                f"You currently meet {met}/3 required criteria. "
                "Focus on strengthening your weakest areas below."
            )
        else:
            recs.append(
                f"You meet {met}/3 required criteria — your case has a "
                f"{'strong' if met >= 5 else 'viable'} foundation."
            )

        weak = sorted(scores, key=lambda s: s.score)[:3]
        for s in weak:
            if s.score < 60:
                for r in s.recommendations:
                    recs.append(r)
        return recs[:8]

    def _generate_e2_recommendations(self, scores: list[CriterionScore], met: int) -> list[str]:
        recs = []
        if met < 4:
            recs.append(
                f"Your E-2 application meets {met}/4 key requirements. "
                "Review the areas below to strengthen your petition."
            )
        else:
            recs.append(
                f"All {met} key E-2 requirements are satisfied. "
                "Your application has a strong foundation."
            )

        for s in scores:
            if s.score < 60:
                for r in s.recommendations:
                    recs.append(r)
        return recs[:8]
