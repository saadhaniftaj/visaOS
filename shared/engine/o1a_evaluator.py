"""
O-1A Extraordinary Ability Evaluator — 2026 USCIS Standards.

Evaluates 8 criteria with 2026 updates:
- Digital achievements (podcasts, OSS PR reviews, hackathon judging) are valid evidence
- Comparable evidence standard for STEM/digital professionals
- Focus on quality/substance over quantity

Applicant must meet at least 3 of 8 criteria (score >= 60 each).
"""
from shared.engine.base import BaseEvaluator


class O1AEvaluator(BaseEvaluator):
    """Rule-based O-1A eligibility evaluator implementing 2026 USCIS standards."""

    def evaluate(self, data: dict) -> list[dict]:
        """Evaluate all 8 O-1A criteria from questionnaire data."""
        results = [
            self._evaluate_awards(data.get("step_5", {})),
            self._evaluate_memberships(data.get("step_5", {})),
            self._evaluate_published_material(data.get("step_6", {})),
            self._evaluate_judging(data.get("step_7", {})),
            self._evaluate_original_contributions(data.get("step_8", {})),
            self._evaluate_authorship(data.get("step_6", {})),
            self._evaluate_critical_role(data.get("step_4", {})),
            self._evaluate_high_remuneration(data.get("step_4", {})),
        ]
        return results

    def _evaluate_awards(self, data: dict) -> dict:
        """
        Criterion 1: Awards — Nationally/internationally recognized prizes.
        Scoring:
        - International awards (Nobel, Turing, etc.): 95
        - National excellence awards: 80
        - Industry-specific awards: 65
        - Regional/local: 25-40
        """
        awards = data.get("awards", [])
        if not awards:
            return self._empty_criterion(
                "o1a_awards", "Awards & Prizes",
                "No awards provided.",
                ["Apply for industry awards and competitions in your field.",
                 "Consider prestigious hackathon prizes, innovation challenges, or startup competitions.",
                 "Document any grants or fellowships received."]
            )

        count, avg_quality = self._count_with_quality(awards, "scope")

        # Score: weighted blend of quantity and quality
        quantity_score = min(count * 20, 60)  # Up to 60 from quantity
        quality_score = avg_quality * 0.4     # Up to 40 from quality
        score = self._clamp_score(quantity_score + quality_score)

        award_names = [a.get("name", "Unnamed") for a in awards[:3]]
        summary = f"{count} award(s) documented: {', '.join(award_names)}."

        recs = []
        if score < 60:
            recs.append("Strengthen this criterion by obtaining national/international recognition.")
            recs.append("Industry awards from IEEE, ACM, Forbes 30 Under 30, etc. carry significant weight.")
        if count < 3:
            recs.append(f"Currently {count} award(s). Aim for 3+ with national/international scope.")

        return {
            "id": "o1a_awards",
            "name": "Awards & Prizes",
            "score": score,
            "evidence_summary": summary,
            "recommendations": recs,
        }

    def _evaluate_memberships(self, data: dict) -> dict:
        """
        Criterion 2: Memberships requiring outstanding achievements.
        Elite/invite-only: 90+; Peer-reviewed: 70; Open membership: 20
        """
        memberships = data.get("memberships", [])
        if not memberships:
            return self._empty_criterion(
                "o1a_memberships", "Selective Memberships",
                "No selective memberships provided.",
                ["Join selective professional organizations (IEEE Fellow, ACM Distinguished Member).",
                 "Industry-specific societies with peer review requirements are ideal.",
                 "Document the selection criteria and exclusivity of each membership."]
            )

        exclusivity_scores = {
            "invite_only": 95, "peer_reviewed": 75, "application": 55, "open": 20
        }

        total = 0
        for m in memberships:
            level = m.get("exclusivity", "open").lower().replace("-", "_").replace(" ", "_")
            total += exclusivity_scores.get(level, 30)

        avg = total / len(memberships)
        count_bonus = min(len(memberships) * 10, 30)
        score = self._clamp_score(avg * 0.7 + count_bonus)

        names = [m.get("organization", "Unknown") for m in memberships[:3]]
        summary = f"{len(memberships)} membership(s): {', '.join(names)}."

        recs = []
        if score < 60:
            recs.append("Focus on memberships that require peer review or invitation.")
            recs.append("Document the selection process and what percentage of applicants are accepted.")

        return {
            "id": "o1a_memberships",
            "name": "Selective Memberships",
            "score": score,
            "evidence_summary": summary,
            "recommendations": recs,
        }

    def _evaluate_published_material(self, data: dict) -> dict:
        """
        Criterion 3: Published material ABOUT the applicant in major media.
        Major media: 90+; Trade publications: 60-80; Blogs: 20-40
        2026 Update: Digital trade journals and practitioner-led outlets accepted.
        """
        publications = data.get("published_about", [])
        if not publications:
            return self._empty_criterion(
                "o1a_published_material", "Published Material (About You)",
                "No published material about you provided.",
                ["Seek features in major tech publications (TechCrunch, Wired, Forbes).",
                 "Industry trade journal features count — target your field's top outlets.",
                 "2026 Update: Significant digital trade journals and practitioner-led platforms are accepted."]
            )

        outlet_scores = {
            "major_media": 95, "trade_publication": 70, "digital_outlet": 60,
            "blog": 30, "social_media": 20,
        }

        total = 0
        for p in publications:
            outlet_type = p.get("outlet_type", "blog").lower().replace(" ", "_").replace("-", "_")
            total += outlet_scores.get(outlet_type, 35)

        avg = total / len(publications)
        count_bonus = min(len(publications) * 12, 35)
        score = self._clamp_score(avg * 0.65 + count_bonus)

        outlets = [p.get("outlet_name", "Unknown") for p in publications[:3]]
        summary = f"{len(publications)} feature(s) in: {', '.join(outlets)}."

        recs = []
        if score < 60:
            recs.append("Target major media coverage about your work and achievements.")
            recs.append("Include circulation/readership data to demonstrate the outlet's significance.")

        return {
            "id": "o1a_published_material",
            "name": "Published Material (About You)",
            "score": score,
            "evidence_summary": summary,
            "recommendations": recs,
        }

    def _evaluate_judging(self, data: dict) -> dict:
        """
        Criterion 4: Judging the work of others.
        2026 Update: Hackathon judging, OSS PR reviewing, podcast panel judging are valid.
        Conference/competition judging: 80+; Peer review: 70; Internal review: 30
        """
        judging = data.get("judging_activities", [])
        if not judging:
            return self._empty_criterion(
                "o1a_judging", "Judging (Including Digital)",
                "No judging activities provided.",
                ["Serve as a judge at hackathons, startup competitions, or tech awards.",
                 "2026 Update: Peer-reviewing open-source pull requests counts as judging.",
                 "Participate as a panelist/judge on industry podcasts or webinars.",
                 "Document your role and the significance of the event."]
            )

        judging_scores = {
            "international_competition": 95,
            "national_competition": 85,
            "hackathon": 80,
            "conference_panel": 75,
            "peer_review": 70,
            "oss_pr_review": 70,  # 2026: OSS PR review is valid
            "podcast_panel": 65,  # 2026: Podcast judging is valid
            "grant_review": 75,
            "internal_review": 30,
        }

        total = 0
        for j in judging:
            jtype = j.get("type", "internal_review").lower().replace(" ", "_").replace("-", "_")
            total += judging_scores.get(jtype, 40)

        avg = total / len(judging)
        count_bonus = min(len(judging) * 10, 30)
        score = self._clamp_score(avg * 0.7 + count_bonus)

        activities = [j.get("event_name", "Unknown") for j in judging[:3]]
        summary = f"{len(judging)} judging activit{'ies' if len(judging) != 1 else 'y'}: {', '.join(activities)}."

        recs = []
        if score < 60:
            recs.append("Increase judging activities — hackathons and OSS code review are strong evidence.")
            recs.append("Aim for judging roles at nationally/internationally recognized events.")

        return {
            "id": "o1a_judging",
            "name": "Judging (Including Digital)",
            "score": score,
            "evidence_summary": summary,
            "recommendations": recs,
        }

    def _evaluate_original_contributions(self, data: dict) -> dict:
        """
        Criterion 5: Original contributions of major significance.
        Widely adopted tech/patents: 90+; Published research: 70; Internal tools: 30
        """
        contributions = data.get("contributions", [])
        if not contributions:
            return self._empty_criterion(
                "o1a_original_contributions", "Original Contributions",
                "No original contributions provided.",
                ["Document patents, published papers, or widely adopted technologies.",
                 "Include adoption metrics (users, downloads, citations) for each contribution.",
                 "Open-source projects with significant community adoption are strong evidence."]
            )

        contrib_scores = {
            "patent": 90, "published_paper": 75, "open_source": 75,
            "product": 70, "framework": 80, "algorithm": 85,
            "internal_tool": 30, "methodology": 60,
        }

        total = 0
        for c in contributions:
            ctype = c.get("type", "internal_tool").lower().replace(" ", "_").replace("-", "_")
            base = contrib_scores.get(ctype, 40)

            # Adoption bonus
            adoption = c.get("adoption_level", "low").lower()
            adoption_bonus = {"high": 15, "medium": 8, "low": 0}.get(adoption, 0)
            total += base + adoption_bonus

        avg = total / len(contributions)
        count_bonus = min(len(contributions) * 10, 25)
        score = self._clamp_score(avg * 0.75 + count_bonus)

        names = [c.get("name", "Unknown") for c in contributions[:3]]
        summary = f"{len(contributions)} contribution(s): {', '.join(names)}."

        recs = []
        if score < 60:
            recs.append("Focus on contributions with measurable real-world impact.")
            recs.append("Obtain expert letters explaining why your contributions are significant.")

        return {
            "id": "o1a_original_contributions",
            "name": "Original Contributions",
            "score": score,
            "evidence_summary": summary,
            "recommendations": recs,
        }

    def _evaluate_authorship(self, data: dict) -> dict:
        """
        Criterion 6: Authorship of scholarly articles.
        2026 Update: Digital publications (tech blogs with metrics, podcasts) accepted.
        Top journals: 90+; Digital with metrics: 60-80; Average: 20-40
        """
        articles = data.get("authored_articles", [])
        if not articles:
            return self._empty_criterion(
                "o1a_authorship", "Scholarly Authorship (Including Digital)",
                "No authored articles provided.",
                ["Publish research in peer-reviewed journals or major conferences.",
                 "2026 Update: Tech blog posts with verifiable readership metrics qualify.",
                 "Digital content (podcasts, video series) with audience data is accepted.",
                 "Include citation counts and readership metrics."]
            )

        venue_scores = {
            "top_journal": 95, "peer_reviewed": 80, "conference_proceedings": 75,
            "tech_blog": 60, "digital_publication": 55, "podcast": 55,
            "book_chapter": 80, "whitepaper": 65, "blog_post": 35,
        }

        total = 0
        for a in articles:
            venue = a.get("venue_type", "blog_post").lower().replace(" ", "_").replace("-", "_")
            base = venue_scores.get(venue, 40)

            # Citation/reach bonus
            citations = a.get("citations", 0)
            if citations > 100:
                base += 15
            elif citations > 20:
                base += 8

            total += base

        avg = total / len(articles)
        count_bonus = min(len(articles) * 8, 25)
        score = self._clamp_score(avg * 0.75 + count_bonus)

        titles = [a.get("title", "Untitled") for a in articles[:3]]
        summary = f"{len(articles)} publication(s): {', '.join(titles)}."

        recs = []
        if score < 60:
            recs.append("Target top-tier journals or major conference proceedings.")
            recs.append("Include citation counts, download stats, and readership metrics.")

        return {
            "id": "o1a_authorship",
            "name": "Scholarly Authorship (Including Digital)",
            "score": score,
            "evidence_summary": summary,
            "recommendations": recs,
        }

    def _evaluate_critical_role(self, data: dict) -> dict:
        """
        Criterion 7: Employment in a critical role at distinguished organizations.
        FAANG/unicorn: 90+; Funded startup: 60-80; Small company: 30-50
        """
        roles = data.get("work_history", [])
        if not roles:
            return self._empty_criterion(
                "o1a_critical_role", "Critical/Essential Role",
                "No work history provided.",
                ["Document your role's criticality at each organization.",
                 "Highlight the organization's reputation and your specific impact.",
                 "Include metrics: revenue generated, team size, products launched."]
            )

        org_scores = {
            "faang": 95, "fortune_500": 90, "unicorn": 85,
            "public_company": 75, "funded_startup": 65, "startup": 50,
            "small_company": 35, "freelance": 25,
        }

        role_scores = {
            "cto": 95, "vp_engineering": 90, "director": 80,
            "principal": 85, "staff": 75, "senior": 60,
            "lead": 65, "mid": 40, "junior": 20,
        }

        best_score = 0
        for r in roles:
            org_type = r.get("org_type", "small_company").lower().replace(" ", "_").replace("-", "_")
            role_level = r.get("role_level", "mid").lower().replace(" ", "_").replace("-", "_")

            org_s = org_scores.get(org_type, 40)
            role_s = role_scores.get(role_level, 40)
            combined = (org_s * 0.5 + role_s * 0.5)

            if combined > best_score:
                best_score = combined

        # Bonus for multiple critical roles
        multi_bonus = min((len(roles) - 1) * 8, 20) if len(roles) > 1 else 0
        score = self._clamp_score(best_score + multi_bonus)

        employers = [r.get("employer", "Unknown") for r in roles[:3]]
        summary = f"{len(roles)} role(s) at: {', '.join(employers)}."

        recs = []
        if score < 60:
            recs.append("Emphasize your essential role and unique contributions at each organization.")
            recs.append("Obtain letters from senior leadership confirming your critical impact.")

        return {
            "id": "o1a_critical_role",
            "name": "Critical/Essential Role",
            "score": score,
            "evidence_summary": summary,
            "recommendations": recs,
        }

    def _evaluate_high_remuneration(self, data: dict) -> dict:
        """
        Criterion 8: High salary relative to field.
        Top 10%: 90+; Top 25%: 60-80; Average: 20-40
        """
        compensation = data.get("compensation", {})
        if not compensation:
            return self._empty_criterion(
                "o1a_high_remuneration", "High Remuneration",
                "No compensation data provided.",
                ["Provide your total compensation (salary + equity + bonuses).",
                 "Include field-specific salary benchmarks to demonstrate your percentile.",
                 "Stock options and equity grants count toward total remuneration."]
            )

        total_comp = compensation.get("total_annual", 0)
        field_median = compensation.get("field_median", 100000)
        field_percentile = compensation.get("percentile", 50)

        if field_percentile >= 90:
            score = 95
        elif field_percentile >= 75:
            score = 80
        elif field_percentile >= 60:
            score = 65
        elif field_percentile >= 50:
            score = 45
        else:
            if total_comp > 0 and field_median > 0:
                ratio = total_comp / field_median
                score = min(ratio * 50, 90)
            else:
                score = 20

        score = self._clamp_score(score)

        summary = f"Total compensation: ${total_comp:,.0f}. Field percentile: {field_percentile}%."

        recs = []
        if score < 60:
            recs.append("High remuneration is measured relative to your specific field.")
            recs.append("Include equity, bonuses, and all forms of compensation.")
            recs.append("Provide industry salary surveys as benchmarks (Glassdoor, Levels.fyi, etc.).")

        return {
            "id": "o1a_high_remuneration",
            "name": "High Remuneration",
            "score": score,
            "evidence_summary": summary,
            "recommendations": recs,
        }

    @staticmethod
    def _empty_criterion(criterion_id: str, name: str, summary: str, recs: list[str]) -> dict:
        """Return a zero-score criterion when no data is provided."""
        return {
            "id": criterion_id,
            "name": name,
            "score": 0.0,
            "evidence_summary": summary,
            "recommendations": recs,
        }
