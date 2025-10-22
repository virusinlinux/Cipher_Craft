
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="text-center p-4 md:p-6 border-b border-gray-700">
      <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
        CipherCraft
      </h1>
      <p className="mt-2 text-gray-400">
        Secure your messages with classic ciphers and a secret key.
      </p>
    </header>
  );
};

export default Header;
