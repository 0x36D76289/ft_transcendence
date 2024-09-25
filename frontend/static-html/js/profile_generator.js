import { postData } from './api/utils.js';
import { readCookie } from './cookie.js';

// Function to generate user profiles
async function generateProfile(username, password, bio) {
	const data = {
		username: username,
		password: password,
		bio: bio
	};

	console.log(`Creating profile for user: ${username}`);

	const response = await postData("/user/register", {}, data);

	if (response.username) {
		console.log(`Profile created successfully for: ${response.username}`);
	} else {
		console.log(`Error creating profile: ${response.detail}`);
	}
}

// Function to delete a user profile
async function deleteProfile(username) {
	const token = readCookie("authToken");

	if (!token) {
		console.error("User is not authenticated");
		return;
	}

	console.log(`Deleting profile for user: ${username}`);

	const response = await postData("/user/remove_friend_request", {
		Authorization: `Token ${token}`
	}, { username });

	if (response.detail === "User removed successfully") {
		console.log(`Profile deleted for: ${username}`);
	} else {
		console.log(`Error deleting profile: ${response.detail}`);
	}
}

// Sample usage to create multiple profiles
export async function generateMultipleProfiles(nb) {
	const profiles = [];
	for (let i = 1; i <= nb; i++) {
		profiles.push({
			username: `user_${i}`,
			password: `password${i}`,
			bio: `Hi im STEVE_${i}`
		});
	}

	for (const profile of profiles) {
		await generateProfile(profile.username, profile.password, profile.bio);
	}
}

// Example to delete profiles
export async function deleteMultipleProfiles() {
	const usersToDelete = ["player1", "player2", "player3"];

	for (const username of usersToDelete) {
		await deleteProfile(username);
	}
}

