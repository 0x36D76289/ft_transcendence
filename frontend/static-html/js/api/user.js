import { postData, getData } from "./utils.js";
import { createCookie, eraseCookie } from "../cookie.js";

export const registerUser = (username, password, bio = '') => {
	return postData("/user/register", { username, password, bio });
};

export const loginUser = async (username, password) => {
	const response = await postData("/user/login", { username, password });

	if (response.token) {
		createCookie("authToken", response.token, 1);
		createCookie("username", username, 1);
	}

	return response;
};

export const logoutUser = async (token) => {
	const response = await postData("/user/logout", {}, token);

	if (response.detail === "Successfully logged out.") {
		eraseCookie("authToken");
		eraseCookie("username");
	}

	return response;
};

export const updateUser = (token, username, bio) => {
	return postData("/user/update_user", { username, bio }, token);
};

export const getUserProfile = (token, username) => {
	return getData(`/user/profile/${username}`, token);
};

export const getUserStats = (token, username) => {
	return getData(`/user/stats/${username}`, token);
};

export const sendFriendRequest = (token, username) => {
	return postData("/user/send_friend_request", { username }, token);
};

export const removeFriendRequest = (token, username) => {
	return postData("/user/remove_friend_request", { username }, token);
};

export const getFriendship = (token, username) => {
	return postData("/user/get_friendship", { username }, token);
};
