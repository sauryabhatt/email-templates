/** @format */

import React, { useState, useEffect, useRef, useImperativeHandle } from "react";
import { enquireScreen } from "enquire-js";
import Slider from "react-slick";
import playButton from "../../public/filestore/playButton";
import play from "../../public/filestore/play";
import pause from "../../public/filestore/pause";
import cross from "../../public/filestore/Cross";
import volume from "../../public/filestore/volume";
import mute from "../../public/filestore/mute";

import signUp_icon from "../../public/filestore/Sign_Up";
import Link from "next/link";
import { useRouter } from "next/router";

//import b2 from "../../public/filestore/Homepage-banner2.jpg"
//import b2_m from "../../public/filestore/Homepage-banner2-mob.jpg"

export default function HomePageCarousel(props) {
  const [isMobile, setIsMobile] = useState(false);
  const imgs = [
    {
      img: "https://cdn.qalara.com/images/Img_Homepage_Banner_Qalara_1.jpg",
      hading_text: (
        <div style={{ color: "#754222" }}>
          Global wholesale{isMobile ? <br /> : null} buying,{" "}
          {isMobile ? <br /> : null}reimagined.
        </div>
      ),
      small_text: (
        <div>
          <div>
            Shop wholesale products online from {isMobile ? <br /> : null}India
            & South East Asia.
          </div>{" "}
          <div style={{ marginBottom: isMobile ? "15px" : "20px" }}>
            Unique products. Ethically crafted.{isMobile ? <br /> : null}{" "}
            Quality certified. Door delivered.
          </div>
          <div>Verified buyers across 40+ countries.</div>
          <div>Backed by a Fortune 100 company.</div>
        </div>
      ),
      video_link: "",
      isSignupbtn: true,
      signinBTNLink: "/sellers/all-categories",
      signinBTNText: "START SHOPPING",
      mobileImg: "https://cdn.qalara.com/images/Img_Homepage_Banner_Qalara_1-mob.jpg",
    },
    {
      img: "https://cdn.qalara.com/images/Img_Banner_Qalarabazar.jpg",
      hading_text: "",//"Global wholesale buying, reimagined.",
      small_text: "",//"Source wholesale products from India and South East Asia. Order digitally, reliably, affordably.Backed by a Fortune 100 company.Verified buyers from 25+ countries.",
      video_link: "",//"https://archive.org/download/BigBuckBunny_124/Content/big_buck_bunny_720p_surround.mp4",            
      isSignupbtn: false,
      signinBTNLink: "/seller/SL10789/all-categories",
      mobileImg: "https://cdn.qalara.com/images/Img_Banner_Qalarabazar_mob.jpg",
    },
    {
      img: "https://cdn.qalara.com/images/Img_Homepage_Banner_Qalara_2-1.jpg",
      hading_text: <div className = "second-img-head">Eco-friendly,{isMobile ?<br/>: null} handmade gifts for{isMobile ?<br/>: null} the Holiday season.</div>,
      small_text: <span className = "second-img-subhead" > <div> Use coupon code <b>FLAT75OFF</b> to avail</div><div> <b>$75 off*</b> on all orders.</div></span>,
      //video_link: "",  
      isSignupbtn: true,
      signinBTNLink: "/sellers/all-categories?f_values=ECO_FRIENDLY",
      signinBTNText: "EXPLORE NOW",
      mobileImg: "https://cdn.qalara.com/images/Img_Homepage_Banner_Qalara_2-mob.jpg",
    },
    {
      img: "https://cdn.qalara.com/images/Img_Homepage_banner_3.jpg",
      hading_text: "",
      small_text: "",
      isSignupbtn: false,
      signinBTNLink: "/sellers/all-categories",
      mobileImg: "https://cdn.qalara.com/images/Img_Homepage_banner_3_mob.jpg",
    },
  ];
  const [imgCount, setImgCount] = useState(0);
  const [before, setBefore] = useState(false);

  let slider;
  const next = () => {
    slider.slickNext();
  };
  const previous = () => {
    slider.slickPrev();
  };

  useEffect(() => {
    enquireScreen((status) => setIsMobile(status));
    //window.addEventListener("scroll", handleScroll);
  }, []);

  function handleScroll() {
    let video = document.querySelectorAll("video");
    if (Object.keys(video).length > 0) {
      if (window.scrollY >= document.body.clientHeight) {
        for (let i = 0; i < 2; i++) {
          video[i].pause();
          video[i].currentTime = 2;
        }
      }
    }
  }

  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    afterChange: onSlideChange,
    autoplay: true,
    autoplaySpeed: 10000,
    //beforeChange: change,
  };

  function change() {
    setBefore(!before);
    document
      .querySelector(".home-signup-btn")
      .style.setProperty("bottom", "30%");
    let video = document.querySelectorAll("video");
    for (let i = 0; i < 2; i++) {
      video[i].pause();
      video[i].currentTime = 2;
    }
    if (
      document.querySelectorAll(".home-banner-video-reset") &&
      document.querySelectorAll(".home-banner-video-reset")[0]
    )
      document.querySelectorAll(".home-banner-video-reset")[0].click();
  }

  function onSlideChange(e) {
    setImgCount(e);
  }

  return (
    <div className="home-banner-carousel">
      <Slider className="" ref={(c) => (slider = c)} {...settings}>
        {imgs.map((e, index) => {
          return (
            <SlideElement
              e={e}
              key={index}
              index={index}
              isVideoPlay={false}
              imgCount={imgCount}
              isMobile={isMobile}
              isAuthenticated={props.isAuthenticated}
            />
          );
        })}
      </Slider>
      <div className="scroller-container">
        {!isMobile ? (
          <span onClick={previous} className="previous-btn">
            prev
          </span>
        ) : null}
        {imgCount + 1}/{imgs.length}
        {!isMobile ? (
          <span onClick={next} className="next-btn">
            next
          </span>
        ) : null}
      </div>
    </div>
  );
}

