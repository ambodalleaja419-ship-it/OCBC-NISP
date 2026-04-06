import {
  Transaction,
  DepositTransaction,
  WithdrawalTransaction,
  TransferTransaction,
  TransactionType,
  TransactionStatus,
  CompanyBankInfo,
} from '../types';
import { supabase } from './supabaseClient';
import * as authService from './authService';

export const getCompanyBankInfoList = async (): Promise<CompanyBankInfo[]> => {
  const { data, error } = await supabase
    .from('company_bank_info')
    .select('*');
  
  if (error || !data) return [];
  
  return data.map((item: any) => ({
    id: item.id,
    bankName: item.bank_name,
    accountNumber: item.account_number,
    accountHolderName: item.account_holder_name
  }));
};

export const setCompanyBankInfoList = async (infoList: CompanyBankInfo[]): Promise<void> => {
  await supabase.from('company_bank_info').delete().neq('id', '00000000-0000-0000-0000-000000000000'); 
  
  const dbItems = infoList.map(i => ({
    bank_name: i.bankName,
    account_number: i.accountNumber,
    account_holder_name: i.accountHolderName
  }));

  await supabase.from('company_bank_info').insert(dbItems);
};

export const deposit = async (userId: string, amount: number): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('transactions')
      .insert([{
        user_id: userId,
        type: TransactionType.DEPOSIT,
        amount: amount,
        method: 'Bank Transfer',
        status: TransactionStatus.PENDING,
        date: new Date().toISOString(),
      }]);

    if (error) throw error;

    await authService.addUserNotification(userId, `Your deposit of Rp ${amount.toLocaleString('id-ID')} is pending approval.`);
    return true;
  } catch (e) {
    console.error("Deposit error", e);
    return false;
  }
};

export const withdraw = async (
  userId: string,
  amount: number,
  method: string,
  bankOrEwalletName: string,
  accountNumber: string,
  accountHolderName: string,
): Promise<boolean> => {
  try {
    const user = await authService.getCurrentUser();
    if (!user || user.balance < amount) return false;

    // 1. Deduct balance (Optimistic)
    const newBalance = user.balance - amount;
    await authService.updateUserBalance(userId, newBalance);

    // 2. Create Transaction
    const { error } = await supabase
      .from('transactions')
      .insert([{
        user_id: userId,
        type: TransactionType.WITHDRAWAL,
        amount: amount,
        method: method,
        bank_or_ewallet_name: bankOrEwalletName,
        account_number: accountNumber,
        account_holder_name: accountHolderName,
        status: TransactionStatus.PENDING,
        date: new Date().toISOString(),
      }]);

    if (error) {
      // Rollback balance if transaction fails
      await authService.updateUserBalance(userId, user.balance);
      throw error;
    }

    await authService.addUserNotification(userId, `Your balance has been reduced by Rp ${amount.toLocaleString('id-ID')} for a pending withdrawal.`);
    return true;
  } catch (e) {
    console.error("Withdrawal error", e);
    return false;
  }
};

export const transfer = async (userId: string, recipientEmail: string, amount: number): Promise<{ success: boolean; message: string }> => {
  try {
    const sender = await authService.getCurrentUser();
    if (!sender || sender.balance < amount) {
        return { success: false, message: 'Insufficient balance.' };
    }

    // Find Recipient
    const { data: recipientData, error: recipientError } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', recipientEmail)
        .single();
    
    if (recipientError || !recipientData) {
        return { success: false, message: 'Recipient email not found.' };
    }

    // Deduct from Sender
    await authService.updateUserBalance(sender.id, sender.balance - amount);
    
    // Add to Recipient
    await authService.updateUserBalance(recipientData.id, recipientData.balance + amount);

    // Record Transaction (Sender Side)
    await supabase.from('transactions').insert([{
        user_id: userId,
        type: TransactionType.TRANSFER,
        amount: amount,
        method: 'Internal Transfer',
        status: TransactionStatus.SUCCESS,
        date: new Date().toISOString(),
        bank_or_ewallet_name: recipientEmail // Storing recipient in this field for simplicity
    }]);

    await authService.addUserNotification(sender.id, `Transferred Rp ${amount.toLocaleString('id-ID')} to ${recipientEmail}.`);
    await authService.addUserNotification(recipientData.id, `Received Rp ${amount.toLocaleString('id-ID')} from ${sender.email}.`);

    return { success: true, message: 'Transfer successful.' };

  } catch (e: any) {
    console.error("Transfer error", e);
    return { success: false, message: e.message || 'Transfer failed.' };
  }
};

