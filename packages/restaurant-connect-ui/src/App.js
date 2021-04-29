import React from 'react';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import { DataGrid } from '@material-ui/data-grid'



import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';


import IconButton from '@material-ui/core/IconButton';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import MenuIcon from '@material-ui/icons/Menu';
import AddIcon from '@material-ui/icons/Add';
import RefreshIcon from '@material-ui/icons/Refresh';

import { getRows } from './services/dbApi';
import columns from './components/GridColumns';
import OrderDialog from './components/OrderDialog';

import { 
    withStyles 
} from '@material-ui/core/styles';

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
function refreshOrders(){
    getRows()
        .then((Items) => {
            return this.setState({ Items });
        });
}
class App extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        Items: [],
      };
      this.refreshOrders = refreshOrders.bind(this);
    }
    componentDidMount() {
        this.setState({ dialogOpen: false });
        getRows()
            .then(Items => 
                this.setState({ Items }));
    }
    toggleDialogOpen(){
        this.dialogOpen.toggle();
    }

    render(){
        const { classes } = this.props;
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
                <ButtonGroup>
                    <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        startIcon={<AddIcon />}
                        onClick={this.toggleDialogOpen.bind(this)}
                    >
                        New Order
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        startIcon={<RefreshIcon />}
                        onClick={this.refreshOrders.bind(this)}
                    >
                        Refresh
                    </Button>
                </ButtonGroup>
                <OrderDialog ref={dialogOpen => this.dialogOpen = dialogOpen}/>
                <Paper>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <div>
                                <DataGrid 
                                    autoHeight = {true}
                                    columns={columns} 
                                    rows={this.state.Items}
                                />
                            </div>
                        </Grid>
                    </Grid>
                </Paper>
            </div>
        );
    }
}
   
export default withStyles(useStyles)(App);