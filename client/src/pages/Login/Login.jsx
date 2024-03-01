
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

    const [errors, setErrors] = useState({});


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

        let errors = {};
        if (!userDetails.name) errors.name = 'Name is required';
        if (!userDetails.email) errors.email = 'Email is required';
        if (!userDetails.password) errors.password = 'Password is required';
        if (isSignUp && userDetails.password !== userDetails.confirmPassword) {
            errors.confirmPassword = 'Passwords do not match';
        }
        setErrors(errors);


        if (Object.keys(errors).length > 0) return;
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
                        <input type="text" id="email" name="email" className={errors.name ? styles.error : ''} placeholder='email' value={userDetails.email} onChange={(e) => handleChangeInput(e)} />
                        <label htmlFor="password">Password:</label>
                        <input type="password" id="password" className={errors.name ? styles.error : ''} placeholder='password' name="password" value={userDetails.password} onChange={(e) => handleChangeInput(e)} />
                        <button onClick={(e) => handleSubmit(e)}>Login</button>
                        <p>Have no account yet?</p>
                        <button type="button" name='setToRegister' onClick={(e) => handleSignupOrLogin(e)}>
                            Register
                        </button>
                    </form>
                    {errors.name && <div className={styles.errorMessage}>{errors.name}</div>}
                </div>
            ) : (
                <div className={styles.rightPanel}>
                    <form>
                        <h2>Sign Up</h2>
                        <input type="text" id="name" name="name" className={errors.name ? styles.error : ''} placeholder='name' value={userDetails.name} onChange={(e) => handleChangeInput(e)} />
                        <input type="text" id="email" name="email" className={errors.name ? styles.error : ''} placeholder='email' value={userDetails.email} onChange={(e) => handleChangeInput(e)} />
                        <input type="password" id="password" name="password" placeholder='password' className={errors.name ? styles.error : ''} value={userDetails.password} onChange={(e) => handleChangeInput(e)} />
                        <input type="password" id="confirmPassword" name="confirmPassword" className={errors.name ? styles.error : ''} placeholder='Confirm Password' value={userDetails.confirmPassword} onChange={(e) => handleChangeInput(e)} />
                        <button onClick={(e) => handleSubmit(e)}>Sign Up</button>'
                        <p>Already have an account?</p>
                        <button type="button" name='setToSignup' onClick={(e) => handleSignupOrLogin(e)}>
                            Login
                        </button>
                    </form>
                    {errors.name && <div className={styles.errorMessage}>{errors.name}</div>}
                </div>
            )}
        </div>
    );
};

export default Login;
