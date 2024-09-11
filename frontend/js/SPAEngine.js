export class SPAEngine {
	constructor(appElement) {
		this.appElement = appElement;
		this.views = {};
		this.state = {};
		this.vDOM = null;
	}

	registerView(viewName, renderFunc) {
		if (typeof renderFunc === 'function') {
			this.views[viewName] = renderFunc;
		} else {
			console.error('renderFunc must be a function');
		}
	}

	registerActions(actions) {
		this.actions = actions;
	}

	navigate(viewName) {
		if (viewName in this.views) {
			this.setState({ currentView: viewName });
		} else {
			console.error(`View ${viewName} is not registered.`);
		}
	}

	setState(newState) {
		this.state = { ...this.state, ...newState };
		this.render();
	}

	render() {
		const activeView = this.state.currentView;
		const newVDOM = this.views[activeView](this.state);

		if (this.vDOM !== newVDOM) {
			this.appElement.innerHTML = newVDOM;
			this.vDOM = newVDOM;
			this.bindEvents();
		}
	}

	bindEvents() {
		const elements = this.appElement.querySelectorAll('[data-event]');
		elements.forEach(el => {
			const eventType = el.getAttribute('data-event');
			const action = el.getAttribute('data-action');

			const handler = () => {
				if (action in this.actions) {
					this.actions[action]();
				}
			};

			el.removeEventListener(eventType, handler);
			el.addEventListener(eventType, handler);
		});
	}

	handleCustomCodeInjection(html = '', css = '', js = '') {
		if (html) {
			this.appElement.innerHTML += html;
		}
		if (css) {
			if (!document.querySelector(`style[data-injected="true"]`)) {
				const style = document.createElement('style');
				style.textContent = css;
				document.head.appendChild(style);
			}
		}
		if (js) {
			const script = document.createElement('script');
			script.textContent = js;
			document.body.appendChild(script);
		}
	}

}