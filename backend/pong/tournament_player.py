from dataclasses import dataclass
from user.models import User

@dataclass
class TournamentPlayer:
    name: str
    bot: bool
    user: User | None

