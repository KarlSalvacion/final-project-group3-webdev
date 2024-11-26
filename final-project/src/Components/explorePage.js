import '../CSS Components/explorePage.css';
import AirplanePic1 from '../Assets/airplane-view-night.jpg';
const ExplorePage = () => {
    return (
    
    <div className="main-container">
        <div className="image-container">
            <img src={AirplanePic1} className="airplaneImagePOV"/>
        </div>

        <button className="exploreBtn">Explore</button>
        <div className="section-1">

            <h1>sample</h1>
            
        </div>
    </div>
    
    );
}

export default ExplorePage;