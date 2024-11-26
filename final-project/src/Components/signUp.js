import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../CSS Components/signUp.css';

const Signup = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle signup logic here (e.g., API call)
        console.log('Signup Data:', formData);
    };

    return (
        <div className="login-container">
            <h2>Sign Up</h2>
            <form className="login-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="confirmPassword">Confirm Password</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="button-container">
                    <button type="submit" className="login-button">Sign Up</button>
                </div>
            </form>
            <div className="login-link">
                <p>Already have an account? <Link to="/log-in">Click here</Link></p>
            </div>
        </div>
    );
};

export default Signup;