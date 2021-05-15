import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import ExpensesApp from './ExpensesApp';
import reportWebVitals from './reportWebVitals';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import { unstable_createMuiStrictModeTheme as createMuiTheme, ThemeProvider } from '@material-ui/core/styles';

const font = "'Baloo Bhaina 2', cursive";
const theme = createMuiTheme({
    palette: {
        type: 'dark',
        primary: {
            main: '#D60E3C',
            light: '#C03757',
        },
        secondary: {
            main: '#242424',
        },
        background: {
            default: '#000000',
        },
    },
    typography: {
        fontFamily: font,
    },
});

ReactDOM.render(
    <React.StrictMode>
        <Provider store={store}>
            <ThemeProvider theme={theme}>
                <ExpensesApp />
            </ThemeProvider>
        </Provider>
    </React.StrictMode>,
    document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
