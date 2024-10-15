from django.urls import re_path
from user import consumers

websocket_urlpatterns = [
    re_path(r"ws/user/online_status", consumers.OnlineStatusConsumer.as_asgi()),
]