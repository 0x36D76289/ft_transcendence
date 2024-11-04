export function initNotifications() {
	const NOTIFICATIONS = `
		<div class="notifications">
			<div class="notification">
				<div class="notification-content">
					<span class="material-icons">notifications</span>
					<span class="notification-text">You have a new friend request!</span>
				</div>
				<button class="notification-action">View</button>
			</div>
		</div>
	`

	const notifications = document.createElement("div");
	notifications.innerHTML = NOTIFICATIONS;
	document.body.appendChild(notifications);
}
