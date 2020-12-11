import React, { useState, useEffect} from 'react';
import { enquireScreen } from "enquire-js";

import Slider from "react-slick";

import left from "../../public/filestore/left"
import right from "../../public/filestore/right"

export default function Tastimonial(){

    const [isMobile, setIsMobile] = useState(false);
    let slider;

    const next = () => {
        slider.slickNext();
    };
    const previous = () => {
        slider.slickPrev();
    };

    useEffect(() => {
        enquireScreen((status) => setIsMobile(status));
    }, []); 

    const settings = {
        infinite: true,
        speed: 1000,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: false,
        autoplaySpeed: 5000,
    };
    const tastimonial_data= [
        {
            url: "",
            text_message: "“Your bells arrived and I wish I had ordered many more!!! The craftsmanship is outstanding - thank you:)”",
            user_name: "- Store owner, Western Australia"
        },
        {
            url: "",
            text_message: "“I have just taken delivery of my cushions shipment. Extremely happy with the products. Thank you for all your help and prompt updates throughout this process. I will be placing more orders with Qalara soon.”",
            user_name: "- Boutique owner, United Kingdom"
        },
        {
            url: "",
            text_message: "“It was lovely chatting with you yesterday... the rugs look awesome!”",
            user_name: "- Business owner, New Zealand"
        },
        {
            url: "",
            text_message: "“I just wanted to extend my thanks for all the work you are putting in on our behalf, it is greatly appreciated”",
            user_name: "- Online retailer, USA"
        }]


    return(
        <div className="tastimonial-wrapper">
            <span
                onClick={previous}
                className="cart-left-arrow cart-arrow"
            >{left()}</span>
            <Slider ref={(c) => (slider = c)} {...settings}>
                {tastimonial_data.map((p, index) => {
                    return (
                        <div key={index} className="cart-sildes">
                            <span className="cart-banner-title">{p.text_message}</span>
                            <span className="cart-banner-copy">{p.user_name}</span>
                        </div>
                    );
                })}
            </Slider>
            <span onClick={next} className="cart-right-arrow cart-arrow">
                {right()}
            </span>
        </div>
    )
}
