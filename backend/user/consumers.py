from channels.generic.websocket import WebsocketConsumer
from user.models import User
from sys import stderr

from pong.users import pong_data

#TODO: check if self.user and user are exactly equivalent
class OnlineStatusConsumer(WebsocketConsumer):
    def connect(self):
        self.user: User = self.scope.get("user")
        self.anonymous_connection: bool = self.user.is_anonymous
        if (self.anonymous_connection):
            self.close()
            return
        pong_data.register(self)
        self.accept()
        user = self.scope['user']
        user.is_online = True
        user.save()

    def disconnect(self, code):
        if (self.anonymous_connection):
            return
        pong_data.unregister(self)
        user = self.scope['user']
        user.is_online = False
        user.save()

    def receive(self, text_data: str):
        if text_data == "start":
            l = list(pong_data.online_users)
            print("\\" * 20, file=stderr)
            print("online users rn", l, file=stderr)
#            print("tournaments rn", [t.players for t in pong_data.tournaments], file=stderr)
            print("\\" * 20, file=stderr)
            pong_data.start_tournament(l)
            # pong_data.start_game(l[0], l[1])
        if text_data == "join_mm":
            pong_data.join_matchmaking(self.user)
