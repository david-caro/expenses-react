import Box from '@material-ui/core/Box';
import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import { makeStyles } from '@material-ui/core/styles';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import React, { useEffect, useState } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import { deleteExpense, euroToChf } from '../redux/reducers/expenses';
import { Expense } from '../types';
import './DateRangePickerStyles.css';
import LocalMallOutlinedIcon from '@material-ui/icons/LocalMallOutlined';
import { CategoryIcon } from './CategoryIcon';
import MoreVertOutlinedIcon from '@material-ui/icons/MoreVertOutlined';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import { setEmitFlags } from 'typescript';
import { EditExpenseDialog } from './EditExpenseDialog';
import { useDispatch } from 'react-redux';

const useStyles = makeStyles((theme) => ({
    container: {
        display: 'flex',
        alignItems: 'center',
        padding: '22px 20px 20px 16px',
        borderRadius: '8px',
        fontWeight: 'bold',
        justifyContent: 'space-between',
        marginBottom: '16px',
    },
    expenseText: {
        display: 'flex',
        flexDirection: 'column',
        marginLeft: '12px',
        justifyContent: 'center',
    },
    left: {
        display: 'flex',
        alignItems: 'center',
    },
    right: {
        display: 'flex',
        alignItems: 'center',
    },
    description: {
        lineHeight: '1em',
        marginBottom: '4px',
    },
    category: {
        lineHeight: '1em',
        fontWeight: 400,
    },
}));

export function ExpenseItem({ expense }: { expense: Expense }): JSX.Element {
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [openEditDialogue, setOpenEditDialogue] = useState<boolean>(false);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const dispatch = useDispatch();
    const handleDelete = () => {
        dispatch(deleteExpense({ id: expense.id }));
        setAnchorEl(null);
    };
    const handleEdit = () => {
        setOpenEditDialogue(true);
        setAnchorEl(null);
    };

    return (
        <Box className={classes.container} bgcolor="secondary.main" color="secondary.contrastText" key={expense.id}>
            <div className={classes.left}>
                <CategoryIcon category={expense.category} />
                <div className={classes.expenseText}>
                    <div className={classes.description}>{expense.description}</div>
                    <div className={classes.category}>{expense.category}</div>
                </div>
            </div>
            <div className={classes.right}>
                <span style={{ marginTop: '6px' }}>
                    {expense.amount} {expense.currency === 'EUR' ? '€' : 'chf'}
                </span>
                <IconButton onClick={handleClick}>
                    <MoreVertOutlinedIcon />
                </IconButton>
                <Menu
                    id="actions-menu"
                    anchorEl={anchorEl}
                    keepMounted
                    open={Boolean(anchorEl)}
                    onClose={() => {
                        setAnchorEl(null);
                    }}
                >
                    <MenuItem onClick={handleEdit}>Edit</MenuItem>
                    <MenuItem onClick={handleDelete}>Delete</MenuItem>
                </Menu>
                <EditExpenseDialog currentExpense={expense} open={openEditDialogue} handleClose={() => setOpenEditDialogue(false)} />
            </div>
        </Box>
    );
}
