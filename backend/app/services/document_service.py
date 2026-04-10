"""Document Intelligence Service — Simulated AWS Textract/Bedrock extraction."""
import uuid
import os
from datetime import datetime, timezone


# Simulated extraction data for different document types
_MOCK_EXTRACTIONS = {
    "passport": {
        "name": "John Alexander Smith",
        "dob": "1990-05-15",
        "nationality": "Canadian",
        "document_type": "Passport",
        "document_number": "AB1234567",
        "issue_date": "2021-03-10",
        "expiry_date": "2031-03-09",
        "confidence": 0.97,
    },
    "resume": {
        "name": "John Alexander Smith",
        "work_history": [
            {
                "employer": "TechCorp Inc.",
                "role": "Senior Software Engineer",
                "start_date": "2018-06",
                "end_date": "2023-12",
                "location": "San Francisco, CA",
            },
            {
                "employer": "StartupXYZ",
                "role": "CTO & Co-Founder",
                "start_date": "2024-01",
                "end_date": "Present",
                "location": "New York, NY",
            },
        ],
        "education": [
            {
                "institution": "MIT",
                "degree": "M.S. Computer Science",
                "year": 2018,
            }
        ],
        "confidence": 0.92,
    },
    "default": {
        "name": "Document Owner",
        "dob": "1992-01-01",
        "nationality": "Unknown",
        "work_history": [],
        "confidence": 0.50,
    },
}


class DocumentIntelligenceService:
    """
    Simulates AWS Bedrock / Textract document extraction.
    
    In production, this would:
    1. Upload file to S3 with server-side encryption (AES-256 or KMS)
    2. Call Textract StartDocumentAnalysis for OCR
    3. Pass extracted text to Bedrock (Claude/Titan) for structured entity extraction
    4. Return validated, structured data
    
    For MVP, returns realistic mock data based on filename patterns.
    """

    UPLOAD_DIR = os.path.join(os.path.dirname(__file__), "..", "..", "uploads")

    def __init__(self):
        os.makedirs(self.UPLOAD_DIR, exist_ok=True)

    async def save_file(self, filename: str, content: bytes) -> str:
        """Save uploaded file to local storage. Returns file path."""
        safe_name = f"{uuid.uuid4()}_{filename}"
        file_path = os.path.join(self.UPLOAD_DIR, safe_name)
        with open(file_path, "wb") as f:
            f.write(content)
        return file_path

    async def extract_from_pdf(self, file_path: str, filename: str) -> dict:
        """
        Simulate document extraction.
        
        In production: AWS Textract → Bedrock pipeline.
        In MVP: Returns mock structured data based on filename heuristics.
        """
        filename_lower = filename.lower()

        if "passport" in filename_lower or "travel" in filename_lower:
            data = _MOCK_EXTRACTIONS["passport"].copy()
        elif "resume" in filename_lower or "cv" in filename_lower:
            data = _MOCK_EXTRACTIONS["resume"].copy()
        else:
            data = _MOCK_EXTRACTIONS["default"].copy()

        data["extracted_at"] = datetime.now(timezone.utc).isoformat()
        data["source_file"] = filename
        data["extraction_method"] = "simulated_textract_bedrock"

        return data

    async def get_extraction_status(self, document_id: uuid.UUID) -> dict:
        """Check extraction job status (simulated)."""
        return {
            "document_id": str(document_id),
            "status": "completed",
            "message": "Extraction completed successfully (simulated)",
        }
