import { getUserStats, getUserProfile, logoutUser } from "../../api/user.js";
import { createButton, createParagraph, createHeading, createDiv } from "../../components.js";
import { addRoute, navigate } from "../../spa.js";
import { readCookie, eraseCookie } from "../../cookie.js";
import { renderLogin } from "./login.js";

const CSS = `
.profile-container {
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 2rem;
}

.profile-heading {
	font-size: 2rem;
	margin-bottom: 1rem;
}

.profile-paragraph {
	margin-bottom: 1rem;
}

.logout-button {
	margin-top: 2rem;
	padding: 0.5rem 1rem;
	font-size: 1rem;
}
`;

export async function renderProfile() {
	// load CSS
	const style = document.createElement("style");
	style.textContent = CSS;
	document.head.appendChild(style);

	// check if user is authenticated
	const tokenValue = readCookie("authToken");
	if (!tokenValue) {
		navigate("/login");
		return;
	}

	// get user profile and stats
	const profile = await getUserProfile(tokenValue);
	const stats = await getUserStats(tokenValue);

	const container = createDiv("profile-container");

	createHeading(1, "Profile", "profile-heading", container);

	createParagraph(`Username: ${profile.username}`, "profile-paragraph", container);
	createParagraph(`Created At: ${new Date(profile.createdAt).toLocaleString()}`, "profile-paragraph", container);
	createParagraph(`Last Seen: ${new Date(profile.lastSeen).toLocaleString()}`, "profile-paragraph", container);
	createParagraph(`Games Played: ${stats.gamesPlayed}`, "profile-paragraph", container);
	createParagraph(`Games Won: ${stats.gamesWon}`, "profile-paragraph", container);

	createButton("Logout", async () => {
		await logoutUser(tokenValue);
		eraseCookie("authToken");
		addRoute("/login", renderLogin);
		navigate("/login");
	}, "logout-button", container);
}
