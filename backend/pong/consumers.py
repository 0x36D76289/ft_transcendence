import json
import sys
from asgiref.sync import async_to_sync
from user.models import User
from channels.generic.websocket import WebsocketConsumer
from typing import Dict, List, Tuple

def errprint(*kwargs):
    print(*kwargs, file=sys.stderr)

class pong_data():
    rooms: Dict[str, List[Tuple[int, User]]] = dict()
    users: Dict[User, str] = dict()
    # make rooms
    # store players in room
    # do not delete p1/p2 until everyone left??
    # do not assign spectators??
    # assign to p1/p2 in here
    a = 0
    @classmethod
    def register(cls, user: User, room: str) -> str:
        if not room in cls.rooms:
            cls.rooms[room] = []
        player_num: int = len(cls.rooms[room]) + 1
        cls.rooms[room].append((player_num, user))
        cls.users[user] = room
        if (player_num == 1 or player_num == 2):
            return json.dumps({"type":"player_assign", "value":player_num})
        return ""


class ChatConsumer(WebsocketConsumer):
    def connect(self):
        self.user: User = self.scope.get("user")
        self.anonymous_connection = self.user.is_anonymous
        if (self.anonymous_connection):
            errprint("*" * 20)
            errprint("rejected user")
            errprint("*" * 20)
            self.close()
            return
        self.room_name: str = self.scope["url_route"]["kwargs"]["room_name"]
        assign_message = pong_data.register(self.user, self.room_name)
        self.accept()

        if assign_message:
            self.send(assign_message)
        async_to_sync(self.channel_layer.group_add)(
            self.room_name,
            self.channel_name,
        )

#['DoesNotExist', 'Meta', 'MultipleObjectsReturned', 'REQUIRED_FIELDS', 'USERNAME_FIELD', '__class__', '__delattr__', '__dict__', '__dir__', '__doc__', '__eq__', '__firstlineno__', '__format__', '__ge__', '__getattribute__', '__getstate__', '__gt__', '__hash__', '__init__', '__init_subclass__', '__le__', '__lt__', '__module__', '__ne__', '__new__', '__reduce__', '__reduce_ex__', '__repr__', '__setattr__', '__setstate__', '__sizeof__', '__static_attributes__', '__str__', '__subclasshook__', '__weakref__', '_check_column_name_clashes', '_check_constraints', '_check_db_table_comment', '_check_default_pk', '_check_field_name_clashes', '_check_fields', '_check_id_field', '_check_indexes', '_check_local_fields', '_check_long_column_names', '_check_m2m_through_same_relationship', '_check_managers', '_check_model', '_check_model_name_db_lookup_clashes', '_check_ordering', '_check_property_name_related_field_accessor_clashes', '_check_single_primary_key', '_check_swappable', '_check_unique_together', '_do_insert', '_do_update', '_get_FIELD_display', '_get_expr_references', '_get_field_expression_map', '_get_next_or_previous_by_FIELD', '_get_next_or_previous_in_order', '_get_pk_val', '_get_session_auth_hash', '_get_unique_checks', '_meta', '_parse_params', '_password', '_perform_date_checks', '_perform_unique_checks', '_prepare_related_fields_for_save', '_save_parents', '_save_table', '_set_pk_val', '_state', '_validate_force_insert', 'acheck_password', 'adelete', 'arefresh_from_db', 'asave', 'auth_token', 'bio', 'check', 'check_password', 'clean', 'clean_fields', 'conv_initiator', 'conv_participant', 'date_error_message', 'date_joined', 'delete', 'from_db', 'full_clean', 'get_constraints', 'get_deferred_fields', 'get_email_field_name', 'get_next_by_date_joined', 'get_previous_by_date_joined', 'get_session_auth_fallback_hash', 'get_session_auth_hash', 'get_username', 'has_usable_password', 'id', 'is_active', 'is_anonymous', 'is_authenticated', 'is_guest', 'is_online', 'last_login', 'logentry_set', 'login_42', 'message_sender', 'natural_key', 'normalize_username', 'objects', 'p1', 'p2', 'password', 'pfp', 'pk', 'prepare_database_save', 'refresh_from_db', 'save', 'save_base', 'serializable_value', 'set_password', 'set_unusable_password', 'unique_error_message', 'user_block_uid1', 'user_block_uid2', 'user_friend_uid1', 'user_friend_uid2', 'username', 'validate_constraints', 'validate_unique']
        errprint("+" * 20)
        errprint("new connection")
        errprint("self:", self)
        errprint('channame', self.channel_name)
        errprint(self.user)
        errprint(dir(self.user))
        errprint("+" * 20)

    def assign_message(self) -> str:
        one = json.dumps({"type":"player_assign", "value":1})
        two = json.dumps({"type":"player_assign", "value":2})
        #print("#" * 20)
        #if not self.room_name in self.channel_layer.groups:
        #    return one
        #match len(self.channel_layer.groups[self.room_name]):
        #    case 0:
        #        return one
        return one
        #    case 1:
        #        return two
        #    case _:
        #        pass
        #        print(self.channel_layer.groups[self.room_name])
        #print("#" * 20)
        return ""

    def disconnect(self, close_code):
        if (self.anonymous_connection):
            return
        async_to_sync(self.channel_layer.group_discard)(
                self.room_name,
                self.channel_name
            )
        errprint("+" * 20)
        errprint("end of connection")
        errprint("+" * 20)

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
