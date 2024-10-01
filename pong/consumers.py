import json
from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer

class ChatConsumer(WebsocketConsumer):
    def connect(self):
        print("+" * 20)
        print("new connection")
        print("self:", dir(self))
        print('channame', self.channel_name)
        print("+" * 20)
        #variable self.scope
        self.room_name = self.scope["url_route"]["kwargs"]["room_name"]
        assign_message = self.assign_message()
        self.accept()
        if assign_message:
            self.send(assign_message)
        async_to_sync(self.channel_layer.group_add)(
            self.room_name,
            self.channel_name,
        )

    def assign_message(self) -> str:
        one = json.dumps({"type":"player_assign", "value":1})
        two = json.dumps({"type":"player_assign", "value":2})
        print("#" * 20)
        if not self.room_name in self.channel_layer.groups:
            return one
        match len(self.channel_layer.groups[self.room_name]):
            case 0:
                return one
            case 1:
                return two
            case _:
                pass
                print(self.channel_layer.groups[self.room_name])
        print("#" * 20)
        return ""

    def disconnect(self, close_code):
        async_to_sync(self.channel_layer.group_discard)(
                self.room_name,
                self.channel_name
            )
        print("+" * 20)
        print("end of connection")
        print("+" * 20)

    # Receive message from WebSocket
    def receive(self, text_data: str):
        #TODO: use json
#        print("+" * 20)
#        print("received " + text_data)
        if text_data == "ping":
#            print("Sent ping")
            self.send("pong")
        else:
#            print("sent to group")
            async_to_sync(self.channel_layer.group_send)(
                self.room_name,
                {
                    "type": "message",
                    "msg": text_data
                }
            )
#        print("+" * 20)

    def message(self, event):
#        print("+" * 20)
#        print(event)
#        print("+" * 20)
        self.send(event["msg"])
