export function loginView(state) {
	return `
    <h2>Login</h2>
    <form id="loginForm">
      <input type="text" id="username" placeholder="Username" required>
      <input type="password" id="password" placeholder="Password" required>
      <button type="submit" data-event="click" data-action="submitLogin">Login</button>
    </form>
    ${state.loginError ? `<p style="color: red;">${state.loginError}</p>` : ''}
    <p>Don't have an account? <a href="#" data-event="click" data-action="goToSignup">Sign up</a></p>
  `;
}