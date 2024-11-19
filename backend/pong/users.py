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

@dataclass
class TournamentPlayer:
    name: str
    bot: bool
    user: User | None

def next_power_of_2(n: int) -> int:
    return 2**(n-1).bit_length()

class Tournament:
    players: list[TournamentPlayer] = []
    rounds: list[list[TournamentPlayer | None]] = []
    current_round = 0

    #INFO: logic only
    round: list[TournamentPlayer | None] = []
    next_round: list[TournamentPlayer | None] = []
    
    def __init__(self, player_list: list[User]):
        for user in player_list:
            self.players.append(TournamentPlayer(user.username, False, user))
        self.fill_rounds()
        self.start_round()
        self.print_rounds()

    def has_user(self, user: User) -> bool:
        return user in [elem.user for elem in self.players]

    def fill_rounds(self) -> None:
        self.rounds.append([self.players[i] if i < len(self.players) else None for i in range(next_power_of_2(len(self.players)))])
        while (len(self.rounds[-1]) > 1):
            self.rounds.append([None for _ in range(len(self.rounds[-1])//2)])

    def is_round_over(self) -> bool:
        for i in range(len(self.next_round)):
            if self.next_round[i] == None:
                if self.round[i * 2] != None and self.round[i * 2 + 1] != None:
                    return False
        return True

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
        online_users.start_match(p1.user, p2.user)
        # TODO: use return value of start_match to advance to next round in case one player is offline but not other

    def start_round(self) -> None:
        self.round = self.rounds[self.current_round]
        self.next_round = self.rounds[self.current_round + 1]
        for i in range(len(self.next_round)):
            name1 = "None"
            name2 = "None"
            if self.round[i * 2]:
                name1 = self.round[i * 2].name
            if self.round[i * 2 + 1]:
                name2 = self.round[i * 2 + 1].name
            errprint("STARTING GAME BETWEEN", name1, name2)
            self.next_round[i] = self.start_game(self.round[i * 2], self.round[i * 2 + 1])
        self.current_round += 1


    def report_winner(self, user: User) -> bool:
        """
        returns True if tournament is over, in which case it should be deleted
        """
        self.print_rounds()
        if self.current_round == len(self.rounds) - 1:
            # end of tournament
            #  TODO:
            #   remove is_busy status from everyone
            #   report tournament
            return True
        for i in range(len(self.round)):
            if self.round[i] and self.round[i].user == user:
                self.next_round[i // 2] = self.round[i]
                break
        if self.is_round_over():
            self.start_round()
        return False

    def print_rounds(self):
        for i, round in enumerate(self.rounds):
            errprint(f"{i}:", " ".join((thing.name if thing else "empty" for thing in round)))
        errprint()

class pong_data():
    rooms: dict[str, list[tuple[int, User]]] = dict()
    users: dict[User, tuple[WebsocketConsumer, str]] = dict()
    tournaments: list[Tournament] = []
    # make rooms
    # store players in room
    # do not delete p1/p2 until everyone left??
    # do not assign spectators??
    # assign to p1/p2 in here
    @classmethod
    def register(cls, sock: WebsocketConsumer, user: User, room: str) -> str:
        if not room in cls.rooms:
            cls.rooms[room] = []
        player_num: int = len(cls.rooms[room]) + 1
        cls.rooms[room].append((player_num, user))
        cls.users[user] = (sock, room)
        if (player_num == 1 or player_num == 2):
            return json.dumps({"type":"player_assign", "value":player_num})
        return ""

    @classmethod
    def delete_room(cls, room_name: str):
        l: list[tuple[int, User]] = cls.rooms[room_name]
        for user in l:
            del(cls.users[user[1]])
        del(cls.rooms[room_name])
    
    @classmethod
    def unregister(cls, user: User) -> None:
        if user not in cls.users:
            return

        room_name = cls.users[user][1]
        room: list[tuple[int, User]] = cls.rooms[room_name]
        player_num: int = 0
        for i in range(len(room)):
            if room[i][1] == user:
                player_num = room[i][1]
        if player_num not in [1, 2]:
            return
        data = {"type": "score", "p1": 0, "p2": 0}
        if player_num == 1:
            data["p2"] = WIN_SCORE
        if player_num == 2:
            data["p1"] = WIN_SCORE
        pong_data.end_game(user, data)

    @classmethod
    def find_tournament(cls, user: User) -> Tournament | None:
        for t in cls.tournaments:
            if t.has_user(user):
                return t

    @classmethod
    def end_game(cls, user: User, score: dict[str, Any]) -> None:
        errprint("END OF GAME WITH", user.name, ":", score)
        room_name: str = cls.users[user][1]
        winner: User | None = None
        if score["p1"] == WIN_SCORE:
            winner = cls.rooms[room_name][1][1]
        elif score["p2"] == WIN_SCORE:
            winner = cls.rooms[room_name][0][1]
        pong_data.delete_room(room_name)
        tourney: Tournament | None = pong_data.find_tournament(winner)
        if tourney:
            tourney.report_winner(winner)

    @classmethod
    def start_tournament(cls, l: list[User]):
        cls.tournaments.append(Tournament(l))

class online_users():
    users: dict[User, WebsocketConsumer] = dict()
    
    @classmethod
    def register(cls, user: User, consumer: WebsocketConsumer) -> None:
        cls.users[user] = consumer

    @classmethod
    def start_match(cls, user1: User, user2: User) -> bool:
        if user1 not in cls.users or user2 not in cls.users:
            return False
        room: str = str(uuid4().hex)
        user1_sock: WebsocketConsumer = cls.users[user1]
        user2_sock: WebsocketConsumer = cls.users[user2]
        user1_sock.send(json.dumps({"type":"game_start", "value": room}))
        user2_sock.send(json.dumps({"type":"game_start", "value": room}))
        return True
