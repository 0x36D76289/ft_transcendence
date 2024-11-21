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
    def connect(self):
        self.user: User = self.scope.get("user")
        self.is_closed = False
        self.anonymous_connection: bool = self.user.is_anonymous
        if (self.anonymous_connection):
            errprint("*" * 20)
            errprint("rejected user")
            errprint("*" * 20)
            self.close()
            return
        self.room_name: str = self.scope["url_route"]["kwargs"]["room_name"]
        if (self.room_name == "test"):
            self.anonymous_connection = True
            self.close()
            return
        assign_message = pong_data.get_assign_message(self.user)
        self.accept()

        if assign_message:
            self.send(assign_message)
        async_to_sync(self.channel_layer.group_add)(
            self.room_name,
            self.channel_name,
        )

        errprint("+" * 20)
        errprint("new connection")
        errprint("self:", self)
        errprint('channame', self.channel_name)
        errprint("assign_message '", assign_message, "'")
        errprint(self.user)
        errprint("+" * 20)

    def disconnect(self, close_code):
        if self.is_closed:
            return
        self.is_closed = True
        if (self.anonymous_connection):
            return
        #TODO: if in game: win for other player
        # set state when game over normally for disconnect to be handled
        errprint(self.user)
        errprint(dir(self.user))
        errprint("+" * 20)
        async_to_sync(self.channel_layer.group_discard)(
                self.room_name,
                self.channel_name
            )
        errprint("+" * 20)
        errprint("end of connection")
        errprint("+" * 20)

    # Receive message from WebSocket
    def receive(self, text_data: str):
        # print("+" * 20)
        # print("received " + text_data)
        # print("+" * 20)
        if text_data == "ping":
#            print("Sent ping")
            self.send("pong")
            return
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
#        print("+" * 20)

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
