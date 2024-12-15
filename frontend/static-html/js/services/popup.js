const emptyFunction = () => {};

export function popupSystem(
  type = "info",
  message,
  showButtons = false,
  accept = emptyFunction,
  reject = emptyFunction
) {
  // Material Icons mapping
  const icons = {
    info: "info",
    success: "check_circle",
    warning: "warning",
    error: "error",
  };

  // Popup buttons (conditionally rendered)
  const buttons = showButtons
    ? `
      <div class="popup__buttons">
        <button class="popup__button popup__button--accept">Accept</button>
        <button class="popup__button popup__button--reject">Reject</button>
      </div>
    `
    : "";

  // Popup template
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

  // Add popup to DOM
  document.body.insertAdjacentHTML("beforeend", popup);
  const popupElement = document.querySelector(".popup:last-child");
  const popupClose = popupElement.querySelector(".popup__close");

  // Set stack position
  updatePopupPositions();

  // Close popup animation
  const removePopup = () => {
    popupElement.style.animation = "popupExit 0.4s forwards";
    setTimeout(() => {
      popupElement.remove();
      updatePopupPositions();
    }, 400);
  };

  popupClose.onclick = removePopup;

  if (!showButtons) {
    const autoCloseTimeout = setTimeout(removePopup, 5000);

    popupElement.addEventListener("mouseenter", () => {
      clearTimeout(autoCloseTimeout);
    });

    popupElement.addEventListener("mouseleave", () => {
      setTimeout(removePopup, 2000);
    });
  }

  if (showButtons) {
    const acceptButton = popupElement.querySelector(".popup__button--accept");
    const rejectButton = popupElement.querySelector(".popup__button--reject");

    acceptButton.addEventListener("click", () => {
      accept();
      removePopup();
    });

    rejectButton.addEventListener("click", () => {
      reject();
      removePopup();
    });
  }

  return popupElement;
}

function updatePopupPositions() {
  const popups = document.querySelectorAll(".popup");
  popups.forEach((popup, index) => {
    popup.style.bottom = `${index * 95 + 16}px`;
  });
}
