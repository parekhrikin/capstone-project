import React, { useState, useEffect } from 'react';
import { Box, IconButton, Typography, useTheme, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, Button, Grid } from '@mui/material';
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
import axios from 'axios'

import { Formik, Form, Field } from 'formik';

const ViewStatement = () => {
  const [statementList, setStatementList] = useState({
    statements: []
  });
  const [dummyList, setDummyList] = useState({
    dummy: []
  })
  const [myAccounts, setMyAccounts] = useState({
    accounts: []
  });
  const { user, userInfo, userToken, error, success, authenticated, loading } = useSelector((state) => state.auth);
//   const [openDialog, setOpenDialog] = useState(false);
//   const [selectedRowId, setSelectedRowId] = useState(null);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [selectedBalance, setSelectedBalance] = useState('');
  const [selectedAccount, setSelectedAccount] = useState("");

  const columns = [
    { field: 'id', headerName: 'Index'},
    { field: 'dateTime', headerName: 'Date', cellClassName: 'pol-column--cell' },
    { field: 'reference', headerName: 'Reference', cellClassName: 'pod-column--cell' },
    { field: 'amount', headerName: 'Amount' },
    { field: 'transactionType', headerName: 'Cr/Db' }
  ];

  useEffect( async () => {

    if(user && user.id && selectedAccount){
      const headers = new Headers();
      headers.append('Content-Type', 'application/json');
      headers.append('Authorization', 'Bearer ' + userToken);
      const res = await fetch(`http://localhost:8080/api/customer/${selectedAccount}/viewStatement`, {
          method: 'GET',
          headers: headers
      });
      const resData = await res.json();
      const newList = []

      
      for(let i = 0; resData.length; i++){
          console.log(resData[i])
          if(resData[i].sender == selectedAccount){
            resData[i].transactionType = "DB"
          } else {
            resData[i].transactionType = "CR"
          }
          const r = {
              "id": i,
              "dateTime": resData[i].dateTime,
              "reference": "milk",
              "amount": resData[i].amount,
              "transactionType": resData[i].transactionType
          }
          newList.push(r)
      }
      setStatementList({statements: newList})
      
    }

    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', 'Bearer ' + userToken);
    const res = await fetch(`http://localhost:8080/api/customer/${user.id}/account`, { 
      method: 'GET', 
      headers: headers,
    });
    const resData = await res.json();

    setMyAccounts({accounts: resData})
  }, [user, selectedAccount]);


  const handleAccountChange = async (event) => {
    setSelectedAccount(event.target.value);
    myAccounts.accounts.forEach(a => {
        if(event.target.value == a.accountNumber){
            setSelectedBalance(a.accountBalance)
        }
    })

    
    // setDummyList({dummy: await resData})
    

  }



  return (
    <Box m="20px">
      <Header title="View Statement" subtitle="View Statement Of Each Account" />
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
            {myAccounts.accounts.map((acc) => (
              <MenuItem key={acc.accountNumber} value={acc.accountNumber}>
                {acc.accountNumber}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        </Grid>
        </Box>
        <Box
            display="grid"
            gridTemplateColumns="repeat(12, 1fr)"
            gridAutoRows="140px"
            gap="20px"
            >
               <Box
                    display="flex"
                    // justifyContent="space-between"
                    alignItems="center"
                    colors={colors.grey[100]}
                    p="20px"
                >
                    <Typography color={colors.grey[100]} variant="h5" fontWeight="600" fontSize="30px">
                    Account No.: {selectedAccount}
                    </Typography>
                </Box>
                <Box
                    display="flex"
                    // justifyContent="space-between"
                    alignItems="center"
                    colors={colors.grey[100]}
                    p="20px"
                >
                    <Typography color={colors.grey[100]} variant="h5" fontWeight="600" fontSize="30px">
                    Account Balance: {selectedBalance}
                    </Typography>
                </Box> 
        </Box>
        <DataGrid
          rows={statementList.statements}
          columns={columns}
          components={{
            Toolbar: GridToolbar
          }}
        />
      </Box>
    </Box>
  );
};

export default ViewStatement;