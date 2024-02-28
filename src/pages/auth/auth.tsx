import React, { useState } from 'react'
import { Footer } from '../../components/footer/footer';
import "./auth.css";
import { login, register, fetchUserData, parseJwt } from '../../AuthService';
import { useAuth } from '../../UserContext';

export default function Auth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [isHidePassword, setIsHidePassword] = useState(true);
  const { setUser } = useAuth();

  const handleAuthSubmit = async () => {
    if (isSignUp) {
      const token = await register(email, password, username);
      if (token) {
        const userData = await fetchUserData(parseJwt().id);
        setUser(userData);
      }
    } else {
      const token = await login(email, password);
      if (token) {
        const userData = await fetchUserData(parseJwt().id);
        setUser(userData);
      }
    }
    setEmail('');
    setPassword('');
    setUsername('');
    window.location.reload();
  };
  
  return (
    <>
        <img src='/images/Vector5.png' alt="vector 5" className='vector' id="formVector"/>
        <div id="form">
            <div className="header">Sign {isSignUp ? "Up" : "In"}</div>
            <div id='inputs'>
            <input
              type="email"
              placeholder="Your email"
              value={email}
              required={true}
              onChange={(e) => setEmail(e.target.value)}
            />
            {isSignUp && <input
              type="text"
              placeholder="Create username"
              value={username}
              required={true}
              onChange={(e) => setUsername(e.target.value)}
            />}
            <div>
              <input
                type= {isHidePassword ? "password" : "text"}
                placeholder="Your password"
                value={password}
                required={true}
                onChange={(e) => setPassword(e.target.value)}
              />
              <img
                src={`images/${(isHidePassword ? 'eye.webp' : 'hide.webp')}`}
                alt='show/hide password' id='eye'
                onClick={() => {setIsHidePassword(!isHidePassword)}}/>
            </div>
            { !isSignUp && <div id='changePassword'>Forgot password?</div> }
            <button onClick={handleAuthSubmit}> {isSignUp ? "Sign Up" : "Sign In"} </button>
            </div>
        </div>
        <div id="formButtons">
            <button id="signUpButton" onClick={() => setIsSignUp(true)}>Sign up</button>
            <button id="logInButton" onClick={() => setIsSignUp(false)}>Sign in</button>
        </div>
        <div className='bottom'>
            <Footer />
        </div>
    </>
  )
}