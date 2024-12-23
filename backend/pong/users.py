from datetime import datetime
from typing import Any

from django.db.models import Count
from channels.generic.websocket import WebsocketConsumer
from chat.models import Conversation, Message
from pong.models import Game
from user.models import User
from uuid import uuid4
from random import randint
import sys
import json
from pong.tournament_player import TournamentPlayer, TournamentBot, TournamentUser

WIN_SCORE = 10


def errprint(*kwargs):
    print(*kwargs, file=sys.stderr)


class PongGame:
    # DATA
    p1: User
    p2: User
    spectators: list[User]
    room_name: str
    start_time: datetime

    # methods
    def __init__(self, p1: User, p2: User):
        self.p1 = p1
        self.p2 = p2
        self.room_name: str = str(uuid4().hex)
        pu1 = pong_data.get_pong_user(p1)
        pu2 = pong_data.get_pong_user(p2)
        self.spectators = []
        self.start_time = datetime.now()
        if not pu1 or not pu2:
            return
        pu1.send("game_start", self.room_name)
        pu2.send("game_start", self.room_name)
        pu1.busy = True
        pu2.busy = True

    def disconnect_user(self, user: User):
        pu = pong_data.get_pong_user(user)
        if pu is None:
            return
        try:
            if pu.pong_socket:
                pu.pong_socket.send('{"type":"end"}')
                pu.pong_socket.close()
        except:
            pass
        pu.pong_socket = None
        pu.game = None
        if pu.tournament is None:
            pu.busy = False

    def lose_game(self, loser: User, data: dict[str, Any] | None = None):
        if loser != self.p1 and loser != self.p2:
            return
        if data is None:
            if loser == self.p2:
                data = {"p1": WIN_SCORE, "p2": 0}
            else:
                data = {"p1": 0, "p2": WIN_SCORE}
        Game(
            p1=self.p1,
            p2=self.p2,
            p1_score=data["p1"],
            p2_score=data["p2"],
            time_start=self.start_time,
            time_end=datetime.now(),
        ).save()
        self.close()
        pu = pong_data.get_pong_user(loser)
        if pu is None:
            return
        if pu.tournament:
            pu.tournament.report_game(loser, False)

    def report_score(self, data: dict[str, Any]):
        if data["p1"] == WIN_SCORE:
            self.lose_game(self.p2, data)
        elif data["p2"] == WIN_SCORE:
            self.lose_game(self.p1, data)

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
        return json.dumps({"type": "player_assign", "value": number})


def next_power_of_2(n: int) -> int:
    return 2 ** (n - 1).bit_length()


def get_TP_name(tp: TournamentPlayer | None) -> str:
    if tp is None:
        return "None"
    return tp.name


