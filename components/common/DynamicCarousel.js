/** @format */

import React from "react";
import Slider from "react-slick";
import { RightOutlined, LeftOutlined } from "@ant-design/icons";
import lockOutline from "../../public/filestore/lockOutline";
import Icon from "@ant-design/icons";
import playButton from "../../public/filestore/playButton";
import { useSelector } from "react-redux";

const SampleNextArrow = (props, e) => {
  const { style, onClick, className = "" } = props;
  let disabled = false;
  if (className.includes("slick-disabled")) {
    disabled = true;
  }
  return (
    <div
      className={`slick-arrow qa-slick-next ${disabled ? "disabled" : ""}`}
      style={{
        ...style,
        display: "block",
        background: "rgba(31, 31, 31, 0.25)",
      }}
      onClick={(e) => {
        e.preventDefault();
        if (!disabled) {
          onClick();
        }
      }}
    >
      <RightOutlined />
    </div>
  );
};

const SamplePrevArrow = (props) => {
  const { style, onClick, className = "" } = props;
  let disabled = false;
  if (className.includes("slick-disabled")) {
    disabled = true;
  }
  return (
    <div
      className={`slick-arrow qa-slick-prev ${disabled ? "disabled" : ""}`}
      style={{
        ...style,
        display: "block",
        background: "rgba(31, 31, 31, 0.25)",
      }}
      onClick={(e) => {
        e.preventDefault();
        if (!disabled) {
          onClick();
        }
      }}
    >
      <LeftOutlined />
    </div>
  );
};

