import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { ADD_EXPENSE } from '../redux/actions';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { makeStyles } from '@material-ui/core';
import MenuItem from '@material-ui/core/MenuItem';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import DatePicker from 'react-datepicker';
import { format } from 'date-fns';
import { CategoryIcon } from './CategoryIcon';
import { Currency, Expense, NewExpense } from '../types';
import { addExpense } from '../redux/reducers/expenses';

const useStyles = makeStyles((theme) => ({
    paper: {
        background: theme.palette.secondary.main,
    },
    flex: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    textFieldGroup: {
        display: 'flex',
        flexWrap: 'wrap',
        width: '100%',
    },
    textField: {
        marginLeft: theme.spacing(0.5),
        marginRight: theme.spacing(0.5),
    },
    selectedCategory: {
        marginLeft: theme.spacing(0.5),
        marginRight: theme.spacing(0.5),
        '& .MuiSelect-selectMenu': {
            display: 'flex',
            alignItems: 'end',
            '& svg': {
                marginRight: '12px',
            },
        },
    },
    categoryOptions: {
        display: 'flex',
        alignItems: 'center',
        '& div': {
            lineHeight: '1em',
            marginLeft: '12px',
        },
    },
}));

const currencies: { value: Currency; label: string }[] = [
    {
        value: 'EUR',
        label: '€',
    },
    {
        value: 'CHF',
        label: 'chf',
    },
];

const accounts = [
    {
        value: 0,
        label: 'Joint Revolut',
    },
    {
        value: 1,
        label: 'Wise David',
    },
    {
        value: 2,
        label: 'Wise Dini',
    },
    {
        value: 3,
        label: 'Revolut David',
    },
    {
        value: 4,
        label: 'Transferwise David',
    },
];

const categories = [
    {
        value: 'groceries',
        label: 'Groceries',
    },
    {
        value: 'plants',
        label: 'Plants',
    },
    {
        value: 'eating-out',
        label: 'Eating out',
    },
    {
        value: 'rent',
        label: 'Rent',
    },
    {
        value: 'travel',
        label: 'Travel',
    },
    {
        value: 'car',
        label: 'Car',
    },
    {
        value: 'family',
        label: 'Family',
    },
    {
        value: 'pet',
        label: 'Pet',
    },
    {
        value: 'gadgets',
        label: 'Gadgets',
    },
    {
        value: 'medical',
        label: 'Medical',
    },
    {
        value: 'other',
        label: 'Other',
    },
];

export const AddExpenseDialog = ({ open, handleClose }: { open: boolean; handleClose(): void }) => {
    const [description, setDescription] = useState('');
    const [currency, setCurrency] = useState<Currency>('EUR');
    const [amount, setAmount] = useState<number>(0);
    const [date, setDate] = useState(new Date());
    const [category, setCategory] = useState(categories[0].value);
    const [account, setAccount] = useState(accounts[0].value);

    const dispatch = useDispatch();
    const classes = useStyles();

    const handleAddExpense = () => {
        const expenseToAdd: NewExpense = {
            description,
            currency,
            amount,
            timestamp: date.toISOString(),
            accountId: account,
            category,
        };
        dispatch(addExpense({ expense: expenseToAdd }));
        handleClose();
    };
    return (
        <Dialog open={open} onClose={handleClose} classes={{ paper: classes.paper }} fullWidth>
            <DialogContent className={classes.flex}>
                <TextField
                    autoFocus
                    margin="dense"
                    id="description"
                    label="Description"
                    type="text"
                    className={classes.textField}
                    fullWidth
                    required
                    onChange={(event) => setDescription(event.target.value)}
                />

                <div className={classes.textFieldGroup}>
                    <TextField
                        id="currency"
                        select
                        label="Currency"
                        value={currency}
                        onChange={(event) => setCurrency(event.target.value as Currency)}
                        margin="dense"
                        className={classes.textField}
                    >
                        {currencies.map((option) => {
                            return (
                                <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                </MenuItem>
                            );
                        })}
                    </TextField>
                    <TextField
                        margin="dense"
                        id="amount"
                        label="Amount"
                        type="number"
                        className={classes.textField}
                        style={{ flex: 1 }}
                        onChange={(event) => setAmount(Number(event.target.value))}
                    />
                </div>

                <div className={classes.textFieldGroup}>
                    <TextField
                        id="date"
                        label="Date"
                        type="date"
                        margin="dense"
                        className={classes.textField}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        defaultValue={format(date, 'yyyy-MM-dd')}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => setDate(event.target.valueAsDate || new Date())}
                    />
                    <TextField
                        id="account"
                        select
                        label="Account"
                        value={account}
                        onChange={(event) => setAccount(+event.target.value)}
                        margin="dense"
                        className={classes.textField}
                        style={{ flex: 1 }}
                    >
                        {accounts.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                                {option.label}
                            </MenuItem>
                        ))}
                    </TextField>
                </div>

                <TextField
                    id="category"
                    select
                    fullWidth
                    label="Category"
                    value={category}
                    onChange={(event) => setCategory(event.target.value)}
                    margin="dense"
                    className={classes.selectedCategory}
                >
                    {categories.map((option) => (
                        <MenuItem key={option.value} value={option.value} classes={{ root: classes.categoryOptions }}>
                            <CategoryIcon category={option.value} /> <div> {option.label}</div>
                        </MenuItem>
                    ))}
                </TextField>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleAddExpense} color="primary">
                    Save
                </Button>
            </DialogActions>
        </Dialog>
    );
};
