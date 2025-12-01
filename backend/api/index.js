const serverless = require('serverless-http');

// 1. Import your existing Express app instance.
// Ensure your main server file (e.g., server.js) exports the 'app' variable.
const app = require('../server'); 

// 2. Wrap your Express app with serverless-http.
const handler = serverless(app);

// 3. Export the handler. Vercel uses this function to process requests.
module.exports = handler;