from django.urls import re_path
import chat.consumers
import pong.consumers

websocket_urlpatterns = [
        re_path(r'ws/chat/(?P<room_name>\w+)/$', chat.consumers.ChatConsumer.as_asgi()),
        re_path(r'ws/pong/(?P<room_name>\w+)/$', pong.consumers.ChatConsumer.as_asgi()),
]
