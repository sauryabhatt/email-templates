import React from 'react';

function HomeBanner (props) {
    return (
        <div id="banner-container">
            <div className='bird-vector' />
            {props.children}
        </div>
    )
}

export default HomeBanner;