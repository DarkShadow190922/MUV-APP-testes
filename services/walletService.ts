
import { Wallet, Transaction, TransactionType, TransactionStatus } from '../types';
import { mockWallet, mockTransactions, currentUser } from './mockData';

export const WalletService = {
  /**
   * Mirrors PHP Wallet::withdraw
   */
  withdraw: async (amount: number, method: string, details: any): Promise<Transaction> => {
    if (mockWallet.balance < amount) {
      throw new Error('Insufficient balance');
    }

    // Update Wallet state
    mockWallet.balance -= amount;
    mockWallet.withdrawn_amount += amount;

    const transaction: Transaction = {
      id: `t_w_${Date.now()}`,
      wallet_id: mockWallet.id,
      type: 'withdrawal',
      amount: amount,
      method: method,
      details: JSON.stringify(details),
      reference_id: `REF_WD_${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
      status: 'pending',
      created_at: new Date().toISOString()
    };

    mockTransactions.unshift(transaction);
    console.log(`[WalletService] Withdrawal initiated: $${amount} via ${method}`);
    
    // Simulate async processing
    setTimeout(() => {
        transaction.status = 'completed';
        transaction.processed_at = new Date().toISOString();
        console.log(`[WalletService] Withdrawal completed: ${transaction.id}`);
    }, 5000);

    return transaction;
  },

  /**
   * Deducts balance directly for tipping or other internal spends.
   */
  deductBalance: (amount: number, type: TransactionType, details: any = {}): Transaction => {
    if (mockWallet.balance < amount) {
      throw new Error('Insufficient balance');
    }

    mockWallet.balance -= amount;

    const transaction: Transaction = {
      id: `t_d_${Date.now()}`,
      wallet_id: mockWallet.id,
      type: type,
      amount: amount,
      method: 'internal_transfer',
      details: JSON.stringify(details),
      reference_id: `REF_DED_${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
      status: 'completed',
      created_at: new Date().toISOString(),
      processed_at: new Date().toISOString()
    };

    mockTransactions.unshift(transaction);
    console.log(`[WalletService] Balance deducted: $${amount} for ${type}`);
    return transaction;
  },

  /**
   * Mirrors PHP Wallet::addEarnings
   */
  addEarnings: (amount: number, type: 'ad' | 'creator_fund' | 'tips' | 'general' | 'brand_partnership' = 'general'): Transaction => {
    mockWallet.balance += amount;
    mockWallet.total_earnings += amount;

    switch (type) {
      case 'ad':
        mockWallet.ad_revenue += amount;
        break;
      case 'creator_fund':
        mockWallet.creator_fund_earnings += amount;
        break;
      case 'tips':
        mockWallet.tips_received += amount;
        break;
    }

    const transaction: Transaction = {
      id: `t_e_${Date.now()}`,
      wallet_id: mockWallet.id,
      type: type === 'tips' ? 'tip_received' : type === 'brand_partnership' ? 'brand_partnership' : 'earning',
      amount: amount,
      method: type,
      reference_id: `REF_ER_${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
      status: 'completed',
      created_at: new Date().toISOString(),
      processed_at: new Date().toISOString()
    };

    mockTransactions.unshift(transaction);
    console.log(`[WalletService] Earning added: $${amount} from ${type}`);
    return transaction;
  },

  getWallet: (): Wallet => {
    return mockWallet;
  },

  getTransactions: (limit: number = 20): Transaction[] => {
    return mockTransactions.slice(0, limit);
  }
};
