import { getUserStats, getUserProfile, logoutUser } from "../../api/user.js";
import { createButton, createParagraph, createHeading, createDiv } from "../../components.js";
import { navigate } from "../../spa.js";

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
	const container = createDiv("profile-container");
	const username = localStorage.getItem("username");
	console.log(username);

	try {
		const profile = await getUserProfile(username);
		const stats = await getUserStats(username);

		const heading = createHeading(1, `Profile of ${profile.username}`, "profile-heading");
		container.appendChild(heading);

		const bioParagraph = createParagraph(`Bio: ${profile.bio || "No bio available"}`, "profile-paragraph");
		container.appendChild(bioParagraph);

		const dateJoinedParagraph = createParagraph(`Date Joined: ${new Date(profile.date_joined).toLocaleDateString()}`, "profile-paragraph");
		container.appendChild(dateJoinedParagraph);

		const isOnlineParagraph = createParagraph(`Status: ${profile.is_online ? "Online" : `Last online: ${new Date(profile.last_online).toLocaleString()}`}`, "profile-paragraph");
		container.appendChild(isOnlineParagraph);

		const statsParagraph = createParagraph(`Stats: ${stats}`, "profile-paragraph");
		container.appendChild(statsParagraph);

		const logoutButton = createButton("Logout", async () => {
			await logoutUser(localStorage.getItem("authToken"));
			localStorage.removeItem("authToken");
			localStorage.removeItem("username");
			navigate("/connexion");
		}, "logout-button");
		container.appendChild(logoutButton);

		document.body.appendChild(container);

		const style = document.createElement("style");
		style.textContent = CSS;
		document.head.appendChild(style);
	} catch (error) {
		console.error("Error loading profile:", error);
	}
}
