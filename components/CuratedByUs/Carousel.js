import React, { useState, useEffect } from "react";
import Link  from "next/link";
import Slider from "react-slick";
import { enquireScreen } from "enquire-js";

export default function Carousel(props){
  let {carouselContent, size} = props
  const [imgCount, setImgCount] = useState(carouselContent.length-1);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    enquireScreen((status) => setIsMobile(status));
  }, []);

  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    centerMode: false,
    slidesToScroll: 1,
    arrows: false,
  };
  let slider;

  const next = () => {
    if(!isMobile || props.setZoomUrl) slider.slickNext();

    let count = imgCount
    if(imgCount >= (carouselContent.length - 1)){
      count = 0
    } else{
      count += 1 
    }
    setImgCount(count)
    if(props.setZoomUrl){
      props.setZoomUrl(carouselContent[count])
    }

  };
  const previous = () => {
    if(!isMobile || props.setZoomUrl) slider.slickPrev();

    let count = imgCount
    if(imgCount <= 0){
      count = carouselContent.length - 1
    } else{
      count -= 1
    }
    setImgCount(count)
    if(props.setZoomUrl){
      props.setZoomUrl(carouselContent[count])
    }
  };


  //function scrollMoveNext(e){

  //let new_array = [...carouselContent]
  //let index = new_array.shift()
  //new_array.push(index)
  //props.updateArray(new_array)
  //setZoomUrl(index)

  //let count = imgCount
  //if(imgCount >= (carouselContent.length - 1)){
  //  count = 0
  //} else{
  //  count += 1 
  //}
  //setImgCount(count)
  //e.target.parentNode.previousElementSibling.firstElementChild.style.marginLeft = `-${(count)*size}px`
  //if(props.setZoomUrl){
  //  props.setZoomUrl(index)
  //}
  //}

  //function scrollMovePrev(e){

  //let new_array = [...carouselContent]
  //let index = new_array[new_array.length - 2]
  //let pop = new_array.pop()
  //new_array.unshift(pop)
  //props.updateArray(new_array)

  //if(props.setZoomUrl){
  //  props.setZoomUrl(index)
  //}
  //let count = imgCount
  //if(imgCount <= 0){
  //  count = carouselContent.length - 1
  //} else{
  //  count -= 1
  //}
  //setImgCount(count)
  ////e.target.parentNode.previousElementSibling.firstElementChild.style.marginLeft = `-${(count)*size}px`
  //if(props.setZoomImgUrl){
  //  props.setZoomImgUrl(carouselContent[count])
  //}
  //}

  return (
    <div>
      {isMobile && !props.setZoomUrl ? (
        <div className = "hroizontal-img-container">
          <div className = "scroll-container">
            {carouselContent.map((e, index) => {
              return( 
                <Link href={e.url}>
                  <div className = "image-wrp">
                    <img src = {require("../../public/filestore/")} alt = {e.alt}/>
                    <h3>{e.text}</h3>
                  </div>
                </Link>
              )
            } )}
          </div>
        </div>
      ):(
        <Slider
          className="category-slider"
          ref={(c) => (slider = c)}
          {...settings}
        >
          {carouselContent.map((e, index) => {
            return( 
              <Link href={e.url}>
                <div className = "image-wrp">
                  <img src = {e.img} alt = {e.alt}/>
                  <h3>{e.text}</h3>
                </div>
              </Link>
            )
          } )}
        </Slider>)}
      {isMobile && !props.setZoomUrl ? null : 
          (<div className = "scroller-container">
            <span onClick = {previous} className = "previous-btn">prev</span>
            <span onClick = {next} className = "next-btn">next</span>
          </div>)}
    </div>
  )
}
