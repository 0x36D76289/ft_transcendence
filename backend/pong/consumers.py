import json
import sys
from asgiref.sync import async_to_sync
from user.models import User
from channels.generic.websocket import WebsocketConsumer
from pong.users import pong_data
from typing import Any

def errprint(*kwargs):
    print(*kwargs, file=sys.stderr)

class ChatConsumer(WebsocketConsumer):
    user: User
    bot_game: bool
    is_closed: bool
    anonymous_connection: bool
    room_name: str

    def connect(self):
        self.bot_game = False
        self.user: User = self.scope.get("user")
        self.is_closed = False
        self.anonymous_connection: bool = self.user.is_anonymous
        if (self.anonymous_connection):
            self.close()
            return
        self.room_name: str = self.scope["url_route"]["kwargs"]["room_name"]
        if (self.room_name == "test"):
            self.anonymous_connection = True
            self.close()
            return
        if self.room_name == "bot":
            self.accept()
            self.bot_game = True
            pong_data.set_fighting_bot(self.user)
            return
        self.accept()
        assign_message = pong_data.get_assign_message(self.user)

        if assign_message:
            self.send(assign_message)
        async_to_sync(self.channel_layer.group_add)(
            self.room_name,
            self.channel_name,
        )

    def disconnect(self, close_code):
        if self.is_closed:
            return
        self.is_closed = True
        if self.bot_game:
            # TODO: lose by default
            return
        if (self.anonymous_connection):
            return
        #TODO: if in game: win for other player
        # set state when game over normally for disconnect to be handled
        # make function for disconnect in pong_data that calls lose game if in game
        async_to_sync(self.channel_layer.group_discard)(
                self.room_name,
                self.channel_name
            )

    # Receive message from WebSocket
    def receive(self, text_data: str):
        if self.bot_game:
            if text_data == "win":
                pong_data.win_bot(self.user)
            elif text_data == "lose":
                pong_data.lose_bot(self.user)
            return
        # errprint("+" * 20)
        # errprint("received " + text_data)
        # errprint("+" * 20)
        try:
            data: dict[str, Any] = json.loads(text_data)
            if "type" in data and data["type"] == "score" and "p1" in data and "p2" in data:
                #TODO: send to report_score
                pu = pong_data.get_pong_user(self.user)
                if pu and pu.game:
                    pu.game.report_score(data)
                errprint()
        except:
            pass
        async_to_sync(self.channel_layer.group_send)(
            self.room_name,
            {
                "type": "message",
                "msg": text_data
            }
        )

    def message(self, event):
        if self.is_closed:
            return
        # print("+" * 20)
        # print(event)
        # print("+" * 20)
        try:
            self.send(event["msg"])
        except:
            pass
