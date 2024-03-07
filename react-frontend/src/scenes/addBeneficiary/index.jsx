import { Box, Button, TextField, Typography, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio } from "@mui/material";
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { Formik } from "formik";
import { useDispatch, useSelector } from 'react-redux';
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import React, { useState, useEffect } from "react";

const Form = () => {
  const { user, userInfo, userToken, error, success, authenticated, loading } = useSelector((state) => state.auth);
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const [accountExists, setAccountExists] = useState(null)

  const handleFormSubmit = async (values) => {
    console.log(values);
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', 'Bearer ' + userToken);

    const response = await fetch(`http://localhost:8080/api/customer/${user.id}/account`, { 
      method: 'GET', 
      headers: headers
    });
    const accounts = await response.json();

    console.log(parseInt(values.accountNumber))

    for (const acc of accounts) {
        console.log(acc.accountNumber)
        if(acc.accountNumber == parseInt(values.accountNumber)){
            setAccountExists(true)
            break;
        } else {
            setAccountExists(false)
        }
    };

    // setTimeout(() => {
    //     console.log('After 5 seconds');
    //     console.log(accountExists);
    // }, 5000);

    

    // if(accountExists){
        const body = {
            "accountNumber": values.accountNumber,
            "accountType": values.accountType
        }

        console.log("ive reached here!")
    
        // Make fetch request with updated headers
        const res = await fetch(`http://localhost:8080/api/customer/${user.id}/beneficiary`, { 
          method: 'POST', 
          headers: headers,
          body: JSON.stringify(body)
        });
        const resData = await res.json();
        console.log(resData);
    // }
    
  };

//   const handleAccountConfirmation = (data) => {
//     // Simulated check for account existence
    
//     setAccountExists(accountExists);
//   };
  

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  return (
    <Box m="20px">
      <Header title="ADD BENEFICIARY" subtitle="Add A New Beneficiary" />

      <Formik
        onSubmit={handleFormSubmit}
        initialValues={initialValues}
        validationSchema={checkoutSchema}
      >
        {({
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
          handleSubmit,
        }) => (
          <form onSubmit={handleSubmit}>
            <Box
              display="grid"
              gap="30px"
            >
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Enter Account Number"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.accountNumber}
                name="accountNumber"
                error={!!touched.accountNumber && !!errors.accountNumber}
                helperText={touched.accountNumber && errors.accountNumber}
                // sx={{ gridColumn: "span 2" }}
              />
              <Box display="flex" justifyContent="center" mt="20px">
                {accountExists !== null && (
                    <Typography variant="body1" color={accountExists ? "error" : "success"}>
                    {accountExists ? "This account exists" : "This account doesn't exist"}
                    </Typography>
                )}
            </Box>
              <Typography variant="h5" alignItems="center">
                Select Type of Account:
              </Typography>
              <FormControl>
              <RadioGroup
                    aria-labelledby="demo-controlled-radio-buttons-group"
                    name="accountType"
                    value={values.accountType}
                    onChange={handleChange}
                >
                    <FormControlLabel value="SB" control={<Radio />} label="Savings Bank" />
                    <FormControlLabel value="CA" control={<Radio />} label="Current Account" />
                </RadioGroup>
              </FormControl>
            </Box>
            <Box display="flex" justifyContent="center" mt="20px">
              <Button type="submit" color="secondary" variant="contained">
                Add Beneficiary
              </Button>
            </Box>
          </form>
        )}
      </Formik>
      {/* Dialog Component */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>Account Created</DialogTitle>
        <DialogContent>
            <DialogContentText>{dialogMessage}</DialogContentText>
        </DialogContent>
        <DialogActions>
            <Button onClick={handleCloseDialog}>OK</Button>
        </DialogActions>
       </Dialog>
    </Box>
  );
};

// const phoneRegExp =
//   /^((\+[1-9]{1,4}[ -]?)|(\([0-9]{2,3}\)[ -]?)|([0-9]{2,4})[ -]?)*?[0-9]{3,4}[ -]?[0-9]{3,4}$/;

const checkoutSchema = yup.object().shape({
    accountType: yup.string().required("required"),
    accountNumber: yup.string().required("required"),
});
const initialValues = {
  accountType: "savings",
  accountNumber: "",
};

export default Form;



