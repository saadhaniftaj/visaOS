"""
E-2 Treaty Investor Evaluator — 2026 USCIS Standards.

Implements:
- Proportionality Test (inverted sliding scale, $80k-$300k+ range)
- Marginality Test (5-year hiring plan, revenue projections)
- Treaty Country verification
- Control & Direction requirement
- Service-startup exception (lower absolute, ~90-100% ratio)
"""
from shared.engine.base import BaseEvaluator
from shared.types.visa_types import E2_TREATY_COUNTRIES


class E2Evaluator(BaseEvaluator):
    """Rule-based E-2 investor visa eligibility evaluator."""

    def evaluate(self, data: dict) -> list[dict]:
        """Evaluate all E-2 criteria from questionnaire data."""
        personal = data.get("step_1", {})
        investment = data.get("step_9", {})
        step4 = data.get("step_4", {})

        results = [
            self._evaluate_treaty_country(personal),
            self._evaluate_proportionality(investment),
            self._evaluate_marginality(investment),
            self._evaluate_control_direction(investment, step4),
        ]
        return results

    def _evaluate_treaty_country(self, data: dict) -> dict:
        """
        Verify investor's nationality has an E-2 treaty with the US.
        """
        nationality = data.get("nationality", "").strip()

        if not nationality:
            return {
                "id": "e2_treaty_country",
                "name": "Treaty Country Eligibility",
                "score": 0.0,
                "evidence_summary": "Nationality not provided.",
                "recommendations": [
                    "Provide your nationality to verify E-2 treaty eligibility.",
                    "E-2 visas require nationality from a country with a US commerce treaty.",
                ],
            }

        # Check against treaty list (case-insensitive)
        is_treaty = any(
            nationality.lower() == country.lower()
            for country in E2_TREATY_COUNTRIES
        )

        if is_treaty:
            return {
                "id": "e2_treaty_country",
                "name": "Treaty Country Eligibility",
                "score": 95.0,
                "evidence_summary": f"{nationality} is an E-2 treaty country. ✓",
                "recommendations": [],
            }
        else:
            return {
                "id": "e2_treaty_country",
                "name": "Treaty Country Eligibility",
                "score": 0.0,
                "evidence_summary": f"{nationality} does not have an E-2 treaty with the US.",
                "recommendations": [
                    f"{nationality} is not on the E-2 treaty list.",
                    "Consider alternative visa categories (O-1A, EB-1, L-1) instead.",
                    "Consult with an immigration attorney for alternative strategies.",
                ],
            }

    def _evaluate_proportionality(self, data: dict) -> dict:
        """
        Proportionality Test — Inverted Sliding Scale.
        
        The investment must be "substantial" relative to the total enterprise cost:
        - Enterprise < $100k → investment ~90-100% of cost
        - Enterprise $100k-$500k → investment ~75-90%
        - Enterprise $500k+ → investment ~50-75%
        
        Common range: $80k-$300k+
        Service-startup exception: lower absolute if ~90-100% of startup cost.
        """
        investment_amount = data.get("investment_amount", 0)
        enterprise_cost = data.get("total_enterprise_cost", 0)
        business_type = data.get("business_type", "").lower()
        is_service_startup = "service" in business_type

        if not investment_amount or not enterprise_cost:
            return {
                "id": "e2_proportionality",
                "name": "Substantial Investment (Proportionality)",
                "score": 0.0,
                "evidence_summary": "Investment amount or enterprise cost not provided.",
                "recommendations": [
                    "Provide your total investment amount and the total cost of the enterprise.",
                    "Common E-2 investments range from $80,000 to $300,000+.",
                    "For service startups, lower amounts may qualify if they represent ~90-100% of costs.",
                ],
            }

        ratio = investment_amount / enterprise_cost if enterprise_cost > 0 else 0

        # Determine required ratio based on enterprise cost
        if enterprise_cost < 100000:
            required_ratio = 0.90
            tier = "small enterprise (< $100k)"
        elif enterprise_cost < 500000:
            required_ratio = 0.75
            tier = "mid-range enterprise ($100k-$500k)"
        else:
            required_ratio = 0.50
            tier = "large enterprise ($500k+)"

        # Service-startup exception
        if is_service_startup and ratio >= 0.85:
            score = max(75, ratio * 100)
            summary = (
                f"Service startup: ${investment_amount:,.0f} invested "
                f"({ratio:.0%} of ${enterprise_cost:,.0f} cost). "
                f"Service-startup exception applies."
            )
        elif ratio >= required_ratio:
            # Meets or exceeds required ratio
            score = 80 + (ratio - required_ratio) * 50
            summary = (
                f"${investment_amount:,.0f} invested ({ratio:.0%} of "
                f"${enterprise_cost:,.0f} — {tier}). Proportionality satisfied."
            )
        elif ratio >= required_ratio * 0.8:
            # Close but not quite
            score = 50 + (ratio / required_ratio) * 20
            summary = (
                f"${investment_amount:,.0f} invested ({ratio:.0%} of "
                f"${enterprise_cost:,.0f}). Below the ~{required_ratio:.0%} threshold for {tier}."
            )
        else:
            score = max(10, ratio * 60)
            summary = (
                f"${investment_amount:,.0f} invested ({ratio:.0%} of "
                f"${enterprise_cost:,.0f}). Well below the required ratio for {tier}."
            )

        score = self._clamp_score(score)

        recs = []
        if score < 60:
            recs.append(
                f"Your investment ratio ({ratio:.0%}) is below the ~{required_ratio:.0%} "
                f"threshold for a {tier}."
            )
            recs.append("Increase investment or demonstrate that funds are genuinely at risk.")
            recs.append("Document the lawful source of all investment funds.")
            if not is_service_startup:
                recs.append(
                    "If this is a service startup, the lower absolute threshold may apply."
                )

        return {
            "id": "e2_proportionality",
            "name": "Substantial Investment (Proportionality)",
            "score": score,
            "evidence_summary": summary,
            "recommendations": recs,
        }

    def _evaluate_marginality(self, data: dict) -> dict:
        """
        Marginality Test — Business must NOT be marginal.
        
        Requirements:
        - Revenue exceeds investor family support needs
        - 5-year hiring plan with US worker job creation
        - Growth trajectory demonstrated
        - Tax contributions projected
        """
        five_year_plan = data.get("five_year_plan", {})
        projected_revenue_y5 = five_year_plan.get("projected_revenue_year_5", 0)
        planned_hires_y5 = five_year_plan.get("planned_us_hires_year_5", 0)
        current_employees = data.get("current_us_employees", 0)
        annual_revenue = data.get("annual_revenue", 0)

        if not five_year_plan:
            return {
                "id": "e2_marginality",
                "name": "Non-Marginality (5-Year Plan)",
                "score": 0.0,
                "evidence_summary": "No 5-year business plan provided.",
                "recommendations": [
                    "Provide a detailed 5-year business plan with financial projections.",
                    "Include a US worker hiring plan (critical for E-2 non-marginality).",
                    "Show revenue projections that exceed personal/family support needs.",
                    "Include projected tax contributions and economic impact.",
                ],
            }

        score = 0
        factors = []

        # Hiring plan factor (most important — 40 points max)
        if planned_hires_y5 >= 10:
            score += 40
            factors.append(f"Strong hiring plan: {planned_hires_y5} US workers by year 5")
        elif planned_hires_y5 >= 5:
            score += 30
            factors.append(f"Moderate hiring plan: {planned_hires_y5} US workers by year 5")
        elif planned_hires_y5 >= 2:
            score += 20
            factors.append(f"Minimal hiring plan: {planned_hires_y5} US workers by year 5")
        elif planned_hires_y5 >= 1:
            score += 10
            factors.append(f"Limited hiring: {planned_hires_y5} US worker(s) by year 5")

        # Revenue projection factor (25 points max)
        if projected_revenue_y5 >= 500000:
            score += 25
            factors.append(f"Strong revenue: ${projected_revenue_y5:,.0f} projected by year 5")
        elif projected_revenue_y5 >= 200000:
            score += 18
            factors.append(f"Moderate revenue: ${projected_revenue_y5:,.0f} projected by year 5")
        elif projected_revenue_y5 >= 100000:
            score += 10
            factors.append(f"Basic revenue: ${projected_revenue_y5:,.0f} projected by year 5")

        # Current operations factor (20 points max)
        if current_employees >= 3:
            score += 20
            factors.append(f"Currently employing {current_employees} US workers")
        elif current_employees >= 1:
            score += 12
            factors.append(f"Currently employing {current_employees} US worker(s)")

        # Business plan detail factor (15 points max)
        plan_detail_score = 0
        if five_year_plan.get("market_analysis"):
            plan_detail_score += 5
        if five_year_plan.get("financial_projections"):
            plan_detail_score += 5
        if five_year_plan.get("growth_strategy"):
            plan_detail_score += 5
        score += plan_detail_score
        if plan_detail_score > 0:
            factors.append(f"Business plan includes {plan_detail_score // 5} of 3 key sections")

        score = self._clamp_score(score)
        summary = " | ".join(factors) if factors else "Insufficient data for marginality assessment."

        recs = []
        if score < 60:
            recs.append("Strengthen your 5-year hiring plan with specific US worker positions.")
            recs.append("Include detailed financial projections showing revenue well above family support.")
            if planned_hires_y5 < 5:
                recs.append(f"Aim for at least 5 planned US worker hires (currently: {planned_hires_y5}).")
            if not five_year_plan.get("market_analysis"):
                recs.append("Add a market analysis section to your business plan.")

        return {
            "id": "e2_marginality",
            "name": "Non-Marginality (5-Year Plan)",
            "score": score,
            "evidence_summary": summary,
            "recommendations": recs,
        }

    def _evaluate_control_direction(self, investment_data: dict, work_data: dict) -> dict:
        """
        Control & Direction — Investor must own >= 50% and direct the enterprise.
        """
        ownership_pct = investment_data.get("ownership_percentage", 0)
        role = investment_data.get("role_title", "").lower()
        has_operational_control = investment_data.get("has_operational_control", False)

        executive_roles = {"ceo", "president", "managing director", "founder", "co-founder", "cto", "coo"}
        is_executive = any(er in role for er in executive_roles)

        if not ownership_pct and not role:
            return {
                "id": "e2_control_direction",
                "name": "Control & Direction",
                "score": 0.0,
                "evidence_summary": "No ownership or role information provided.",
                "recommendations": [
                    "Provide your ownership percentage (must be >= 50% for E-2).",
                    "Specify your executive/managerial role title.",
                    "Document your operational control over the business.",
                ],
            }

        score = 0

        # Ownership factor (50 points max)
        if ownership_pct >= 50:
            score += 50
        elif ownership_pct >= 25:
            score += 25
        else:
            score += 10

        # Role factor (30 points max)
        if is_executive:
            score += 30
        elif has_operational_control:
            score += 20
        elif role:
            score += 10

        # Operational control bonus (20 points max)
        if has_operational_control:
            score += 20

        score = self._clamp_score(score)

        summary = f"Ownership: {ownership_pct}%. Role: {role or 'Not specified'}."
        if has_operational_control:
            summary += " Operational control confirmed."

        recs = []
        if ownership_pct < 50:
            recs.append(f"Your ownership ({ownership_pct}%) is below the 50% threshold.")
            recs.append("You must own at least 50% or demonstrate operational control via executive role.")
        if not is_executive:
            recs.append("Hold an executive/managerial title (CEO, President, Managing Director).")

        return {
            "id": "e2_control_direction",
            "name": "Control & Direction",
            "score": score,
            "evidence_summary": summary,
            "recommendations": recs,
        }
