import React from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import '../../CSS Components/userHome CSS/explorePage.css';

const ExplorePage = () => {
    return (
        <div className="explore-background">
            <div className="main-container">
                <Link to="/search-flights">
                    <button className="exploreBtn">Book Flights</button> </Link>
                    <div className="section-1">

                    </div>
                    </div>
                    </div>

    );
};

export default ExplorePage;