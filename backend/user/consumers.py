from channels.generic.websocket import WebsocketConsumer
from user.models import User

class OnlineStatusConsumer(WebsocketConsumer):
	def connect(self):
		self.accept()
		user = self.scope['user']
		user.is_online = True
		user.save()

	def disconnect(self, code):
		user = self.scope['user']
		user.is_online = False
		user.is_in_game = False
		user.is_in_tournament = False
		user.save()