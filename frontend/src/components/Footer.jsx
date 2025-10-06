import React from 'react';

// Define the functional component
function Footer() {
  // The component's logic goes here (state, effects, handlers, etc.)

  // Return the JSX (the component's UI)
  return (
    <footer className="p-4 text-sm bg-transparent">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-center md:text-left w-full md:w-auto">© 2025 TV Recommender</div>
        <div className="w-full md:w-auto flex justify-center md:justify-end">
          <a
            href="mailto:support@tvrecommender.example"
            className="inline-block px-4 py-2 bg-cyan-600 text-white rounded shadow hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-indigo-300"
            aria-label="Contact us via email"
          >
            Contact Us
          </a>
        </div>
      </div>
    </footer>
  );
}

// Export the footer
export default Footer;