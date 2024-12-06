from dataclasses import dataclass
from typing import Literal
from user.models import User

class TournamentPlayerBase:
    name: str

class TournamentUser(TournamentPlayerBase):
    bot: Literal[False]
    user: User

    def __init__(self, user: User) -> None:
        self.name = user.get_username()
        self.bot = False
        self.user = user
    def __repr__(self) -> str:
        return f"TournamentUser({self.name})"

class TournamentBot(TournamentPlayerBase):
    bot: Literal[True]
    user: None

    def __init__(self, name: str) -> None:
        self.name = name
        self.bot = True
        self.user = None

    def __repr__(self) -> str:
        return f"TournamentBot({self.name})"

TournamentPlayer = TournamentUser | TournamentBot
