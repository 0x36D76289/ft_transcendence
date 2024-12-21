from django.core.management.base import BaseCommand, CommandError
from pong.users import pong_data
from user.models import User


def create_user(name: str, bio: str):
    try:
        user = User.objects.get(username=name)
    except:
        user = None

    if user == None:
        user = User(username=name, bio=bio)
        user.save()
    return user


class Command(BaseCommand):
    help = "set up the application"

    def handle(self, *args, **kwargs):
        create_user("bot", "bip bop")
        create_user("system", "sys_message")

        self.stdout.write(self.style.SUCCESS("Setup complete !"))
