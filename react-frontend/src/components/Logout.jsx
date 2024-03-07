import React, { useState, useEffect } from 'react';
import { setAuthenticated } from '../state/auth/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import RequiredAuth from '../components/RequiredAuth';
import { useNavigate } from 'react-router-dom';
import { Link } from "react-router-dom";
import {resetAuthState} from '../state/auth/authSlice'

const Logout = () => {
    const { user, userInfo, userToken, error, success, authenticated, loading } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Example usage: calling updateUserInfoHandler with new data
    useEffect(() => {
        dispatch(resetAuthState())
        navigate('/');
    }, [dispatch, navigate]); // Make sure to adjust the dependencies according to your use case


    return null;
}

export default Logout;