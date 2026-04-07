import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { BellIcon, UserCircleIcon, Bars3Icon } from '@heroicons/react/24/outline';
import NotificationDropdown from './NotificationDropdown';
import ProfileDropdown from './ProfileDropdown';
import { useAuth } from '../../context/AuthContext';
import { useTransactions } from '../../context/TransactionContext';

interface HeaderProps {
  onToggleSidebar?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onToggleSidebar }) => {
  const { user } = useAuth();
  const { balance, notifications, accountMode, toggleAccountMode } = useTransactions();
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const tickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (tickerRef.current) {
        if (tickerRef.current.querySelector('script')) return;

        const script = document.createElement('script');
        script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js';
        script.async = true;
        script.innerHTML = JSON.stringify({
          "symbols": [
            { "proName": "FOREXCOM:SPXUSD", "title": "S&P 500" },
            { "proName": "FOREXCOM:NSXUSD", "title": "US 100" },
            { "proName": "FX_IDC:EURUSD", "title": "EUR/USD" },
            { "proName": "BITSTAMP:BTCUSD", "title": "Bitcoin" },
            { "proName": "BITSTAMP:ETHUSD", "title": "Ethereum" }
          ],
          "showSymbolLogo": true,
          "colorTheme": "dark",
          "isTransparent": false,
          "displayMode": "adaptive",
          "locale": "en"
        });
        tickerRef.current.appendChild(script);
    }
  }, []);

  const unreadNotificationsCount = notifications.filter(n => !n.read).length;

  const formatCurrency = (amount: number): string => {
    return `Rp ${amount.toLocaleString('id-ID')}`;
  };

  return (
    <>
    {/* Main Header 
        Now fixed at top-[50px] for all devices.
    */}
    <header className="fixed top-[50px] left-0 lg:left-64 right-0 bg-headerRed h-[60px] lg:h-16 z-40 flex items-center justify-between px-4 shadow-lg lg:shadow-md transition-all duration-300">
      
      {/* Mobile: Hamburger Menu inside Header */}
      <div className="lg:hidden flex items-center">
         <button 
            onClick={onToggleSidebar}
            className="text-white p-2 focus:outline-none bg-white/10 hover:bg-white/20 rounded-lg transition-all border border-white/10 shadow-sm"
            aria-label="Open Menu"
         >
            {/* Made icon larger and stroke thicker */}
            <Bars3Icon className="h-7 w-7 stroke-[2.5]" />
         </button>
      </div>

      {/* Desktop: Spacer */}
      <div className="hidden lg:block"></div>

      {/* Right: Controls */}
      <div className="flex items-center space-x-3 sm:space-x-4">
        
        {/* Custom Balance Button */}
        <button 
            onClick={toggleAccountMode} 
            className="flex items-center shadow-md transform hover:scale-105 transition-transform duration-200"
            title="Click to toggle Real/Demo"
        >
          {/* Left Side: Balance */}
          <div className="bg-[#2B3139] text-white text-[10px] sm:text-sm font-bold px-2 sm:px-3 py-1.5 rounded-l flex items-center h-8 sm:h-9 border-r border-gray-600">
            {formatCurrency(balance)}
          </div>
          {/* Right Side: Status */}
          <div className={`bg-[#0ECB81] text-white text-[9px] sm:text-xs font-bold uppercase tracking-wider px-1.5 sm:px-2 py-1.5 rounded-r flex items-center h-8 sm:h-9 min-w-[40px] sm:min-w-[50px] justify-center`}>
            {accountMode === 'real' ? 'Real' : 'Demo'}
          </div>
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            className="p-2 text-white hover:text-white/80 relative rounded-full hover:bg-white/10 transition-colors"
          >
            <BellIcon className="h-7 w-7" />
            {unreadNotificationsCount > 0 && (
            <span className="absolute top-1.5 right-1.5 bg-danger text-white text-[8px] font-bold rounded-full h-2.5 w-2.5 border-2 border-headerRed"></span>
            )}
          </button>
          {isNotificationsOpen && (
            <NotificationDropdown
              notifications={notifications}
              onClose={() => setIsNotificationsOpen(false)}
            />
          )}
        </div>

        {/* Profile */}
        <div className="relative">
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center focus:outline-none ml-1 rounded-full ring-2 ring-white/50 hover:ring-white transition-all shadow-md"
          >
            {user?.profilePictureUrl ? (
              <img src={user.profilePictureUrl} alt="Profile" className="h-10 w-10 rounded-full object-cover" />
            ) : (
              <UserCircleIcon className="h-10 w-10 text-white bg-headerRed rounded-full" />
            )}
          </button>
          {isProfileOpen && <ProfileDropdown onClose={() => setIsProfileOpen(false)} />}
        </div>
      </div>
    </header>

    {/* Secondary Ticker Header 
        Mobile: top-[110px] (50px Brand + 60px Header).
        Desktop: top-[114px] (50px Brand + 64px Header).
    */}
    <div className="fixed top-[110px] lg:top-[114px] left-0 lg:left-64 right-0 h-12 bg-[#1A1F29] border-b border-gray-800 z-30 shadow-md">
        <div className="tradingview-widget-container h-full w-full" ref={tickerRef}>
            <div className="tradingview-widget-container__widget"></div>
        </div>
    </div>
    </>
  );
};

export default Header;