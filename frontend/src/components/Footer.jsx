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
            className="px-5 py-1 text-sm border rounded-xl bg-neutral-900 font-semibold shadow-sm hover:bg-zinc-800 border-gray-300"
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