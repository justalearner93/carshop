import React, { useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-material.css';
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import Addcar from './Addcar';
import Editcar from './Editcar';

function Carlist () {
const [cars, setCars] = useState([]);
const [open, setOpen] = useState(false);

const deleteCar = (link) => {
    if (window.confirm("Are you sure?")) {
    fetch (link, {method: "DELETE"})
    .then (response => {
        if (!response.ok) {
        alert ("Shit happens");
    }
        else {
        setOpen(true);
        fetchCar();
        }
    })
    .catch (err => console.error(err));
}
}

const addCar = (newCar) => {
    fetch(process.env.REACT_APP_API_URL, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(newCar)
    })
    .then (response => {
        if (response.ok) {
            fetchCar();
        }
        else {
            alert('Shit happens')
        }
    })
    .catch(err => console.error(err))
}

useEffect (() => {
    fetchCar();
}
)

const fetchCar = () => {
    fetch(process.env.REACT_APP_API_URL)
    .then (response => response.json())
    .then(data => setCars(data._embedded.cars))
    .catch(err => console.error(err))
}


const [columns] = useState([
    {field:"brand", sortable: true, filter: true},
    {field:"model", sortable: true, filter: true},
    {field:"color", sortable: true, filter: true, width: 150},
    {field:"fuel", sortable: true, filter: true, width: 120},
    {field:"year", sortable: true, filter: true, width: 100},
    {field:"price", sortable: true, filter: true},
    {
        headerName:'',
        width: 100,
        field: "_links.self.href",
        cellRenderer: params => <Editcar params={params} updateCar={updateCar}/>

    },
    {   headerName: "",
        field: "_links.self.href",
        cellRenderer: params => 
        <IconButton color="error" onClick={() => deleteCar(params.value)}><DeleteIcon/></IconButton>,
        width: 100 }
]);

const updateCar = (updatedCar, link) => {
    fetch(link, 
    {method: "PUT",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(updatedCar)
})
    .then(response => {
        if (response.ok) {
            fetchCar();
        }
        else {
            alert("Shit happens");
        }
    })
    .catch(err =>console.error(err));
}

return (
    <>
    <Addcar addCar ={addCar} />
     <div className="ag-theme-material" style={{height: 800, width: '90%'}}>
     <AgGridReact
        columnDefs={columns}
        rowData={cars}
        pagination={true}
        paginationPageSize={12}
        suppressCellFocus={true}
     />
     <Snackbar
        open ={open}
        autoHideDuration={3000}
        onClose={() => setOpen(false)}
        message = "Car deleted successfully"
        
      />
     </div>
    </>
  );
}

export default Carlist;