import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Error from '../components/Error';
import { registerUser } from '../state/auth/authActions';

const ForgotPassword = () => {
  const { loading, error } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useDispatch();
  const { register, handleSubmit } = useForm();
  const [secretQuestion, setSecretQuestion] = useState('');

  const submitForm = (data) => {
    // Handle form submission here

  };

  const handleSecretQuestionChange = (e) => {
    setSecretQuestion(e.target.value);
  };


  return (
    <div
      style={{
        marginTop: '100px',
        height: '60vh',
        flex: '1',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <h2>Update Password:</h2>
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
          <label htmlFor='secretQuestion'>Secret Question</label>
          <select
            className='form-input'
            onChange={handleSecretQuestionChange}
            value={secretQuestion}
            required
          >
            <option value=''>Select Secret Question</option>
            <option value="mother_maiden_name">What is your mother's maiden name?</option>
            {/* Add other secret questions as options */}
          </select>
        </div>
        {secretQuestion && (
          <div className='form-group'>
            <label htmlFor='secretAnswer'>Secret Answer</label>
            <input
              type='text'
              className='form-input'
              {...register('secretAnswer')}
              required
            />
          </div>
        )}
        <button type='submit' className='button' disabled={loading}>
          {loading ? 'Loading...' : 'Get Details'}
        </button>
      </form>
      Already have a customer account? - Back to Login
    </div>
  );
};

export default ForgotPassword;
