"""
LLC Self-Sponsorship Evaluator — 2026 USCIS Rule.

2026 Rule: An applicant's own LLC can act as the petitioner for O-1 and E-2 visas.

Requirements:
1. LLC is a legitimate US entity (registered, EIN, operating agreement)
2. Genuine employer-employee relationship demonstrated
3. Governance structure exists (board/advisors can hire/fire the beneficiary)
4. Alternative: US Agent filing if employer-employee relationship not viable
"""


class LLCSponsorshipEvaluator:
    """Evaluates LLC self-sponsorship viability under 2026 rules."""

    def evaluate(self, llc_data: dict) -> dict:
        """
        Assess whether an applicant's LLC can serve as petitioner.
        
        Returns dict compatible with LLCAssessment schema:
        - eligible: bool
        - entity_type: str
        - has_governance: bool
        - employer_employee_relationship: bool
        - recommendations: list[str]
        - alternative_route: str | None
        """
        if not llc_data:
            return {
                "eligible": False,
                "entity_type": None,
                "has_governance": False,
                "employer_employee_relationship": False,
                "recommendations": [
                    "No LLC information provided.",
                    "Under 2026 rules, your own LLC can petition for your O-1 or E-2 visa.",
                    "The LLC must be a legitimate US entity with proper governance.",
                ],
                "alternative_route": "us_agent",
            }

        entity_type = llc_data.get("entity_type", "").upper()  # LLC, C-Corp, S-Corp
        is_registered = llc_data.get("is_registered", False)
        has_ein = llc_data.get("has_ein", False)
        has_operating_agreement = llc_data.get("has_operating_agreement", False)
        has_governance = llc_data.get("has_governance_structure", False)
        board_members = llc_data.get("board_members", 0)
        has_external_oversight = llc_data.get("has_external_oversight", False)
        can_hire_fire = llc_data.get("entity_can_hire_fire", False)

        recs = []
        eligible = True
        employer_employee = False

        # Check 1: Entity legitimacy
        if not is_registered:
            eligible = False
            recs.append("LLC must be registered in a US state.")
        if not has_ein:
            eligible = False
            recs.append("Obtain an EIN (Employer Identification Number) from the IRS.")
        if not has_operating_agreement:
            recs.append("Draft a formal operating agreement for your LLC.")

        # Check 2: Governance (critical for employer-employee relationship)
        if has_governance and (board_members >= 2 or has_external_oversight):
            employer_employee = True
            if can_hire_fire:
                recs.append("✓ Governance structure can demonstrate employer-employee relationship.")
        else:
            recs.append(
                "Establish a governance structure (board of advisors, investors, or "
                "independent directors) who can exercise control over your employment."
            )
            recs.append(
                "At minimum, have 2+ board members or external advisors with authority "
                "to hire/terminate the beneficiary."
            )

        # Check 3: Determine alternative route
        alternative = None
        if not employer_employee:
            alternative = "us_agent"
            recs.append(
                "Alternative: File via a US Agent instead of the LLC. "
                "This is common for founders who cannot demonstrate employer-employee relationships."
            )

        # Entity type guidance
        if entity_type == "LLC":
            recs.append("LLCs are accepted as petitioners under 2026 guidance.")
        elif entity_type in ("C-CORP", "S-CORP"):
            recs.append(f"{entity_type} structure provides stronger employer-employee evidence.")
        elif entity_type:
            recs.append(f"Verify that '{entity_type}' qualifies as a US petitioner entity.")

        return {
            "eligible": eligible,
            "entity_type": entity_type or None,
            "has_governance": has_governance,
            "employer_employee_relationship": employer_employee,
            "recommendations": recs,
            "alternative_route": alternative,
        }
