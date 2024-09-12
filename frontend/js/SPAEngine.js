export class SPAEngine {
	constructor() {
		this.routes = {};
	}

	addRoute(path, handler) {
		this.routes[path] = handler;
		console.log("Route added:", path);
	}

	navigate(path) {
		if (this.routes[path]) {
			console.log("Navigating to", path);
			this.routes[path]();
		} else {
			console.warn("Route not found");
		}
	}

	start() {
		window.addEventListener("hashchange", () => {
			this.navigate(window.location.hash.substring(1));
			console.log("Hash changed to", window.location.hash);
		});

		if (window.location.hash) {
			this.navigate(window.location.hash.substring(1));
			console.log("Initial hash found:", window.location.hash);
		} else {
			this.navigate('/');
			console.log("No initial hash found");
		}
	}
}
