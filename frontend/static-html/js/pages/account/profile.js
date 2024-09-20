import { getUserStats, getUserProfile, logoutUser } from "../../api/user.js";
import { createButton, createParagraph, createHeading, createDiv } from "../../components.js";
import { navigate } from "../../spa.js";

const CSS = `
.profile-container {
	max-width: 800px;
	margin: 0 auto;
	padding: 1rem;
	text-align: center;
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
}
	
.home-button {
	position: absolute;
	top: 10px;
	left: 10px;
}
	
.profile-button {
	position: absolute;
	bottom: 10px;
	left: 50%;
	transform: translateX(-50%);
}
`;

export async function renderProfile(username) {
	const token = localStorage.getItem("authToken");
	if (!token) {
		navigate("/connexion");
		return;
	}

	try {
		const userProfile = await getUserProfile(username);
		const userStats = await getUserStats(username);

		console.log(userProfile);
		console.log(userStats);

		const profileDiv = createDiv("profile-container");

		const heading = createHeading(1, `Profile of ${userProfile.username}`, "profile-heading");
		const bioParagraph = createParagraph(userProfile.bio || "No bio available", "profile-paragraph");
		const statsParagraph = createParagraph(`Stats: ${JSON.stringify(userStats)}`, "profile-paragraph");

		profileDiv.appendChild(heading);
		profileDiv.appendChild(bioParagraph);
		profileDiv.appendChild(statsParagraph);

		document.body.appendChild(profileDiv);
	} catch (error) {
		const errorParagraph = createParagraph("Failed to load profile information.", "profile-paragraph");
		document.body.appendChild(errorParagraph);
	}

	const homeButton = createButton("Home", () => navigate("/"), "home-button");
	document.body.appendChild(homeButton);

	if (token) {
		const logoutButton = createButton("Logout", async () => {
			await logoutUser(token);
			localStorage.removeItem("authToken");
			navigate("/login");
		}, "profile-button");
		document.body.appendChild(logoutButton);
	}

	const style = document.createElement("style");
	style.textContent = CSS;

	document.head.appendChild(style);
}
