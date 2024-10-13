import random

#returns winner
def play_game(p1: str, p2: str) -> str:
    return random.choice((p1, p2))

players = ["p" + str(i) for i in range(13)]


def nex(n: int) -> int:
    if (n == 0):
        return 0
    ret = 1
    while (ret < n):
        ret <<= 1
    return ret

def next_power_of_2(n: int) -> int:
    """
    Return next power of 2 greater than or equal to n
    """
    return 2**(n-1).bit_length()

rounds = []
def fill_rounds(rounds: list[str], players: list[str]) -> None:
    rounds.append([players[i] if i < len(players) else None for i in range(next_power_of_2(len(players)))])
    while (len(rounds[-1]) > 1):
        rounds.append([None for i in range(len(rounds[-1])//2)])

fill_rounds(rounds, players)

def print_rounds():
    global rounds
    for i, round in enumerate(rounds):
        print(f"{i}:", " ".join((thing if thing else "empty" for thing in round)))
    print()

#use external variables or local
current_round = 0
current_game = 0

def next_round() -> None | str:
    # vars would be part of a class with multiple tournaments in a server side environment, games would get started with an ID and when reporting the right tournament would get found
    global rounds
    global current_round
    global current_game

    if current_round >= len(rounds) - 1:
        return rounds[-1][0]
    p1: str = rounds[current_round][current_game * 2]
    p2: str = rounds[current_round][current_game * 2 + 1]
    winner: str = ""
    print(f"round {current_round} game {current_game}: {p1} vs {p2}")
    if p2:
        winner = play_game(p1, p2)
    else:
        winner = p1
    rounds[current_round + 1][current_game] = winner
    current_game += 1
    current_game %= len(rounds[current_round]) // 2
    if current_game == 0:
        current_round += 1

print_rounds()
while not next_round():
    print_rounds()
print_rounds()
