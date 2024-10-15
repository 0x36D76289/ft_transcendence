import os

from channels.routing import ProtocolTypeRouter, URLRouter
from channels.security.websocket import AllowedHostsOriginValidator
from django.core.asgi import get_asgi_application

django_asgi_app = get_asgi_application()

import chat.routing, user.routing
from ft_transcendence.tokenauth_middleware import TokenAuthMiddleware

application = ProtocolTypeRouter(
	{
		"http": django_asgi_app,
		"websocket": AllowedHostsOriginValidator(
			TokenAuthMiddleware(URLRouter(
				chat.routing.websocket_urlpatterns + user.routing.websocket_urlpatterns
			))
		)
	}
)
