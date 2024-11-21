export function generateRandomUsers(count) {
	const users = [];
	const statuses = ['online', 'offline'];
	const getRandomDate = () => {
		const start = new Date(2020, 0, 1);
		const end = new Date();
		return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
	};

	for (let i = 0; i < count; i++) {
		const gender = Math.random() > 0.5 ? 'men' : 'women';
		users.push({
			id: i + 1,
			name: `Utilisateur ${i + 1}`,
			avatar: `https://randomuser.me/api/portraits/${gender}/${i + 1}.jpg`,
			status: statuses[Math.floor(Math.random() * statuses.length)],
			lastActive: getRandomDate()
		});
	}
	return users;
}
