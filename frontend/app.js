document.getElementById('fetch-users').addEventListener('click', async () => {
	const response = await fetch('http://localhost:4567/users');
	const users = await response.json();
	document.getElementById('users').textContent = JSON.stringify(users, null, 2);
});
