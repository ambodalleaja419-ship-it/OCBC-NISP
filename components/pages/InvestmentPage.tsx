import React from 'react';
import { Trophy, Rocket, Sparkles, ShieldCheck } from 'lucide-react';

const INVESTMENT_PACKAGES = [
  {
    name: 'PAKET BASIC',
    color: 'text-yellow-500',
    icon: Trophy,
    items: [
      { modal: 500000, profit: 14000000 },
      { modal: 700000, profit: 18000000 },
    ]
  },
  {
    name: 'PAKET GOLD',
    color: 'text-white',
    icon: Rocket,
    items: [
      { modal: 1000000, profit: 25000000 },
      { modal: 1500000, profit: 30000000 },
      { modal: 2000000, profit: 50000000 },
      { modal: 2500000, profit: 80000000 },
    ]
  },
  {
    name: 'PAKET PLATINUM',
    color: 'text-cyan-400',
    icon: Sparkles,
    items: [
      { modal: 3500000, profit: 100000000 },
      { modal: 4500000, profit: 120000000 },
      { modal: 5000000, profit: 135000000 },
      { modal: 5500000, profit: 150000000 },
    ]
  },
  {
    name: 'PAKET DIAMOND',
    color: 'text-purple-500',
    icon: ShieldCheck,
    items: [
      { modal: 6000000, profit: 200000000 },
      { modal: 7000000, profit: 220000000 },
      { modal: 8000000, profit: 250000000 },
      { modal: 9000000, profit: 270000000 },
      { modal: 10000000, profit: 300000000 },
    ]
  }
];

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value).replace('Rp', 'Rp ');
};

const InvestmentPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-darkblue text-white py-12 px-4">
      <div className="container mx-auto max-w-7xl">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-black tracking-tight mb-4">
            PAKET <span className="text-blue-500">INVESTASI</span>
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Pilih paket yang sesuai dengan profil risiko Anda. Dapatkan imbal hasil maksimal dengan sistem perdagangan otomatis kami.
          </p>
        </div>

        {/* Packages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {INVESTMENT_PACKAGES.map((pkg) => (
            <div 
              key={pkg.name} 
              className="bg-darkblue2 border border-borderGray rounded-3xl p-8 flex flex-col items-center transition-all hover:scale-[1.02] hover:shadow-2xl"
            >
              <div className={`mb-6 ${pkg.color}`}>
                <pkg.icon size={64} strokeWidth={1.5} />
              </div>
              
              <h3 className={`text-2xl font-black mb-8 uppercase tracking-wider ${pkg.color}`}>
                {pkg.name}
              </h3>

              <div className="w-full space-y-4">
                {pkg.items.map((item, idx) => (
                  <div 
                    key={idx} 
                    className="bg-[#0B0E11] rounded-2xl p-4 border border-borderGray/50"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Modal</span>
                      <span className="text-sm font-bold text-white">{formatCurrency(item.modal)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Hasil</span>
                      <span className={`text-sm font-bold ${pkg.color}`}>{formatCurrency(item.profit)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer Info */}
        <div className="mt-20 flex flex-col md:flex-row justify-between items-center gap-8 py-8 border-t border-borderGray">
          <div className="flex items-center gap-8 opacity-70 grayscale hover:grayscale-0 transition-all">
            <img 
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Otoritas_Jasa_Keuangan_Logo.svg/2560px-Otoritas_Jasa_Keuangan_Logo.svg.png" 
              alt="OJK Logo" 
              className="h-10 object-contain"
              referrerPolicy="no-referrer"
            />
            <img 
              src="https://bappebti.go.id/resources/images/logo_bappebti.png" 
              alt="BAPPEBTI Logo" 
              className="h-10 object-contain"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="text-center md:text-right">
            <p className="text-gray-500 text-sm font-medium">
              PT Bank OCBC NISP Tbk terdaftar dan diawasi oleh OJK, BAPPEBTI serta peserta penjaminan LPS
            </p>
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-16 text-center">
          <button className="bg-primary hover:bg-red-600 text-white font-black py-4 px-12 rounded-full text-xl shadow-xl transition-all transform hover:scale-105 active:scale-95 uppercase tracking-widest">
            Mulai Investasi Sekarang
          </button>
        </div>
      </div>
    </div>
  );
};

export default InvestmentPage;
