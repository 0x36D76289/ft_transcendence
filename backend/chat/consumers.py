import base64
import json
import secrets
from datetime import datetime

from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer
from django.core.files.base import ContentFile

from user.models import User
from chat.models import Message, Conversation
from chat.serializers import MessageSerializer

from sys import stderr


class ChatConsumer(WebsocketConsumer):
    def connect(self):
        print("CONNECTING TO SOCKET", file=stderr)
        self.room_name = self.scope["url_route"]["kwargs"]["room_name"]
        self.room_group_name = f"chat_{self.room_name}"
        sender = self.scope.get("user")

        try:
            print("on est la", file=stderr)
            print([obj for obj in Conversation.objects.all()], file=stderr)
            conversation = Conversation.objects.get(id=int(self.room_name))
            print("on est la 2", file=stderr)
            sender = self.scope["user"]
            print(sender.username, file=stderr)
            print(conversation.participants.all(), file=stderr)
            if sender not in conversation.participants.all():
                print("user not in conv", file=stderr)
                raise Exception()
        except Exception as e:
            print("found error", e, file=stderr)
            self.close()
            return

        # Join room group
        async_to_sync(self.channel_layer.group_add)(
            self.room_group_name, self.channel_name
        )
        self.accept()

    def disconnect(self, close_code):
        # Leave room group
        async_to_sync(self.channel_layer.group_discard)(
            self.room_group_name, self.channel_name
        )

    # Receive message from WebSocket
    def receive(self, text_data=None, bytes_data=None):
        # parse the json data into dictionary object
        text_data_json = json.loads(text_data)
        message = text_data_json["message"]

        conversation = Conversation.objects.get(id=int(self.room_name))
        sender = self.scope["user"]

        _message = Message.objects.create(
            sender=sender, content=message, conversation_id=conversation
        )
        # Send message to room group
        chat_type = {"type": "chat_message"}
        message_serializer = dict(MessageSerializer(instance=_message).data)
        return_dict = {**chat_type, **message_serializer}
        async_to_sync(self.channel_layer.group_send)(
            self.room_group_name,
            return_dict,
        )

    # Receive message from room group
    def chat_message(self, event):
        dict_to_be_sent = event.copy()
        dict_to_be_sent.pop("type")

        # Send message to WebSocket
        self.send(text_data=json.dumps(dict_to_be_sent))
