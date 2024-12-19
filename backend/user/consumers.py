from channels.generic.websocket import WebsocketConsumer
from pong.tournament_player import TournamentBot, TournamentPlayer
from user.models import User

from pong.users import errprint, pong_data


class OnlineStatusConsumer(WebsocketConsumer):
    user: User
    anonymous_connection: bool

    def connect(self):
        self.user: User = self.scope.get("user")
        self.anonymous_connection: bool = self.user.is_anonymous
        if self.anonymous_connection:
            self.close()
            return
        self.accept()
        pong_data.register(self)
        user = User.objects.get(id=self.scope["user"].id)
        user.is_online = True
        user.save()
        self.send('{"type":"online-state"}')

    def disconnect(self, code):
        if self.anonymous_connection:
            return
        pong_data.unregister(self)
        user = User.objects.get(id=self.scope["user"].id)
        user.is_online = False
        user.save()

    def receive(self, text_data: str):
        errprint(text_data)
        if text_data == "ping":
            self.send('{"type":"pong"}')
        elif text_data == "join_mm":
            pong_data.join_matchmaking(self.user)
        elif text_data.startswith("fight "):
            pong_data.fight(self.user, text_data[6:])
        elif text_data.startswith("invite "):
            pong_data.invite_to_tournament(self.user, text_data[7:])
        elif text_data.startswith("accept "):
            pong_data.accept_tournament_invite(self.user, text_data[7:])
        elif text_data.startswith("reject "):
            pong_data.reject_tournament_invite(self.user, text_data[7:])
        elif text_data.startswith("start "):
            pong_data.start_tournament_text(self.user, text_data[6:])
