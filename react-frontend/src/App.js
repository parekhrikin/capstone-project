import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import RequiredAuth from "./components/RequiredAuth";
import RegistrationForm from "./components/RegistrationForm";
import Dashboard from "./scenes/dashboard";
import Rates from "./scenes/rates";
import ConfirmedRates from "./scenes/confirmedRates";
import Customers from "./scenes/customers";
import AddRate from "./scenes/addRate";
import Sidebar from "./scenes/global/Sidebar";
import Topbar from "./scenes/global/Topbar";
import Logout from "./components/Logout";
import ForgotPassword from "./components/ForgotPassword";
import CreateAccount from "./scenes/createAccount";
import AddBeneficiary from "./scenes/addBeneficiary";
import TransferMoney from "./scenes/transferMoney";
import ViewStatement from "./scenes/viewStatement";
import ApproveAccount from "./scenes/approveAccount";
import { ColorModeContext, useMode } from "./theme";
import { CssBaseline, ThemeProvider } from "@mui/material";
import RemoveBeneficiaries from "./scenes/removeBeneficiary";

function App() {
  const [theme, colorMode] = useMode();
  // const [authenticated, setAuthenticated] = useState(false);
  const authenticated = useSelector((state) => state.auth.authenticated);
  const userType = useSelector((state) => state.auth.userType);
  const { loading, userInfo, error, success } = useSelector(
    (state) => state.auth
  );

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {/* <Router> */}
        <Routes>
          <Route
            path="*"
            element={
              authenticated ? (
                userInfo.userType === "customer" ? (
                  <AuthenticatedContentForCustomer />
                ) : (
                  <AuthenticatedContentForStaff />
                )
              ) : (
                <RequiredAuth />
              )
            }
          />
        </Routes>
        {/* </Router> */}
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

function AuthenticatedContentForCustomer() {
  return (
    <div className="app">
      <Sidebar />
      <main className="content">
        <Topbar />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/createAccount" element={<CreateAccount />} />
          <Route path="/addBeneficiary" element={<AddBeneficiary />} />
          <Route path="/removeBeneficiary" element={<RemoveBeneficiaries />} />
          <Route path="/transferMoney" element={<TransferMoney />} />
          <Route path="/viewStatement" element={<ViewStatement />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/logout" element={<Logout />} />
        </Routes>
      </main>
    </div>
  );
}

function AuthenticatedContentForStaff() {
  return (
    <div className="app">
      <Sidebar />
      <main className="content">
        <Topbar />
        {/* Add routes specific to staff */}
        <Routes>
          <Route path="/" element={<ApproveAccount />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/logout" element={<Logout />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