export const getDepositHistory = async (userId: string): Promise<DepositTransaction[]> => {
  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .eq('user_id', userId)
    .eq('type', TransactionType.DEPOSIT)
    .order('date', { ascending: false });

  if (error) return [];

  return data.map((t: any) => ({
    id: t.id,
    userId: t.user_id,
    type: TransactionType.DEPOSIT,
    amount: t.amount,
    method: t.method,
    status: t.status,
    date: t.date,
    companyBankInfoList: [] 
  }));
};

export const getWithdrawalHistory = async (userId: string): Promise<WithdrawalTransaction[]> => {
  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .eq('user_id', userId)
    .eq('type', TransactionType.WITHDRAWAL)
    .order('date', { ascending: false });

  if (error) return [];

  return data.map((t: any) => ({
    id: t.id,
    userId: t.user_id,
    type: TransactionType.WITHDRAWAL,
    amount: t.amount,
    method: t.method,
    bankOrEwalletName: t.bank_or_ewallet_name,
    accountNumber: t.account_number,
    accountHolderName: t.account_holder_name,
    status: t.status,
    date: t.date,
  }));
};

export const getAllTransactions = async (): Promise<Transaction[]> => {
  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .order('date', { ascending: false });

  if (error) return [];

  return data.map((t: any) => {
    const base = {
      id: t.id,
      userId: t.user_id,
      amount: t.amount,
      status: t.status,
      date: t.date,
      method: t.method,
    };
    if (t.type === TransactionType.DEPOSIT) {
      return { ...base, type: TransactionType.DEPOSIT } as DepositTransaction;
    } else if (t.type === TransactionType.TRANSFER) {
      return { ...base, type: TransactionType.TRANSFER, recipientEmail: t.bank_or_ewallet_name } as TransferTransaction;
    } else {
      return {
        ...base,
        type: TransactionType.WITHDRAWAL,
        bankOrEwalletName: t.bank_or_ewallet_name,
        accountNumber: t.account_number,
        accountHolderName: t.account_holder_name
      } as WithdrawalTransaction;
    }
  });
};

export const updateDepositStatus = async (depositId: string, status: TransactionStatus): Promise<boolean> => {
  // ... (Existing implementation) ...
  // Returning to keep concise, but logic remains same as provided previously
  try {
    const { data: t } = await supabase.from('transactions').select('*').eq('id', depositId).single();
    if (!t) return false;

    const { error } = await supabase
      .from('transactions')
      .update({ status: status })
      .eq('id', depositId);
    
    if (error) throw error;

    if (t.status !== TransactionStatus.SUCCESS && status === TransactionStatus.SUCCESS) {
        const { data: profile } = await supabase.from('profiles').select('balance').eq('id', t.user_id).single();
        if (profile) {
            await authService.updateUserBalance(t.user_id, profile.balance + t.amount);
            await authService.addUserNotification(t.user_id, `Your deposit of Rp ${t.amount.toLocaleString('id-ID')} is successful!`);
        }
    } else if (t.status === TransactionStatus.SUCCESS && status !== TransactionStatus.SUCCESS) {
        const { data: profile } = await supabase.from('profiles').select('balance').eq('id', t.user_id).single();
        if (profile) {
            await authService.updateUserBalance(t.user_id, profile.balance - t.amount);
            await authService.addUserNotification(t.user_id, `Your deposit of Rp ${t.amount.toLocaleString('id-ID')} has been reverted to ${status}.`);
        }
    }
    await authService.addUserNotification(t.user_id, `Your deposit #${depositId} status updated to ${status}.`);
    return true;
  } catch (e) {
    console.error(e);
    return false;
  }
};

export const updateWithdrawalStatus = async (withdrawalId: string, status: TransactionStatus): Promise<boolean> => {
  try {
    const { data: t } = await supabase.from('transactions').select('*').eq('id', withdrawalId).single();
    if (!t) return false;

    const { error } = await supabase
      .from('transactions')
      .update({ status: status })
      .eq('id', withdrawalId);

    if (error) throw error;

    if (t.status === TransactionStatus.PENDING && (status === TransactionStatus.REJECTED || status === TransactionStatus.CANCELLED)) {
       const { data: profile } = await supabase.from('profiles').select('balance').eq('id', t.user_id).single();
       if (profile) {
          await authService.updateUserBalance(t.user_id, profile.balance + t.amount);
          await authService.addUserNotification(t.user_id, `Your withdrawal of Rp ${t.amount.toLocaleString('id-ID')} was ${status}, and your balance has been restored.`);
       }
    }
    await authService.addUserNotification(t.user_id, `Your withdrawal #${withdrawalId} status updated to ${status}.`);
    return true;
  } catch (e) {
    console.error(e);
    return false;
  }
};