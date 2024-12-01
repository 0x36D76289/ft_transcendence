from django.contrib.auth.models import AnonymousUser
from channels.db import database_sync_to_async
from rest_framework.authtoken.models import Token
from channels.middleware import BaseMiddleware

import sys

@database_sync_to_async
def get_user(token_key):
	try:
		token = Token.objects.get(key=token_key)
		return token.user
	except Token.DoesNotExist:
		return AnonymousUser()

class TokenAuthMiddleware(BaseMiddleware):
	def __init__(self, inner):
		self.inner = inner

	async def __call__(self, scope, receive, send):
		query_string = scope['query_string'].split(b'&')
		for s in query_string:
			if s.startswith(b'token='):
				s = s.decode()
				scope['user'] = await get_user(s[6:])
		return await super().__call__(scope, receive, send)
