import { i18n } from "../services/i18n.js";

const emptyFunction = () => {};

export function popupSystem(
  type = "info",
  message,
  showButtons = false,
  accept = emptyFunction,
  reject = emptyFunction,
) {
  const icons = {
    info: "info",
    success: "check_circle",
    warning: "warning",
    error: "error",
    question: "help_outline",
    notification: "notifications",
  };

  const popupId = `popup-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  const buttons = showButtons
    ? `
      <div class="popup__buttons">
        <button class="popup__button popup__button--accept" data-i18n="popup.accept">${i18n.t("popup.accept")}</button>
        <button class="popup__button popup__button--reject" data-i18n="popup.reject">${i18n.t("popup.reject")}</button>
      </div>
    `
    : "";

  // Popup template
  const popup = `
    <div class="popup ${type}" id="${popupId}">
      <div class="popup__content">
        <div class="popup__icon">
          <span class="material-icons">${icons[type] || icons["info"]}</span>
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
  const popupElement = document.getElementById(popupId);
  const popupClose = popupElement.querySelector(".popup__close");

  // Set stack position
  updatePopupPositions();

  // Close popup animation
  const removePopup = () => {
    popupElement.classList.add("popup--exiting");
    setTimeout(() => {
      popupElement.remove();
      updatePopupPositions();
    }, 400);
  };

  popupClose.onclick = removePopup;

  let autoCloseTimeout;

  if (!showButtons) {
    autoCloseTimeout = setTimeout(removePopup, 5000);

    popupElement.addEventListener("mouseenter", () => {
      clearTimeout(autoCloseTimeout);
    });

    popupElement.addEventListener("mouseleave", () => {
      autoCloseTimeout = setTimeout(removePopup, 2000);
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

  return {
    element: popupElement,
    close: removePopup,
    updateMessage: (newMessage) => {
      const messageElement = popupElement.querySelector(".popup__message");
      messageElement.textContent = newMessage;
    },
    changeType: (newType) => {
      popupElement.classList.remove(...Object.keys(icons));
      popupElement.classList.add(newType);
      const iconElement = popupElement.querySelector(
        ".popup__icon .material-icons",
      );
      iconElement.textContent = icons[newType] || icons["info"];
    },
  };
}

function updatePopupPositions() {
  const popups = document.querySelectorAll(".popup:not(.popup--exiting)");
  let offset = 16;
  popups.forEach((popup) => {
    popup.style.bottom = `${offset}px`;
    offset += popup.offsetHeight + 8;
  });
}
