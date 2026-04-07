import React, { useState } from 'react';
import Header from '../dashboard/Header';
import Sidebar from '../dashboard/Sidebar';
import { InformationCircleIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../../context/AuthContext';

interface DashboardLayoutProps {
  children?: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user } = useAuth();

  return (
    <div className="flex min-h-screen bg-darkblue text-white font-sans selection:bg-primary selection:text-white">
      
      {/* Top Brand Bar (Now for all devices) */}
      <div className="fixed top-0 left-0 right-0 h-[50px] bg-black z-50 flex flex-col items-center justify-center border-b border-gray-800 shadow-sm px-4">
         <h1 className="text-lg sm:text-xl font-bold tracking-wide text-white leading-none">
            OCBC NISP
         </h1>
         <p className="text-gray-400 text-[8px] sm:text-[9px] tracking-widest mt-0.5 uppercase">INVESTMENT</p>
      </div>

      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:ml-64 transition-all duration-300 ease-in-out min-w-0 overflow-x-hidden">
        {/* Pass toggleSidebar to Header */}
        <Header onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
        
        {/* 
           Padding Logic Refined:
           Mobile: 
             Brand Bar (50px) + 
             Header (60px) + 
             Ticker (48px) + 
             Padding (20px) 
             = pt-[178px]
           Desktop:
             Brand Bar (50px) +
             Header (64px) + 
             Ticker (48px) + 
             Padding (32px)
             = pt-[194px]
        */}
        <main className="flex-1 px-4 sm:px-6 pt-[178px] lg:pt-[194px] pb-10">
          {/* Account Activation Alert */}
          {!user?.isVerified && (
            <div className="bg-gradient-to-r from-danger/90 to-red-900/90 text-white p-4 rounded-lg shadow-lg mb-8 flex items-start backdrop-blur-sm border border-red-500/30">
              <InformationCircleIcon className="h-6 w-6 mr-3 flex-shrink-0 animate-pulse" />
              <div>
                <h3 className="font-bold text-base">Perhatian Diperlukan</h3>
                <p className="text-sm mt-1 text-red-100">
                  Halo <span className="font-semibold">{user?.fullName}</span>, akun Anda belum aktif sepenuhnya. Silahkan lakukan pembayaran untuk melakukan penarikan.
                </p>
              </div>
            </div>
          )}
          
          <div className="animate-fade-in">
             {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;