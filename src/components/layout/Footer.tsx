import React from 'react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-surface border-t border-border">
      <div className="px-4 lg:px-6 py-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-text-muted">
            © {currentYear} Luxury Watches Admin. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-sm text-text-muted">
            <a
              href="#"
              className="hover:text-text-primary transition-colors"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="hover:text-text-primary transition-colors"
            >
              Terms of Service
            </a>
            <a
              href="#"
              className="hover:text-text-primary transition-colors"
            >
              Support
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
