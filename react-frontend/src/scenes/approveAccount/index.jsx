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
import { useDispatch, useSelector } from 'react-redux';

import { Formik, Form, Field } from 'formik';

const ApproveAccount = () => {
  const [accList, setAccList] = useState({
    accounts: []
  });
  const { user, userInfo, userToken, error, success, authenticated, loading } = useSelector((state) => state.auth);
//   const [openDialog, setOpenDialog] = useState(false);
//   const [selectedRowId, setSelectedRowId] = useState(null);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  let rowsWithId;

  const columns = [
    { field: 'id', headerName: 'Index'},
    { field: 'accountNumber', headerName: 'Account Number', cellClassName: 'pod-column--cell' },
    { field: 'accountBalance', headerName: 'Account Balance', cellClassName: 'pol-column--cell' },
    { field: 'accountType', headerName: 'Account Type' },
    { field: 'approved', headerName: 'Approved' },
    { field: 'customerId', headerName: 'Customer ID' },
    { field: 'dateOfCreation', headerName: 'Date Created' },
    {
      field: 'actions',
      headerName: 'Actions',
      sortable: false,
      width: 130,
      renderCell: (params) => {
        const handleApproval = () => {
          const headers = new Headers();
          headers.append('Content-Type', 'application/json');
          headers.append('Authorization', 'Bearer ' + userToken);
          fetch(`http://localhost:8080/api/staff/accounts/approve`, { method: 'PUT', headers: headers })
            .then(() => console.log('Approval successful'));
        };

        return (
          <Box>
          <IconButton onClick={handleApproval} color="error" aria-label="delete">
            Approve
          </IconButton>
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
          const res = await fetch(`http://localhost:8080/api/customer/${user.id}/beneficiary/all`, { 
            method: 'GET', 
            headers: headers,
          });
          const resData = await res.json();
          console.log(resData);

          const newList = []
          for(let i = 0; i < resData.length; i++){
            const row = resData[i];
            const newRow = {
                "id": i + 1,
                "beneficiaryNumber": row.beneficiaryNumber,
                "accountNumber": row.accountNumber,
                "accountType": row.accountType,
                "approved": row.approved,
                "customerId": row.customerId
            }
            newList.push(newRow)
          }
  
          setBenList({beneficiaries: newList})

        }
      };
      
  
      // Call fetchData function after the user state is updated
      fetchData(); 
    // console.log(rowsWithId)

  }, [user, userToken]);

  console.log(benList)

  return (
    <Box m="20px">
      <Header title="Beneficiaries" subtitle="Delete Beneficiaries" />
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
          rows={benList.beneficiaries}
          columns={columns}
          components={{
            Toolbar: GridToolbar
          }}
        />
      </Box>
    </Box>
  );
};

export default ApproveAccount;