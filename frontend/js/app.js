import {SPAEngine} from './SPAEngine';

export const app = new SPAEngine();

// Define routes
app.addRoute('/', () => app.renderHomePage());
app.addRoute('login', () => app.renderAuthPage());

// Start the app
app.start();
app.renderHeader();