function SlideElement(props) {
  const router = useRouter();
  let {
    e,
    isVideoPlay,
    index,
    imgCount,
    before,
    isMobile,
    isAuthenticated,
  } = props;
  const videoEl = useRef(null);
  const plaBtnEl = useRef(null);
  const [isSound, setSoundControle] = useState(false);
  const [isVideoPause, setStart] = useState(false);
  const [isVideo, setVideo] = useState(false);
  const [isStop, setStop] = useState(false);
  useEffect(() => {
    let el = plaBtnEl.current;
    if (e && e.video_link) {
      if (index == imgCount) {
        if (isVideo || isStop) return;
        el.className += " activeCircle";
        setTimeout(
          () => {
            el.classList.remove("activeCircle");
            showVideo("play");
          },
          3000,
          el,
          showVideo
        );
        //setStop(false)
      } else {
        if (isVideo) showVideo("pause");
        setStop(false);
      }
    }
  });

  function playControlVideo(value) {
    if (value === "play") {
      videoEl.current.play();
      setStart(false);
    } else {
      videoEl.current.pause();
      let video = document.querySelectorAll("video");
      for (let i = 0; i < 2; i++) {
        video[i].pause();
        //video[i].muted = true
        if (value === "stop") video[i].currentTime = 2;
      }

      setStart(true);
    }
  }

  function muteVideo() {
    let video = document.querySelectorAll("video");
    for (let i = 0; i < 2; i++) {
      video[i].muted = true;
    }

    videoEl.current.muted = !isSound;
    setSoundControle(!isSound);
  }

  function showVideo(flag) {
    if (flag === "play") {
      document
        .querySelector(".home-signup-btn")
        .style.setProperty("bottom", "60px");
    } else {
      document
        .querySelector(".home-signup-btn")
        .style.setProperty("bottom", "30%");
      setStop(true);
    }
    playControlVideo(flag);
    setVideo(!isVideo);
  }

  function signupAction() {
    router.push(e.signinBTNLink);
  }
  return (
    <div
      onClick={!e.isSignupbtn ? signupAction : () => {}}
      style={
        isMobile
          ? {}
          : { backgroundImage: `url(${isMobile ? e.mobileImg : e.img})` }
      }
      key={index}
      className={`home-banner-carousel-wrap ${
        !e.isSignupbtn ? "pointer" : ""
      } ${!isVideo ? "active-banner" : ""}`}
    >
      {isMobile ? (
        <img
          style={{ width: "100%", maxHeight: "100vh" }}
          alt=""
          src={isMobile ? e.mobileImg : e.img}
        />
      ) : null}
      <div className="home-signup-btn">
        {e.isSignupbtn ? (
          !isAuthenticated ? (
            <a href="/signup" className="button">
              <span className="sign-up-text-icon">{signUp_icon()} </span>
              <span className="sign-up-text">Sign Up as a buyer</span>
            </a>
          ) : (
            <a href={e.signinBTNLink} className="button">
              <span className="sign-up-text">{e.signinBTNText}</span>
            </a>
          )
        ) : null}
      </div>
      {e.video_link && isVideo ? (
        <span
          className="video-action-btn home-banner-video-reset"
          onClick={() => showVideo("stop")}
        >
          {cross()}
        </span>
      ) : null}
      {e.video_link ? (
        <div className="home-banner-video-wrap">
          <video
            style={!isVideo ? { visibility: "hidden" } : {}}
            ref={videoEl}
            id={`home-banner-video-${index}`}
            currentTime={index === 1 ? 2 : ""}
            className="home-banner-video"
            height="100%"
            width="100%"
            src={e.video_link}
            type="video/mp4"
          />
        </div>
      ) : null}
      {e.hading_text ? (
        <div
          style={
            !e.video_link
              ? { top: "17%" }
              : isVideo
                ? { fontSize: "30px", top: "27px" }
                : {}
          }
          className="home-banner-head-text"
        >
          {e.hading_text}
        </div>
      ) : null}
      {e.video_link && !isVideo ? (
        <span
          ref={plaBtnEl}
          className={`home-banner-playvideo `}
          onClick={() => showVideo("play")}
        >
          <svg className="icn-spinner">
            <circle cx="66" cy="66" r="63"></circle>
          </svg>
          {playButton()}
        </span>
      ) : null}
      {e.small_text && !isVideo ? (
        <div className="home-banner-small-text">{e.small_text}</div>
      ) : null}

      {e.video_link && isVideo ? (
        <div className="video-action-wrap">
          <span
            className="video-action-btn"
            onClick={
              isVideoPause ? () => playControlVideo("play") : playControlVideo()
            }
          >
            {isVideoPause ? play() : pause()}
          </span>
          <span className="video-action-btn" onClick={muteVideo}>
            {!isSound ? volume() : mute()}
          </span>
        </div>
      ) : null}
    </div>
  );
}
