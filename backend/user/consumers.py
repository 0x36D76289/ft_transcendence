from channels.generic.websocket import WebsocketConsumer
from user.models import User
import json
from typing import Dict
from sys import stderr

from pong.users import online_users, pong_data

class OnlineStatusConsumer(WebsocketConsumer):
    def connect(self):
        self.user: User = self.scope.get("user")
        self.anonymous_connection: bool = self.user.is_anonymous
        if (self.anonymous_connection):
            self.close()
            return
        online_users.register(self.user, self)
        self.accept()
        user = self.scope['user']
        user.is_online = True
        user.save()

    def disconnect(self, code):
        #TODO: unregister
        if (self.anonymous_connection):
            return
        user = self.scope['user']
        user.is_online = False
        user.save()

    def receive(self, text_data: str):
        if text_data == "start":
            l = list(online_users.users)
            print("\\" * 20, file=stderr)
            print("online users rn", l, file=stderr)
            print("tournaments rn", [t.players for t in pong_data.tournaments], file=stderr)
            print("\\" * 20, file=stderr)
            pong_data.start_tournament(l)
