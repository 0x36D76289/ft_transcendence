from django.core.management.base import BaseCommand, CommandError
from user.models import User

class Command(BaseCommand):
	help = 'set up the application'

	def handle(self, *args, **kwargs):
		try:
			user = User.objects.get(username='bot')
		except:
			user = None
		
		if user == None:
			user = User(username='bot', bio='bip bop')
			user.save()

		self.stdout.write(
			self.style.SUCCESS('Setup complete !')
		)