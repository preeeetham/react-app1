import React, { useState } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import jwt_decode from 'jwt_decode';

function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const history = useHistory();

  // Handle standard email/password sign-in
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Send the sign-in request to your backend
      const response = await axios.post('/api/signin', { email, password });

      // Store the token in localStorage (or any secure storage)
      localStorage.setItem('token', response.data.token);

      // Redirect the user to a protected route (like the todo page or dashboard)
      history.push('/todos');
    } catch (error) {
      console.error('Sign in failed', error);
    }
  };

  // Handle Google OAuth sign-in
  const handleGoogleSignInSuccess = async (credentialResponse) => {
    try {
      const decoded = jwt_decode(credentialResponse.credential);
      console.log(decoded);

      const response = await axios.post('/api/google-signin', {
        token: credentialResponse.credential,
      });

      // Store the token and redirect
      localStorage.setItem('token', response.data.token);
      history.push('/todos');
    } catch (error) {
      console.log('Google Signin failed', error);
    }
  };

  return (
    <div>
      <h2>Sign In</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <button type="submit">Sign In</button>
      </form>

      <div>
        <p>Or sign in with Google:</p>
        <GoogleLogin
          onSuccess={handleGoogleSignInSuccess}
          onError={() => {
            console.log('Sign In Failed');
          }}
        />
      </div>
    </div>
  );
}

export default SignIn;
