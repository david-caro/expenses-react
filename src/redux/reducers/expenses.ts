import { AnyAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { Expense, NewExpense } from '../../types';
import { client } from '../../utilities/client';
import { RootState } from '../store';

export enum Status {
    IDLE = 'IDLE',
    LOADING = 'LOADING',
    COMPLETED = 'COMPLETED',
    FAILED = 'FAILED',
}

const now = new Date();
const FIRST_DAY_OF_MONTH = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
const LAST_DAY_OF_MONTH = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString();

const initialState = {
    expenses: [] as Expense[],
    status: Status.IDLE,
    error: null,
    fromDate: FIRST_DAY_OF_MONTH,
    toDate: LAST_DAY_OF_MONTH,
};

export const fetchExpenses = createAsyncThunk('expenses/fetchExpenses', async () => {
    const response = await client.get('/api/expenses');
    return response;
});

export const addExpense = createAsyncThunk(
    'expenses/addExpense',
    async (payload: { expense: NewExpense }): Promise<Expense> => {
        console.log(payload);
        const response = await client.post('/api/expenses', payload.expense);
        return response;
    }
);

const expensesSlice = createSlice({
    name: 'expenses',
    initialState,
    reducers: {
        expenseUpdated(state, action) {
            let existingExpense = state.expenses.find((expense) => expense.id === action.payload.id);
            if (existingExpense) {
                existingExpense = {
                    ...existingExpense,
                    ...action.payload,
                };
            }
        },
        updateFromDate(state, action: { type: string; payload: string }) {
            state.fromDate = action.payload;
        },
        updateToDate(state, action: { type: string; payload: string }) {
            state.toDate = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder.addCase('expenses/fetchExpenses/pending', (state) => {
            state.status = Status.LOADING;
        });
        builder.addCase('expenses/fetchExpenses/fulfilled', (state, action: AnyAction) => {
            state.status = Status.COMPLETED;
            state.expenses = state.expenses.concat(action.payload);
        });
        builder.addCase('expenses/fetchExpenses/rejected', (state, action: AnyAction) => {
            state.status = Status.FAILED;
            state.error = action.error.message;
        });
        builder.addCase('expenses/addExpense/fulfilled', (state, action: AnyAction) => {
            state.expenses.unshift(action.payload);
        });
    },
});

export const { expenseUpdated, updateFromDate, updateToDate } = expensesSlice.actions;

export default expensesSlice.reducer;

export const selectAllExpenses = (state: RootState): Expense[] => state.expenses.expenses;

export const selectExpensesInRange = (state: RootState): Expense[] => {
    const allExpenses = selectAllExpenses(state);
    return allExpenses.filter(
        (expense) =>
            new Date(expense.timestamp) >= new Date(state.expenses.fromDate) &&
            new Date(expense.timestamp) <= new Date(state.expenses.toDate)
    );
};

export const selectAmountInEuros = (state: RootState): number => {
    const expenses = selectExpensesInRange(state);
    const total = expenses.reduce((acc, expense) => {
        if (expense.currency === 'CHF') {
            return acc + +chfToEuro(expense.amount).toFixed(2);
        } else {
            return acc + expense.amount;
        }
    }, 0);
    return total;
};

export function chfToEuro(amount: number): number {
    return amount / CONVERSION_RATE_EUR_TO_CHF;
}

export function euroToChf(amount: number): number {
    return amount * CONVERSION_RATE_EUR_TO_CHF;
}

export const CONVERSION_RATE_EUR_TO_CHF = 1.1;
