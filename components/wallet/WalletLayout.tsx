import React from 'react';
import { HomeIcon } from '@heroicons/react/24/solid';

interface WalletLayoutProps {
  children: React.ReactNode;
}

const WalletLayout: React.FC<WalletLayoutProps> = ({ children }) => {
  return (
    <div className="container mx-auto px-4 lg:px-6">
      <div className="mb-6">
         {/* IDR Wallet Header Box */}
         <div className="bg-darkblue2 border border-borderGray p-4 rounded-t-lg">
             <h2 className="text-xl text-white font-medium">IDR Wallet</h2>
         </div>
         {/* Breadcrumb Box */}
         <div className="bg-[#1E2329] border-x border-b border-borderGray p-2 px-4 rounded-b-lg flex items-center text-xs text-gray-400">
             <HomeIcon className="w-3 h-3 mr-1" /> 
             <span className="mx-1">Home</span> 
             <span className="mx-1">{'>'}</span> 
             <span className="text-white">IDR Wallet</span>
         </div>
      </div>
      
      {children}
    </div>
  );
};

export default WalletLayout;