function DynamicCarousel(props) {
  const settings = {
    className: "center",
    centerMode: true,
    dots: true,
    infinite: true,
    lazyLoad: true,
    centerPadding: "0",
    slidesToShow: props.items || 3,
    slidesToScroll: 1,
    speed: 500,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: props.items || 3,
          slidesToScroll: props.items || 1,
          infinite: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: props.items || 2,
          slidesToScroll: props.items || 1,
          infinite: true,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: props.items || 1.05,
          slidesToScroll: props.items || 1,
          infinite: true,
        },
      },
    ],
  };
  const isAuthenticated = useSelector((state) => state.auth.authenticated);
  let slider;

  let productImages = {};
  let {
    data = [],
    id = "",
    productName = "",
    userProfile = {},
    productId = "",
    selectedProductId = "",
    sellerId = "",
    visibleTo = "",
  } = props || {};
  let { profileType = "", verificationStatus = "", profileId = "" } =
    userProfile || {};
  if (profileType === "SELLER") {
    profileId = profileId.replace("SELLER::", "");
  }
  let accessLocked = false;
  if (
    (profileType === "BUYER" && verificationStatus === "VERIFIED") ||
    (profileType === "BUYER" && verificationStatus === "IN_PROGRESS") ||
    (profileType === "SELLER" && profileId === sellerId) ||
    (profileType === "BUYER" &&
      verificationStatus === "IN_PROGRESS" &&
      visibleTo === "ALL") ||
    props.id === "seller-listing"
  ) {
    accessLocked = true;
  }

  if (visibleTo === "ALL") {
    accessLocked = true;
  }

  if (data && data.length) {
    productImages = data.slice(0, 10).map((item, i) => {
      let { displayMedia = {} } = item;

      let { altName = "" } = displayMedia;
      let imageUrl =
        displayMedia.media &&
        displayMedia.media.mediaUrl &&
        process.env.REACT_APP_ASSETS_FILE_URL + displayMedia.media.mediaUrl;

      if (id === "seller-product-listing" || id === "product-listing") {
        imageUrl = process.env.REACT_APP_ASSETS_FILE_URL + item;
      }
      return (
        <div key={i} className="slider-slide">
          <div
            className={`${
              !accessLocked
                ? "aspect-ratio-box lock-section"
                : "aspect-ratio-box"
            }`}
          >
            {imageUrl && imageUrl.includes(".mp4") ? (
              <div className="splp-video-section">
                <video
                  id="splp-video"
                  className="splp-video"
                  src={imageUrl}
                  preload="meta"
                ></video>

                <span
                  style={{
                    position: "absolute",
                    left: "50%",
                    top: "50%",
                    transform: "translate(-50%, -50%)",
                  }}
                >
                  <Icon
                    component={playButton}
                    style={{ width: "132px", height: "131px" }}
                  />
                </span>
              </div>
            ) : (
              <img src={imageUrl} alt={altName || productName} />
            )}
          </div>
        </div>
      );
    });
  }
  let notificationMsg = "";
  if (profileType === "BUYER" && verificationStatus === "IN_PROGRESS") {
    notificationMsg =
      "You will be able to view the products once your Buyer account is verified.";
  } else if (profileType === "BUYER" && verificationStatus === "ON_HOLD") {
    notificationMsg =
      "You will be able to view the products once your Buyer account is verified.";
  } else if (profileType === "BUYER" && verificationStatus === "REJECTED") {
    notificationMsg =
      "You will be able to view the products once your Buyer account is verified.";
  } else if (profileType === "SELLER" && profileId !== sellerId) {
    notificationMsg =
      "In order to activate your account and place an order Please signup as a buyer";
  }

  if (!isAuthenticated) {
    notificationMsg =
      "Sign up/ Sign in to view this product (for verified buyers only)";
  }

  return (
    <div className="image-carousel">
      {data && data.length > 0 ? (
        <Slider ref={(c) => (slider = c)} {...settings}>
          {productImages}
        </Slider>
      ) : (
        <div className="aspect-ratio-box">
          <span className="qa-aspect-box">
            <svg
              width="150px"
              height="100px"
              viewBox="0 0 163 102"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M95.1665 42.4999V31.7532L92.3332 28.9199L97.9998 23.2533V43.9166C97.9998 44.6986 97.3652 45.3332 96.5832 45.3332H75.9199L78.7532 42.4999H95.1665ZM100.833 56.6664H64.5867L61.7534 59.4997H102.25C103.032 59.4997 103.666 58.8651 103.666 58.0831V17.5867L100.833 20.42V56.6664ZM114.585 2.41858L49.4186 67.5846C48.8661 68.1385 47.9679 68.1385 47.4154 67.5846C46.8615 67.0307 46.8615 66.1353 47.4154 65.5814L55.5003 57.4966V4.25031C55.5003 3.46832 56.1349 2.83366 56.9169 2.83366H102.25C103.032 2.83366 103.666 3.46832 103.666 4.25031V9.33042L112.581 0.415433C113.135 -0.138478 114.031 -0.138478 114.585 0.415433C115.138 0.969344 115.138 1.86467 114.585 2.41858ZM58.3336 54.6633L67.6636 45.3332H62.5835C61.8015 45.3332 61.1669 44.6986 61.1669 43.9166V9.91692C61.1669 9.13493 61.8015 8.50027 62.5835 8.50027H96.5832C97.3652 8.50027 97.9998 9.13493 97.9998 9.91692V14.997L100.833 12.1637V5.66696H58.3336V54.6633ZM87.6682 24.2548C87.1143 23.7009 86.2189 23.7009 85.665 24.2548L75.3334 34.5865L70.6103 29.8634C70.0564 29.3095 69.1596 29.3095 68.6071 29.8634L64.0002 34.4689V42.4999H70.4969L88.2051 24.7918L87.6682 24.2548Z"
                fill="#191919"
              />
              <path
                d="M5.82422 96.8379V98H1.50391V96.8379H3.04883V90.002H1.50391V88.8398H5.82422V90.002H4.2793V96.8379H5.82422ZM17.3496 88.8398V98H16.1191V91.3691L13.2891 94.3906H12.9609L10.0625 91.3691V98H8.83203V88.8398H9.21484L13.125 93.0371L16.9668 88.8398H17.3496ZM23.8848 88.8398L28.1641 98H26.6875L25.7305 95.8125H21.4375L20.4668 98H18.9902L23.2695 88.8398H23.8848ZM23.5977 90.918L21.9434 94.6504H25.2246L23.5977 90.918ZM33.3047 92.9961H37.3379V96.7559C37.1191 96.9928 36.8366 97.2253 36.4902 97.4531C36.1439 97.6719 35.7428 97.8542 35.2871 98C34.8405 98.1367 34.3483 98.2051 33.8105 98.2051C33.1178 98.2051 32.4798 98.082 31.8965 97.8359C31.3132 97.5807 30.8027 97.2344 30.3652 96.7969C29.9277 96.3594 29.5859 95.8535 29.3398 95.2793C29.1029 94.696 28.9844 94.0762 28.9844 93.4199C28.9844 92.7637 29.1029 92.1484 29.3398 91.5742C29.5859 90.9909 29.9277 90.4805 30.3652 90.043C30.8027 89.6055 31.3132 89.2637 31.8965 89.0176C32.4798 88.7624 33.1178 88.6348 33.8105 88.6348C34.4759 88.6348 35.0182 88.7259 35.4375 88.9082C35.8659 89.0905 36.2396 89.3275 36.5586 89.6191V90.9727C36.3581 90.8268 36.1302 90.6673 35.875 90.4941C35.6289 90.321 35.3372 90.1706 35 90.043C34.6719 89.9062 34.2754 89.8379 33.8105 89.8379C33.127 89.8379 32.5163 89.9928 31.9785 90.3027C31.4408 90.6126 31.0169 91.041 30.707 91.5879C30.3971 92.1257 30.2422 92.7363 30.2422 93.4199C30.2422 94.1035 30.3971 94.7142 30.707 95.252C31.0169 95.7897 31.4408 96.2181 31.9785 96.5371C32.5163 96.847 33.127 97.002 33.8105 97.002C34.2754 97.002 34.6491 96.9564 34.9316 96.8652C35.2142 96.765 35.4375 96.6556 35.6016 96.5371C35.7656 96.4095 35.8978 96.3047 35.998 96.2227L36.0117 94.0898H33.3047V92.9961ZM45.0762 92.7227V93.8848H40.6191V96.8379H45.6641V98H39.3887V88.8398H45.6641V90.002H40.6191V92.7227H45.0762ZM60.0059 88.8398V98H59.541L53.5938 91.4512V98H52.3633V88.8398H52.8281L58.7754 95.4707V88.8398H60.0059ZM67.0195 88.6348C67.7122 88.6348 68.3503 88.7624 68.9336 89.0176C69.5169 89.2637 70.0273 89.6055 70.4648 90.043C70.9023 90.4805 71.2396 90.9909 71.4766 91.5742C71.7227 92.1484 71.8457 92.7637 71.8457 93.4199C71.8457 94.0762 71.7227 94.696 71.4766 95.2793C71.2396 95.8535 70.9023 96.3594 70.4648 96.7969C70.0273 97.2344 69.5169 97.5807 68.9336 97.8359C68.3503 98.082 67.7122 98.2051 67.0195 98.2051C66.3268 98.2051 65.6888 98.082 65.1055 97.8359C64.5221 97.5807 64.0117 97.2344 63.5742 96.7969C63.1367 96.3594 62.7949 95.8535 62.5488 95.2793C62.3118 94.696 62.1934 94.0762 62.1934 93.4199C62.1934 92.7637 62.3118 92.1484 62.5488 91.5742C62.7949 90.9909 63.1367 90.4805 63.5742 90.043C64.0117 89.6055 64.5221 89.2637 65.1055 89.0176C65.6888 88.7624 66.3268 88.6348 67.0195 88.6348ZM67.0195 89.8379C66.3359 89.8379 65.7253 89.9928 65.1875 90.3027C64.6497 90.6126 64.2259 91.041 63.916 91.5879C63.6061 92.1257 63.4512 92.7363 63.4512 93.4199C63.4512 94.1035 63.6061 94.7142 63.916 95.252C64.2259 95.7897 64.6497 96.2181 65.1875 96.5371C65.7253 96.847 66.3359 97.002 67.0195 97.002C67.7031 97.002 68.3138 96.847 68.8516 96.5371C69.3893 96.2181 69.8132 95.7897 70.123 95.252C70.4329 94.7142 70.5879 94.1035 70.5879 93.4199C70.5879 92.7363 70.4329 92.1257 70.123 91.5879C69.8132 91.041 69.3893 90.6126 68.8516 90.3027C68.3138 89.9928 67.7031 89.8379 67.0195 89.8379ZM79.9395 88.8398V90.002H76.7812V97.959H75.5508V90.002H72.3926V88.8398H79.9395ZM89.4688 88.8398L93.748 98H92.2715L91.3145 95.8125H87.0215L86.0508 98H84.5742L88.8535 88.8398H89.4688ZM89.1816 90.918L87.5273 94.6504H90.8086L89.1816 90.918ZM101.965 88.8398L97.6855 98H97.0703L92.791 88.8398H94.2676L97.3574 95.9219L100.488 88.8398H101.965ZM106.039 88.8398L110.318 98H108.842L107.885 95.8125H103.592L102.621 98H101.145L105.424 88.8398H106.039ZM105.752 90.918L104.098 94.6504H107.379L105.752 90.918ZM116.279 96.8379V98H111.959V96.8379H113.504V90.002H111.959V88.8398H116.279V90.002H114.734V96.8379H116.279ZM120.518 88.8398V96.8379H125.562V98H119.287V88.8398H120.518ZM131.51 88.8398L135.789 98H134.312L133.355 95.8125H129.062L128.092 98H126.615L130.895 88.8398H131.51ZM131.223 90.918L129.568 94.6504H132.85L131.223 90.918ZM140.656 88.6211C141.331 88.6211 141.914 88.735 142.406 88.9629C142.908 89.1816 143.295 89.4824 143.568 89.8652C143.842 90.248 143.979 90.6901 143.979 91.1914C143.979 91.638 143.851 92.0482 143.596 92.4219C143.34 92.7865 143.021 93.0599 142.639 93.2422C142.912 93.2969 143.181 93.4108 143.445 93.584C143.71 93.7572 143.928 93.9941 144.102 94.2949C144.284 94.5957 144.375 94.9694 144.375 95.416C144.375 95.9264 144.229 96.3867 143.938 96.7969C143.646 97.207 143.227 97.5352 142.68 97.7812C142.142 98.0182 141.504 98.1367 140.766 98.1367C140.201 98.1367 139.608 98.1003 138.988 98.0273C138.378 97.9635 137.858 97.8861 137.43 97.7949V88.9629C137.904 88.8535 138.419 88.7715 138.975 88.7168C139.54 88.653 140.1 88.6211 140.656 88.6211ZM140.574 89.7832C140.191 89.7832 139.845 89.7969 139.535 89.8242C139.234 89.8516 138.943 89.8926 138.66 89.9473V92.8184H140.807C141.426 92.8184 141.9 92.6634 142.229 92.3535C142.557 92.0345 142.721 91.6654 142.721 91.2461C142.721 90.918 142.62 90.6491 142.42 90.4395C142.219 90.2207 141.955 90.0566 141.627 89.9473C141.308 89.8379 140.957 89.7832 140.574 89.7832ZM138.66 96.8105C138.988 96.8743 139.353 96.9199 139.754 96.9473C140.155 96.9655 140.483 96.9746 140.738 96.9746C141.422 96.9746 141.987 96.8333 142.434 96.5508C142.889 96.2682 143.117 95.89 143.117 95.416C143.117 94.9147 142.894 94.541 142.447 94.2949C142.01 94.0397 141.472 93.9121 140.834 93.9121H138.66V96.8105ZM148.025 88.8398V96.8379H153.07V98H146.795V88.8398H148.025ZM161.178 92.7227V93.8848H156.721V96.8379H161.766V98H155.49V88.8398H161.766V90.002H156.721V92.7227H161.178Z"
                fill="black"
              />
            </svg>
          </span>
        </div>
      )}
      {(id === "product-listing" || id === "seller-product-listing") &&
        !accessLocked && (
          <div>
            <span className="lock-outline-sec">
              <Icon
                component={lockOutline}
                style={{ width: "20px", height: "25px" }}
              />
            </span>
            {productId == selectedProductId && (
              <div className="ant-popover locked-product ant-popover-placement-bottomRight">
                <div className="ant-popover-content">
                  <div className="ant-popover-arrow"></div>
                  <div className="ant-popover-inner">
                    <div>
                      <div className="ant-popover-inner-content">
                        <div className="qa-lh">{notificationMsg}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
    </div>
  );
}

export default DynamicCarousel;
