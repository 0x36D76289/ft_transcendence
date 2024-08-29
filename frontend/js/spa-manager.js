class SPAManager {
	constructor(pages) {
		this.pages = pages;
		this.currentPage = null;
		this.rootElement = document.body;
		this.init();
	}

	init() {
		window.addEventListener('popstate', this.handleRouteChange.bind(this));
		this.handleRouteChange();
	}

	navigateTo(path) {
		window.history.pushState(null, null, path);
		this.handleRouteChange();
	}

	handleRouteChange() {
		const path = window.location.pathname;
		const page = this.pages[path] || this.pages['/404'];
		this.renderPage(page);
	}

	renderPage(page) {
		this.currentPage = page;
		this.rootElement.innerHTML = page.render();
		if (page.setup) {
			page.setup();
		}
	}

	addEventListenerTo(selector, event, handler) {
		const element = document.querySelector(selector);
		if (element) {
			element.addEventListener(event, handler);
		}
	}

	async logout() {
		const token = localStorage.getItem('authToken');

		try {
			const response = await fetch('http://127.0.0.1:8000/logout', {
				method: 'POST',
				headers: {
					'Authorization': `Token ${token}`
				}
			});

			if (!response.ok) {
				throw new Error('Logout failed');
			}

			localStorage.removeItem('authToken');
			alert('Logged out successfully');
			this.navigateTo('/');
		} catch (error) {
			console.error('Error:', error);
			alert('Logout failed: ' + error.message);
		}
	}
}
