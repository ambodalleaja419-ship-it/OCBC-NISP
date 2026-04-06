import React from 'react';

interface AuthLayoutProps {
  children?: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative bg-darkblue overflow-hidden text-white p-4 font-sans">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop" 
          alt="OCBC NISP Office" 
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        {/* Dark Overlay for better readability */}
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"></div>
      </div>

      {/* Card Container - Glassmorphism - Transparent */}
      <div className="w-full max-w-md bg-transparent backdrop-blur-md rounded-xl shadow-2xl p-8 sm:p-10 border border-white/10 relative z-10">
        {children}
      </div>

      {/* Footer Section */}
      <p className="mt-12 text-gray-300 text-xs relative z-10 text-shadow-sm">
        &copy; 2024 <span className="text-red-600 font-semibold">OCBC NISP</span>. All rights reserved.
      </p>
    </div>
  );
};

export default AuthLayout;