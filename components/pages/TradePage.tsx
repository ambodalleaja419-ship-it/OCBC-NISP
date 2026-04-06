import React, { useEffect, useRef, useState } from 'react';
import { ClockIcon, ChevronDownIcon } from '@heroicons/react/24/outline';

const TradePage: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [amount, setAmount] = useState<string>('50');
  const [duration, setDuration] = useState<string>('3 Hour');

  useEffect(() => {
    if (containerRef.current) {
        // Clear container to prevent duplicates
        containerRef.current.innerHTML = '';

        const script = document.createElement('script');
        script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js';
        script.type = 'text/javascript';
        script.async = true;
        script.innerHTML = JSON.stringify({
          "autosize": true,
          "symbol": "BINANCE:ETHBTC",
          "interval": "1",
          "timezone": "Etc/UTC",
          "theme": "dark",
          "style": "1",
          "locale": "en",
          "enable_publishing": false,
          "hide_top_toolbar": false,
          "hide_legend": false,
          "allow_symbol_change": true, 
          "save_image": false,
          "calendar": false,
          "hide_volume": false,
          "support_host": "https://www.tradingview.com"
        });
        
        const widgetContainer = document.createElement('div');
        widgetContainer.className = "tradingview-widget-container__widget h-full w-full";
        containerRef.current.appendChild(widgetContainer);
        containerRef.current.appendChild(script);
    }
  }, []);

  return (
    <div className="flex flex-col space-y-6 w-full pb-10">
      
      {/* Chart & Trading Controls Container */}
      <div className="flex flex-col h-[600px] w-full bg-[#151922] rounded-lg overflow-hidden border border-gray-800 shadow-xl relative z-10">
        
        {/* Chart Container */}
        <div className="flex-1 relative w-full bg-[#151922]">
           <div className="tradingview-widget-container h-full w-full" ref={containerRef}></div>
        </div>

        {/* Control Bar */}
        <div className="h-20 bg-[#151922] px-4 py-3 grid grid-cols-2 lg:grid-cols-4 gap-3 items-center shrink-0 border-t border-gray-800">
            
            {/* IDR Input */}
            <div className="flex items-center h-12 bg-[#0B0E11] rounded border border-[#2B3139] overflow-hidden">
               <div className="h-full px-4 flex items-center justify-center bg-[#2B3139] text-gray-400 text-sm font-semibold border-r border-[#2B3139]">
                  IDR
               </div>
               <input 
                  type="text" 
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="flex-1 h-full bg-transparent text-white px-3 focus:outline-none font-medium font-mono text-base"
               />
            </div>

            {/* Duration Input */}
            <div className="flex items-center h-12 bg-[#0B0E11] rounded border border-[#2B3139] overflow-hidden relative cursor-pointer group">
               <div className="h-full px-3 flex items-center justify-center bg-[#2B3139] text-gray-400 border-r border-[#2B3139]">
                  <ClockIcon className="w-5 h-5" />
               </div>
               <div className="flex-1 px-3 text-white text-sm font-medium flex items-center justify-between">
                  {duration}
                  <ChevronDownIcon className="w-4 h-4 text-gray-500" />
               </div>
               <select 
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
               >
                  <option value="1 Minute">1 Minute</option>
                  <option value="5 Minutes">5 Minutes</option>
                  <option value="15 Minutes">15 Minutes</option>
                  <option value="1 Hour">1 Hour</option>
                  <option value="3 Hour">3 Hour</option>
                  <option value="1 Day">1 Day</option>
               </select>
            </div>

            {/* Buy Button */}
            <button className="h-12 bg-[#0ECB81] hover:bg-[#0aa86b] text-white font-bold rounded flex items-center justify-center text-lg transition-transform active:scale-95 shadow-lg shadow-green-900/20">
                Buy 99%
            </button>

            {/* Sell Button */}
            <button className="h-12 bg-[#F6465D] hover:bg-[#d93d51] text-white font-bold rounded flex items-center justify-center text-lg transition-transform active:scale-95 shadow-lg shadow-red-900/20">
                Sell 99%
            </button>

        </div>
      </div>

      {/* History Section */}
      <div className="w-full">
         <h3 className="text-gray-300 text-2xl font-normal mb-4 px-1">History</h3>
         <div className="bg-[#1E2329] rounded-lg border border-gray-800 overflow-hidden">
             <div className="overflow-x-auto">
                 <table className="w-full text-left">
                     <thead>
                         <tr className="border-b border-gray-700 bg-[#1E2329] text-gray-500 text-sm font-bold capitalize tracking-wide">
                             <th className="py-4 px-6 whitespace-nowrap">Date</th>
                             <th className="py-4 px-6 whitespace-nowrap">Market</th>
                             <th className="py-4 px-6 whitespace-nowrap">Trx</th>
                             <th className="py-4 px-6 whitespace-nowrap">Package</th>
                             <th className="py-4 px-6 whitespace-nowrap">Amount</th>
                             <th className="py-4 px-6 whitespace-nowrap">Rate Stake</th>
                             <th className="py-4 px-6 whitespace-nowrap">Rate End</th>
                             <th className="py-4 px-6 whitespace-nowrap">Status</th>
                         </tr>
                     </thead>
                     <tbody className="divide-y divide-gray-800">
                         {/* Empty State / Lines to match the visual style of an empty table */}
                         <tr>
                             <td colSpan={8} className="py-6 px-6 border-b border-gray-800 bg-[#1E2329]"></td>
                         </tr>
                         <tr>
                             <td colSpan={8} className="py-6 px-6 border-b border-gray-800 bg-[#1E2329]"></td>
                         </tr>
                     </tbody>
                 </table>
             </div>
         </div>
      </div>

    </div>
  );
};

export default TradePage;