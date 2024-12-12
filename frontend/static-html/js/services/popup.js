const emptyFunction = () => {};

export function popupSystem(
  type = "info",
  message,
  showButtons = false,
  accept = emptyFunction,
  reject = emptyFunction,
) {
  // Material Icons mapping
  const icons = {
    info: "info",
    success: "check_circle",
    warning: "warning",
    error: "error",
  };

  const buttons = showButtons
    ? `
		<div class="popup__buttons">
			<button class="popup__button popup__button--accept">Accept</button>
			<button class="popup__button popup__button--reject">Reject</button>
		</div>
	`
    : "";

  const popup = `
<div class="popup ${type}">
	<div class="popup__content">
		<div class="popup__icon">
			<span class="material-icons">${icons[type]}</span>
		</div>
		<div class="popup__message">${message}</div>
		${buttons}
		<div class="popup__close">
			<span class="material-icons">close</span>
		</div>
	</div>
</div>
	`;

  document.body.insertAdjacentHTML("beforeend", popup);
  const popupElement = document.querySelector(".popup:last-child");
  const popupClose = popupElement.querySelector(".popup__close");

  // Handling close animation
  const removePopup = () => {
    popupElement.style.animation =
      "popupExit 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards";

    // Reposition other popups
    const currentIndex = Array.from(
      document.querySelectorAll(".popup"),
    ).indexOf(popupElement);
    const remainingPopups = document.querySelectorAll(".popup");

    remainingPopups.forEach((popup, index) => {
      if (index > currentIndex) {
        popup.style.transform = `translateY(calc(-${(index - 1) * 100}% - ${(index - 1) * 16}px))`;
      }
    });

    if (showButtons) {
      setTimeout(() => {
        popupElement.remove();
      }, 400);
    }
  };

  // Close button click handler
  popupClose.addEventListener("click", removePopup);

  // Auto-close after 5 seconds
  const autoCloseTimeout = setTimeout(removePopup, 5000);

  // Pause auto-close on hover
  popupElement.addEventListener("mouseenter", () => {
    clearTimeout(autoCloseTimeout);
  });

  // Resume auto-close on mouse leave
  popupElement.addEventListener("mouseleave", () => {
    setTimeout(removePopup, 2000);
  });

  // Accept and Reject button handlers
  if (showButtons) {
    const acceptButton = popupElement.querySelector(".popup__button--accept");
    const rejectButton = popupElement.querySelector(".popup__button--reject");

    acceptButton.addEventListener("click", () => {
      console.log("Accepted");
      accept();
      removePopup();
    });

    rejectButton.addEventListener("click", () => {
      console.log("Rejected");
      reject();
      removePopup();
    });
  }

  return popupElement;
}
