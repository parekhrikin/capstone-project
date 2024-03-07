import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
// import RequiredAuth from "./components/RequiredAuth";
import Dashboard from "../scenes/dashboard";
import Rates from "../scenes/rates";
import ConfirmedRates from "../scenes/confirmedRates";
import Customers from "../scenes/customers";
import AddRate from "../scenes/addRate";
import Sidebar from "../scenes/global/Sidebar";
import Topbar from "../scenes/global/Topbar";
// import { ColorModeContext, useMode } from "./theme";
// import { CssBaseline, ThemeProvider } from "@mui/material";

function AuthenticatedContent({ handleLogout }) {
    return (
      <div className="app">
        <Sidebar />
        <main className="content">
          <Topbar handleLogout={handleLogout} />
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/rates" element={<Rates />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/confirmedRates" element={<ConfirmedRates />} />
            <Route path="/add" element={<AddRate />} />
          </Routes>
        </main>
      </div>
    );
  }

export default AuthenticatedContent