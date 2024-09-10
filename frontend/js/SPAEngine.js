export class SPAEngine {
	constructor(appElement) {
		this.appElement = appElement;
		this.views = {};
		this.state = {};
		this.vDOM = null;
	}

	/**
	 * Register a view with the engine.
	 * @param {String} viewName - The name of the view.
	 * @param {Function} renderFunc - A function that returns the view's HTML string.
	 */
	registerView(viewName, renderFunc) {
		this.views[viewName] = renderFunc;
	}

	/**
	 * Update the app's state and trigger a re-render.
	 * @param {Object} newState - An object containing new state data.
	 */
	setState(newState) {
		this.state = { ...this.state, ...newState }; // Merge new state with existing state
		this.render();
	}

	/**
	 * Main render method, re-renders the active view based on current state.
	 */
	render() {
		const activeView = this.state.currentView;
		const newVDOM = this.views[activeView](this.state); // Generate new virtual DOM

		// Diff and update only if the virtual DOM has changed
		if (this.vDOM !== newVDOM) {
			this.appElement.innerHTML = newVDOM;
			this.vDOM = newVDOM;
			this.bindEvents();
		}
	}

	/**
	 * Binds events to elements based on custom data-* attributes.
	 */
	bindEvents() {
		const elements = this.appElement.querySelectorAll('[data-event]');
		elements.forEach(el => {
			const eventType = el.getAttribute('data-event');
			const action = el.getAttribute('data-action');

			el.addEventListener(eventType, () => {
				if (action in this.actions) {
					this.actions[action]();
				}
			});
		});
	}

	/**
	 * Register event-driven actions with the engine.
	 * @param {Object} actions - An object mapping action names to functions.
	 */
	registerActions(actions) {
		this.actions = actions;
	}

	/**
	 * Inject custom HTML, CSS, or JS code into the app.
	 * @param {String} html - Custom HTML string.
	 * @param {String} css - Custom CSS string.
	 * @param {String} js - Custom JavaScript code.
	 */
	injectCustomCode(html = '', css = '', js = '') {
		if (html) {
			this.appElement.innerHTML += html;
		}

		if (css) {
			const style = document.createElement('style');
			style.textContent = css;
			document.head.appendChild(style);
		}

		if (js) {
			const script = document.createElement('script');
			script.textContent = js;
			document.body.appendChild(script);
		}
	}

	/**
	 * Navigate to a different view.
	 * @param {String} viewName - The name of the view to switch to.
	 */
	navigate(viewName) {
		this.setState({ currentView: viewName });
	}
}