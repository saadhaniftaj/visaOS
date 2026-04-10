"""Authentication Service — JWT + Argon2 password hashing."""
import uuid
from datetime import datetime, timedelta, timezone
from jose import JWTError, jwt
from pwdlib import PasswordHash
from pwdlib.hashers.argon2 import Argon2Hasher
from app.config import get_settings

settings = get_settings()

password_hasher = PasswordHash((Argon2Hasher(),))

# In-memory token blocklist (swap for Redis in production)
_token_blocklist: set[str] = set()


def hash_password(password: str) -> str:
    """Hash a plaintext password with Argon2."""
    return password_hasher.hash(password)


def verify_password(plain: str, hashed: str) -> bool:
    """Verify a password against its Argon2 hash."""
    return password_hasher.verify(plain, hashed)


def create_access_token(user_id: uuid.UUID, email: str) -> tuple[str, int]:
    """Create a short-lived access JWT. Returns (token, expires_in_seconds)."""
    expires_delta = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    expire = datetime.now(timezone.utc) + expires_delta
    jti = str(uuid.uuid4())

    payload = {
        "sub": str(user_id),
        "email": email,
        "exp": expire,
        "iat": datetime.now(timezone.utc),
        "jti": jti,
        "type": "access",
    }
    token = jwt.encode(payload, settings.JWT_SECRET_KEY, algorithm=settings.JWT_ALGORITHM)
    return token, int(expires_delta.total_seconds())


def create_refresh_token(user_id: uuid.UUID) -> str:
    """Create a long-lived refresh JWT."""
    expires_delta = timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)
    expire = datetime.now(timezone.utc) + expires_delta
    jti = str(uuid.uuid4())

    payload = {
        "sub": str(user_id),
        "exp": expire,
        "iat": datetime.now(timezone.utc),
        "jti": jti,
        "type": "refresh",
    }
    return jwt.encode(payload, settings.JWT_SECRET_KEY, algorithm=settings.JWT_ALGORITHM)


def decode_token(token: str) -> dict | None:
    """Decode and validate a JWT. Returns payload or None."""
    try:
        payload = jwt.decode(
            token, settings.JWT_SECRET_KEY, algorithms=[settings.JWT_ALGORITHM]
        )
        jti = payload.get("jti")
        if jti and jti in _token_blocklist:
            return None
        return payload
    except JWTError:
        return None


def blocklist_token(jti: str) -> None:
    """Add a token's JTI to the blocklist (logout)."""
    _token_blocklist.add(jti)
