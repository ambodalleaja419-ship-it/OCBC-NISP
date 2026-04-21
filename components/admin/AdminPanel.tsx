
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTransactions } from '../../context/TransactionContext';
import { Transaction, TransactionStatus, User, CompanyBankInfo } from '../../types';
import Button from '../common/Button';
import Input from '../common/Input';
import { BanknotesIcon, CreditCardIcon, BuildingLibraryIcon, PlusIcon, MinusIcon, TrashIcon, XMarkIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline';


const AdminPanel: React.FC = () => {
  const { user } = useAuth();
  const {
    getAllUsers,
    updateUserVerification,
    getAllTransactions,
    updateDepositStatus,
    updateWithdrawalStatus,
    companyBankInfoList,
    setCompanyBankInfoList,
    adminUpdateUserBalance,
    adminCreateUser
  } = useTransactions();

  const [activeTab, setActiveTab] = useState<'users' | 'transactions' | 'settings'>('users');
  const [bankList, setBankList] = useState<CompanyBankInfo[]>(companyBankInfoList);
  const [users, setUsers] = useState<User[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // Balance Modal State
  const [isBalanceModalOpen, setIsBalanceModalOpen] = useState(false);
  const [selectedUserForBalance, setSelectedUserForBalance] = useState<User | null>(null);
  const [balanceAmount, setBalanceAmount] = useState('');
  const [balanceOperation, setBalanceOperation] = useState<'add' | 'set' | 'subtract'>('add');

  // Create User Modal State
  const [isCreateUserModalOpen, setIsCreateUserModalOpen] = useState(false);
  const [newUserData, setNewUserData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    password: '',
    balance: 0,
    isVerified: true
  });
  const [createUserError, setCreateUserError] = useState<string | null>(null);
  const [isCreatingUser, setIsCreatingUser] = useState(false);

  useEffect(() => {
    setBankList(companyBankInfoList);
  }, [companyBankInfoList]);

  useEffect(() => {
    if (user?.isAdmin) {
      loadData();
    }
  }, [user, getAllUsers, getAllTransactions]);

  const loadData = async () => {
    try {
      const fetchedUsers = await getAllUsers();
      setUsers(fetchedUsers);
      const fetchedTransactions = await getAllTransactions();
      setTransactions(fetchedTransactions);
    } catch (error) {
      console.error("Error loading admin data", error);
    }
  };

  if (!user || !user.isAdmin) {
    return (
      <div className="container mx-auto text-center text-danger">
        Access Denied: You must be an administrator to view this page.
      </div>
    );
  }

  const handleBankChange = (index: number, field: keyof CompanyBankInfo, value: string) => {
    const updatedList = [...bankList];
    updatedList[index][field] = value;
    setBankList(updatedList);
  };

  const addBank = () => {
    setBankList([...bankList, { bankName: '', accountNumber: '', accountHolderName: '' }]);
  };

  const removeBank = (index: number) => {
    const updatedList = bankList.filter((_, i) => i !== index);
    setBankList(updatedList);
  };

  const handleUpdateBankInfo = () => {
    setCompanyBankInfoList(bankList);
    alert('Company Bank Info Updated!');
  };

  // Balance Modal Handlers
  const openBalanceModal = (u: User) => {
    setSelectedUserForBalance(u);
    setBalanceAmount('');
    setBalanceOperation('add');
    setIsBalanceModalOpen(true);
  };

  const handleBalanceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserForBalance || !balanceAmount) return;

    const amount = parseFloat(balanceAmount);
    if (isNaN(amount)) {
        alert("Please enter a valid number");
        return;
    }

    const finalAmount = balanceOperation === 'subtract' ? -amount : amount;
    const operationType = balanceOperation === 'set' ? 'set' : 'add';

    await adminUpdateUserBalance(selectedUserForBalance.id, finalAmount, operationType);
    setIsBalanceModalOpen(false);
    setSelectedUserForBalance(null);
    setBalanceAmount('');
    loadData(); // Refresh UI
  };

  const handleCreateUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateUserError(null);
    setIsCreatingUser(true);
    
    // Convert balance to number
    const userData = {
      ...newUserData,
      balance: Number(newUserData.balance)
    };

    const result = await adminCreateUser(userData);
    if (result.success) {
        setIsCreateUserModalOpen(false);
        setNewUserData({ fullName: '', email: '', phoneNumber: '', password: '', balance: 0, isVerified: true });
        loadData();
        alert('User created successfully!');
    } else {
        setCreateUserError(result.error || 'Failed to create user.');
    }
    setIsCreatingUser(false);
  };

  const getStatusClass = (status: TransactionStatus): string => {
    switch (status) {
      case TransactionStatus.SUCCESS:
        return 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20';
      case TransactionStatus.PENDING:
        return 'bg-amber-500/10 text-amber-500 border border-amber-500/20';
      case TransactionStatus.REJECTED:
      case TransactionStatus.FAILED:
      case TransactionStatus.CANCELLED:
        return 'bg-slate-500/10 text-slate-400 border border-slate-500/20';
      default:
        return 'bg-gray-700/10 text-gray-400 border border-gray-700/20';
    }
  };

  return (
    <div className="container mx-auto relative">
      <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6">Admin Panel (MOCK)</h2>
      <p className="text-gray-500 mb-8">
        This is a frontend-only simulation of an admin panel. All data and actions are handled client-side via Local Storage and do not represent real backend functionality.
      </p>

      <div className="bg-darkblue2 p-6 rounded-lg shadow-md">
        <div className="flex border-b border-gray-700 mb-6 overflow-x-auto">
          <button
            className={`px-4 py-2 text-base sm:text-lg font-medium whitespace-nowrap ${
              activeTab === 'users' ? 'text-primary border-b-2 border-primary' : 'text-gray-400 hover:text-white'
            }`}
            onClick={() => setActiveTab('users')}
          >
            Manage Users
          </button>
          <button
            className={`ml-4 px-4 py-2 text-base sm:text-lg font-medium whitespace-nowrap ${
              activeTab === 'transactions' ? 'text-primary border-b-2 border-primary' : 'text-gray-400 hover:text-white'
            }`}
            onClick={() => setActiveTab('transactions')}
          >
            Manage Transactions
          </button>
          <button
            className={`ml-4 px-4 py-2 text-base sm:text-lg font-medium whitespace-nowrap ${
              activeTab === 'settings' ? 'text-primary border-b-2 border-primary' : 'text-gray-400 hover:text-white'
            }`}
            onClick={() => setActiveTab('settings')}
          >
            Company Settings
          </button>
        </div>

        {activeTab === 'users' && (
          <div>
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">All Users</h3>
                <Button 
                    variant="primary" 
                    size="sm" 
                    onClick={() => setIsCreateUserModalOpen(true)}
                    className="flex items-center"
                >
                    <PlusIcon className="h-4 w-4 mr-1" /> Create New User
                </Button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-darkblue">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Balance</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Verified</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Admin</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {users.map((u: User) => (
                    <tr key={u.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500 font-sans tabular-nums">{u.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-white">{u.fullName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-300">{u.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-white font-sans tabular-nums">Rp {u.balance.toLocaleString('id-ID')}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-xs sm:text-sm">
                        <span className={`px-2 py-1 inline-flex text-[10px] leading-4 font-bold rounded-md border ${u.isVerified ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-slate-500/10 text-slate-400 border-slate-500/20'}`}>
                          {u.isVerified ? 'VERIFIED' : 'UNVERIFIED'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-xs sm:text-sm">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${u.isAdmin ? 'bg-primary/20 text-primary' : 'bg-gray-700 text-gray-400'}`}>
                          {u.isAdmin ? 'Yes' : 'No'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-xs sm:text-sm font-medium">
                        <div className="flex space-x-2 justify-end">
                            <Button
                                variant="secondary"
                                size="sm"
                                onClick={() => openBalanceModal(u)}
                                className="bg-red-600 hover:bg-red-500 text-white"
                            >
                                Edit Balance
                            </Button>
                            <Button
                                variant={u.isVerified ? 'danger' : 'primary'}
                                size="sm"
                                onClick={async () => {
                                    await updateUserVerification(u.id, !u.isVerified);
                                    await loadData();
                                }}
                            >
                                {u.isVerified ? 'Deactivate' : 'Activate'}
                            </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'transactions' && (
          <div>
            <h3 className="text-xl font-semibold mb-4">All Transactions</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-darkblue">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">User ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {transactions.map((t: Transaction) => (
                    <tr key={t.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500 font-sans tabular-nums">{t.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-300 font-sans tabular-nums">{t.userId}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-white">{t.type}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-white font-sans tabular-nums">Rp {t.amount.toLocaleString('id-ID')}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(t.status)}`}>
                          {t.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500">{new Date(t.date).toLocaleString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-xs sm:text-sm font-medium">
                        {t.status === TransactionStatus.PENDING && (
                          <>
                            <Button
                              variant="primary"
                              size="sm"
                              onClick={async () => {
                                if (t.type === 'DEPOSIT') await updateDepositStatus(t.id, TransactionStatus.SUCCESS);
                                else await updateWithdrawalStatus(t.id, TransactionStatus.SUCCESS);
                                await loadData();
                              }}
                              className="mr-2"
                            >
                              {t.type === 'WITHDRAWAL' ? 'Mark as Done' : 'Approve'}
                            </Button>
                            <Button
                              variant="danger"
                              size="sm"
                              onClick={async () => {
                                if (t.type === 'DEPOSIT') await updateDepositStatus(t.id, TransactionStatus.REJECTED);
                                else await updateWithdrawalStatus(t.id, TransactionStatus.REJECTED);
                                await loadData();
                              }}
                            >
                              Reject
                            </Button>
                          </>
                        )}
                        {(t.status === TransactionStatus.SUCCESS || t.status === TransactionStatus.REJECTED) && (
                           <span className="text-gray-500 text-xs">Actioned</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div>
            <h3 className="text-xl font-semibold mb-4">Company Bank Information for Deposits</h3>
            <div className="space-y-6">
                {bankList.map((bank, index) => (
                    <div key={index} className="bg-darkblue p-4 rounded-md border border-gray-700 relative">
                        <h4 className="font-semibold text-lg mb-4 text-white">Bank Account #{index + 1}</h4>
                        <Input
                            id={`adminBankName-${index}`}
                            label="Bank Name"
                            type="text"
                            icon={<BuildingLibraryIcon />}
                            value={bank.bankName}
                            onChange={(e) => handleBankChange(index, 'bankName', e.target.value)}
                            className="mb-4"
                        />
                        <Input
                            id={`adminAccountNumber-${index}`}
                            label="Account Number"
                            type="text"
                            icon={<CreditCardIcon />}
                            value={bank.accountNumber}
                            onChange={(e) => handleBankChange(index, 'accountNumber', e.target.value)}
                            className="mb-4"
                        />
                        <Input
                            id={`adminAccountHolderName-${index}`}
                            label="Account Holder Name"
                            type="text"
                            icon={<BanknotesIcon />}
                            value={bank.accountHolderName}
                            onChange={(e) => handleBankChange(index, 'accountHolderName', e.target.value)}
                            className="mb-4"
                        />
                        <Button onClick={() => removeBank(index)} variant="danger" size="sm" className="absolute top-4 right-4 !p-2">
                          <TrashIcon className="h-4 w-4" />
                        </Button>
                    </div>
                ))}
            </div>
            <div className="mt-6 flex justify-between items-center">
              <Button onClick={addBank} variant="secondary" size="md">
                  <PlusIcon className="h-5 w-5 mr-2" /> Add New Bank Account
              </Button>
              <Button onClick={handleUpdateBankInfo} variant="primary" size="lg">
                  Save All Changes
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Balance Edit Modal */}
      {isBalanceModalOpen && selectedUserForBalance && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <div className="bg-darkblue2 border border-gray-700 rounded-lg shadow-2xl w-full max-w-md overflow-hidden animate-fade-in">
                <div className="bg-darkblue p-4 border-b border-gray-700 flex justify-between items-center">
                    <h3 className="text-white text-lg font-semibold flex items-center">
                        <CurrencyDollarIcon className="w-5 h-5 mr-2 text-primary" />
                        Edit Balance
                    </h3>
                    <button onClick={() => setIsBalanceModalOpen(false)} className="text-gray-400 hover:text-white">
                        <XMarkIcon className="w-6 h-6" />
                    </button>
                </div>
                
                <form onSubmit={handleBalanceSubmit} className="p-6">
                    <div className="mb-4">
                        <p className="text-sm text-gray-400 mb-1">Target User:</p>
                        <p className="text-white font-medium text-lg">{selectedUserForBalance.fullName} <span className="text-gray-500 text-sm">({selectedUserForBalance.email})</span></p>
                    </div>
                    
                    <div className="mb-6">
                         <p className="text-sm text-gray-400 mb-1">Current Balance:</p>
                         <p className="text-2xl font-sans tabular-nums font-bold text-white">Rp {selectedUserForBalance.balance.toLocaleString('id-ID')}</p>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm text-gray-400 mb-2">Operation</label>
                            <div className="flex space-x-4">
                                <label className={`flex-1 cursor-pointer border rounded-lg p-3 flex items-center justify-center transition-colors ${balanceOperation === 'add' ? 'bg-primary/20 border-primary text-white' : 'border-gray-700 text-gray-400 hover:bg-gray-800'}`}>
                                    <input 
                                        type="radio" 
                                        name="operation" 
                                        value="add" 
                                        checked={balanceOperation === 'add'} 
                                        onChange={() => setBalanceOperation('add')}
                                        className="hidden" 
                                    />
                                    <PlusIcon className="w-4 h-4 mr-2" />
                                    Add Amount
                                </label>
                                <label className={`flex-1 cursor-pointer border rounded-lg p-3 flex items-center justify-center transition-colors ${balanceOperation === 'subtract' ? 'bg-danger/20 border-danger text-white' : 'border-gray-700 text-gray-400 hover:bg-gray-800'}`}>
                                    <input 
                                        type="radio" 
                                        name="operation" 
                                        value="subtract" 
                                        checked={balanceOperation === 'subtract'} 
                                        onChange={() => setBalanceOperation('subtract')}
                                        className="hidden" 
                                    />
                                    <MinusIcon className="h-4 w-4 mr-2" />
                                    Subtract
                                </label>
                                <label className={`flex-1 cursor-pointer border rounded-lg p-3 flex items-center justify-center transition-colors ${balanceOperation === 'set' ? 'bg-warning/20 border-warning text-white' : 'border-gray-700 text-gray-400 hover:bg-gray-800'}`}>
                                    <input 
                                        type="radio" 
                                        name="operation" 
                                        value="set" 
                                        checked={balanceOperation === 'set'} 
                                        onChange={() => setBalanceOperation('set')}
                                        className="hidden" 
                                    />
                                    <BanknotesIcon className="w-4 h-4 mr-2" />
                                    Set Total
                                </label>
                            </div>
                        </div>

                        <Input 
                            id="adminBalanceInput"
                            label={balanceOperation === 'add' ? "Amount to Add (Rp)" : "New Total Balance (Rp)"}
                            type="number"
                            placeholder="0"
                            value={balanceAmount}
                            onChange={(e) => setBalanceAmount(e.target.value)}
                            icon={<CurrencyDollarIcon />}
                            className="font-sans tabular-nums"
                        />
                    </div>

                    <div className="mt-8 flex space-x-3">
                        <Button type="button" variant="secondary" fullWidth onClick={() => setIsBalanceModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" variant="primary" fullWidth>
                            Confirm Update
                        </Button>
                    </div>
                </form>
            </div>
        </div>
      )}

      {/* Create User Modal */}
      {isCreateUserModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <div className="bg-darkblue2 border border-gray-700 rounded-lg shadow-2xl w-full max-w-md overflow-hidden animate-fade-in">
                <div className="bg-darkblue p-4 border-b border-gray-700 flex justify-between items-center">
                    <h3 className="text-white text-lg font-semibold flex items-center">
                        <PlusIcon className="w-5 h-5 mr-2 text-primary" />
                        Create New User
                    </h3>
                    <button onClick={() => setIsCreateUserModalOpen(false)} className="text-gray-400 hover:text-white">
                        <XMarkIcon className="w-6 h-6" />
                    </button>
                </div>
                
                <form onSubmit={handleCreateUserSubmit} className="p-6 space-y-4">
                    {createUserError && (
                        <div className="bg-danger/10 border border-danger text-danger p-3 rounded-md text-sm">
                            {createUserError}
                        </div>
                    )}

                    <Input 
                        id="newFullName"
                        label="Full Name"
                        type="text"
                        placeholder="John Doe"
                        value={newUserData.fullName}
                        onChange={(e) => setNewUserData({...newUserData, fullName: e.target.value})}
                        required
                    />

                    <Input 
                        id="newEmail"
                        label="Email Address"
                        type="email"
                        placeholder="john@example.com"
                        value={newUserData.email}
                        onChange={(e) => setNewUserData({...newUserData, email: e.target.value})}
                        required
                    />

                    <Input 
                        id="newPhone"
                        label="Phone Number"
                        type="text"
                        placeholder="08123456789"
                        value={newUserData.phoneNumber}
                        onChange={(e) => setNewUserData({...newUserData, phoneNumber: e.target.value})}
                        required
                    />

                    <Input 
                        id="newPassword"
                        label="Password"
                        type="password"
                        placeholder="••••••••"
                        value={newUserData.password}
                        onChange={(e) => setNewUserData({...newUserData, password: e.target.value})}
                        required
                    />

                    <Input 
                        id="newBalance"
                        label="Initial Balance (Rp)"
                        type="number"
                        placeholder="0"
                        value={newUserData.balance}
                        onChange={(e) => setNewUserData({...newUserData, balance: Number(e.target.value)})}
                        icon={<CurrencyDollarIcon />}
                    />

                    <div className="flex items-center space-x-3 bg-darkblue p-3 rounded-lg border border-gray-700">
                        <input
                            id="newIsVerified"
                            type="checkbox"
                            className="w-5 h-5 rounded border-gray-700 bg-gray-800 text-primary focus:ring-primary"
                            checked={newUserData.isVerified}
                            onChange={(e) => setNewUserData({...newUserData, isVerified: e.target.checked})}
                        />
                        <label htmlFor="newIsVerified" className="text-sm font-medium text-white cursor-pointer select-none">
                            Verify Account Automatically
                        </label>
                    </div>

                    <div className="mt-8 flex space-x-3 pt-4">
                        <Button type="button" variant="secondary" fullWidth onClick={() => setIsCreateUserModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" variant="primary" fullWidth disabled={isCreatingUser}>
                            {isCreatingUser ? 'Creating...' : 'Create User'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
