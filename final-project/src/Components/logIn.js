import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../Components/authContext';
import '../CSS Components/logIn.css';

const Login = () => {
    const [emailOrUsername, setEmailOrUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth(); // Get login function from AuthContext

    const handleLogin = (e) => {
        e.preventDefault();

        const storedUsers = JSON.parse(localStorage.getItem('users')) || [];
        const user = storedUsers.find(user => 
            (user.email === emailOrUsername || user.username === emailOrUsername) && user.password === password
        );

        if (user) {
            // Use the login function from the AuthContext to update global state
            login(user); // Update the global auth state
            localStorage.setItem('loggedInUser', JSON.stringify(user)); // Store in localStorage
            // Redirect to the user dashboard or home page
            navigate('/home');
        } else {
            // Handle login failure
            alert('Invalid credentials. Please try again.');
        }
    };

    return (
        <div className="login-overlay">
            <div className="login-container">
                <h2>Login</h2>
                <form onSubmit={handleLogin} className="login-form">
                    <div className="form-group">
                        <label htmlFor="emailOrUsername">Email or Username:</label>
                        <input 
                            type="text" 
                            id="emailOrUsername" 
                            value={emailOrUsername} 
                            onChange={(e) => setEmailOrUsername(e.target.value)} 
                            required 
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password:</label>
                        <input 
                            type="password" 
                            id="password" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            required 
                        />
                    </div>
                    <div className="button-container">
                        <button type="submit" className="login-button">Log In</button>
                    </div>
                </form>
                <div className="signup-link">
                    <p>Don't have an account? <Link to="/sign-up">Sign up here</Link></p>
                </div>
            </div>
        </div>
    );
};

export default Login;
