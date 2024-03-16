import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from './Login.module.css';
import eyeIcon from '../../assets/eye.png';
import lock from '../../assets/lock.png';
import email from '../../assets/email.png';
import astronaut from '../../assets/astronaut.png';

const Login = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const navigate = useNavigate();
  const [passwordType, setPasswordType] = useState('password');
  const [userDetails, setUserDetails] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});

  const handleSignupOrLogin = (e) => {
    e.preventDefault();
    const { name } = e.target;
    if (name === 'setToRegister') {
      setIsSignUp(true);
    } else {
      setIsSignUp(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    let errors = {};
    if (!userDetails.email) {
      errors.email = 'Email is required';
    }
    if (!userDetails.password) {
      errors.password = 'Password is required';
    }

    if (isSignUp) {
      if (!userDetails.name) {
        errors.name = 'Name is required';
      }
      if (!userDetails.confirmPassword) {
        errors.confirmPassword = 'Confirm Password is required';
      }

      if (userDetails.password !== userDetails.confirmPassword) {
        setErrors({ confirmPassword: 'Passwords do not match' });
        return;
      }
    }

    if (Object.keys(errors).length > 0) {
      setErrors(errors);
      return;
    }

    const url = isSignUp
      ? 'https://menon-mahijith-gmail-com-cuvette-final-lpx3.onrender.com/signup'
      : 'https://menon-mahijith-gmail-com-cuvette-final-lpx3.onrender.com/login';
    try {
      const response = await axios.post(url, userDetails);
      if (response.status === 200) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem(
          'userDetails',
          JSON.stringify(response.data.userDetails)
        );
        navigate('/dashboard');
      }
    } catch (error) {
      setErrors({ general: error.response.data });
    }
  };
  const handleChangeInput = (e) => {
    const { name, value } = e.target;
    setUserDetails({ ...userDetails, [name]: value });
  };
  return (
    <div className={styles.container}>
      <div className={styles.leftPanel}>
        <div className={styles.centeredImage}>
          <img src={astronaut} alt="Astronaut" />
        </div>
      </div>
      {!isSignUp ? (
        <div className={styles.rightPanel}>
          <form>
            <h2>Login</h2>
            <div className={styles.passwordDiv}>
              <img src={email} height={30} width={40} alt="email" />
              <input
                type="text"
                id="email"
                name="email"
                placeholder="email"
                value={userDetails.email}
                onChange={(e) => handleChangeInput(e)}
              />
            </div>
            {errors.email && (
              <div className={styles.errorMessage}>{errors.email}</div>
            )}
            <div className={styles.passwordDiv}>
              <img src={lock} height={30} width={40} alt="lock" />

              <input
                type={passwordType}
                id="password"
                placeholder="password"
                className={styles.passwordInput}
                name="password"
                value={userDetails.password}
                onChange={(e) => handleChangeInput(e)}
              />
              <img
                src={eyeIcon}
                height={20}
                width={20}
                alt="eye"
                onClick={() =>
                  setPasswordType(
                    passwordType === 'password' ? 'text' : 'password'
                  )
                }
              />
            </div>
            {errors.password && (
              <div className={styles.errorMessage}>{errors.password}</div>
            )}
            <button
              type="button"
              className={styles.btnLogin}
              name="setToLogin"
              onClick={(e) => handleSubmit(e)}
            >
              Login
            </button>
            <p>Have no account yet?</p>
            <button
              type="button"
              name="setToRegister"
              className={styles.btnOpp}
              onClick={(e) => handleSignupOrLogin(e)}
            >
              Register
            </button>
            {errors.general && (
              <div className={styles.errorMessage}>{errors.general}</div>
            )}
          </form>
        </div>
      ) : (
        <div className={styles.rightPanel}>
          <form>
            <h2>Sign Up</h2>
            <div className={styles.passwordDiv}>
              <img src={lock} height={30} width={40} alt="lock" />
              <input
                type="text"
                id="name"
                name="name"
                placeholder="name"
                value={userDetails.name}
                onChange={(e) => handleChangeInput(e)}
              />
              <img
                src={eyeIcon}
                height={20}
                width={20}
                alt="eye"
                onClick={() =>
                  setPasswordType(
                    passwordType === 'password' ? 'text' : 'password'
                  )
                }
              />
            </div>
            {errors.name && (
              <div className={styles.errorMessage}>{errors.name}</div>
            )}
            <div className={styles.passwordDiv}>
              <img src={email} height={30} width={40} alt="email" />
              <input
                type="text"
                id="email"
                name="email"
                placeholder="email"
                value={userDetails.email}
                onChange={(e) => handleChangeInput(e)}
              />
            </div>
            {errors.email && (
              <div className={styles.errorMessage}>{errors.email}</div>
            )}
            <div className={styles.passwordDiv}>
              <img src={lock} height={30} width={40} alt="lock" />

              <input
                type={passwordType}
                id="password"
                placeholder="password"
                className={styles.passwordInput}
                name="password"
                value={userDetails.password}
                onChange={(e) => handleChangeInput(e)}
              />
              <img
                src={eyeIcon}
                height={20}
                width={20}
                alt="eye"
                onClick={() =>
                  setPasswordType(
                    passwordType === 'password' ? 'text' : 'password'
                  )
                }
              />
            </div>
            {errors.password && (
              <div className={styles.errorMessage}>{errors.password}</div>
            )}
            <div className={styles.passwordDiv}>
              <img src={lock} height={30} width={40} alt="lock" />
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={userDetails.confirmPassword}
                onChange={(e) => handleChangeInput(e)}
              />
              <img
                src={eyeIcon}
                height={20}
                width={20}
                alt="eye"
                onClick={() =>
                  setPasswordType(
                    passwordType === 'password' ? 'text' : 'password'
                  )
                }
              />
            </div>
            {errors.confirmPassword && (
              <div className={styles.errorMessage}>
                {errors.confirmPassword}
              </div>
            )}
            <button
              type="button"
              className={styles.btnLogin}
              onClick={(e) => handleSubmit(e)}
            >
              Sign Up
            </button>
            <p>Already have an account?</p>
            <button
              type="button"
              name="setToLogin"
              className={styles.btnOpp}
              onClick={(e) => handleSignupOrLogin(e)}
            >
              Login
            </button>
            {errors.general && (
              <div className={styles.errorMessage}>{errors.general}</div>
            )}
          </form>
        </div>
      )}
    </div>
  );
};

export default Login;
