import React, { useState, useEffect } from 'react';
import { Box, IconButton, Typography, useTheme, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, Button, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, Grid } from '@mui/material';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { tokens } from '../../theme';
import AdminPanelSettingsOutlinedIcon from '@mui/icons-material/AdminPanelSettingsOutlined';
import LockOpenOutlinedIcon from '@mui/icons-material/LockOpenOutlined';
import SecurityOutlinedIcon from '@mui/icons-material/SecurityOutlined';
import Header from '../../components/Header';
import { useDispatch, useSelector } from 'react-redux';

import { Formik, Form, Field } from 'formik';

const TransferMoney = () => {
  const [accList, setAccList] = useState({
    accounts: []
  });
  const { user, userInfo, userToken, error, success, authenticated, loading } = useSelector((state) => state.auth);
  let accounts = []
  const [selectedAccount, setSelectedAccount] = useState('');
  const [amount, setAmount] = useState('');
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [selectedValue, setSelectedValue] = useState(null);
  const [allAccountsList, setAllAccountsList] = useState({
    accs: []
  })

  const columns = [
    { field: 'id', headerName: 'Index'},
    { field: 'accountNumber', headerName: 'Account Number', cellClassName: 'pol-column--cell' },
    { field: 'accountBalance', headerName: 'Account Balance', cellClassName: 'pod-column--cell' },
    { field: 'accountType', headerName: 'Account Type' },
    {
      field: 'actions',
      headerName: 'Select',
      sortable: false,
      width: 130,
      renderCell: (params) => {
        const handleSelected = () => {
            setSelectedValue(params.row.accountNumber);
        };

        return (
          <Box>
            <Radio
                checked={selectedValue === params.row.id} 
                onChange={handleSelected} 
                value={params.row.id}
                name="radio-buttons" 
                inputProps={{ 'aria-label': 'Select' }}
                />
        </Box>
        );
      }
    }
  ];

  useEffect( async () => {
    const fetchData = async () => {
        if (user && user.id){
          const headers = new Headers();
          headers.append('Content-Type', 'application/json');
          headers.append('Authorization', 'Bearer ' + userToken);
  
          // Make fetch request with updated headers
          const res = await fetch(`http://localhost:8080/api/customer/${user.id}/account`, { 
            method: 'GET', 
            headers: headers,
          });
          const resData = await res.json();
        //   console.log(resData);

          const newList = []
          for(let i = 0; i < resData.length; i++){
            const row = resData[i];
            const newRow = {
                "id": i + 1,
                "accountNumber": row.accountNumber,
                "accountBalance": row.accountBalance,
                "accountType": row.accountType
            }
            newList.push(newRow)
          }
  
          setAccList({accounts: newList})

          const response = await fetch(`http://localhost:8080/api/customer/${user.id}/beneficiary/all`, { 
            method: 'GET', 
            headers: headers,
          });
          const responseData = await response.json();

          setAllAccountsList({accs: responseData})

        }
      };
      
  
      // Call fetchData function after the user state is updated
      fetchData(); 
    // console.log(rowsWithId)


  }, [user, userToken]);

  

  const handleAccountChange = (event) => {
    setSelectedAccount(event.target.value);
  };

  const handleAmountChange = (event) => {
    setAmount(event.target.value);
  };

  const handleTransfer = async () => {


    const payload = {
        "fromAccNumber": selectedValue,
        "toAccNumber": selectedAccount,
        "amount": parseInt(amount),
        "customerId": user.id 
    }

    console.log(payload)

    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', 'Bearer ' + userToken);


    // Make fetch request with updated headers
    const res = await fetch(`http://localhost:8080/api/customer/transfer`, { 
      method: 'PUT', 
      headers: headers,
      body: JSON.stringify(payload)
    });
    const resData = await res;
    console.log(resData);
  
          // Make fetch request with updated headers
          const response = await fetch(`http://localhost:8080/api/customer/${user.id}/account`, { 
            method: 'GET', 
            headers: headers,
          });
          const responseData = await response.json();
        //   console.log(resData);

          const newList = []
          for(let i = 0; i < responseData.length; i++){
            const row = responseData[i];
            const newRow = {
                "id": i + 1,
                "accountNumber": row.accountNumber,
                "accountBalance": row.accountBalance,
                "accountType": row.accountType
            }
            newList.push(newRow)
          }
  
          setAccList({accounts: newList})

  };

  return (
    <Box m="20px">
      <Header title="Transfer Money" />
      <Box
        m="40px 0 0 0"
        // height="75vh"
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
            rows={accList.accounts}
            columns={columns}
            components={{
                Toolbar: GridToolbar
            }}
            sx={{ height: '31vh', width: '70vh' }} // Adjust the height and width as needed
            />
      </Box>
      <br />

      <Box
      display="grid"
      gridTemplateColumns="repeat(12, 1fr)"
      gridAutoRows="140px"
      gap="20px"
      >
      <Grid container spacing={2}>
        {/* Dropdown menu for selecting account */}
        <Grid width="50px" item>
          <TextField
            select
            label="Select Account"
            value={selectedAccount}
            onChange={handleAccountChange}
            variant="outlined"
            sx={{ minWidth: '200px' }}
          >
            {allAccountsList.accs.map((account) => (
              <MenuItem key={account.accountNumber} value={account.accountNumber}>
                {account.accountNumber}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        
        {/* Textbox for entering amount */}
        <Grid item >
          <TextField
            label="Amount"
            value={amount}
            onChange={handleAmountChange}
            variant="outlined"
            style={{ minWidth: 150 }}
          />
        </Grid>
      </Grid>
    </Box>
    <Box display="flex" justifyContent="left" mt="20px">
        <Button type="button" onClick={handleTransfer} color="secondary" variant="contained">
        Transfer Amount
        </Button>
    </Box>
    </Box>
  );
};

export default TransferMoney;