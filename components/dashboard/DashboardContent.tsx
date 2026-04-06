import React, { useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';

const DashboardContent: React.FC = () => {
  const forexRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const referralLink = `https://ocbcnisp.com/?reff=${user?.username || 'muhamadmustofa'}`;

  useEffect(() => {
    // Inject Forex Widget
    if (forexRef.current) {
        if (forexRef.current.querySelector('script')) return;

        const widgetDiv = document.createElement('div');
        widgetDiv.className = 'tradingview-widget-container__widget';
        forexRef.current.appendChild(widgetDiv);
        
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-forex-cross-rates.js';
        script.async = true;
        // Logic to determine height based on screen size could be done here, 
        // but passing "100%" height to the container and controlling container height via CSS is safer.
        script.innerHTML = JSON.stringify({
          "width": "100%",
          "height": "100%", // Use 100% of container
          "currencies": [
            "EUR", "USD", "JPY", "GBP", "CHF", "AUD", "CAD", "NZD", "CNY", "TRY", "SEK", "NOK", "DKK", "ZAR", "HKD", "SGD", "THB", "MXN"
          ],
          "isTransparent": true,
          "colorTheme": "dark",
          "locale": "en"
        });
        forexRef.current.appendChild(script);
    }
  }, []);

  return (
    <div className="w-full flex flex-col space-y-6">
       
       {/* Referral Link Section */}
       <div className="flex flex-col sm:flex-row gap-3">
          <input 
             type="text" 
             readOnly 
             value={referralLink}
             className="flex-1 bg-[#2B3139] border border-gray-700 text-gray-300 px-4 py-3 rounded text-sm sm:text-base focus:outline-none focus:border-[#EF4444] transition-colors"
          />
          <button 
             className="bg-[#EF4444] hover:bg-[#DC2626] text-white font-bold px-6 py-3 rounded text-sm sm:text-base transition-colors shadow-lg shadow-red-500/20 whitespace-nowrap"
             onClick={() => navigator.clipboard.writeText(referralLink)}
          >
             Copy Reff URL
          </button>
       </div>

       {/* Forex Cross Rates Section */}
       <div className="space-y-4">
         {/* Container height increased to fit content visually similar to reference */}
         <div 
            className="tradingview-widget-container w-full h-[600px] sm:h-[850px] lg:h-[1100px] bg-[#151922] rounded-lg overflow-hidden border border-[#2B3139] shadow-2xl relative" 
            ref={forexRef}
         >
            <div className="tradingview-widget-copyright"></div>
         </div>
       </div>
    </div>
  );
};

export default DashboardContent;