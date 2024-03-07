import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import Error from '../components/Error';
import { loginCustomer, loginStaff } from '../state/auth/authActions';
import RegistrationForm from './RegistrationForm';
import { setUserInfo, setUser, setUserToken } from '../state/auth/authSlice';
import ForgotPassword from './ForgotPassword';

const RequiredAuth = () => {
  const { user, userInfo, userToken, error, success, authenticated, loading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm();
  const [userType, setUserType] = useState('');
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  

  const submitForm = async (data) => {
    data.username = data.username.toLowerCase();
    data.userType = userType;
    console.log(data);

    try {
        // Dispatch setUserInfo action
        dispatch(setUserInfo(data));

        // Dispatch login action based on userType
        let responseData;
        if (data.userType === "customer") {
            responseData = await dispatch(loginCustomer(data));
            // console.log("Response from loginCustomer:", responseData);
        } else {
            responseData = await dispatch(loginStaff(data));
            // console.log("Response from loginStaff:", responseData);
        }

        // Handle the response data
        dispatch(setUserToken(responseData.payload));

        // Construct headers with updated userToken
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', 'Bearer ' + responseData.payload.toString());

        // Make fetch request with updated headers
        const res = await fetch(`http://localhost:8080/api/${data.userType}/username/${data.username}`, { 
          method: 'GET', 
          headers: headers,
        });
        // console.log((await res).json())
        const resData = await res.json();
        console.log(resData)
        dispatch(setUser(resData));
        console.log(user);
        console.log(userToken);
        console.log(userInfo);
;    } catch (error) {
        console.error("Error:", error);
        // Handle errors
    }
  };

  useEffect(() => {
    console.log(user);
    console.log(userToken);
    console.log(userInfo);


  }, [user, userToken, userInfo]); 

  const handleRegister = (event) => {
    event.preventDefault();
    setShowRegistrationForm(true);
  };

  const handleForgotPassword = () => {
    setShowForgotPassword(true);
  };

  return (
    <div className="homepage">
      <header>
        <h1 style={{ flex: '1', display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%' }}>Welcome to XYZ Bank</h1>
      </header>
      <main style={{ display: 'flex' }}>
        <div className="bank-symbol" style={{ marginTop: '100px', flex: '1', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" fill="currentColor" class="bi bi-bank" viewBox="0 0 16 16">
            <path d="m8 0 6.61 3h.89a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.5.5H15v7a.5.5 0 0 1 .485.38l.5 2a.498.498 0 0 1-.485.62H.5a.498.498 0 0 1-.485-.62l.5-2A.5.5 0 0 1 1 13V6H.5a.5.5 0 0 1-.5-.5v-2A.5.5 0 0 1 .5 3h.89zM3.777 3h8.447L8 1zM2 6v7h1V6zm2 0v7h2.5V6zm3.5 0v7h1V6zm2 0v7H12V6zM13 6v7h1V6zm2-1V4H1v1zm-.39 9H1.39l-.25 1h13.72z"/>
          </svg>
        </div>
        {showRegistrationForm ? (
          <RegistrationForm />
        ) : showForgotPassword ? (
          <ForgotPassword />
        ) : (
          <div className="login-form" style={{ marginTop: '100px', height: '60vh', flex: '1', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h2>Login</h2>
            <form onSubmit={handleSubmit(submitForm)}>
              {error && <Error>{error}</Error>}
              <div className='form-group'>
                <label htmlFor='username'>Username</label>
                <input
                  type='text'
                  className='form-input'
                  {...register('username')}
                  required
                />
              </div>
              <div className='form-group'>
                <label htmlFor='password'>Password</label>
                <input
                  type='password'
                  className='form-input'
                  {...register('password')}
                  required
                />
              </div>
              <div className="form-group">
                <label>User Type:</label>
                <div>
                  <input 
                    type="radio"
                    id="customer"
                    name="userType"
                    value="customer"
                    checked={userType === 'customer'}
                    onChange={() => setUserType('customer')}
                  />
                  <label htmlFor="customer">Customer</label>
                </div>
                <div>
                  <input 
                    type="radio"
                    id="staff"
                    name="userType"
                    value="staff"
                    checked={userType === 'staff'}
                    onChange={() => setUserType('staff')}
                  />
                  <label htmlFor="staff">Staff</label>
                </div>
              </div>
              <button type='submit' className='button' disabled={loading}>
                {loading ? 'Loading...' : 'Login'}
              </button>
              <Link to="/forgot-password" onClick={handleForgotPassword}>Forgot password?</Link>
              <br/>
              <button type="button" className="button" onClick={handleRegister}>
                Register
              </button>
            </form>
          </div>
        )}
      </main>
      <footer>
        <p style={{ flex: '1', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>© {new Date().getFullYear()} XYZ Bank. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default RequiredAuth;
