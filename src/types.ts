export interface Expense {
    id: number;
    amount: number;
    currency: Currency;
    timestamp: string;
    category: string;
    description: string;
    account: {
        id: number;
        name: string;
    };
}

export interface NewExpense {
    amount: number;
    currency: string;
    timestamp: string;
    category: string;
    description: string;
    accountId: number;
}

export type Currency = 'EUR' | 'CHF';
