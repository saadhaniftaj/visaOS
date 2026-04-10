"""Documents Router — Upload and extract data from PDFs."""
import uuid
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.models.user import User
from app.models.profile import Document
from app.services.document_service import DocumentIntelligenceService
from app.middleware.auth_middleware import get_current_user

router = APIRouter(prefix="/documents", tags=["Documents"])
doc_service = DocumentIntelligenceService()


@router.post("/upload", status_code=status.HTTP_201_CREATED)
async def upload_document(
    file: UploadFile = File(...),
    profile_id: str | None = None,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Upload a document and trigger simulated extraction."""
    # Validate file type
    if file.content_type not in ["application/pdf", "image/jpeg", "image/png"]:
        raise HTTPException(
            status_code=400,
            detail="Only PDF, JPEG, and PNG files are supported",
        )

    # Size limit: 10MB
    content = await file.read()
    if len(content) > 10 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="File size exceeds 10MB limit")

    # Save file
    file_path = await doc_service.save_file(file.filename, content)

    # Parse profile_id
    pid = None
    if profile_id:
        try:
            pid = uuid.UUID(profile_id)
        except ValueError:
            pass

    # Create document record
    doc = Document(
        user_id=current_user.id,
        profile_id=pid,
        filename=file.filename,
        content_type=file.content_type,
        file_path=file_path,
        extraction_status="processing",
    )
    db.add(doc)
    await db.flush()

    # Run extraction (simulated)
    extracted = await doc_service.extract_from_pdf(file_path, file.filename)
    doc.extracted_data = extracted
    doc.extraction_status = "completed"

    await db.flush()
    await db.refresh(doc)

    return {
        "id": doc.id,
        "filename": doc.filename,
        "extraction_status": doc.extraction_status,
        "extracted_data": doc.extracted_data,
        "created_at": doc.created_at.isoformat(),
    }


@router.get("/")
async def list_documents(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """List all documents for the authenticated user."""
    result = await db.execute(
        select(Document)
        .where(Document.user_id == current_user.id)
        .order_by(Document.created_at.desc())
    )
    docs = result.scalars().all()

    return [
        {
            "id": d.id,
            "filename": d.filename,
            "content_type": d.content_type,
            "extraction_status": d.extraction_status,
            "extracted_data": d.extracted_data,
            "created_at": d.created_at.isoformat(),
        }
        for d in docs
    ]


@router.get("/{document_id}")
async def get_document(
    document_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Get a specific document with its extracted data."""
    try:
        did = uuid.UUID(document_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid document ID")

    result = await db.execute(
        select(Document).where(
            Document.id == did, Document.user_id == current_user.id
        )
    )
    doc = result.scalar_one_or_none()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")

    return {
        "id": doc.id,
        "filename": doc.filename,
        "content_type": doc.content_type,
        "file_path": doc.file_path,
        "extraction_status": doc.extraction_status,
        "extracted_data": doc.extracted_data,
        "created_at": doc.created_at.isoformat(),
    }
