import React, { useState, useEffect } from 'react';
import { Box, Button, IconButton, Typography, useTheme, Switch } from "@mui/material";
import { tokens } from "../../theme";
import { mockTransactions } from "../../data/mockData";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import EmailIcon from "@mui/icons-material/Email";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import TrafficIcon from "@mui/icons-material/Traffic";
import Header from "../../components/Header";
import LineChart from "../../components/LineChart";
import GeographyChart from "../../components/GeographyChart";
import BarChart from "../../components/BarChart";
import StatBox from "../../components/StatBox";
import ProgressCircle from "../../components/ProgressCircle";
import { useDispatch, useSelector } from 'react-redux';

const Dashboard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { user, userInfo, userToken, error, success, authenticated, loading } = useSelector((state) => state.auth);
  let accounts = []
  const [savings, setSavings] = useState({});
  const [sChecked, setSchecked] = useState(false)
  const [checking, setChecking] = useState({});
  const [cChecked, setCchecked] = useState(false);


  useEffect(async () => {
    console.log(user);
    console.log(userToken);
    console.log(userInfo);

    
    // Define a function to fetch data from the API
    const fetchData = async () => {
      if (user && user.id){
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', 'Bearer ' + userToken);

        // Make fetch request with updated headers
        const res = await fetch(`http://localhost:8080/api/${userInfo.userType}/${user.id}/account`, { 
          method: 'GET', 
          headers: headers,
        });
        const resData = await res.json();
        console.log(resData);

        resData.forEach(acc => {
          accounts.push(acc);
        });

        console.log(accounts);

        accounts.forEach(acc => {
          if (acc.accountType === "SB") {
            setSavings(acc);
            setSchecked(acc.approved === "Yes");
          } else {
            setChecking(acc);
            setCchecked(acc.approved === "Yes");
          }
        });
      }
    };
    

    // Call fetchData function after the user state is updated
    fetchData();  

  }, [user, userToken]); 


  const handleSavingsSwitch = async () => {
    setSchecked((prevSchecked) => !prevSchecked);
    if(sChecked){
      savings.approved = "Yes"
    } else {
      savings.approved = "No"
    }

    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', 'Bearer ' + userToken);

    // Make fetch request with updated headers
    const res = await fetch(`http://localhost:8080/api/customer/${user.id}/account/${savings.accountNumber}`, { 
      method: 'PUT', 
      headers: headers,
      body: JSON.stringify(savings)
    });
    const resData = await res.json();

    console.log(resData)

  }

  const handleCheckingSwitch = async () => {
    setCchecked((prevCchecked) => !prevCchecked)
    if(cChecked){
      checking.approved = "Yes"
    } else {
      checking.approved = "No"
    }

    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', 'Bearer ' + userToken);

    // Make fetch request with updated headers
    const res = await fetch(`http://localhost:8080/api/customer/${selectedAccount}/account/${checking.accountNumber}`, { 
      method: 'PUT', 
      headers: headers,
      body: JSON.stringify(checking)
    });
    const resData = await res.json();

  }

  return (
    <Box m="20px">
      {/* HEADER */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="DASHBOARD" subtitle="Welcome to your dashboard" />

        <Box>
          <Button
            sx={{
              backgroundColor: colors.blueAccent[700],
              color: colors.grey[100],
              fontSize: "14px",
              fontWeight: "bold",
              padding: "10px 20px",
            }}
          >
            <DownloadOutlinedIcon sx={{ mr: "10px" }} />
            Download Reports
          </Button>
        </Box>
      </Box>

      {/* GRID & CHARTS */}
      <Box
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        gridAutoRows="140px"
        gap="20px"
      >
        {/* ROW 1 */}

        {/* ROW 2 */}
        <Box
          gridColumn="span 8"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
        >
          <Box
            display="flex"
            // justifyContent="space-between"
            alignItems="center"
            colors={colors.grey[100]}
            p="20px"
          >
            <Typography color={colors.grey[100]} variant="h5" fontWeight="600" fontSize="30px">
              Account Type: {savings.accountType}
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
              Account Balance: {savings.accountBalance}
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
              Enable/Disable:
            </Typography>
            <Box display="flex" justifyContent="space-between" mt="0px">
            <Switch
              checked={sChecked}
              onChange={handleSavingsSwitch}
              inputProps={{ 'aria-label': 'controlled' }}
            />
            </Box>
          </Box>

          <Box display="flex" justifyContent="end">
            <Button type="submit" color="secondary" variant="contained">
              View More
            </Button>
          </Box>
        </Box>
        
            <Box
              gridColumn="span 4"
              gridRow="span 2"
              backgroundColor={colors.primary[400]}
              overflow="auto"
            >
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                borderBottom={`4px solid ${colors.primary[500]}`}
                colors={colors.grey[100]}
                p="15px"
              >
                <Typography color={colors.grey[100]} variant="h5" fontWeight="600">
                  Recent Transactions
                </Typography>
              </Box>
              {mockTransactions.map((transaction, i) => (
                <Box
                  key={`${transaction.txId}-${i}`}
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  borderBottom={`4px solid ${colors.primary[500]}`}
                  p="15px"
                >
                  <Box>
                    <Typography
                      color={colors.greenAccent[500]}
                      variant="h5"
                      fontWeight="600"
                    >
                      {transaction.txId}
                    </Typography>
                    <Typography color={colors.grey[100]}>
                      {transaction.user}
                    </Typography>
                  </Box>
                  <Box color={colors.grey[100]}>{transaction.date}</Box>
                  <Box
                    backgroundColor={colors.greenAccent[500]}
                    p="5px 10px"
                    borderRadius="4px"
                  >
                    ${transaction.cost}
                  </Box>
                </Box>
              ))}
            </Box>

            {/* ROW 3 */}
          {Object.keys(checking).length > 0 && (
          <>
            <Box
              gridColumn="span 8"
              gridRow="span 2"
              backgroundColor={colors.primary[400]}
            >
              {/* Add your content here */}
              <Box
                gridColumn="span 8"
                gridRow="span 2"
                backgroundColor={colors.primary[400]}
              >
                <Box
                  display="flex"
                  // justifyContent="space-between"
                  alignItems="center"
                  colors={colors.grey[100]}
                  p="20px"
                >
                  <Typography color={colors.grey[100]} variant="h5" fontWeight="600" fontSize="30px">
                    Account Type: {checking.accountType}
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
                    Account Balance: {checking.accountBalance}
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
                    Enable/Disable:
                  </Typography>
                  <Box display="flex" justifyContent="space-between" mt="0px">
                  <Switch
                    checked={cChecked}
                    onChange={handleCheckingSwitch}
                    inputProps={{ 'aria-label': 'controlled' }}
                  />
                  </Box>
                </Box>

                <Box display="flex" justifyContent="end">
                  <Button type="submit" color="secondary" variant="contained">
                    View More
                  </Button>
                </Box>
              </Box>
            </Box>

            <Box
              gridColumn="span 4"
              gridRow="span 2"
              backgroundColor={colors.primary[400]}
              overflow="auto"
            >
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                borderBottom={`4px solid ${colors.primary[500]}`}
                colors={colors.grey[100]}
                p="15px"
              >
                <Typography color={colors.grey[100]} variant="h5" fontWeight="600">
                  Recent Transactions
                </Typography>
              </Box>
              {mockTransactions.map((transaction, i) => (
                <Box
                  key={`${transaction.txId}-${i}`}
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  borderBottom={`4px solid ${colors.primary[500]}`}
                  p="15px"
                >
                  <Box>
                    <Typography
                      color={colors.greenAccent[500]}
                      variant="h5"
                      fontWeight="600"
                    >
                      {transaction.txId}
                    </Typography>
                    <Typography color={colors.grey[100]}>
                      {transaction.user}
                    </Typography>
                  </Box>
                  <Box color={colors.grey[100]}>{transaction.date}</Box>
                  <Box
                    backgroundColor={colors.greenAccent[500]}
                    p="5px 10px"
                    borderRadius="4px"
                  >
                    ${transaction.cost}
                  </Box>
                </Box>
              ))}
            </Box>
          </>
        )}


        {/* ROW 4 */}
        {/* <Box
          gridColumn="span 4"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
          p="30px"
        >
          <Typography variant="h5" fontWeight="600">
            Campaign
          </Typography>
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            mt="25px"
          >
            <ProgressCircle size="125" />
            <Typography
              variant="h5"
              color={colors.greenAccent[500]}
              sx={{ mt: "15px" }}
            >
              $48,352 revenue generated
            </Typography>
            <Typography>Includes extra misc expenditures and costs</Typography>
          </Box>
        </Box>
        <Box
          gridColumn="span 4"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
        >
          <Typography
            variant="h5"
            fontWeight="600"
            sx={{ padding: "30px 30px 0 30px" }}
          >
            Sales Quantity
          </Typography>
          <Box height="250px" mt="-20px">
            <BarChart isDashboard={true} />
          </Box>
        </Box>
        <Box
          gridColumn="span 4"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
          padding="30px"
        >
          <Typography
            variant="h5"
            fontWeight="600"
            sx={{ marginBottom: "15px" }}
          >
            Geography Based Traffic
          </Typography>
          <Box height="200px">
            <GeographyChart isDashboard={true} />
          </Box>
        </Box> */}
      </Box>
    </Box>
  );
};

export default Dashboard;