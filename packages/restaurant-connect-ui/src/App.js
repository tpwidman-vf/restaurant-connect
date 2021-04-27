import React from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';

import axios from 'axios';
import { createMuiTheme } from '@material-ui/core/styles';
import purple from '@material-ui/core/colors/purple';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: purple[500],
    },
    secondary: {
      main: '#f44336',
    },
  },
});

const useStyles = makeStyles((theme) =>
    createStyles({
        root: {
            flexGrow: 1,
        },
        paper: {
            padding: theme.spacing(2),
            textAlign: 'center',
            color: theme.palette.text.secondary,
        },
        table: {
            minWidth: 650
        },
        menuButton: {
            marginRight: theme.spacing(2),
        },
        title: {
            flexGrow: 1,
        },
    }),
);

const mockData = [
    {
        "phoneNumber": "+15704140030",
        "pizzaSize": "Large",
        "orderStatus": "IN_PROGRESS",
        "orderId": "58932b2a-0534-48b3-b589-47ae74bee3ce",
        "updatedAt": "2021-04-15T20:06:56.418Z",
        "createdAt": "2021-04-15T20:06:56.418Z",
        "pizzaType": "Mushroom",
        "customer": "Jim Halpert"
    },
    {
        "phoneNumber": "+11234567890",
        "pizzaSize": "Large",
        "orderStatus": "IN_PROGRESS",
        "orderId": "94ef6889-d573-4092-b988-4af147bc63dc",
        "updatedAt": "2021-04-13T14:10:42.739Z",
        "createdAt": "2021-04-13T14:10:42.739Z",
        "pizzaType": "Cheese",
        "customer": "Pam Beesley"
    },
    {
        "phoneNumber": "+11234567890",
        "pizzaSize": "Medium",
        "orderStatus": "IN_PROGRESS",
        "orderId": "94ef6889-d573-0534-b988-47ae74bee3ce",
        "updatedAt": "2021-04-26T14:10:42.739Z",
        "createdAt": "2021-04-26T14:10:42.739Z",
        "pizzaType": "Pepperoni",
        "customer": "Roy Anderson"
    }
];

async function getRows() {
    return await axios.get('https://2m4ncx4jdf.execute-api.us-east-1.amazonaws.com/prod/orders').data.Items;
}
export default function BasicTable() {
    const classes = useStyles();
    const rows = mockData.sort((a, b) => {
        if (Date.parse(a) > Date.parse(b)) {
            return 1;
        }
        if (Date.parse(a) < Date.parse(b)) {
            return -1;
        }
        return 0;
    });
    return (
        <div className={classes.root}>
            <AppBar position="static">
                <Toolbar>
                    <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" className={classes.title}>
                        Resturant Connect - Order Status
                    </Typography>
                </Toolbar>
            </AppBar>
            <Box m={5}/>
            <Paper>
                <Grid container spacing={3}>
                    <Grid item xs={9}>
                        <TableContainer>
                            <Table className={classes.table} aria-label="simple table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Order ID</TableCell>
                                        <TableCell align="right">Customer Name</TableCell>
                                        <TableCell align="right">Customer Phone</TableCell>
                                        <TableCell align="right">Pizza Type</TableCell>
                                        <TableCell align="right">Pizza Size</TableCell>
                                        <TableCell align="right">Order Status</TableCell>
                                        <TableCell align="right">Order Date and Time</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {rows.map((row) => (
                                        <TableRow key={row.name}>
                                            <TableCell component="th" scope="row">
                                                {row.orderId}
                                            </TableCell>
                                            <TableCell align="right">{row.customer}</TableCell>
                                            <TableCell align="right">{row.phoneNumber}</TableCell>
                                            <TableCell align="right">{row.pizzaType}</TableCell>
                                            <TableCell align="right">{row.pizzaSize}</TableCell>
                                            <TableCell align="right">{row.orderStatus.replace('_', ' ')}</TableCell>
                                            <TableCell align="right">{new Date(Date.parse(row.createdAt)).toLocaleString()}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Grid>
                </Grid>
            </Paper>
        </div>
    );
}