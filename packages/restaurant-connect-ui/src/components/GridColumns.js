import React from 'react';

import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup'
import SaveIcon from '@material-ui/icons/Save';
import DeleteIcon from '@material-ui/icons/Delete';
import { 
    updateRow,
    removeRow
} from '../services/dbApi';

// function toProperCase(string){
//     return string.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
// };
export default [
    { field: 'id', headerName: 'Order Id', hide: true },
    { field: 'customer', headerName: 'Customer Name', editable: true },
    { field: 'phoneNumber', headerName: 'Customer Phone', editable: true },
    { 
        field: 'pizzaType', 
        headerName: 'Pizza Type', 
        editable: true
        /*
        renderCell: (params) => {
            const pizzaTypes = [ 
                "None",
                "Mushroom",
                "Pepperoni",
                "Cheese"
            ]
            const pizzaCased = params.value.toProperCase();
            const handleSelectChange = (event) => {
                console.log(event);
            }
            return <Select
                labelId="demo-simple-select-label"
                id="pizzaType"
                value={pizzaCased}
                defaultValue="None"
                onChange={handleSelectChange}
                >
                {
                    pizzaTypes.map((value) => 
                    <MenuItem 
                    // style="text-transform: capitalize;"
                    selected = {value === pizzaCased}
                    key = {value} 
                    value = {value}>{value}</MenuItem>)
                }
            </Select>
            
        }*/
    },
    { field: 'pizzaSize', headerName: 'Pizza Size', editable: true },
    { field: 'orderStatus', headerName: 'Order Status', editable: true },
    {
      field: 'createdAt',
      headerName: 'Date Created',
      type: 'date',
      editable: true,
    },
    {
        field: 'updatedAt',
        headerName: 'Date Updated',
        type: 'date',
        editable: true,
    },
    {
        field: 'saveChanges',
        headerName: 'Actions',
        editable: false,
        renderCell: (params) => {
            const api = params.api;
            const save = () => {
                const fields = api
                    .getAllColumns()
                    .map((c) => c.field)
                    .filter((c) => c !== "__check__" && !!c);
                const thisRow = {};
        
                fields.forEach((f) => {
                    thisRow[f] = params.getValue(f);
                });
                return updateRow(thisRow).then(response => {
                    const rowId = response.data.orderId;
                    const update = [{ id: rowId, ...response.data}];
                    return api.updateRows(update);
                })
            };
            const remove = () => {
                const id = params.getValue("id")
                return removeRow(id).then(() => {
                    const update = [{ id: id, _action: "delete"}];
                    return api.updateRows(update);
                })
            };
        return <strong>
                <ButtonGroup>
                    <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        onClick={() => save()}
                    >
                        <SaveIcon/>
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        onClick={() => remove()}
                        aria-label="delete"
                    >
                        <DeleteIcon />
                    </Button>
                </ButtonGroup>
            </strong>
        }
    }
].map(item => {
    item.flex = 1;
    // item.sortable = false;
    return item;
})