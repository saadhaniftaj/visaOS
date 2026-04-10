/**
 * Questionnaire step definitions for the 10-step dynamic questionnaire.
 */

export interface StepConfig {
  id: number;
  title: string;
  description: string;
  category: "all" | "O1A" | "E2";
  fields: FieldConfig[];
}

export interface FieldConfig {
  name: string;
  label: string;
  type: "text" | "email" | "number" | "select" | "textarea" | "array" | "date";
  placeholder?: string;
  required?: boolean;
  options?: { value: string; label: string }[];
  arrayFields?: FieldConfig[];
  visibleWhen?: { field: string; value: string };
}

export const STEPS: StepConfig[] = [
  {
    id: 1,
    title: "Personal Information",
    description: "Let's start with your basic details. This information is essential for determining your visa eligibility.",
    category: "all",
    fields: [
      { name: "full_name", label: "Full Legal Name", type: "text", placeholder: "John Alexander Smith", required: true },
      { name: "email", label: "Email Address", type: "email", placeholder: "john@example.com", required: true },
      { name: "dob", label: "Date of Birth", type: "date", required: true },
      {
        name: "nationality", label: "Nationality / Country of Citizenship", type: "text",
        placeholder: "e.g., Canada, United Kingdom, Japan", required: true,
      },
      { name: "current_location", label: "Current Location", type: "text", placeholder: "City, State/Country" },
      { name: "phone", label: "Phone Number", type: "text", placeholder: "+1 (555) 000-0000" },
    ],
  },
  {
    id: 2,
    title: "Visa Category Selection",
    description: "Choose the visa category you'd like to evaluate. We'll tailor the questionnaire to your selection.",
    category: "all",
    fields: [
      {
        name: "visa_type", label: "Visa Category", type: "select", required: true,
        options: [
          { value: "", label: "Select a category..." },
          { value: "O1A", label: "O-1A — Extraordinary Ability (Tech/Business)" },
          { value: "E2", label: "E-2 — Treaty Investor" },
        ],
      },
      {
        name: "has_llc", label: "Do you have a U.S. LLC or Corporation?", type: "select",
        options: [
          { value: "", label: "Select..." },
          { value: "yes", label: "Yes — I have a US entity" },
          { value: "no", label: "No — I need sponsorship" },
          { value: "planning", label: "Planning to form one" },
        ],
      },
      { name: "timeline", label: "Desired Timeline", type: "text", placeholder: "e.g., Within 6 months" },
    ],
  },
  {
    id: 3,
    title: "Education & Background",
    description: "Your academic credentials and professional training history.",
    category: "all",
    fields: [
      { name: "highest_degree", label: "Highest Degree", type: "select", options: [
        { value: "", label: "Select..." },
        { value: "phd", label: "Ph.D. / Doctorate" },
        { value: "masters", label: "Master's Degree" },
        { value: "bachelors", label: "Bachelor's Degree" },
        { value: "associate", label: "Associate Degree" },
        { value: "other", label: "Other / Self-taught" },
      ]},
      { name: "institution", label: "Institution Name", type: "text", placeholder: "e.g., MIT, Stanford" },
      { name: "field_of_study", label: "Field of Study", type: "text", placeholder: "e.g., Computer Science, Business" },
      { name: "graduation_year", label: "Graduation Year", type: "number", placeholder: "2020" },
      { name: "certifications", label: "Professional Certifications", type: "textarea", placeholder: "List any relevant certifications..." },
    ],
  },
  {
    id: 4,
    title: "Work History & Impact",
    description: "Document your professional experience. Focus on critical roles, leadership, and measurable impact.",
    category: "all",
    fields: [
      { name: "current_employer", label: "Current Employer / Company", type: "text", placeholder: "Company name" },
      { name: "current_role", label: "Current Role / Title", type: "text", placeholder: "e.g., CTO, Senior Engineer" },
      { name: "role_level", label: "Role Level", type: "select", options: [
        { value: "", label: "Select..." },
        { value: "cto", label: "C-Suite (CTO, CEO, COO)" },
        { value: "vp_engineering", label: "VP / SVP" },
        { value: "director", label: "Director" },
        { value: "principal", label: "Principal / Staff" },
        { value: "senior", label: "Senior" },
        { value: "mid", label: "Mid-Level" },
        { value: "lead", label: "Team Lead" },
      ]},
      { name: "org_type", label: "Organization Type", type: "select", options: [
        { value: "", label: "Select..." },
        { value: "faang", label: "FAANG / Big Tech" },
        { value: "unicorn", label: "Unicorn Startup (1B+ valuation)" },
        { value: "public_company", label: "Public Company" },
        { value: "funded_startup", label: "Funded Startup" },
        { value: "startup", label: "Early-Stage Startup" },
        { value: "small_company", label: "Small/Medium Business" },
      ]},
      { name: "years_experience", label: "Years of Experience", type: "number", placeholder: "10" },
      { name: "impact_statement", label: "Key Accomplishments & Impact", type: "textarea", placeholder: "Describe your most significant professional achievements, team sizes managed, revenue impact, products launched..." },
      { name: "total_annual_comp", label: "Total Annual Compensation (USD)", type: "number", placeholder: "e.g., 250000" },
      { name: "field_percentile", label: "Estimated Salary Percentile in Your Field", type: "number", placeholder: "e.g., 90" },
    ],
  },
  {
    id: 5,
    title: "Awards & Recognition",
    description: "List awards, prizes, grants, and memberships that demonstrate excellence in your field.",
    category: "O1A",
    fields: [
      { name: "awards_description", label: "Awards, Prizes & Honors", type: "textarea", placeholder: "List each award with its name, granting organization, year, and scope (international/national/industry/local).\n\nExample:\n- Forbes 30 Under 30 (2024, National)\n- ACM Distinguished Paper Award (2023, International)" },
      { name: "awards_scope", label: "Highest Award Scope", type: "select", options: [
        { value: "", label: "Select highest scope..." },
        { value: "international", label: "International" },
        { value: "national", label: "National" },
        { value: "industry", label: "Industry-specific" },
        { value: "regional", label: "Regional" },
        { value: "local", label: "Local" },
      ]},
      { name: "awards_count", label: "Total Number of Awards", type: "number", placeholder: "e.g., 5" },
      { name: "memberships_description", label: "Selective Professional Memberships", type: "textarea", placeholder: "List memberships in organizations that require outstanding achievements.\n\nExample:\n- IEEE Senior Member (peer-reviewed)\n- ACM Distinguished Member (invite-only)" },
      { name: "memberships_exclusivity", label: "Highest Membership Exclusivity", type: "select", options: [
        { value: "", label: "Select..." },
        { value: "invite_only", label: "Invite Only" },
        { value: "peer_reviewed", label: "Peer Reviewed" },
        { value: "application", label: "Application Required" },
        { value: "open", label: "Open Membership" },
      ]},
    ],
  },
  {
    id: 6,
    title: "Publications & Media",
    description: "Articles written by you AND articles/features written about you. Include digital publications per 2026 standards.",
    category: "O1A",
    fields: [
      { name: "published_about_description", label: "Media Coverage About You", type: "textarea", placeholder: "List articles/features written ABOUT you and your work.\n\nExample:\n- TechCrunch: 'Founder X raises $10M...' (major_media)\n- IEEE Spectrum profile (trade_publication)" },
      { name: "published_about_type", label: "Highest Outlet Type", type: "select", options: [
        { value: "", label: "Select..." },
        { value: "major_media", label: "Major Media (NYT, Forbes, TechCrunch)" },
        { value: "trade_publication", label: "Trade Publication" },
        { value: "digital_outlet", label: "Digital Outlet (2026-recognized)" },
        { value: "blog", label: "Blog / Newsletter" },
      ]},
      { name: "published_count", label: "Number of Features About You", type: "number", placeholder: "e.g., 3" },
      { name: "authored_description", label: "Your Scholarly Publications", type: "textarea", placeholder: "List articles, papers, or digital content YOU authored.\n\nInclude: venue, citation count, readership\n\n2026 Update: Tech blogs with metrics, podcasts with audience data qualify." },
      { name: "authored_venue", label: "Highest Venue Type", type: "select", options: [
        { value: "", label: "Select..." },
        { value: "top_journal", label: "Top-Tier Journal (Nature, Science)" },
        { value: "peer_reviewed", label: "Peer-Reviewed Journal" },
        { value: "conference_proceedings", label: "Conference Proceedings" },
        { value: "tech_blog", label: "Tech Blog (with metrics)" },
        { value: "podcast", label: "Podcast (with audience data)" },
        { value: "whitepaper", label: "Whitepaper / Report" },
      ]},
      { name: "authored_count", label: "Number of Authored Publications", type: "number", placeholder: "e.g., 8" },
      { name: "total_citations", label: "Total Citation Count", type: "number", placeholder: "e.g., 150" },
    ],
  },
  {
    id: 7,
    title: "Judging & Peer Review",
    description: "Document all judging activities. Per 2026 USCIS standards, hackathon judging, OSS PR reviews, and podcast panels qualify.",
    category: "O1A",
    fields: [
      { name: "judging_description", label: "Judging Activities", type: "textarea", placeholder: "List ALL judging activities:\n\n- Hackathon judge at HackMIT (2024, hackathon)\n- OSS PR reviewer for React core (ongoing, oss_pr_review)\n- Panel judge on AI podcast (2025, podcast_panel)\n- Grant review committee (2023, grant_review)" },
      { name: "judging_type", label: "Highest Judging Type", type: "select", options: [
        { value: "", label: "Select..." },
        { value: "international_competition", label: "International Competition" },
        { value: "national_competition", label: "National Competition" },
        { value: "hackathon", label: "Hackathon Judge" },
        { value: "oss_pr_review", label: "Open-Source PR Reviewer (2026)" },
        { value: "podcast_panel", label: "Podcast/Webinar Panel Judge (2026)" },
        { value: "conference_panel", label: "Conference Panel" },
        { value: "peer_review", label: "Peer Review (Journal/Conference)" },
        { value: "grant_review", label: "Grant Review Committee" },
      ]},
      { name: "judging_count", label: "Total Judging Activities", type: "number", placeholder: "e.g., 6" },
    ],
  },
  {
    id: 8,
    title: "Original Contributions",
    description: "Patents, products, open-source projects, and innovations that demonstrate major significance in your field.",
    category: "O1A",
    fields: [
      { name: "contributions_description", label: "Original Contributions", type: "textarea", placeholder: "List your original contributions:\n\n- Patent: US Patent #12345 — AI recommendation engine\n- Open-source: React component library (10k+ GitHub stars)\n- Product: Led development of platform serving 1M+ users" },
      { name: "contribution_type", label: "Primary Contribution Type", type: "select", options: [
        { value: "", label: "Select..." },
        { value: "patent", label: "Patent" },
        { value: "open_source", label: "Open-Source Project" },
        { value: "product", label: "Product / Platform" },
        { value: "algorithm", label: "Algorithm / Method" },
        { value: "framework", label: "Framework / Library" },
        { value: "published_paper", label: "Published Research" },
        { value: "methodology", label: "Methodology / Process" },
      ]},
      { name: "adoption_level", label: "Adoption Level", type: "select", options: [
        { value: "", label: "Select..." },
        { value: "high", label: "High (1M+ users, 1K+ stars, widely cited)" },
        { value: "medium", label: "Medium (10K+ users, 100+ stars)" },
        { value: "low", label: "Low / Internal use" },
      ]},
      { name: "contributions_count", label: "Total Contributions", type: "number", placeholder: "e.g., 4" },
    ],
  },
  {
    id: 9,
    title: "Investment Details",
    description: "For E-2 Treaty Investor applicants. Provide details about your investment and business plan.",
    category: "E2",
    fields: [
      { name: "investment_amount", label: "Total Investment Amount (USD)", type: "number", placeholder: "e.g., 150000", required: true },
      { name: "total_enterprise_cost", label: "Total Enterprise Cost (USD)", type: "number", placeholder: "e.g., 200000", required: true },
      { name: "business_type", label: "Business Type", type: "select", options: [
        { value: "", label: "Select..." },
        { value: "service_startup", label: "Service-Based Startup" },
        { value: "tech_startup", label: "Technology Startup" },
        { value: "franchise", label: "Franchise" },
        { value: "retail", label: "Retail / E-Commerce" },
        { value: "manufacturing", label: "Manufacturing" },
        { value: "consulting", label: "Consulting Firm" },
      ]},
      { name: "ownership_percentage", label: "Your Ownership Percentage", type: "number", placeholder: "e.g., 100" },
      { name: "role_title", label: "Your Role/Title in the Business", type: "text", placeholder: "e.g., CEO, Managing Director" },
      { name: "has_operational_control", label: "Do you have day-to-day operational control?", type: "select", options: [
        { value: "", label: "Select..." },
        { value: "yes", label: "Yes" },
        { value: "no", label: "No" },
      ]},
      { name: "current_us_employees", label: "Current US Employees", type: "number", placeholder: "e.g., 3" },
      { name: "annual_revenue", label: "Current Annual Revenue (USD)", type: "number", placeholder: "e.g., 250000" },
      { name: "planned_hires_y5", label: "Planned US Hires by Year 5", type: "number", placeholder: "e.g., 10" },
      { name: "projected_revenue_y5", label: "Projected Revenue by Year 5 (USD)", type: "number", placeholder: "e.g., 500000" },
      { name: "has_business_plan", label: "Do you have a formal business plan?", type: "select", options: [
        { value: "", label: "Select..." },
        { value: "yes", label: "Yes — detailed 5-year plan" },
        { value: "partial", label: "Partial — basic projections" },
        { value: "no", label: "No" },
      ]},
    ],
  },
  {
    id: 10,
    title: "LLC & Sponsorship",
    description: "Under 2026 USCIS rules, your own LLC can act as your visa petitioner. Provide entity details here.",
    category: "all",
    fields: [
      { name: "entity_type", label: "Entity Type", type: "select", options: [
        { value: "", label: "Select..." },
        { value: "LLC", label: "LLC" },
        { value: "C-Corp", label: "C-Corporation" },
        { value: "S-Corp", label: "S-Corporation" },
        { value: "none", label: "No US Entity" },
      ]},
      { name: "entity_name", label: "Entity Name", type: "text", placeholder: "e.g., Vanguard Solutions LLC" },
      { name: "is_registered", label: "Is the entity registered in a US state?", type: "select", options: [
        { value: "", label: "Select..." },
        { value: "yes", label: "Yes" },
        { value: "no", label: "No" },
      ]},
      { name: "has_ein", label: "Does the entity have an EIN?", type: "select", options: [
        { value: "", label: "Select..." },
        { value: "yes", label: "Yes" },
        { value: "no", label: "No" },
      ]},
      { name: "has_operating_agreement", label: "Does it have an Operating Agreement?", type: "select", options: [
        { value: "", label: "Select..." },
        { value: "yes", label: "Yes" },
        { value: "no", label: "No" },
      ]},
      { name: "has_governance", label: "Does it have a governance structure (board of advisors/directors)?", type: "select", options: [
        { value: "", label: "Select..." },
        { value: "yes", label: "Yes" },
        { value: "no", label: "No" },
      ]},
      { name: "board_members", label: "Number of Board/Advisor Members", type: "number", placeholder: "e.g., 3" },
      { name: "entity_can_hire_fire", label: "Can the entity hire/fire you (the beneficiary)?", type: "select", options: [
        { value: "", label: "Select..." },
        { value: "yes", label: "Yes" },
        { value: "no", label: "No" },
      ]},
    ],
  },
];
