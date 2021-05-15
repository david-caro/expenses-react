import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './App.css';
import { DateRangePicker } from './components/DateRangePicker';
import { TotalAmount } from './components/TotalAmount';
import { fetchExpenses, selectAmountInEuros, selectExpensesInRange, Status, updateFromDate, updateToDate } from './redux/reducers/expenses';
import { RootState } from './redux/store';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import { ExpenseItem } from './components/ExpenseItem';
import { AddExpenseDialog } from './components/AddExpenseDialog';

const useStyles = makeStyles((theme) => ({
    buttonContainer: {
        display: 'flex',
        justifyContent: 'space-between',
        margin: '8px 36px',
    },
    button: {
        minWidth: '90px',
        fontWeight: 'bold',
        textTransform: 'capitalize',
    },
    content: {
        margin: '24px 36px',
    },
}));

function ExpensesApp(): JSX.Element {
    const dispatch = useDispatch();
    const expenses = useSelector(selectExpensesInRange);
    const amountInEuros = useSelector(selectAmountInEuros);
    const expensesStatus = useSelector((state: RootState) => state.expenses.status);
    const fromDate = useSelector((state: RootState) => state.expenses.fromDate);
    const toDate = useSelector((state: RootState) => state.expenses.toDate);
    const error = useSelector((state: RootState) => state.expenses.error);
    const classes = useStyles();

    const [openAddExpense, setOpenAddExpense] = useState(false);
    const handleOpenAddExpense = () => {
        setOpenAddExpense(true);
    };
    const handleCloseAddExpense = () => {
        setOpenAddExpense(false);
    };

    useEffect(() => {
        if (expensesStatus === Status.IDLE) {
            dispatch(fetchExpenses());
        }
    }, [expensesStatus, dispatch]);

    let content;
    if (expensesStatus === Status.LOADING) {
        content = <div className="loader">Loading...</div>;
    } else if (expensesStatus === Status.COMPLETED) {
        content = expenses.map((expense) => <ExpenseItem expense={expense} key={expense.id} />);
    } else if (expensesStatus === Status.FAILED) {
        content = <div>{error}</div>;
    }

    const onFromDateChanged = (newFromDate: Date) => {
        dispatch(updateFromDate(newFromDate.toISOString()));
    };

    function onToDateChanged(newToDate: Date) {
        dispatch(updateToDate(newToDate.toISOString()));
    }

    return (
        <div>
            <DateRangePicker fromDate={fromDate} toDate={toDate} onFromDateChanged={onFromDateChanged} onToDateChanged={onToDateChanged} />
            <TotalAmount amountInEuros={amountInEuros} />
            <div className={classes.buttonContainer}>
                <Button variant="contained" color="primary" className={classes.button}>
                    Show All
                </Button>
                <Button variant="contained" color="primary" className={classes.button} onClick={handleOpenAddExpense}>
                    Add
                </Button>
                <AddExpenseDialog open={openAddExpense} handleClose={handleCloseAddExpense} />
            </div>
            <div className={classes.content}>{content}</div>
        </div>
    );
}

export default ExpensesApp;
