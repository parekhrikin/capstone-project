import { useState, useEffect } from "react";
import {ProSidebar, Menu, MenuItem } from "react-pro-sidebar";
import 'react-pro-sidebar/dist/css/styles.css';
import { Box, IconButton, Typography, useTheme } from '@mui/material';
import { Link } from "react-router-dom";
import { tokens } from "../../theme";
import { useDispatch, useSelector } from "react-redux";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import ContactsOutlinedIcon from "@mui/icons-material/ContactsOutlined";
import ReceiptOutlinedIcon from "@mui/icons-material/ReceiptOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import HelpOutlinedIcon from "@mui/icons-material/HelpOutlined";
import BarChartOutlinedIcon from "@mui/icons-material/BarChartOutlined";
import PieChartOutlinedIcon from "@mui/icons-material/PieChartOutlined";
import TimelineOutlinedIcon from "@mui/icons-material/TimelineOutlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import MapOutlinedIcon from "@mui/icons-material/MapOutlined";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import { useNavigate } from 'react-router-dom';

const Item = ({ title, to, icon, selected, setSelected }) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    console.log(selected);
    return (
        <MenuItem 
            active={selected === title} 
            style={{ color: colors.grey[100]}} 
            onClick={() => setSelected(title)} 
            icon={icon}
        >
            <Typography>{title}</Typography>
            <Link to={to} />
        </MenuItem>
    )
}


const Sidebar = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [selected, setSelected] = useState("Dashboard");
    const { loading, user, userInfo, userToken, error, success } = useSelector((state) => state.auth);


    useEffect(async () => {
    
        
        // Define a function to fetch data from the API
        const fetchData = async () => {
          if (user && user.fullname){
            console.log(user);
            console.log(userToken);
            console.log(userInfo);
          }  
        }

        fetchData();

    }, [user]); 


    return (
        
            <Box
                sx={{
                    "& .pro-sidebar-inner": {
                        background: `${colors.primary[400]} !important`
                    },
                    "& .pro-icon-wrapper": {
                        backgroundColor: "transparent !important"
                    },
                    "& .pro-inner-item": {
                        padding: "5px 35px 5px 20px !important"
                    },
                    "& .pro-inner-item:hover": {
                        color: "#868dfb !important"
                    },
                    "& .pro-menu-item.active": {
                        color: "#6870fa !important"
                    },
                }}
            >
                <ProSidebar collapsed={isCollapsed}>
                <Menu iconShape="square">
                        {/* LOGO AND MENU ICON */}
                        <MenuItem
                            onClick={() => setIsCollapsed(!isCollapsed)}
                            icon={isCollapsed ? <MenuOutlinedIcon /> : undefined}
                            style={{
                            margin: "10px 0 20px 0",
                            color: colors.grey[100],
                            }}
                        >
                            {!isCollapsed && (
                            <Box
                                display="flex"
                                justifyContent="space-between"
                                alignItems="center"
                                ml="15px"
                            >
                                <Typography variant="h3" color={colors.grey[100]}>
                                    {userInfo.userType.toUpperCase()}
                                </Typography>
                                <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
                                <MenuOutlinedIcon />
                                </IconButton>
                            </Box>
                            )}
                        </MenuItem>

                        {/* USER */}
                        {!isCollapsed && (
                            <Box mb="25px">
                                <Box display="flex" justifyContent="center" alignItem="center">
                                    <img
                                        alt="profile-user"
                                        width="100px"
                                        height="100px"
                                        src={`../../assets/rikin.jpeg`}
                                        style={{ cursor: "pointer", borderRadius: "50%"}}
                                    />
                                </Box>

                                <Box textAlign="center">
                                    <Typography 
                                        variant="h2" 
                                        color={colors.grey[100]} 
                                        fontWeight="bold" 
                                        sx={{ m: "10px 0 0 0"}}>
                                        {/* {user.fullname} */}
                                        {userInfo.username.toUpperCase()}
                                    </Typography>
                                    <Typography variant="h5" color={colors.greenAccent[500]}>Software Engineer/Founder</Typography>
                                </Box>
                            </Box>
                        )}

                        {/* MENU ITEMS */}
                        {userInfo.userType === "customer" && (
                        <Box paddingLeft={isCollapsed ? undefined : "10%"}>
                            <Item
                            title="Profile"
                            to="/"
                            icon={<PersonOutlinedIcon />}
                            selected={selected}
                            setSelected={setSelected}
                            />

                            <Item
                            title="Create Account"
                            to="/createAccount"
                            icon={<PeopleOutlinedIcon />}
                            selected={selected}
                            setSelected={setSelected}
                            />

                            <Item
                            title="Add Beneficiary"
                            to="/addBeneficiary"
                            icon={<PeopleOutlinedIcon />}
                            selected={selected}
                            setSelected={setSelected}
                            />

                            <Item
                            title="Remove Beneficiary"
                            to="/removeBeneficiary"
                            icon={<PeopleOutlinedIcon />}
                            selected={selected}
                            setSelected={setSelected}
                            />

                            <Item
                            title="Transfer Money"
                            to="/transferMoney"
                            icon={<PeopleOutlinedIcon />}
                            selected={selected}
                            setSelected={setSelected}
                            />

                            <Item
                            title="View Statement"
                            to="/viewStatement"
                            icon={<PeopleOutlinedIcon />}
                            selected={selected}
                            setSelected={setSelected}
                            />
                            <br />
                            <Item
                            title="Logout"
                            to="/logout"
                            icon={<LogoutRoundedIcon />}
                            selected={selected}
                            setSelected={setSelected}
                            />
                        </Box>
                        )}

                        {userInfo.userType === "staff" && (
                        <Box paddingLeft={isCollapsed ? undefined : "10%"}>
                            {/* Render staff-specific menu items */}
                            <Item
                            title="Approve Account"
                            to="/"
                            icon={<PersonOutlinedIcon />}
                            selected={selected}
                            setSelected={setSelected}
                            />

                            <Item
                            title="Logout"
                            to="/logout"
                            icon={<LogoutRoundedIcon />}
                            selected={selected}
                            setSelected={setSelected}
                            />
                        </Box>
                        )}

                    
                            
                    </Menu>
                </ProSidebar>

            </Box>
            
    )
}

export default Sidebar;