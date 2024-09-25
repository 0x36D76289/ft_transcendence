import { navigate, loadPage } from '../../spa.js';
import { readCookie } from '../../cookie.js';
import { postData, getData } from '../../api/utils.js';

const cssContent = `
.profile-container {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	height: 100vh;
}
#home-button, #update-button {
	margin-top: 20px;
}
#bio-input {
	width: 300px;
	height: 100px;
}
`;

export async function renderProfile(username) {
	const token = readCookie("authToken");
	const loggedInUsername = readCookie("username");

	let isOwnProfile = false;
	if (token && username === loggedInUsername) {
		isOwnProfile = true;
	}

	// Fetch user profile information
	const profileData = await getData(`/user/profile/${username}`, {
		Authorization: `Token ${token}`
	});

	if (!profileData || !profileData.username) {
		document.body.innerHTML = "<p>Profile not found or you are not authorized to view this profile.</p>";
		return;
	}

	let htmlContent = `
	<div class="profile-container">
		<h1>Profile of ${profileData.username}</h1>
		<p>ID: ${profileData.id}</p>
		<p>Bio: ${profileData.bio || 'No bio available.'}</p>
		<p>Joined: ${new Date(profileData.date_joined).toLocaleDateString()}</p>
		<p>Last Online: ${profileData.is_online ? 'Currently Online' : new Date(profileData.last_online).toLocaleString()}</p>
		<button id="home-button">Back to Home</button>
	`;

	// If it's the logged-in user's profile, allow updates
	if (isOwnProfile) {
		htmlContent += `
		<h2>Update Profile</h2>
		<textarea id="bio-input" placeholder="Update your bio">${profileData.bio || ''}</textarea><br />
		<button id="update-button">Update Bio</button>
		<p id="update-message"></p>
	`;
	}

	htmlContent += `</div>`;

	// Load the HTML and CSS content
	loadPage(htmlContent, cssContent);

	// Event listener for Back to Home button
	document.getElementById("home-button").addEventListener("click", () => {
		navigate("/home");
	});

	// If it's the logged-in user's profile, handle profile updates
	if (isOwnProfile) {
		document.getElementById("update-button").addEventListener("click", async () => {
			const newBio = document.getElementById("bio-input").value;

			const updateResponse = await postData("/user/update_user", {
				Authorization: `Token ${token}`
			}, {
				username: loggedInUsername,
				bio: newBio
			});

			if (updateResponse.detail) {
				document.getElementById("update-message").textContent = "Profile updated successfully!";
			} else {
				document.getElementById("update-message").textContent = "Failed to update profile. Please try again.";
			}
		});
	}
}