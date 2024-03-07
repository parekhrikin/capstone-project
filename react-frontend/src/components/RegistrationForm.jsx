import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import Error from '../components/Error'
// import Spinner from '../components/Spinner'
import { registerUser } from '../state/auth/authActions'
import { setUserInfo, setUser } from '../state/auth/authSlice';

const RegistrationForm = () => {
  const { loading, userInfo, error, success, user } = useSelector(
    (state) => state.auth
  )
  const dispatch = useDispatch()
  const { register, handleSubmit } = useForm()

  const submitForm = (data) => {
    // check if passwords match
    if (data.password !== data.confirmPassword) {
      alert('Password mismatch')
    }
    // transform email string to lowercase to avoid case sensitivity issues in login
    data.username = data.username.toLowerCase()
    data.userType = "customer";
    dispatch(setUserInfo(data));
    dispatch(registerUser(data))
    
  }
  return (
    <div style={{ marginTop: '100px', height: '60vh', flex: '1', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <h2>Registration</h2>
      <form onSubmit={handleSubmit(submitForm)}>
        {error && <Error>{error}</Error>}
        <div className='form-group'>
          <label htmlFor='fullname'>Full Name</label>
          <input
            type='text'
            className='form-input'
            {...register('fullname')}
            required
          />
        </div>
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
        <div className='form-group'>
          <label htmlFor='password'>Confirm Password</label>
          <input
            type='password'
            className='form-input'
            {...register('confirmPassword')}
            required
          />
        </div>
        <button type='submit' className='button' disabled={loading}>
          {loading ? 'Loading...' : 'Register'}
        </button>
      </form>
    </div>
  )
}
export default RegistrationForm
