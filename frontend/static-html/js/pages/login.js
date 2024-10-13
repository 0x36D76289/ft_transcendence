import { loadPage, navigate } from "../spa.js";
import { postData } from "../api/utils.js";
import { createCookie } from "../cookie.js";
import { initBackground, eventBackground } from "../utils/background.js";

const HTML = `
<div class="main-content">
    <div class="login-container">
        <form class="login-form">
            <div class="input-group">
                <input type="text" id="username" name="username" placeholder="Username" required>
            </div>
            <div class="input-group">
                <input type="password" id="password" name="password" placeholder="Password" required>
            </div>
            <div class="button-group">
                <button type="submit" class="nav-button login-btn">
                    <img class="nav-icon" src="https://api.iconify.design/mdi:login.svg" alt="Login Icon">
                    <span class="nav-text">Login</span>
                </button>
                <button type="button" class="nav-button register-btn">
                    <img class="nav-icon" src="https://api.iconify.design/mdi:account-plus.svg" alt="Register Icon">
                    <span class="nav-text">Register</span>
                </button>
            </div>
        </form>
        <div class="message"></div>
    </div>
</div>
`;

const CSS = `
.main-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    max-width: 400px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
}

.login-container {
    background-color: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(10px);
    border-radius: 16px;
    padding: var(--padding-xl);
    width: 100%;

    h1 {
        color: var(--gray90);
        margin-bottom: var(--margin-l);
        text-align: center;
        font: var(--h1ui);
    }

    .login-form {
        display: flex;
        flex-direction: column;
        gap: var(--margin-m);

        .input-group {
            input {
                width: 100%;
                padding: var(--padding-s);
                border: 2px solid var(--gray30);
                border-radius: 8px;
                background-color: var(--gray20);
                color: var(--gray90);
                font-family: var(--ff2);
                font-size: 1rem;

                &:focus {
                    outline: none;
                    border-color: var(--colora);
                }
            }
        }

        .button-group {
            display: flex;
            justify-content: space-between;
            margin-top: var(--margin-s);

            .nav-button {
                display: flex;
                align-items: center;
                justify-content: center;
                padding: var(--padding-s) var(--padding-m);
                border: 2px solid var(--gray10);
                border-radius: 16px;
                background-color: var(--gray20);
                color: var(--gray90);
                transition: background-color 0.2s ease, box-shadow 0.2s ease, transform 0.1s ease;
                box-shadow: 0px 4px 0 0 var(--gray10);
                text-align: center;
                width: 48%;

                img {
                    width: var(--padding-m);
                    height: var(--padding-m);
                    filter: invert(100%);
                    margin-right: var(--margin-s);
                }

                .nav-text {
                    font-size: 1.1rem;
                    flex-grow: 1;
                }

                &:hover {
                    background-color: var(--gray30);
                    transform: translateY(-2px);
                }

                &:active {
                    box-shadow: 0px 0px 0 0 var(--gray10);
                    transform: translateY(4px);
                }
            }
        }
    }

    .message {
        margin-top: var(--margin-m);
        color: var(--colora);
        font-size: 1rem;
        text-align: center;
    }
}
`;

export function login() {
    const [backgroundHTML, backgroundCSS] = initBackground();

    const loadHTML = `
    ${backgroundHTML}
    ${HTML}
    `;
    const loadCSS = `
    ${backgroundCSS}
    ${CSS}
    `;

    loadPage(loadHTML, loadCSS);
    eventBackground();

    document.querySelector(".login-btn").addEventListener("click", async (event) => {
        event.preventDefault();
        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;
        const messageDiv = document.querySelector(".message");

        try {
            const response = await postData("/user/login", {}, { username, password });
            if (response.token) {
                createCookie("token", response.token, 7);
                createCookie("username", response.username, 7);
                navigate("/");
            } else {
                messageDiv.textContent = response.detail || "Login failed";
            }
        } catch (error) {
            messageDiv.textContent = "An error occurred during login";
        }
    });

    document.querySelector(".register-btn").addEventListener("click", async () => {
        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;
        const messageDiv = document.querySelector(".message");

        try {
            const response = await postData("/user/register", {}, { username, password });
            if (response.username) {
                messageDiv.textContent = "Registration successful. Please log in.";
            } else {
                messageDiv.textContent = response.detail || "Registration failed";
            }
        } catch (error) {
            messageDiv.textContent = "An error occurred during registration";
        }
    });
}