
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from './Login.module.css';


const Login = () => {
    const [isSignUp, setIsSignUp] = useState(false);
    const navigate = useNavigate();
    const [userDetails, setUserDetails] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });


    const handleSignupOrLogin = (e) => {
        const { name } = e.target;
        if (name === 'setToRegister') {
            setIsSignUp(true);
        } else {
            setIsSignUp(false);
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isSignUp) {
            if (userDetails.password !== userDetails.confirmPassword) {
                return alert('Passwords do not match');
            }
        }

        const url = isSignUp ? 'http://localhost:5000/signup' : 'http://localhost:5000/login';
        try {
            const response = await axios.post(url, userDetails);
            if (response.status === 200) {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('userDetails', JSON.stringify(response.data.userDetails));
                navigate('/dashboard');
            }
        } catch (error) {
            console.log(error);
        }

    }
    const handleChangeInput = (e) => {
        const { name, value } = e.target;
        setUserDetails({ ...userDetails, [name]: value });
    }
    return (
        <div className={styles.container}>
            <div className={styles.leftPanel}></div>
            {!isSignUp ? (
                <div className={styles.rightPanel}>
                    <form>
                        <h2>Login</h2>
                        <label htmlFor="email">Email:</label>
                        <input type="text" id="email" name="email" placeholder='email' value={userDetails.email} onChange={(e) => handleChangeInput(e)} />
                        <label htmlFor="password">Password:</label>
                        <input type="password" id="password" placeholder='password' name="password" value={userDetails.password} onChange={(e) => handleChangeInput(e)} />
                        <button onClick={(e) => handleSubmit(e)}>Login</button>
                        <p>Have no account yet?</p>
                        <button type="button" name='setToRegister' onClick={(e) => handleSignupOrLogin(e)}>
                            Register
                        </button>
                    </form>
                </div>
            ) : (
                <div className={styles.rightPanel}>
                    <form>
                        <h2>Sign Up</h2>
                        <input type="text" id="name" name="name" placeholder='name' value={userDetails.name} onChange={(e) => handleChangeInput(e)} />
                        <input type="text" id="email" name="email" placeholder='email' value={userDetails.email} onChange={(e) => handleChangeInput(e)} />
                        <input type="password" id="password" name="password" placeholder='password' value={userDetails.password} onChange={(e) => handleChangeInput(e)} />
                        <input type="password" id="confirmPassword" name="confirmPassword" placeholder='Confirm Password' value={userDetails.confirmPassword} onChange={(e) => handleChangeInput(e)} />
                        <button onClick={(e) => handleSubmit(e)}>Sign Up</button>'
                        <p>Already have an account?</p>
                        <button type="button" name='setToSignup' onClick={(e) => handleSignupOrLogin(e)}>
                            Login
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default Login;
