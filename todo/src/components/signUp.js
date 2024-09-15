import React,{useState} from "react";
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import jwt_decode from 'jwt_decode';

function signUp(){
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const history = useHistory();

    const handleSubmit = async(e)=>{
        e.preventDefault();
        try{
            await axios.post('/api/signup',{email,password,name});
            history.push('/signin');
        }catch(error){
            console.error('Sign up failed',error);
        }
    };

    const handleGoogleSignUpSuccess = async (credentialResponse)=>{
        try{
            const decoded =  jwt_decode(credentialResponse.credential);
            console.log(decoded);

            const response = await axios.post('/api/google-signup',{
                token: credentialResponse.credential
            });

            localStorage.setItem('token', response.data.token);
            history.push('/todos');
        }
        catch(error){
            console.log('Google Signup failed', error);
        }
    }

    return (
        <div>
          <h2>Sign Up</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Name"
              required
            />
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
            <button type="submit">Sign Up</button>
          </form>
          <div>
            <p>Or sign up with Google:</p>
            <GoogleLogin
              onSuccess={handleGoogleSignUpSuccess}
              onError={() => {
                console.log('Sign Up Failed');
              }}
            />
          </div>
        </div>
      );
    
}