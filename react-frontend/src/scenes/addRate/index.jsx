import { Box, Button, TextField } from "@mui/material";
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import React, { useState, useEffect } from "react";

const Form = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");

  const handleFormSubmit = (values) => {
    console.log(values);
    fetch('http://localhost:8080/rate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(values)
    })
    .then(response => {
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
      setDialogMessage("Rate posted successfully!");
      setDialogOpen(true);
    })
    .catch(error => {
      // Handle any errors that occur during the request
    });
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  return (
    <Box m="20px">
      <Header title="CREATE RATE" subtitle="Create a New Freight Rate" />

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
              gridTemplateColumns="repeat(4, minmax(0, 1fr))"
              sx={{
                "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
              }}
            >
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Port of Loading"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.pol}
                name="pol"
                error={!!touched.pol && !!errors.pol}
                helperText={touched.pol && errors.pol}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Port of Destination"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.pod}
                name="pod"
                error={!!touched.pod && !!errors.pod}
                helperText={touched.pod && errors.pod}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="number"
                label="ID"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.id}
                name="id"
                error={!!touched.id && !!errors.id}
                helperText={touched.id && errors.id}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Route"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.route}
                name="route"
                error={!!touched.route && !!errors.route}
                helperText={touched.route && errors.route}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="number"
                label="Transit Time"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.tt}
                name="tt"
                error={!!touched.tt && !!errors.tt}
                helperText={touched.tt && errors.tt}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="number"
                label="20FT"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.twenty}
                name="twenty"
                error={!!touched.twenty && !!errors.twenty}
                helperText={touched.twenty && errors.twenty}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="number"
                label="40FT"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.forty}
                name="forty"
                error={!!touched.forty && !!errors.forty}
                helperText={touched.forty && errors.forty}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="40HC"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.fortyhq}
                name="fortyhq"
                error={!!touched.fortyhq && !!errors.fortyhq}
                helperText={touched.fortyhq && errors.fortyhq}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="number"
                label="ENS Surcharge"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.ens}
                name="ens"
                error={!!touched.ens && !!errors.ens}
                helperText={touched.ens && errors.ens}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Hazardour Surcharge"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.haz}
                name="haz"
                error={!!touched.haz && !!errors.haz}
                helperText={touched.haz && errors.haz}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="O/T Surcharge"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.ot}
                name="ot"
                error={!!touched.ot && !!errors.ot}
                helperText={touched.ot && errors.ot}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Validity"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.validity}
                name="validity"
                error={!!touched.validity && !!errors.validity}
                helperText={touched.validity && errors.validity}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Service"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.service}
                name="service"
                error={!!touched.service && !!errors.service}
                helperText={touched.service && errors.service}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Destination"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.dest}
                name="dest"
                error={!!touched.dest && !!errors.dest}
                helperText={touched.dest && errors.dest}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="LARA Code"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.lara}
                name="lara"
                error={!!touched.lara && !!errors.lara}
                helperText={touched.lara && errors.lara}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Additional Charges/Special Remarks"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.addcharges}
                name="addcharges"
                error={!!touched.addcharges && !!errors.addcharges}
                helperText={touched.addcharges && errors.addcharges}
                sx={{ gridColumn: "span 2" }}
              />
            </Box>
            <Box display="flex" justifyContent="end" mt="20px">
              <Button type="submit" color="secondary" variant="contained">
                Create Rate
              </Button>
            </Box>
          </form>
        )}
      </Formik>
      {/* Dialog Component */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>Rate Posted</DialogTitle>
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
  id: yup.string().required("required"),
  pol: yup.string().required("required"),
  pod: yup.string().required("required"),
  // email: yup.string().email("invalid email").required("required"),
  // contact: yup
  //   .string()
  //   .matches(phoneRegExp, "Phone number is not valid")
  //   .required("required"),
  tt: yup.string().required("required"),
  // twenty: yup.string().required("required"),
  // forty: yup.string().required("required"),
  // fortyhq: yup.string().required("required"),
  validity: yup.string().required("required")
});
const initialValues = {
  id: "",
  pol: "",
  pod: "",
  route: "",
  tt: "",
  twenty: "",
  forty: "",
  fortyhq: "",
  ens: "",
  haz: "",
  ot: "",
  validity: "",
  service: "",
  dest: "",
  lara: "",
  addcharges: ""
};

export default Form;



