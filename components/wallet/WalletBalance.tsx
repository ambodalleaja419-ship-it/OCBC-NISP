import React from 'react';
import { useTransactions } from '../../context/TransactionContext';
import WalletLayout from './WalletLayout';
import { BanknotesIcon } from '@heroicons/react/24/outline';

const WalletBalance: React.FC = () => {
  const { balance } = useTransactions();

  return (
    <WalletLayout>
        <div className="bg-darkblue2 border border-borderGray rounded-lg p-8 text-center">
            <div className="inline-block p-4 bg-primary/20 rounded-full mb-4">
                <BanknotesIcon className="w-12 h-12 text-primary" />
            </div>
            <h3 className="text-gray-400 text-lg mb-2">Total Available Balance</h3>
            <h1 className="text-4xl text-white font-bold font-sans tabular-nums mb-6">Rp {balance.toLocaleString('id-ID')}</h1>
            <p className="text-gray-500 text-sm max-w-md mx-auto">
                This balance can be used for trading, investment, or withdrawn to your registered bank account.
            </p>
        </div>
    </WalletLayout>
  );
};

export default WalletBalance;