class Tournament:
    players: list[TournamentPlayer]
    rounds: list[list[TournamentPlayer | None]]
    current_round_index: int

    _ongoing_round: list[TournamentPlayer | None]
    _next_round: list[TournamentPlayer | None]

    def __init__(self, player_list: list[User | TournamentPlayer]):
        self.players = []
        for user in player_list:
            if type(user) is User:
                user = TournamentUser(user)
            if isinstance(user, TournamentPlayer):
                # INFO: above always true but here for type checker
                if user.bot == False:
                    pu = pong_data.get_pong_user(user.user)
                    if pu is None:
                        continue
                    if pu.busy:
                        continue
                    pu.tournament = self
                    pu.busy = True
                self.players.append(user)
        if len(self.players) < 2:
            for player in self.players:
                self.remove_player(player)
            return
        self.fill_rounds()
        self.current_round_index = 0
        self._next_round = []
        self.start_round()

    def fill_rounds(self) -> None:
        self.rounds = []
        self.rounds.append(
            [
                self.players[i] if i < len(self.players) else None
                for i in range(next_power_of_2(len(self.players)))
            ]
        )
        while len(self.rounds[-1]) > 1:
            self.rounds.append([None for _ in range(len(self.rounds[-1]) // 2)])

    def start_game(
        self, p1: TournamentPlayer | None, p2: TournamentPlayer | None
    ) -> TournamentPlayer | None:
        if p1 is None:
            return p2
        if p2 is None:
            return p1
        if p1.bot == True and p2.bot == True:
            if randint(0, 1):
                return p2
            return p1
        if p1.bot == True:
            if p2.bot == False:  # INFO: always true but here for type check
                pong_data.start_bot_game(p2.user)
            return None
        if p2.bot == True:
            pong_data.start_bot_game(p1.user)
            return None
        if pong_data.start_game(p1.user, p2.user):
            # if game started correctly
            return None
        # if game couldn't start give win to online user or random if both disappeared
        pu1 = pong_data.get_pong_user(p1.user)
        pu2 = pong_data.get_pong_user(p2.user)
        if pu1:
            return p1
        elif pu2:
            return p2
        if randint(0, 1):
            return p2
        return p1

    def remove_player(self, player: TournamentPlayer | None) -> None:
        if player is None:
            return
        self.players.remove(player)
        if player.bot == True:
            return
        pu = pong_data.get_pong_user(player.user)
        if pu is None:
            return
        pu.tournament = None
        pu.busy = False

    def start_round(self) -> bool:
        if len(self._next_round) == 1:
            if self._next_round[0]:
                self.remove_player(self._next_round[0])
            #  FEAT:
            #   report tournament?
            while self.players:
                self.remove_player(self.players[0])
            errprint("TOURNAMENT OVER, users left: " + str(self.players))
            self.players = []
            self.print_rounds()
            return True
        self._ongoing_round = self.rounds[self.current_round_index]
        self._next_round = self.rounds[self.current_round_index + 1]
        for i in range(len(self._next_round)):
            p1 = self._ongoing_round[i * 2]
            p2 = self._ongoing_round[i * 2 + 1]
            # name1 = get_TP_name(p1)
            # name2 = get_TP_name(p2)
            # errprint("STARTING GAME BETWEEN", name1, name2)
            self._next_round[i] = self.start_game(p1, p2)
            if p1 is None or p2 is None:
                if p2 is None:
                    self.warn_winner(i, 0)
                else:
                    self.warn_winner(i, 1)
        self.current_round_index += 1
        if self.is_round_over():
            return self.start_round()
        return False

    def is_round_over(self) -> bool:
        for i in range(len(self._next_round)):
            if self._next_round[i] == None:
                if (
                    self._ongoing_round[i * 2] != None
                    and self._ongoing_round[i * 2 + 1] != None
                ):
                    return False
        return True

    def find_round(self, user: User) -> tuple[int, int]:
        for i in range(len(self._next_round)):
            player = self._ongoing_round[i * 2]
            if player is not None and player.user == user:
                return (i, 0)
            player = self._ongoing_round[i * 2 + 1]
            if player is not None and player.user == user:
                return (i, 1)
        return -1, 0

    def warn_winner(self, round_number, winner):
        # if self.is_round_over():
        #     return
        winner_tournament_user: TournamentPlayer | None = self._ongoing_round[
            round_number * 2 + winner
        ]
        if not isinstance(winner_tournament_user, TournamentUser):
            return
        pu = pong_data.get_pong_user(winner_tournament_user.user)
        if not pu:
            return
        opp_round_num = round_number
        if round_number % 2:
            opp_round_num -= 1
        else:
            opp_round_num += 1
        message = "next up: fighting "
        if self._next_round[opp_round_num]:
            message += get_TP_name(self._next_round[opp_round_num])
        else:
            message += (
                "the winner of "
                + get_TP_name(self._ongoing_round[opp_round_num * 2])
                + " vs "
                + get_TP_name(self._ongoing_round[opp_round_num * 2 + 1])
            )
        pu.chatsend(message)

    def report_game(self, user: User, user_is_winner: bool) -> bool:
        """
        returns True if tournament is over, in which case it should be deleted
        """
        self.print_rounds()
        round_number, winner = self.find_round(user)
        if round_number == -1:
            return False
        if not user_is_winner:
            winner = 1 - winner
        loser = 1 - winner
        self._next_round[round_number] = self._ongoing_round[2 * round_number + winner]
        self.remove_player(self._ongoing_round[2 * round_number + loser])
        self.warn_winner(round_number, winner)

        if self.is_round_over():
            return self.start_round()
        return False

    def print_rounds(self):
        for i, round in enumerate(self.rounds):
            errprint(
                f"{i}:", " ".join((thing.name if thing else "empty" for thing in round))
            )
        errprint()


class PongUser:
    user: User
    online_socket: WebsocketConsumer
    is_in_bot_game: bool
    game: PongGame | None
    pong_socket: WebsocketConsumer | None
    tournament: Tournament | None
    wants_to_fight: str | None
    busy: bool
    invited_tournement_users: set[str]
    accepted_tournament_invites: set[str]
    system_chat: Conversation

    def __init__(self, online_sock: WebsocketConsumer):
        self.user = online_sock.user
        self.online_socket = online_sock
        self.game = None
        self.pong_socket = None
        self.tournament = None
        self.wants_to_fight = None
        self.busy = False
        self.invited_tournement_users = set()
        self.accepted_tournament_invites = set()
        conversation = (
            Conversation.objects.annotate(n_users=Count("participants"))
            .filter(n_users=2)
            .filter(participants=self.user)
            .filter(participants=pong_data.SYSTEM)
        )
        if conversation.exists():
            conversation = conversation[0]
        else:
            conversation = Conversation()
            conversation.save()
            conversation.participants.add(pong_data.SYSTEM, self.user)
        self.system_chat = conversation

    def send(self, message_type: str, content: Any) -> None:
        self.online_socket.send(json.dumps({"type": message_type, "value": content}))
        pass

    def chatsend(self, message_content: str):
        _message = Message.objects.create(
            sender=pong_data.SYSTEM,
            content=message_content,
            conversation_id=self.system_chat,
        )
        pong_data.message_notify(self.user)


class pong_data:
    BOT: User = None
    SYSTEM: User = None
    appstart = False
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
        if cls.appstart == False:
            cls.BOT = User.objects.get(username="bot")
            cls.SYSTEM = User.objects.get(username="system")
            cls.appstart = True
        user: User = online_sock.user
        cls.online_users[user] = PongUser(online_sock)
        cls.name_to_user[user.get_username()] = user

    @classmethod
    def unregister(cls, online_sock: WebsocketConsumer):
        user: User = online_sock.user
        if cls.matchmaking_queue == user:
            cls.matchmaking_queue = None
        pu = cls.get_pong_user(user)
        if pu:
            if pu.game:
                pu.game.lose_game(pu.user)
            cls.online_users.pop(user)
        if user.get_username() in cls.name_to_user:
            del cls.name_to_user[user.get_username()]

    @classmethod
    def start_game(cls, p1: User, p2: User) -> bool:
        """
        returns False if game couldn't start else True
        """
        pu1 = pong_data.get_pong_user(p1)
        pu2 = pong_data.get_pong_user(p2)
        if pu1 is None or pu2 is None:
            return False
        game = PongGame(p1, p2)
        pu1.game = game
        pu2.game = game
        return True

    @classmethod
    def start_bot_game(cls, user: User):
        pu = cls.get_pong_user(user)
        if pu is None:
            return
        pu.busy = True
        pu.send("game_start", "bot")

    @classmethod
    def fight(cls, user: User, opponent: str):
        if user.get_username() == opponent:
            return
        pu = cls.get_pong_user(user)
        if pu is None:
            return
        if pu.busy:
            pu.send("notify-error", "notifications.fight.self-busy")
            return
        if pu.wants_to_fight == opponent:
            pu.send(
                "notify",
                "notifications.fight.invite.cancel.pre "
                + opponent
                + " notifications.fight.invite.cancel.post",
            )
            pu.wants_to_fight = None
            return

        def offline():
            pu.send(
                "notify-error",
                "notifications.fight.other-offline.pre "
                + opponent
                + " notifications.fight.other-offline.post",
            )

        if opponent in cls.name_to_user:
            opp_user: User = cls.name_to_user[opponent]
        else:
            offline()
            return
        opp_pu = cls.get_pong_user(opp_user)
        if opp_pu is None:
            offline()
            return

        if opp_pu.wants_to_fight == user.get_username():
            if opp_pu.busy:
                pu.send(
                    "notify-error",
                    "notifications.fight.other-busy.pre "
                    + opponent
                    + " notifications.fight.other-busy.post",
                )
            else:
                pong_data.start_game(user, opp_user)
            pu.wants_to_fight = None
            opp_pu.wants_to_fight = None
            return

        pu.wants_to_fight = opponent
        pu.send(
            "notify-success",
            "notifications.fight.invite.send.pre "
            + opponent
            + " notifications.fight.invite.send.post",
        )
        opp_pu.send("game-invite", user.get_username())
        return

    @classmethod
    def invite_to_tournament(cls, user: User, invited: str):
        pu = cls.get_pong_user(user)
        if pu is None:
            return
        if invited in pu.invited_tournement_users:
            return

        def offline():
            pu.send(
                "notify-error",
                "notifications.tournament.other-offline.pre "
                + invited
                + " notifications.tournament.other-offline.post",
            )
            pu.send("invite-reject", invited)

        if invited in cls.name_to_user:
            invited_user = cls.name_to_user[invited]
        else:
            offline()
            return
        invited_pu = cls.get_pong_user(invited_user)
        if invited_pu == None:
            offline()
            return

        pu.invited_tournement_users.add(invited)
        invited_pu.send("tournament-invite", user.get_username())
        pu.send(
            "notify",
            "notifications.tournament.send-invite.pre "
            + invited
            + " notifications.tournament.send-invite.post",
        )

    @classmethod
    def accept_tournament_invite(cls, user: User, inviter: str):
        pu = cls.get_pong_user(user)
        if pu is None:
            return
        if inviter in cls.name_to_user:
            inviter_user = cls.name_to_user[inviter]
        else:
            return
        inviter_pu = cls.get_pong_user(inviter_user)
        if inviter_pu == None:
            return
        if user.get_username() not in inviter_pu.invited_tournement_users:
            return
        pu.accepted_tournament_invites.add(inviter)
        inviter_pu.send("invite-accept", user.get_username())

    @classmethod
    def start_tournament_text(cls, user: User, invitelist: str):
        if invitelist == "[]":
            return
        tournament_list: list[TournamentPlayer] = []
        user_pu = cls.get_pong_user(user)
        if user_pu is None:
            return
        if user_pu.busy:
            return
        username: str = user.get_username()
        decoded: list
        try:
            decoded = json.loads(invitelist)
        except:
            errprint("couldn't decode invitelist:", invitelist)
            return

        def add_user(user: tuple[str, bool]):
            for player in tournament_list:
                if player.name == user[0]:
                    return
            if user[1]:
                # if is bot
                if user[0] != username:
                    tournament_list.append(TournamentBot(user[0]))
                return
            # if player
            if user[0] not in cls.name_to_user:
                return
            user_user = cls.name_to_user[user[0]]
            user_pu = cls.get_pong_user(user_user)
            if user_pu is None:
                return
            if not username in user_pu.accepted_tournament_invites:
                return
            user_pu.accepted_tournament_invites.clear()
            tournament_list.append(TournamentUser(user_user))

        if not type(decoded) == list:
            return
        for elem in decoded:
            if (
                type(elem) != list
                or len(elem) != 2
                or type(elem[0]) != str
                or type(elem[1]) != bool
            ):
                return
            add_user(elem)
        if username not in [player.name for player in tournament_list]:
            tournament_list.append(user)
        user_pu.invited_tournement_users.clear()
        cls.start_tournament(tournament_list)

    @classmethod
    def reject_tournament_invite(cls, user: User, inviter: str):
        pu = cls.get_pong_user(user)
        if pu is None:
            return
        if inviter in cls.name_to_user:
            inviter_user = cls.name_to_user[inviter]
        else:
            return
        inviter_pu = cls.get_pong_user(inviter_user)
        if inviter_pu == None:
            return
        if user.get_username() not in inviter_pu.invited_tournement_users:
            return
        inviter_pu.send("invite-reject", user.get_username())

    @classmethod
    def set_fighting_bot(cls, user: User):
        pu = cls.get_pong_user(user)
        if pu is None:
            return
        pu.is_in_bot_game = True

    @classmethod
    def save_score(cls, user: User, data: str):
        try:
            datadict = json.loads(data.lstrip("win lose"))
            g = Game(
                p1=user,
                p2=pong_data.BOT,
                p1_score=datadict["p1"],
                p2_score=datadict["p2"],
                time_start=datetime.fromtimestamp(datadict["start"] / 1000),
                time_end=datetime.fromtimestamp(datadict["end"] / 1000),
            )
            g.save()
        except:
            errprint("data is", data)

    @classmethod
    def win_bot(cls, user: User, data: str):
        pu = cls.get_pong_user(user)
        if pu is None:
            return
        if not pu.is_in_bot_game:
            return
        if pu.tournament:
            pu.tournament.report_game(user, True)
        pu.is_in_bot_game = False
        cls.save_score(user, data)

    @classmethod
    def lose_bot(cls, user: User, data: str):
        pu = cls.get_pong_user(user)
        if pu is None:
            return
        if not pu.is_in_bot_game:
            return
        pu.is_in_bot_game = False
        if pu.tournament:
            pu.tournament.report_game(user, False)
        cls.save_score(user, data)

    @classmethod
    def get_assign_message(cls, user: User) -> str:
        pu = pong_data.get_pong_user(user)
        if pu is None or pu.game is None:
            return ""
        return pu.game.get_player_number(user)

    @classmethod
    def start_tournament(cls, l: list[User | TournamentPlayer]):
        Tournament(l)

    @classmethod
    def join_matchmaking(cls, user: User):
        pu = pong_data.get_pong_user(user)
        if pu is None:
            return
        if cls.matchmaking_queue == user:
            cls.matchmaking_queue = None
            pu.busy = False
            pu.send("mm", "left")
            return
        if pu.busy:
            return
        pu.busy = True
        if cls.matchmaking_queue is None:
            cls.matchmaking_queue = user
            pu.send("mm", "join")
            return
        cls.start_game(cls.matchmaking_queue, user)
        cls.matchmaking_queue = None

    @classmethod
    def message_notify(cls, user: User):
        pu = pong_data.get_pong_user(user)
        if pu is None:
            return
        pu.send("notify", "notifications.message")
