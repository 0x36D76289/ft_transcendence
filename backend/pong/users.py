from typing import Any
from channels.generic.websocket import WebsocketConsumer
from user.models import User
from dataclasses import dataclass
from uuid import uuid4
import sys
import json

WIN_SCORE = 10

def errprint(*kwargs):
    print(*kwargs, file=sys.stderr)

class PongGame():
    # DATA
    p1: User
    p2: User
    spectators: list[User]
    room_name: str
    # methods
    def __init__(self, p1: User, p2: User):
        self.p1 = p1
        self.p2 = p2
        self.room_name: str = str(uuid4().hex)
        start_message = json.dumps({"type":"game_start", "value":self.room_name})
        pong_data.online_users[p1].online_socket.send(start_message)
        pong_data.online_users[p2].online_socket.send(start_message)
        self.spectators = []

    def disconnect_user(self, user: User):
        #TODO: still busy if not in tournament
        # else remove
        pu = pong_data.get_pong_user(user)
        if pu is None:
            return
        try:
            if pu.pong_socket:
                pu.pong_socket.close()
        except:
            pass
        pu.pong_socket = None
        pu.game = None
    def lose_game(self, loser: User):
        errprint(loser.username, "LOST THE GAME")
        #TODO:
        # save to DB
        self.close()
        pu = pong_data.get_pong_user(loser)
        if pu is None:
            return
        if pu.tournament:
            pu.tournament.report_game(loser, False)
    def report_score(self, data: dict[str, Any]):
        if data["p1"] == WIN_SCORE:
            self.lose_game(self.p2)
        elif data["p2"] == WIN_SCORE:
            self.lose_game(self.p1)
    def close(self):
        self.disconnect_user(self.p1)
        self.disconnect_user(self.p2)
        for spec in self.spectators:
            self.disconnect_user(spec)
        pass
    def get_player_number(self, user: User) -> str:
        number: int = -1
        if user == self.p1:
            number = 1
        if user == self.p2:
            number = 2
        return json.dumps({"type":"player_assign", "value":number})

@dataclass
class TournamentPlayer:
    name: str
    bot: bool
    user: User | None

def next_power_of_2(n: int) -> int:
    return 2**(n-1).bit_length()

