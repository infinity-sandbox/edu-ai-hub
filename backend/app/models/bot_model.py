from typing import List, Optional
from datetime import datetime
from uuid import UUID, uuid4
from beanie import Document, Link
from pydantic import Field
from app.models.user_model import User
from typing import Dict, Union
from pydantic import BaseModel
from app.models.user_model import User 
from app.core.config import settings

class Bot(Document):
    session_uuid: UUID = Field(default_factory=uuid4) # Interaction id (Link to weaviate db)
    bot_id: str = settings.BOT_ID # put bot name, bot id, bot description on settings then call them here
    user_id: Link[User] # Link to the User model
    bot_name: str
    bot_description: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    query: str
    response: str
    respondent_id: str # will hold the respondent user id or the bot id (mainly for chatroom)
    input_metadata: Dict[str, Union[str, bool]] # used to hold voice path, question or not, ...
    output_metadata: Dict[str, Union[str, bool]] # used to hold voice path, question or not, ...
    # message_id: UUID = Field(default_factory=uuid4) # FIXME: remove this one b/c of session_uuid 
    session_id: UUID = Field(default_factory=uuid4)
    chunk_ids: Optional[List[str]] = None
    response_time: Optional[datetime] = None # ouput response - input response
    token: Optional[Dict[str, str]] = None # dict of input token and output token
    model: Optional[str] = None # name of the model
    role: str # for now admin and user only (role of the session user)
    # regenerated: Optional[bool] = False
    rating: Optional[Dict[str, Union[int, bool]]] = None
    is_chatroom: Optional[bool] = False
    is_botclass: Optional[bool] = False
    is_game: Optional[bool] = False
    metadata: Dict[str, Union[List[str], str, dict]]
    is_finished: Optional[bool] = False
    
    # TODO: we will have only 3 schema for weaviate - document, chunk & interaction (FIELDS: query, 
    # session_uuid - will link interaction to mongodb schema)
    
    class Settings:
        name = "bots"
    
    def __repr__(self) -> str:
        return f"<Bot {self.bot_name}>"

    def __str__(self) -> str:
        return self.bot_name

    def __hash__(self) -> int:
        return hash(self.session_uuid)

    def __eq__(self, other: object) -> bool:
        if isinstance(other, Bot):
            return self.session_uuid == other.session_uuid
        return False
    
    @property
    def create(self) -> datetime:
        return self.id.generation_time

