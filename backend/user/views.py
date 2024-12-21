from pong.users import pong_data
from rest_framework.decorators import (
    api_view,
    permission_classes,
    authentication_classes,
    parser_classes,
)
from rest_framework.response import Response
from user.serializers import UserSerializer, UserFriendListSerializer
from rest_framework import status
from rest_framework.authtoken.models import Token
from user.models import User, UserFriend
from django.shortcuts import get_object_or_404
from django.utils.timezone import now
from django.db.models import Q, F
from game.models import Game
import requests
from os import getenv
from ft_transcendence.utils import clean_serializer_errors
from django.core.files import File
from urllib.request import urlopen
from tempfile import NamedTemporaryFile


# USER
@api_view(["POST"])
@authentication_classes([])
@permission_classes([])
def login(request):
    try:
        user = User.objects.get(username=request.data.get("username"))
    except:
        user = None
    if not user or not user.check_password(request.data.get("password")):
        return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)
    token, created = Token.objects.get_or_create(user=user)
    user.last_login = now()
    user.save()
    return Response(
        {
            "token": token.key,
            "username": user.username,
            "detail": "Successfuly logged in!",
        }
    )


@api_view(["POST"])
@authentication_classes([])
@permission_classes([])
def register(request):
    guest = None
    if request.data.get("token"):
        try:
            guest = Token.objects.get(key=request.data["token"]).user
        except:
            return Response(
                {"detail": "Token is not valid"}, status=status.HTTP_404_NOT_FOUND
            )
        if not guest.is_guest:
            return Response(
                {"detail": "Token corresponds to a non guest user"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        if not request.data.get("password"):
            return Response(
                {"detail": "You must include a password"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        serializer = UserSerializer(guest, data=request.data)
    else:
        serializer = UserSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(
            {"detail": clean_serializer_errors(serializer.errors)},
            status=status.HTTP_400_BAD_REQUEST,
        )
    serializer.save(password=request.data.get("password"))
    if guest:
        guest.is_guest = False
        guest.save()
    return Response(
        {"detail": "Account created", "username": serializer.data["username"]}
    )


@api_view(["POST"])
def logout(request):
    user = request.user
    token = Token.objects.get(user=user)
    token.delete()
    if user.is_guest:
        user.delete()
        return Response({"detail": "Logged out and removed guest account!"})
    user.save()
    return Response({"detail": "Logged out!"})


from sys import stderr


def get_42_login(request):
    if not request.data.get("code"):
        return Response(
            {"detail": "json field 'code' is missing"},
            status=status.HTTP_400_BAD_REQUEST,
        )
    data = {
        "code": request.data["code"],
        "client_id": "u-s4t2ud-2e658ba79c415d6104fcd1079864d68a3da2c86f054d28f7c5205c8d4abc1080",
        "client_secret": getenv("API_SECRET_42"),
        "grant_type": "authorization_code",
        "redirect_uri": "https://localhost:8443/42auth",
    }
    request_token = requests.post("https://api.intra.42.fr/oauth/token", data=data)
    json = request_token.json()
    if not json.get("access_token"):
        return Response(
            {"detail": "couldnt get access token"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )
    request_info_user = requests.get(
        "https://api.intra.42.fr/v2/me",
        headers={"Authorization": f"Bearer {json['access_token']}"},
    )
    if request_info_user.status_code != 200:
        return Response(
            {"detail": "couldnt get 42 user informations"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )
    return request_info_user.json()


@api_view(["POST"])
@authentication_classes([])
@permission_classes([])
def login_with_42(request):
    json = get_42_login(request)
    if type(json) == Response:
        return json

    try:
        user = User.objects.get(login_42=json.get("login"))
    except:
        user = None

    if user:
        token, created = Token.objects.get_or_create(user=user)
        user.last_login = now()
        user.save()
        return Response(
            {
                "token": token.key,
                "username": user.username,
                "detail": "Successfuly logged in!",
            }
        )
    else:
        user = User.objects.create()
        if User.objects.filter(username=json.get("login")).exists():
            user.username = f"42_{json.get('login')}"
        else:
            user.username = json.get("login")
        user.login_42 = json.get("login")
        user.last_login = now()
        img_temp = NamedTemporaryFile(delete=True)
        img_temp.write(urlopen(json.get("image").get("link")).read())
        img_temp.flush()
        user.pfp.save(f"{user.username}.jpg", File(img_temp), save=True)
        user.save()
        token, created = Token.objects.get_or_create(user=user)
        return Response(
            {
                "token": token.key,
                "username": user.username,
                "detail": "Successfuly created account and logged in!",
            }
        )


@api_view(["POST"])
@authentication_classes([])
@permission_classes([])
def is_token_valid(request):
    if not request.data.get("token"):
        return Response(
            {"detail": "Missing token argument"}, status=status.HTTP_400_BAD_REQUEST
        )
    try:
        token = Token.objects.get(key=request.data["token"])
    except:
        return Response({"detail": False})
    return Response({"detail": True})


@api_view(["POST"])
def delete_user(request):
    user = request.user
    user.delete()
    return Response({"detail": "Account deleted."})


@api_view(["POST"])
def update_user(request):
    serializer = UserSerializer(request.user, data=request.data, partial=True)
    if not serializer.is_valid():
        return Response(
            {"detail": clean_serializer_errors(serializer.errors)},
            status=status.HTTP_400_BAD_REQUEST,
        )
    serializer.save()
    return Response(serializer.data)


@api_view(["POST"])
@authentication_classes([])
@permission_classes([])
def create_guest(request):
    guest = User.objects.create()
    guest.username = f"noob_{guest.id}"
    guest.is_guest = True
    guest.bio = "humain super cool ^^"
    guest.save()
    token, created = Token.objects.get_or_create(user=guest)
    return Response(
        {
            "token": token.key,
            "username": guest.username,
            "detail": "Successfuly created guest account!",
        }
    )


@api_view(["GET"])
def get_profile(request, username):
    try:
        user = User.objects.get(username=username)
    except:
        return Response({"detail": "User not found"}, status=status.HTTP_404_NOT_FOUND)

    serializer = UserSerializer(user)
    return Response(serializer.data)


@api_view(["GET"])
def get_stats(request, username):
    try:
        user = User.objects.get(username=username)
    except:
        return Response({"detail": "User not found"}, status=status.HTTP_404_NOT_FOUND)

    games_played = Game.objects.filter(Q(p1=user) | Q(p2=user)).count()
    win = Game.objects.filter(
        Q(p1=user, p1_score__gt=F("p2_score")) | Q(p2=user, p2_score__gt=F("p1_score"))
    ).count()
    lose = games_played - win
    win_rate = (win / (games_played if games_played != 0 else 1)) * 100
    return Response(
        {"games_played": games_played, "win": win, "lose": lose, "win_rate": win_rate}
    )


@api_view(["GET"])
def list_users(request):
    query_set = User.objects.all().order_by("-date_joined")[:20]
    serializer = UserSerializer(query_set, many=True)
    return Response(serializer.data)


# USER_FRIEND
@api_view(["GET"])
def get_friends(request, username):
    if username != request.user.username:
        return Response(
            {"detail": "You can't see someone else friends"},
            status=status.HTTP_400_BAD_REQUEST,
        )
    friends = UserFriend.objects.filter(Q(uid1=request.user) | Q(uid2=request.user))
    serializer = UserFriendListSerializer(
        friends, many=True, context={"current_user": request.user}
    )
    return Response(serializer.data)


@api_view(["POST"])
def send_friend_request(request):
    logged_user = request.user
    other_username = request.data.get("username")
    other_user = get_object_or_404(User, username=other_username)
    if logged_user == other_user:
        return Response(
            {"detail": "Cannot be friend with yourself"},
            status=status.HTTP_400_BAD_REQUEST,
        )
    user1 = logged_user if logged_user.id < other_user.id else other_user
    user2 = other_user if logged_user.id < other_user.id else logged_user
    try:
        friendship = UserFriend.objects.get(uid1=user1.id, uid2=user2.id)
    except:
        friendship = None

    if friendship != None:
        if friendship.status == UserFriend.FRIEND:
            return Response(
                {"detail": "Already friends"}, status=status.HTTP_400_BAD_REQUEST
            )
        if (friendship.status == UserFriend.REQ_UID1 and user1 == logged_user) or (
            friendship.status == UserFriend.REQ_UID2 and user2 == logged_user
        ):
            return Response(
                {"detail": "Already sent request to this user"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        friendship.status = UserFriend.FRIEND
        friendship.save()
        return Response({"detail": "You are now friends"})
    stat = UserFriend.REQ_UID1 if user1 == logged_user else UserFriend.REQ_UID2
    friendship = UserFriend(uid1=user1, uid2=user2, status=stat)
    friendship.save()
    if other_username in pong_data.name_to_user:
        other_user = pong_data.name_to_user[other_username]
        other_pu = pong_data.get_pong_user(other_user)
        if other_pu:
            other_pu.send("notify-success", "friends.friend_request_received")
    return Response({"detail": "Sent friend request"})


@api_view(["POST"])
def remove_friend_request(request):
    logged_user = request.user
    other_user = get_object_or_404(User, username=request.data.get("username"))
    if logged_user == other_user:
        return Response(
            {"detail": "Cannot be friend with yourself"},
            status=status.HTTP_400_BAD_REQUEST,
        )
    user1, user2 = (
        (logged_user, other_user)
        if logged_user.id < other_user.id
        else (other_user, logged_user)
    )
    try:
        friendship = UserFriend.objects.get(uid1=user1.id, uid2=user2.id)
    except:
        friendship = None

    message = ""
    if friendship != None:
        if friendship.status == UserFriend.FRIEND:
            message = "You are no longer friends"
        elif (friendship.status == UserFriend.REQ_UID1 and user1 == other_user) or (
            friendship.status == UserFriend.REQ_UID2 and user2 == other_user
        ):
            message = "Friend request declined"
        else:
            message = "Friend request removed"
        friendship.delete()
        return Response({"detail": message})
    return Response(
        {"detail": "Users are not friends or no request was sent between them"}
    )


@api_view(["GET"])
def get_friendship(request):
    logged_user = request.user
    other_user = get_object_or_404(User, username=request.data.get("username"))
    if logged_user == other_user:
        return Response(
            {"detail": "Cannot be friend with yourself"},
            status=status.HTTP_400_BAD_REQUEST,
        )
    user1, user2 = (
        (logged_user, other_user)
        if logged_user.id < other_user.id
        else (other_user, logged_user)
    )
    try:
        friendship = UserFriend.objects.get(uid1=user1.id, uid2=user2.id)
    except:
        friendship = None

    if friendship == None:
        return Response({"status": "NONE"})
    if friendship.status == UserFriend.FRIEND:
        return Response({"status": "FRIEND"})
    if (friendship.status == UserFriend.REQ_UID1 and user1 == logged_user) or (
        friendship.status == UserFriend.REQ_UID2 and user2 == logged_user
    ):
        return Response({"status": "REQ_SENT"})
    return Response({"status": "REQ_RECEIVED"})
