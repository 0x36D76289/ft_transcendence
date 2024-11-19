let allCookies = document.cookie.split(';');for (let i = 0; i < allCookies.length; i++) document.cookie = allCookies[i] + "=;expires="+ new Date(0).toUTCString();

REMAKE END GAME

Better collisions
assign player nums in game start
check all uses of player_num in client
unregister for both sockets
update busy status when starting / ending games
