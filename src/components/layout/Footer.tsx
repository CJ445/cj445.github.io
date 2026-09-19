import React from 'react';
import VisitorCount from '../ui/VisitorCount';

const Footer = () => {
  return (
    <footer className="bg-black text-white py-8 border-t-4 border-white mt-20 text-center">
        <h2 className="text-2xl font-shrikhand text-custom-pink mb-2">Made with ☕ and 💻</h2>
        <VisitorCount />

        <div className="text-xs text-gray-400">
            © {new Date().getFullYear()} Cyril Jacob. All rights reserved.
        </div>
    </footer>
  );
};

export default Footer;