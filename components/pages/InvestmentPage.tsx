import React from 'react';

const INVESTMENT_PACKAGES = [
  {
    name: 'PAKET BASIC',
    color: 'text-red-500',
    items: [
      { modal: 500000, profit: 14000000 },
      { modal: 700000, profit: 18000000 },
    ]
  },
  {
    name: 'PAKET GOLD',
    color: 'text-yellow-500',
    items: [
      { modal: 1000000, profit: 25000000 },
      { modal: 1500000, profit: 30000000 },
      { modal: 2000000, profit: 50000000 },
      { modal: 2500000, profit: 80000000 },
    ]
  },
  {
    name: 'PAKET PLATINUM',
    color: 'text-blue-400',
    items: [
      { modal: 3500000, profit: 100000000 },
      { modal: 4500000, profit: 120000000 },
      { modal: 5000000, profit: 135000000 },
      { modal: 5500000, profit: 150000000 },
    ]
  },
  {
    name: 'PAKET DIAMOND',
    color: 'text-purple-400',
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
    <div className="container mx-auto p-4 md:p-6 lg:p-8 max-w-6xl">
      <div className="bg-white rounded-2xl shadow-2xl overflow-hidden text-gray-800">
        {/* Header Section */}
        <div className="p-8 border-b border-gray-100 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <h1 className="text-4xl font-black tracking-tighter text-gray-900 uppercase leading-tight">
              DAFTAR PAKET INVESTASI
            </h1>
            <h2 className="text-5xl font-black tracking-tighter text-red-600 uppercase leading-none mt-1">
              OCBC NISP
            </h2>
            <p className="text-green-500 font-semibold mt-4 text-lg">
              Paket Aktif Setelah Pembayaran Modal
            </p>
          </div>
          <div className="flex flex-col items-center">
            <img 
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/OCBC_Logo.svg/1200px-OCBC_Logo.svg.png" 
              alt="OCBC NISP Logo" 
              className="h-24 object-contain"
              referrerPolicy="no-referrer"
            />
            <p className="text-gray-600 font-medium text-center mt-2 leading-tight">
              Terus bersama,<br />melaju jauh
            </p>
          </div>
        </div>

        {/* Packages Grid */}
        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-10">
          {INVESTMENT_PACKAGES.map((pkg) => (
            <div key={pkg.name} className="space-y-4">
              <h3 className={`text-2xl font-black ${pkg.color} border-b-2 border-gray-100 pb-2`}>
                {pkg.name}
              </h3>
              <div className="space-y-2">
                {pkg.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center text-lg font-bold">
                    <span className="text-gray-700">
                      Modal <span className="text-gray-900">{formatCurrency(item.modal)}</span>
                    </span>
                    <span className="text-green-500">
                      Profit <span className="text-green-600">{formatCurrency(item.profit)}</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer Section */}
        <div className="p-8 bg-gray-50 flex flex-col md:flex-row justify-between items-center gap-8 border-t border-gray-200">
          <div className="flex items-center gap-6">
            <img 
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Otoritas_Jasa_Keuangan_Logo.svg/2560px-Otoritas_Jasa_Keuangan_Logo.svg.png" 
              alt="OJK Logo" 
              className="h-12 object-contain"
              referrerPolicy="no-referrer"
            />
            <img 
              src="https://bappebti.go.id/resources/images/logo_bappebti.png" 
              alt="BAPPEBTI Logo" 
              className="h-12 object-contain"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="text-center md:text-right max-w-md">
            <p className="text-gray-600 text-sm font-medium leading-relaxed">
              PT Bank OCBC NISP Tbk terdaftar dan diawasi oleh OJK, BAPPEBTI serta peserta penjaminan LPS
            </p>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <div className="mt-10 text-center">
        <button className="bg-red-600 hover:bg-red-700 text-white font-black py-4 px-12 rounded-full text-xl shadow-xl transition-all transform hover:scale-105 active:scale-95 uppercase tracking-widest">
          Mulai Investasi Sekarang
        </button>
      </div>
    </div>
  );
};

export default InvestmentPage;
