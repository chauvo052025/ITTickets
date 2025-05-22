```python
from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime
from uuid import UUID

class UserBase(BaseModel):
    email: EmailStr
    full_name: str
    department: Optional[str] = None

class UserCreate(UserBase):
    password: str
    role: str = "TEACHER"

class User(UserBase):
    id: UUID
    role: str
    created_at: datetime

    class Config:
        from_attributes = True

class TicketBase(BaseModel):
    title: str
    description: str
    priority: str

class TicketCreate(TicketBase):
    pass

class Ticket(TicketBase):
    id: UUID
    status: str
    created_by: UUID
    assigned_to: Optional[UUID]
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class CommentBase(BaseModel):
    content: str
    is_internal: bool = False

class CommentCreate(CommentBase):
    ticket_id: UUID

class Comment(CommentBase):
    id: UUID
    ticket_id: UUID
    user_id: UUID
    created_at: datetime

    class Config:
        from_attributes = True
```