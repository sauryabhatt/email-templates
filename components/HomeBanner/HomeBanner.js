import React from 'react';
import HomePageCarousel from './HomePageCarousel';

function HomeBanner (props) {
    let {isAuthenticated} = props;
    return (
        <div id="banner-container">
            <div className="home-first-fold">
                <HomePageCarousel isAuthenticated = {isAuthenticated}/> 
            </div>
        </div>
    )
}

export default HomeBanner;
