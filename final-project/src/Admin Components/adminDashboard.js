import React from 'react';
import '../Admin CSS Components/adminDashboard.css';

const AdminDashboard = () => {
    return (
        <div className="admin-dashboard">
            <h1>Welcome to the Admin Dashboard</h1>
            <p>Here you can manage your application settings and user data.</p>
            {/* Additional admin functionalities can be added here */}
        </div>
    );
};

export default AdminDashboard;