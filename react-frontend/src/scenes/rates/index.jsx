import React, { useState, useEffect } from 'react';
import { Box, IconButton, Typography, useTheme, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, Button } from '@mui/material';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { tokens } from '../../theme';
import AdminPanelSettingsOutlinedIcon from '@mui/icons-material/AdminPanelSettingsOutlined';
import LockOpenOutlinedIcon from '@mui/icons-material/LockOpenOutlined';
import SecurityOutlinedIcon from '@mui/icons-material/SecurityOutlined';
import Header from '../../components/Header';

import { Formik, Form, Field } from 'formik';

const Rates = () => {
  const [rateList, setRateList] = useState({
    rates: []
  });
  const [custList, setCustList] = useState({
    customers: []
  });
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedRowId, setSelectedRowId] = useState(null);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const columns = [
    { field: 'id', headerName: 'ID', flex: 1 },
    { field: 'pol', headerName: 'POL', cellClassName: 'pol-column--cell' },
    { field: 'pod', headerName: 'POD', cellClassName: 'pod-column--cell' },
    { field: 'route', headerName: 'Route' },
    { field: 'tt', headerName: 'TT' },
    { field: 'twenty', headerName: '20FT' },
    { field: 'forty', headerName: '40FT' },
    { field: 'fortyhq', headerName: '40HC' },
    { field: 'addcharges', headerName: 'Surcharges' },
    { field: 'validity', headerName: 'Validity' },
    {
      field: 'actions',
      headerName: 'Actions',
      sortable: false,
      width: 130,
      renderCell: (params) => {
        const handleDelete = () => {
          const updatedRates = rateList.rates.filter(
            (rate) => rate.id !== params.row.id
          );
          setRateList({ rates: updatedRates });
          fetch(`http://localhost:8080/rate/${params.row.id}`, { method: 'DELETE' })
            .then(() => console.log('Delete successful'));
        };

        const handleQuote = (rowID) => {
          setSelectedRowId(rowID);
          setOpenDialog(true);
        };

        const handleEdit = () => {
          // ... handle edit button click
        };

        return (
          <Box>
          <IconButton
            onClick={() => handleQuote(params.row.id)}
            color="primary"
            aria-label="quote"
          >
            <FormatQuoteIcon />
          </IconButton>
          {/* ... other buttons */}

          <IconButton onClick={handleEdit} color="primary" aria-label="edit">
            <EditIcon />
          </IconButton>
          <IconButton onClick={handleDelete} color="error" aria-label="delete">
            <DeleteIcon />
          </IconButton>

          {/* Dialog box with Formik */}
          <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
            <DialogTitle>Quote Form</DialogTitle>
            <DialogContent sx={{ width: '400px' }}>
              {custList.customers.length > 0 ? (
                <Formik
                  initialValues={{
                    customerID: '',
                    note: '',
                    sellRate20: '',
                    sellRate40: '',
                    sellRate40HQ: '',
                  }}
                  onSubmit={(values) => {
                    console.log(selectedRowId);
                    // Handle form submission
                    fetch('http://localhost:8080/quote', {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                      },
                      body: JSON.stringify({...values, ["rateID"]: selectedRowId})
                    })
                    .then(response => {
                      console.log(response.json());
                      if(response.status === 200) {
                        // Handle success
                        return response.json();
                      } else if(response.status === 304) {
                        // Handle Not Modified
                        return "Not Modified";
                      } else {
                        // Handle error
                        return response.json();
                        throw new Error('Failed to call endpoint');
                      }
                    })
                    .then(data => {
                      // Handle the response data
                      setDialogMessage("Rate quoted to " + values.name + " successfully!");
                      setDialogOpen(true);
                    })
                    .catch(error => {
                      // Handle any errors that occur during the request
                    });
                    setOpenDialog(false);
                  }}
                >
                  <Form>
                    <Box>
                      <Field as={TextField} name="customerID" label="Customer Name" select fullWidth>
                        {custList.customers.map((customer) => (
                          <MenuItem key={customer.id} value={customer.id}>
                            {customer.companyName}
                          </MenuItem>
                        ))}
                      </Field>
                    </Box>
                    <Box mt={2}>
                      <Field as={TextField} name="sellRate20" label="Sell Rate for 20'" fullWidth />
                    </Box>
                    <Box mt={2}>
                      <Field as={TextField} name="sellRate40" label="Sell Rate for 40'" fullWidth />
                    </Box>
                    <Box mt={2}>
                      <Field as={TextField} name="sellRate40HQ" label="Sell Rate for 40HQ" fullWidth />
                    </Box>
                    <Box mt={2}>
                      <Field as={TextField} name="note" label="Note" multiline rows={4} fullWidth />
                    </Box>
                    <Box mt={2}>
                      <Button type="submit" variant="contained" color="primary">
                        Submit Quote
                      </Button>
                    </Box>
                  </Form>
                </Formik>
              ) : (
                // Show loading or empty state
                <Typography>Loading...</Typography>
              )}
            </DialogContent>
          </Dialog>
        </Box>
        );
      }
    }
  ];

  useEffect(() => {
    fetch('http://localhost:8080/rates')
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        setRateList({
          rates: res
        });
        console.log(rateList);
      })
      .catch((error) => {
        console.log('error....' + error);
      });
    
      fetch("http://localhost:8080/user/users")
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        const updatedCusts = res.filter(
          (user) => user.userType === "importer" || user.userType === "exporter"
        );
        console.log(updatedCusts);
        setCustList({ customers: updatedCusts });
        console.log(custList);
      })
      .catch((error) => {
        console.log("error...." + error);
      });
  }, []);

  console.log(custList);

  return (
    <Box m="20px">
      <Header title="Rates" subtitle="View All The Rates" />
      <Box
        m="40px 0 0 0"
        height="75vh"
        sx={{
          '& .MuiDataGrid-root': {
            border: 'none'
          },
          '& .MuiDataGrid-cell': {
            borderBottom: 'none'
          },
          '& .pol-column--cell': {
            color: colors.greenAccent[300],
            fontWeight: 'bold'
          },
          '& .pod-column--cell': {
            color: colors.greenAccent[300],
            fontWeight: 'bold'
          },
          '& .MuiDataGrid-columnHeaders': {
            backgroundColor: colors.blueAccent[700],
            borderBottom: 'none'
          },
          '& .MuiDataGrid-virtualScroller': {
            backgroundColor: colors.primary[400]
          },
          '& .MuiDataGrid-footerContainer': {
            borderTop: 'none',
            backgroundColor: colors.blueAccent[700]
          },
          '& .MuiDataGrid-toolbarContainer .MuiButton-text': {
            color: `${colors.grey[100]} !important`
          }
        }}
      >
        <DataGrid
          rows={rateList.rates}
          columns={columns}
          components={{
            Toolbar: GridToolbar
          }}
        />
      </Box>
    </Box>
  );
};

export default Rates;