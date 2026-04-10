"""Visa types and enumerations for the eligibility engine."""
from enum import Enum
from dataclasses import dataclass, field
from typing import Optional


class VisaCategory(str, Enum):
    O1A = "O1A"
    E2 = "E2"


class CriterionID(str, Enum):
    # O-1A Criteria
    O1A_AWARDS = "o1a_awards"
    O1A_MEMBERSHIPS = "o1a_memberships"
    O1A_PUBLISHED_MATERIAL = "o1a_published_material"
    O1A_JUDGING = "o1a_judging"
    O1A_ORIGINAL_CONTRIBUTIONS = "o1a_original_contributions"
    O1A_AUTHORSHIP = "o1a_authorship"
    O1A_CRITICAL_ROLE = "o1a_critical_role"
    O1A_HIGH_REMUNERATION = "o1a_high_remuneration"

    # E-2 Criteria
    E2_TREATY_COUNTRY = "e2_treaty_country"
    E2_SUBSTANTIAL_INVESTMENT = "e2_substantial_investment"
    E2_PROPORTIONALITY = "e2_proportionality"
    E2_MARGINALITY = "e2_marginality"
    E2_CONTROL_DIRECTION = "e2_control_direction"


# Countries with E-2 treaties (partial list — major ones)
E2_TREATY_COUNTRIES = {
    "Argentina", "Australia", "Austria", "Bangladesh", "Belgium", "Bolivia",
    "Canada", "Chile", "China (Taiwan)", "Colombia", "Costa Rica",
    "Czech Republic", "Denmark", "Ecuador", "Egypt", "Ethiopia", "Finland",
    "France", "Germany", "Greece", "Honduras", "Ireland", "Israel", "Italy",
    "Jamaica", "Japan", "Jordan", "Korea (South)", "Luxembourg", "Mexico",
    "Morocco", "Netherlands", "New Zealand", "Norway", "Pakistan", "Panama",
    "Paraguay", "Philippines", "Poland", "Romania", "Senegal", "Singapore",
    "Spain", "Sri Lanka", "Sweden", "Switzerland", "Thailand", "Trinidad",
    "Tunisia", "Turkey", "Ukraine", "United Kingdom",
}


@dataclass
class CriterionResult:
    id: str
    name: str
    score: float  # 0-100
    met: bool
    evidence_summary: str
    recommendations: list[str] = field(default_factory=list)


@dataclass
class EvaluationResult:
    visa_category: VisaCategory
    overall_score: float
    criteria_met: int
    criteria_required: int
    criteria: list[CriterionResult] = field(default_factory=list)
    status: str = "insufficient"  # strong, moderate, weak, insufficient
    recommendations: list[str] = field(default_factory=list)
