from channels.generic.websocket import WebsocketConsumer
from pong.tournament_player import TournamentBot, TournamentPlayer
from user.models import User
from sys import stderr

from pong.users import errprint, pong_data

#TODO: check if self.user and user are exactly equivalent
class OnlineStatusConsumer(WebsocketConsumer):
    user: User
    anonymous_connection: bool
    def connect(self):
        self.user: User = self.scope.get("user")
        self.anonymous_connection: bool = self.user.is_anonymous
        if (self.anonymous_connection):
            self.close()
            return
        self.accept()
        pong_data.register(self)
        user = User.objects.get(id=self.scope['user'].id)
        user.is_online = True
        user.save()
        self.send('{"type":"online-state"}')

    def disconnect(self, code):
        if (self.anonymous_connection):
            return
        pong_data.unregister(self)
        user = User.objects.get(id=self.scope['user'].id)
        user.is_online = False
        user.save()

    def receive(self, text_data: str):
        errprint(text_data)
        #HACK: testing | not real feature
        if text_data == "ping":
            self.send('{"type":"pong"}')
        elif text_data == "start":
            l: list[User | TournamentPlayer] = list(pong_data.online_users)
            l.append(TournamentBot("kendrick"))
            l.append(TournamentBot("drake"))
            l.append(TournamentBot("cole"))
            print("\\" * 20, file=stderr)
            print("online users rn", l, file=stderr)
#            print("tournaments rn", [t.players for t in pong_data.tournaments], file=stderr)
            print("\\" * 20, file=stderr)
            pong_data.start_tournament(l)
            # pong_data.start_game(l[0], l[1])
        elif text_data == "join_mm":
            pong_data.join_matchmaking(self.user)
        elif text_data.startswith("fight "):
            pong_data.fight(self.user, text_data[6:])
        #HACK: testing | not real feature
        elif text_data == "BOTGAME":
            pong_data.start_bot_game(self.user)
