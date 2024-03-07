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

  const handleFormSubmit = async (values) => {
    console.log(values);
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', 'Bearer ' + userToken);

    const body = {
        "accountBalance": values.accountBalance,
        "accountType": values.accountType
    }

    // Make fetch request with updated headers
    const res = await fetch(`http://localhost:8080/api/customer/${user.id}/account`, { 
      method: 'POST', 
      headers: headers,
      body: JSON.stringify(body)
    });
    const resData = await res.json();
    console.log(resData);
  };

  

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  return (
    <Box m="20px">
      <Header title="CREATE ACCOUNT FORM" subtitle="Create a New Freight Rate" />

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
                label="Enter Initial Amount"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.accountBalance}
                name="accountBalance"
                error={!!touched.accountBalance && !!errors.accountBalance}
                helperText={touched.accountBalance && errors.accountBalance}
                // sx={{ gridColumn: "span 2" }}
              />
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
                Create Account
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
    accountBalance: yup.string().required("required"),
});
const initialValues = {
  accountType: "savings",
  accountBalance: "",
};

export default Form;



