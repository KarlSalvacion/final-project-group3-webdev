import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import useHistory for navigation
import '../CSS Components/logIn.css'; // Import the CSS file for styling

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate(); // Initialize useHistory for navigation

    const handleLogin = (e) => {
        e.preventDefault();
        
        // Check for admin credentials
        if (email === 'admin@admin.com' && password === 'admin123') {
            // Redirect to admin dashboard
            navigate('/admin-dashboard'); // Change this to your admin route
        } else {
            // Handle regular user login or show an error
            alert('Invalid credentials. Please try again.');
        }
    };

    return (
        <div className="login-overlay">
            <div className="login-container">
                <h2>Login</h2>
                <form onSubmit={handleLogin} className="login-form">
                    <div className="form-group">
                        <label htmlFor="email">Email:</label>
                        <input 
                            type="email" 
                            id="email" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
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