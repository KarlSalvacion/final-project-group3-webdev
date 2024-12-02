import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import logo from '../../Assets/png/long-logo.png'; // Your logo
import '../../CSS Components/accountControl CSS/signUp.css';

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

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [showModal, setShowModal] = useState(false);
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
                if (value.length < 5) {
                    errorMsg = 'The username is too short. It must be at least 5 characters long.';
                } else if (value.length > 20) {
                    errorMsg = 'The username is too long. It must be at most 20 characters long.';
                } else if (!usernamePattern.test(value)) {
                    errorMsg = 'Username can only contain letters and numbers.';
                } else if (checkExistingUsername(value)) {
                    errorMsg = 'Username already exists.';
                } else {
                    requirementMsg = 'Your username has been confirmed as valid.';
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
            storedUsers.push(formData); // Corrected line
            localStorage.setItem('users', JSON.stringify(storedUsers));
            setFormData({
                email: '',
                username: '',
                password: '',
                confirmPassword: '',
            });
            setShowModal(true);
        } else {
            console.log('Validation errors:', errors);
        }
    };

    const handleModalClose = () => {
        setShowModal(false);
        navigate('/log-in');
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    // Define the handleExit function to navigate back
    const handleExit = () => {
        navigate('/explore'); // Go back to the previous page
    };

    return (
        <div className='signup-background'>
            <div className="main-container">
                <div className="signup-container">
                    <button className="exit-button" onClick={handleExit}>
                        <FontAwesomeIcon icon={faArrowLeft} /> {/* Add the arrow icon */}
                    </button>
                    <img src={logo} alt="Logo" className="login-logo" />
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
                                <>
                                    {errors.username ? (
                                        <span className="error">{errors.username}</span>
                                    ) : requirementsStatus.username ? (
                                        <span className="requirement">{requirementsStatus.username}</span>
                                    ) : null}
                                </>
                            )}
                        </div>
                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <div className="password-input">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    onFocus={() => handleFocus('password')}
                                    onBlur={() => handleBlur('password')}
                                    required
                                />
                                <span onClick={togglePasswordVisibility} className="password-toggle">
                                    <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                                </span>
                            </div>
                            {focus.password && (
                                <>{errors.password ? <span className="error">{errors.password}</span> : <span className="requirement">{requirementsStatus.password}</span>}</>
                            )}
                        </div>
                        <div className="form-group">
                            <label htmlFor="confirmPassword">Confirm Password</label>
                            <div className="password-input">
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    onFocus={() => handleFocus('confirmPassword')}
                                    onBlur={() => handleBlur('confirmPassword')}
                                    required
                                />
                                <span onClick={toggleConfirmPasswordVisibility} className="password-toggle">
                                    <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} />
                                </span>
                            </div>
                            {focus.confirmPassword && (
                                <>{errors.confirmPassword ? <span className="error">{errors.confirmPassword}</span> : <span className="requirement">{requirementsStatus.confirmPassword}</span>}</>
                            )}
                        </div>
                        <div className="button-container">
                            <button type="submit" className="login-button">Sign Up</button>
                        </div>
                    </form>

                    {showModal && (
                        <div className="custom-modal">
                            <div className="modal-content">
                                <h3>Signup Successful</h3>
                                <p>Your account has been created successfully.</p>
                                <button onClick={handleModalClose} className="btn btn-primary">Go to Login</button>
                            </div>
                        </div>
                    )}

                    <div className="signup-link">
                        <p>Already have an account? <br /> <Link to="/log-in">Log in here</Link></p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Signup;