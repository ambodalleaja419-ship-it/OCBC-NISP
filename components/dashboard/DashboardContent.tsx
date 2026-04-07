import React, { useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Users, Gift, TrendingUp, Wallet, Newspaper, Bell, ExternalLink } from 'lucide-react';

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
        script.innerHTML = JSON.stringify({
          "width": "100%",
          "height": "100%",
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

  const summaryCards = [
    {
      title: 'Referral',
      subtitle: 'TOTAL MEMBER',
      value: '0 member',
      icon: <Users className="w-6 h-6 text-blue-400" />,
      bg: 'bg-[#1a1f2e]',
      accent: 'text-blue-400'
    },
    {
      title: 'Bonus',
      subtitle: 'TOTAL BONUS',
      value: 'Rp 0',
      icon: <Gift className="w-6 h-6 text-yellow-500" />,
      bg: 'bg-[#1a1f2e]',
      accent: 'text-yellow-500'
    },
    {
      title: 'Profit',
      subtitle: 'TOTAL PROFIT',
      value: 'Rp 0',
      icon: <TrendingUp className="w-6 h-6 text-blue-500" />,
      bg: 'bg-[#1a1f2e]',
      accent: 'text-blue-500'
    },
    {
      title: 'IDR Wallet',
      subtitle: 'SALDO ANDA',
      value: `Rp ${user?.balance?.toLocaleString('id-ID') || '0'}`,
      icon: <Wallet className="w-6 h-6 text-orange-500" />,
      bg: 'bg-[#1a1f2e]',
      accent: 'text-orange-500'
    }
  ];

  const newsItems = [
    { id: 1, title: 'GIVE AWAY END OF THE YEAR', date: '04-MAR-2023, 18:24:56' },
    { id: 2, title: 'PUM Coin Go Turkiye', date: '27-FEB-2023, 07:57:23' },
    { id: 3, title: 'Technical Analysis at DailyFX', date: '10-AUG-2022, 14:37:34' }
  ];

  return (
    <div className="w-full flex flex-col space-y-6">
       
       {/* Forex Cross Rates Section */}
       <div className="space-y-4">
         <div className="flex items-center space-x-2 mb-2">
           <TrendingUp className="w-5 h-5 text-red-500" />
           <h2 className="text-lg font-bold text-white">Ikhtisar Pasar</h2>
         </div>
         <div 
            className="tradingview-widget-container w-full h-[800px] sm:h-[850px] lg:h-[1100px] bg-[#151922] rounded-xl overflow-hidden border border-gray-800 shadow-2xl relative" 
            ref={forexRef}
         >
            <div className="tradingview-widget-copyright"></div>
         </div>
       </div>

       {/* Summary Cards */}
       <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {summaryCards.map((card, idx) => (
            <div key={idx} className={`${card.bg} p-5 rounded-xl border border-gray-800 relative overflow-hidden group hover:border-gray-700 transition-all`}>
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gray-800/50 rounded-lg">
                    {card.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white leading-none">{card.title}</h3>
                    <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-wider">{card.subtitle}</p>
                  </div>
                </div>
                <button className="text-[10px] bg-gray-800 hover:bg-gray-700 text-gray-400 px-2 py-1 rounded transition-colors">
                  Detail
                </button>
              </div>
              <div className="mt-6">
                <p className="text-2xl font-bold text-white">{card.value}</p>
              </div>
              {/* Decorative wave-like background element */}
              <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
            </div>
          ))}
       </div>

       {/* Referral Link Section */}
       <div className="bg-[#1a1f2e] p-4 rounded-xl border border-gray-800">
          <p className="text-xs text-gray-500 mb-2 uppercase tracking-wider font-semibold">Your Referral Link</p>
          <div className="flex flex-col sm:flex-row gap-3">
            <input 
                type="text" 
                readOnly 
                value={referralLink}
                className="flex-1 bg-[#0d1117] border border-gray-700 text-gray-300 px-4 py-3 rounded-lg text-sm focus:outline-none focus:border-red-500 transition-colors"
            />
            <button 
                className="bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-3 rounded-lg text-sm transition-colors shadow-lg shadow-red-600/20 whitespace-nowrap flex items-center justify-center gap-2"
                onClick={() => navigator.clipboard.writeText(referralLink)}
            >
                Copy URL
            </button>
          </div>
       </div>

       {/* News and Notifications */}
       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Berita Terbaru */}
          <div className="bg-[#1a1f2e] p-6 rounded-xl border border-gray-800">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center space-x-2">
                <Newspaper className="w-5 h-5 text-red-500" />
                <h2 className="text-lg font-bold text-white">Berita Terbaru</h2>
              </div>
              <button className="text-xs text-blue-400 hover:underline">Lihat Semua</button>
            </div>
            <div className="space-y-4">
              {newsItems.map((item) => (
                <div key={item.id} className="flex items-start space-x-4 p-3 rounded-lg hover:bg-gray-800/50 transition-colors cursor-pointer group">
                  <div className="p-2 bg-gray-800 rounded-lg group-hover:bg-red-900/20 transition-colors">
                    <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-red-400" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-200 group-hover:text-white transition-colors">{item.title}</h4>
                    <p className="text-[10px] text-gray-500 mt-1 uppercase">{item.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Notifikasi */}
          <div className="bg-[#1a1f2e] p-6 rounded-xl border border-gray-800">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center space-x-2">
                <Bell className="w-5 h-5 text-red-500" />
                <h2 className="text-lg font-bold text-white">Notifikasi</h2>
              </div>
              <button className="text-xs text-blue-400 hover:underline">Bersihkan</button>
            </div>
            <div className="flex flex-col items-center justify-center h-[200px] text-gray-500">
              <div className="p-4 bg-gray-800/30 rounded-full mb-4">
                <Bell className="w-8 h-8 opacity-20" />
              </div>
              <p className="text-sm italic">Tidak ada notifikasi baru.</p>
            </div>
          </div>
       </div>
    </div>
  );
};

export default DashboardContent;
