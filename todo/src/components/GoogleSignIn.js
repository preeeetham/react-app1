import React from 'react';
import { GoogleLogin } from 'react-google-login';

function GoogleSignIn({ onSuccess }) {
  const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID; // You'll need to set this in your .env file

  const onFailure = (error) => {
    console.error('Google Sign-In Failed', error);
  };

  return (
    <GoogleLogin
      clientId={clientId}
      buttonText="Sign in with Google"
      onSuccess={onSuccess}
      onFailure={onFailure}
      cookiePolicy={'single_host_origin'}
    />
  );
}

export default GoogleSignIn;