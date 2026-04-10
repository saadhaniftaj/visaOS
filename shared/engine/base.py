"""Abstract Base Evaluator for all visa categories."""
from abc import ABC, abstractmethod


class BaseEvaluator(ABC):
    """Base class for all visa eligibility evaluators."""

    @abstractmethod
    def evaluate(self, questionnaire_data: dict) -> list[dict]:
        """
        Evaluate questionnaire data against visa criteria.
        Returns a list of criterion result dicts, each containing:
        - id: str (criterion identifier)
        - name: str (human-readable name)
        - score: float (0-100)
        - evidence_summary: str
        - recommendations: list[str]
        """
        ...

    @staticmethod
    def _clamp_score(score: float) -> float:
        """Clamp a score between 0 and 100."""
        return max(0.0, min(100.0, float(score)))

    @staticmethod
    def _count_with_quality(items: list[dict], quality_key: str = "scope") -> tuple[int, float]:
        """
        Count items and compute an average quality score.
        Returns (count, avg_quality).
        """
        if not items:
            return 0, 0.0

        quality_map = {
            "international": 95,
            "national": 80,
            "industry": 65,
            "regional": 45,
            "local": 25,
            "internal": 15,
            # E-2 specific
            "high": 90,
            "medium": 60,
            "low": 30,
        }

        total_quality = 0
        for item in items:
            scope = item.get(quality_key, "local").lower()
            total_quality += quality_map.get(scope, 30)

        return len(items), total_quality / len(items)