class Tournament():
    players: list[TournamentPlayer]
    rounds: list[list[TournamentPlayer | None]]
    current_round_index: int

    _ongoing_round: list[TournamentPlayer | None]
    _next_round: list[TournamentPlayer | None]
    #TODO: winner of tournament player has to get removed

    def __init__(self, player_list: list[User]):
        self.players = []
        for user in player_list:
            self.players.append(TournamentPlayer(user.get_username(), False, user))
        self.fill_rounds()
        self.current_round_index = 0
        errprint("BEFORE TOURNAMENT START")
        self.print_rounds()
        self.start_round()

    def fill_rounds(self) -> None:
        self.rounds = []
        self.rounds.append([self.players[i] if i < len(self.players) else None for i in range(next_power_of_2(len(self.players)))])
        while (len(self.rounds[-1]) > 1):
            self.rounds.append([None for _ in range(len(self.rounds[-1])//2)])

    def start_game(self, p1: TournamentPlayer | None, p2: TournamentPlayer | None) -> TournamentPlayer | None:
        if p1 is None:
            return p2
        if p2 is None:
            return p1
        # if p1.bot and p2.bot:
        #     return random between p1 and p2
        # if p1.bot:
        #     start bot game p2
        #     return
        # if p2.bot:
        #     start bot game p1
        #     return
        pong_data.start_game(p1.user, p2.user)
        #TODO: check return value of start_game
        #   if game failed:
        #       if one online:
        #           online is winner
        #       else:
        #           pick at random
        #       IN THAT ORDER

    def start_round(self) -> None:
        self._ongoing_round = self.rounds[self.current_round_index]
        self._next_round = self.rounds[self.current_round_index + 1]
        for i in range(len(self._next_round)):
            name1 = "None"
            name2 = "None"
            p1 = self._ongoing_round[i * 2]
            p2 = self._ongoing_round[i * 2 + 1]
            if p1 is not None:
                name1 = p1.name
            if p2:
                name2 = p2.name
            errprint("STARTING GAME BETWEEN", name1, name2)
            self._next_round[i] = self.start_game(self._ongoing_round[i * 2], self._ongoing_round[i * 2 + 1])
        self.current_round_index += 1
        if self.is_round_over():
            self.start_round()

    def is_round_over(self) -> bool:
        for i in range(len(self._next_round)):
            if self._next_round[i] == None:
                if self._ongoing_round[i * 2] != None and self._ongoing_round[i * 2 + 1] != None:
                    return False
        return True
    
    def find_round(self, user: User) -> tuple[int, int]:
        for i in range(len(self._next_round)):
            if self._ongoing_round[i * 2] is not None and self._ongoing_round[i * 2].user == user:
                return (i, 0)
            if self._ongoing_round[i * 2 + 1] is not None and self._ongoing_round[i * 2 + 1].user == user:
                return (i, 1)
        return -1, 0

    def report_game(self, user: User, user_is_winner: bool) -> bool:
        """
        returns True if tournament is over, in which case it should be deleted
        """
        self.print_rounds()
        if self.current_round_index == len(self.rounds) - 1:
            # end of tournament
            #  TODO:
            #   remove is_busy status from everyone
            #   report tournament
            return True
        round_number, winner = self.find_round(user)
        if round_number == -1:
            return False
        if not user_is_winner:
            winner = 1 - winner
        self._next_round[round_number] = self._ongoing_round[2 * round_number + winner]
        #TODO: remove loser from tournament
        # remove busy from loser

        if self.is_round_over():
            self.start_round()
        return False

    def print_rounds(self):
        for i, round in enumerate(self.rounds):
            errprint(f"{i}:", " ".join((thing.name if thing else "empty" for thing in round)))
        errprint()

class PongUser():
    user: User
    online_socket: WebsocketConsumer
    game: PongGame | None
    pong_socket: WebsocketConsumer | None
    tournament: Tournament | None
    wants_to_fight: str | None
    def __init__(self, online_sock: WebsocketConsumer):
        self.user = online_sock.user
        self.online_socket = online_sock
        self.game = None
        self.pong_socket = None
        self.tournament = None
        self.wants_to_fight = None

class pong_data:
    online_users: dict[User, PongUser] = dict()
    name_to_user: dict[str, User] = dict()

    matchmaking_queue: User | None = None

    @classmethod
    def get_pong_user(cls, user: User) -> PongUser | None:
        if user in cls.online_users:
            return cls.online_users[user]
        return None

    @classmethod
    def register(cls, online_sock: WebsocketConsumer):
        user: User = online_sock.user
        cls.online_users[user] = PongUser(online_sock)
        cls.name_to_user[user.get_username()] = user
    
    @classmethod
    def unregister(cls, online_sock: WebsocketConsumer):
        user: User = online_sock.user
        pu: PongUser = cls.online_users[user]
        if pu.game:
            #TODO: report loser if in game
            pu.game.lose_game(pu.user)
        cls.online_users.pop(user)
        if user.get_username() in cls.name_to_user:
            del(cls.name_to_user[user.get_username()])


    @classmethod
    def start_game(cls, p1: User, p2: User) -> bool:
        pu1 = pong_data.get_pong_user(p1)
        pu2 = pong_data.get_pong_user(p2)
        if pu1 is None or pu2 is None:
            return False
        game = PongGame(p1, p2)
        pu1.game = game
        pu2.game = game
        return True

    @classmethod
    def fight(cls, user: User, opponent: str):
        pu = cls.get_pong_user(user)
        if pu is None:
            return
        pu.wants_to_fight = opponent
        if opponent in cls.name_to_user:
            opp_user: User = cls.name_to_user[opponent]
        else:
            return
        opp_pu = cls.get_pong_user(opp_user)
        if opp_pu is None:
            return
        if opp_pu.wants_to_fight == user.get_username():
            pu.wants_to_fight = None
            opp_pu.wants_to_fight = None
            cls.start_game(user, opp_user)

    @classmethod
    def get_assign_message(cls, user: User) -> str:
        pu = pong_data.get_pong_user(user)
        if pu is None or pu.game is None:
            return ""
        return pu.game.get_player_number(user)
    
    @classmethod
    def start_tournament(cls, l: list[User]):
        tournament: Tournament = Tournament(l)
        for user in l:
            pu = pong_data.get_pong_user(user)
            if pu is not None:
                pu.tournament = tournament

    @classmethod
    def join_matchmaking(cls, user: User):
        if cls.matchmaking_queue is None:
            cls.matchmaking_queue = user
            errprint(user, " joined MM queue")
            #TODO: set status to busy
            return
        if cls.matchmaking_queue == user:
            return
        cls.start_game(cls.matchmaking_queue, user)
        errprint("started game between", user, "and", cls.matchmaking_queue)
        cls.matchmaking_queue = None
