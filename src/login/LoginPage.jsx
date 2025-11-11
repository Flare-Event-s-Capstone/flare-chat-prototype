import { useState } from 'react'
import { useActionState} from 'react'
import {hasSpecialChars, hasNumber, hasUpperCase, meetsLength} from '../util/validation';
import './AppLogin.css'

import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'

function LoginPage() {
  function signupAction(prevFormState, formData){
    const username = formData.get('username');
    const password = formData.get('password');

    let errors = [];

    if(!hasNumber(password)){
      errors.push('You must provide a password with at least one number (0-9).')
    }

    if(!hasUpperCase(password)){
      errors.push('You must provide a password with at least one uppercase character.')
    }

    if(!hasSpecialChars(password)){
      errors.push('You must provide a password with at least (for now) one special character.')
    }

    if(!meetsLength(password)){
      errors.push('You must provide a password with at least 8 characters.')
    }

    if(errors.length > 0){
      return {errors};
    }

    return {errors: null}
  }

  const [formState, formAction, pending] = useActionState(signupAction, {errors: null});

  // Forgot Password Section
  const[showReset, setShowReset] = useState(false);
  const[resetMessage, setResetMessage] = useState('');

  function passwordReset(e)
  {
    e.preventDefault();

    const username = e.target.username.value.trim();

    if(username.length < 3)
    {
      setResetMessage("Enter a valid username.");
      return;
    }

    setResetMessage("An email with a reset form has been sent to the corresponding user (If it exists).")
    e.target.reset();
  }

  // Example account hardcoded
  const VALID_USERNAME = 'admin';
  const VALID_PASSWORD = 'password';

  const [loginError, setLoginError] = useState('');

  const navigate = useNavigate();

  function handleLogin(e) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const username = form.get('username')?.trim();
    const password = form.get('password') ?? '';

    if(username === VALID_USERNAME && password === VALID_PASSWORD) 
    {
      setLoginError('');
      navigate('/dashboard');
    } 
    else 
    {
      setLoginError('Invalid username or password.');
    }

  }


  return (
    <>
    <div className="login-wrapper">
      <img src={`${import.meta.env.BASE_URL}flare.png`} alt="Flare events Logo" className="logo" />
      <h2 className="title">Member Login</h2>
      <form onSubmit={handleLogin}>
        <label htmlFor="username">Username</label>
        <input id="username" type="text" name="username" placeholder="Enter Username"/>

        <label htmlFor="password">Password</label>
        <input id="password" type="password" name="password" placeholder="Enter Password"/>

        <button type="submit">Login</button>
        <p id="message"></p>

        {loginError && (
          <ul className="error">
            <li>{loginError}</li>
          </ul>
        )}


        {formState.errors && <ul className='error'>
          {formState.errors.map((error) => (
            <li key={error}>{error}</li>
          ))}
          </ul>}

        <Link to="/reset" className="link-button">Forgot Password?</Link>
      </form>

      {showReset && (
        <form className="reset-box" onSubmit={passwordReset}>
          <h3 className="title">Reset Password</h3>

          <label htmlFor="reset-username">Username</label>
          <input id="reset-username" name="username" type="text" placeholder="Enter your username"/>

          <button type="submit">Send reset link</button>

          {resetMessage && (
            <ul className="error">
              <li>{resetMessage}</li>
            </ul>
          )}

          <Link to="/" className="link-button">Back to login</Link>


        </form>
      )}

    </div>
      
        
    </>
  )
}

export default LoginPage