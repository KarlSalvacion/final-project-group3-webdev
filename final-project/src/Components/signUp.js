import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../CSS Components/signUp.css';

const Signup = () => {
    const [formData, setFormData] = useState({
        email: '',
        username: '',
        password: '',
        confirmPassword: '',
    });

    const [errors, setErrors] = useState({
        email: '',
        username: '',
        password: '',
        confirmPassword: '',
    });

    const [focus, setFocus] = useState({
        email: false,
        username: false,
        password: false,
        confirmPassword: false,
    });

    const [requirementsStatus, setRequirementsStatus] = useState({
        email: '',
        username: '',
        password: '',
        confirmPassword: '',
    });

    const [showModal, setShowModal] = useState(false); // State to toggle modal visibility
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        validateField(name, value);
    };

    const handleFocus = (name) => {
        setFocus({ ...focus, [name]: true });
    };

    const handleBlur = (name) => {
        setFocus({ ...focus, [name]: false });
    };

    const validateField = (name, value) => {
        let errorMsg = '';
        let requirementMsg = '';

        switch (name) {
            case 'email':
                const emailPattern = /^[^\s@]+@[^\s@]+\.[a-zA-Z]+$/;
                if (!emailPattern.test(value)) {
                    errorMsg = 'Please enter a valid email address.';
                } else if (checkExistingEmail(value)) {
                    errorMsg = 'Email already exists.';
                } else {
                    requirementMsg = 'Email requirement satisfied.';
                }
                break;
            case 'username':
                const usernamePattern = /^[a-zA-Z0-9]{5,20}$/;
                if (!usernamePattern.test(value)) {
                    errorMsg = 'Username must be 5-20 characters long and can only contain letters and numbers.';
                } else if (checkExistingUsername(value)) {
                    errorMsg = 'Username already exists.';
                } else {
                    requirementMsg = 'Username requirement satisfied.';
                }
                break;
            case 'password':
                const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,16}$/;
                if (!passwordPattern.test(value)) {
                    errorMsg = 'Password must be 8-16 characters long and include at least one uppercase letter, one lowercase letter, and one number.';
                } else {
                    requirementMsg = 'Password requirement satisfied.';
                }
                break;
            case 'confirmPassword':
                if (value !== formData.password) {
                    errorMsg = 'Passwords do not match.';
                } else {
                    requirementMsg = 'Confirm Password requirement satisfied.';
                }
                break;
            default:
                break;
        }

        setErrors({ ...errors, [name]: errorMsg });
        setRequirementsStatus({ ...requirementsStatus, [name]: requirementMsg });
    };

    const checkExistingEmail = (email) => {
        const storedUsers = JSON.parse(localStorage.getItem('users')) || [];
        return storedUsers.some(user => user.email === email);
    };

    const checkExistingUsername = (username) => {
        const storedUsers = JSON.parse(localStorage.getItem('users')) || [];
        return storedUsers.some(user => user.username === username);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const isValid = Object.values(errors).every((error) => error === '');
        if (isValid) {
            const storedUsers = JSON.parse(localStorage.getItem('users')) || [];
            storedUsers.push(formData);
            localStorage.setItem('users', JSON.stringify(storedUsers));
            setFormData({
                email: '',
                username: '',
                password: '',
                confirmPassword: '',
            });
            setShowModal(true); // Show custom modal
        } else {
            console.log('Validation errors:', errors);
        }
    };

    const handleModalClose = () => {
        setShowModal(false);
        navigate('/log-in');
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
                        onFocus={() => handleFocus('email')}
                        onBlur={() => handleBlur('email')}
                        required
                    />
                    {focus.email && (
                        <>{errors.email ? <span className="error">{errors.email}</span> : <span className="requirement">{requirementsStatus.email}</span>}</>
                    )}
                </div>
                <div className="form-group">
                    <label htmlFor="username">Username</label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        onFocus={() => handleFocus('username')}
                        onBlur={() => handleBlur('username')}
                        required
                    />
                    {focus.username && (
                        <>{errors.username ? <span className="error">{errors.username}</span> : <span className="requirement">{requirementsStatus.username}</span>}</>
                    )}
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        onFocus={() => handleFocus('password')}
                        onBlur={() => handleBlur('password')}
                        required
                    />
                    {focus.password && (
                        <>{errors.password ? <span className="error">{errors.password}</span> : <span className="requirement">{requirementsStatus.password}</span>}</>
                    )}
                </div>
                <div className="form-group">
                    <label htmlFor="confirmPassword">Confirm Password</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        onFocus={() => handleFocus('confirmPassword')}
                        onBlur={() => handleBlur('confirmPassword')}
                        required
                    />
                    {focus.confirmPassword && (
                        <>{errors.confirmPassword ? <span className="error">{errors.confirmPassword}</span> : <span className="requirement">{requirementsStatus.confirmPassword}</span>}</>
                    )}
                </div>
                <div className="button-container">
                    <button type="submit" className="login-button">Sign Up</button>
                </div>
            </form>

            {/* Custom Modal */}
            {showModal && (
                <div className="custom-modal">
                    <div className="modal-content">
                        <h3>Signup Successful</h3>
                        <p>Your account has been created successfully. Please log in.</p>
                        <button onClick={handleModalClose} className="btn btn-primary">Go to Login</button>
                    </div>
                </div>
            )}

            <div className="login-link">
                <p>Already have an account? <Link to="/log-in">Log in here</Link></p>
            </div>
        </div>
    );
};

export default Signup;
