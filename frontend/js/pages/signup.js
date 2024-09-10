export function signupView(state) {
	return `
    <h2>Sign Up</h2>
    <form id="signupForm">
      <input type="text" id="username" placeholder="Username" required>
      <input type="password" id="password" placeholder="Password" required>
      <button type="submit" data-event="click" data-action="submitSignup">Sign Up</button>
    </form>
    ${state.signupError ? `<p style="color: red;">${state.signupError}</p>` : ''}
    ${state.signupSuccess ? `<p style="color: green;">Signup successful! Redirecting to login...</p>` : ''}
    <p>Already have an account? <a href="#" data-event="click" data-action="goToLogin">Login</a></p>
  `;
}