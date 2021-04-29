/**
 * Dialog
 */
import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/DialogActions';
import TextField from '@material-ui/core/TextField';
import { addRow } from '../services/dbApi'

export default class OrderDialog extends React.Component {
    constructor(props) {
        super(props);
        // make sure the "this" variable keeps its scope
        this.handleChange = this.handleChange.bind(this);
    }
    state = {
        dialogOpen: false,
        error: null, // you could put error messages here if you wanted
        customer: "",
        phoneNumber: "",
        pizzaType: "",
        pizzaSize: ""
    }
    toggle() {
        this.setState({
            dialogOpen: !this.state.dialogOpen
        });
    }
    handleChange(event){
        event.persist();
        const id = event.target.id;
        const value = event.target.value;
        this.setState({ [id]: value });
    }
    render(){
        const cancelClickHandler = () => {
            this.toggle();
        };
        const saveClickHandler = () => {
            const payload = {
                customer: this.state.customer,
                phoneNumber: this.state.phoneNumber,
                pizzaType: this.state.pizzaType,
                pizzaSize: this.state.pizzaSize
            }
            return addRow(payload).then(res => {
                console.log(res);
                this.toggle();
            })
        }
        
        return (
            <Dialog
                title="Create Order"
                open= {this.state.dialogOpen}
            >
                <DialogContent>
                    <DialogTitle>New Order</DialogTitle>
                    <DialogContentText>
                        Please fill in the order here:
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="customer"
                        label="Customer"
                        type="text"
                        fullWidth
                        value={this.state.customer}
                        onChange={this.handleChange}/>
                    <TextField
                        margin="dense"
                        id="phoneNumber"
                        label="Customer Phone"
                        type="phone"
                        fullWidth
                        value={this.state.phoneNumber}
                        onChange={this.handleChange}/>
                    <TextField
                        margin="dense"
                        id="pizzaType"
                        label="Pizza Type"
                        type="text"
                        fullWidth
                        value={this.state.pizzaType}
                        onChange={this.handleChange}/>
                    <TextField
                        margin="dense"
                        id="pizzaSize"
                        label="Pizza Size"
                        type="text"
                        fullWidth
                        value={this.state.pizzaSize}
                        onChange={this.handleChange}/>
                </DialogContent>
                <DialogActions>
                    <Button 
                        onClick={cancelClickHandler} 
                        color="primary">
                        Cancel
                    </Button>
                    <Button 
                        onClick={saveClickHandler} 
                        color="primary">
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        )
    }
}
