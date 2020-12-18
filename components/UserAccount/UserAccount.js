/** @format */

import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import Slider from "react-slick";
import {
  Row,
  Col,
  Avatar,
  Upload,
  Button,
  Form,
  Select,
  Input,
  message,
  Modal,
  Tabs,
  Badge,
  Alert,
  Breadcrumb,
} from "antd";
import Icon, { RightOutlined, LeftOutlined } from "@ant-design/icons";
import { useRouter } from "next/router";
import { useKeycloak } from "@react-keycloak/ssr";
import {
  getUserProfile,
  getOpenRequest,
  getRequestByStatus,
  getMeetingCount,
  getAddresses,
} from "../../store/actions";

import { getCountries } from "react-phone-number-input/input";
import en from "react-phone-number-input/locale/en.json";

import ProfileImageIcon from "../../public/filestore/profileImageIcon";
import AvatarIcon from "../../public/filestore/avatarIcon";

import sellerOrgTypeConfig from "../../public/filestore/sellerOrgType.json";
import buyerOrgTypeConfig from "../../public/filestore/buyerOrgType.json";
import roleInOrganizationConfig from "../../public/filestore/roleInOrganization.json";
import dealsInOrderTypesConfig from "../../public/filestore/dealsInOrderTypes.json";
import dealsInCategoriesConfig from "../../public/filestore/dealsInCategories.json";
import interestsInOrderTypesConfig from "../../public/filestore/interestsInOrderTypes.json";
import interestsInCategoriesConfig from "../../public/filestore/interestsInCategories.json";
import userStatus from "../../public/filestore/userStatus.json";
import VideoRequestCarousel from "../VideoRequestCarousel/VideoRequestCarousel";
import MeetingCard from "../MeetingCard/MeetingCard";
import MeetingCardMobile from "../mobile/MeetingCardMobile";
import Spinner from "../Spinner/Spinner";
import moment from "moment";
import Quotations from "../Quotations/Quotations";
import QuotationMobile from "../mobile/QuotationMobile";
import Orders from "../Orders/Orders";
import OrdersMobile from "../mobile/OrdersMobile";
import Addresses from "../Addresses/Addresses";
import { logoutFromApp } from "../AuthWithKeycloak";
import Collections from "./../Collections/Collections";

const { Option } = Select;
const { TabPane } = Tabs;

const UserAccount = (props) => {
  const router = useRouter();
  const mediaMatch = window.matchMedia("(min-width: 1024px)");
  const [form] = Form.useForm();
  const [successUpdateVisible, setSuccessUpdateVisible] = useState(false);
  const [successPassVisible, setSuccessPassVisible] = useState(false);
  const [initialValues, setInitialValues] = useState(
    props.userProfile.userProfile
  );
  const [imageUrl, setImageUrl] = useState(
    props.userProfile.userProfile &&
      props.userProfile.userProfile.profileImage &&
      props.userProfile.userProfile.profileImage.media &&
      props.userProfile.userProfile.profileImage.media.mediaUrl &&
      process.env.NEXT_PUBLIC_REACT_APP_ASSETS_FILE_URL +
        props.userProfile.userProfile.profileImage.media.mediaUrl
  );
  const [imageLoading, setImageLoading] = useState(false);
  const [edit, setEdit] = useState(true);
  const [loading, setLoading] = useState(false);
  const [passLoading, setPassLoading] = useState(false);
  const { keycloak } = useKeycloak();
  const [mobile, setMobile] = useState(false);
  const [videoRequestCount, setVideoRequestCount] = useState(
    props.openRequest.length
  );
  const [currentCount, setCurrentCount] = useState(1);
  // const [currentText, setCurrentText] = useState('1 of 3')
  const { profileType, username, orgName, firstName, lastName } =
    props.userProfile.userProfile || {};
  const [currentNav, setCurrentNav] = useState(
    router?.query?.section || "profile"
  );
  const [showLoader, setShowLoader] = useState(false);
  // console.log(keycloak, props.userProfile && props.userProfile.userProfile)
  const [showCancelPopup, setShowCancelPopup] = useState(false);
  const [showAcceptPopup, setShowAcceptPopup] = useState(false);
  const [acceptBuyerOrg, setAcceptBuyerOrg] = useState(null);
  const [acceptDate, setAcceptDate] = useState(null);
  const [showReschedulePopup, setReschedulePopup] = useState(false);
  const [requestStart, setRequestStart] = useState(null);
  const [requestEnd, setRequestEnd] = useState(null);
  const [meetingByStatusList, setMeetingByStatusList] = useState([]);
  const [loadCount, setLoadCount] = useState(1);
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [collectionName, setCollectionName] = useState("");
  const [showCollectionDetails, setCollectionDetails] = useState(false);

  const settings = {
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    adaptiveHeight: false,
    // rows: 0,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: true,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: true,
        },
      },
    ],
  };
  useEffect(() => {
    if (router.query.section) {
      setCurrentNav(router.query.section);
    }
  }, [router.query.section]);

  useEffect(() => {
    if (keycloak.token) {
      setShowOrderDetails(false);
      setCollectionDetails(false);
      if (currentNav == "profile") {
        props.getUserProfile(keycloak.token);
      } else if (currentNav == "video") {
        let status = "OPEN";
        let request_status = "SCHEDULED,ACCEPTED";
        if (profileType == "BUYER") {
          status = "OPEN,ACCEPTED";
          request_status = "SCHEDULED";
        }
        props.getOpenRequest(
          keycloak.token,
          props.userProfile.userProfile.profileId,
          status
        );
        props.getRequestByStatus(
          keycloak.token,
          props.userProfile.userProfile.profileId,
          request_status
        );
      } else if (currentNav == "addresses") {
        props.getAddresses(keycloak.token);
      }
    }
  }, [currentNav]);

  const formUpdate = (values) => {
    if (values) {
      var data = { ...values };
      if (values.profileType === "BUYER") {
        // data.inOrderTypes = values.interestsInOrderTypes;
        // data.inCategories = values.interestsInCategories;
        data.inOrderTypes = values.dealsInOrderTypes;
        data.inCategories = values.dealsInCategories;
      }

      if (values.profileType === "SELLER") {
        data.inOrderTypes = values.dealsInOrderTypes;
        data.inCategories = values.dealsInCategories;
      }
      form.setFieldsValue(data);
    }
  };

  useEffect(() => {
    if (keycloak.token) {
      props.getUserProfile(keycloak.token);
    }
  }, [formUpdate(props.userProfile.userProfile)]);

  useEffect(() => {
    if (props.userProfile && props.userProfile.userProfile) {
      if (currentNav == "video") {
        let status = "OPEN";
        let request_status = "SCHEDULED,ACCEPTED";
        if (profileType == "BUYER") {
          status = "OPEN,ACCEPTED";
          request_status = "SCHEDULED";
        }
        props.getOpenRequest(
          keycloak.token,
          props.userProfile.userProfile.profileId,
          status
        );
        props.getRequestByStatus(
          keycloak.token,
          props.userProfile.userProfile.profileId,
          request_status
        );
      } else if (currentNav == "addresses") {
        props.getAddresses(keycloak.token);
      }
    }
  }, [props.userProfile.userProfile, keycloak.token]);

  useEffect(() => {
    setImageUrl(
      props.userProfile.userProfile &&
        props.userProfile.userProfile.profileImage &&
        props.userProfile.userProfile.profileImage.media &&
        props.userProfile.userProfile.profileImage.media.mediaUrl &&
        process.env.NEXT_PUBLIC_REACT_APP_ASSETS_FILE_URL +
          props.userProfile.userProfile.profileImage.media.mediaUrl
    );

    // if (props.isGuest == 'true') {
    //   setCurrentNav("video");
    // }
  }, [props.userProfile.userProfile]);

  useEffect(() => {
    setShowLoader(false);
  }, [props.openRequest]);

  useEffect(() => {
    setShowLoader(false);
  }, [props.addresses]);

  useEffect(() => {
    setShowLoader(false);
  }, [props.quotes]);

  useEffect(() => {
    setShowLoader(false);
  }, [props.orders]);

  useEffect(() => {
    setShowLoader(false);
  }, [props.collections]);

  useEffect(() => {
    if (props.meetingByStatus.length > 0) {
      prepareMeetingList();
    }
  }, [props.meetingByStatus]);

  const prepareMeetingList = () => {
    let arr = [];
    let counter = 0;
    for (let i = 0; i < props.meetingByStatus.length; i++) {
      if (counter < 5) {
        arr.push(props.meetingByStatus[i]);
        counter++;
      }
    }
    setMeetingByStatusList(arr);
  };

  const sellerOrgType = sellerOrgTypeConfig.map((v, i) => {
    return (
      <Option key={i} value={v.key}>
        {v.value}
      </Option>
    );
  });

  const loadMoreData = () => {
    setLoadCount(loadCount + 1);
    let currentLoadCount = loadCount + 1;
    let arr = [];
    let counter = 0;
    for (let i = 0; i < props.meetingByStatus.length; i++) {
      if (counter < currentLoadCount * 5) {
        arr.push(props.meetingByStatus[i]);
        counter++;
      }
    }
    setMeetingByStatusList(arr);
  };

  const buyerOrgType = buyerOrgTypeConfig.map((v, i) => {
    return (
      <Option key={i} value={v.key}>
        {v.value}
      </Option>
    );
  });

  const roleInOrganization = roleInOrganizationConfig.map((v, i) => {
    return (
      <Option key={i} value={v.key}>
        {v.value}
      </Option>
    );
  });

  const dealsInOrderTypes = dealsInOrderTypesConfig.map((v, i) => {
    return (
      <Option key={i} value={v.key}>
        {v.value}
      </Option>
    );
  });

  const dealsInCategories = dealsInCategoriesConfig.map((v, i) => {
    return (
      <Option key={i} value={v.key}>
        {v.value}
      </Option>
    );
  });

  const interestsInOrderTypes = interestsInOrderTypesConfig.map((v, i) => {
    return (
      <Option key={i} value={v.key}>
        {v.value}
      </Option>
    );
  });

  const interestsInCategories = interestsInCategoriesConfig.map((v, i) => {
    return (
      <Option key={i} value={v.key}>
        {v.value}
      </Option>
    );
  });

  const getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => callback(reader.result));
    reader.readAsDataURL(img);
  };

  const acceptedFileTypes = ["image/jpeg", "image/png"];

  const beforeUpload = (file) => {
    const isJpgOrPng = acceptedFileTypes.includes(file.type);
    if (!isJpgOrPng) {
      message.error("You can only upload JPG/PNG file!", 5);
    }
    const isLtM = file.size <= 5 * 1024 * 1024;
    if (!isLtM) {
      message.error("File size must smaller than 5MB!", 5);
    }
    return isJpgOrPng && isLtM;
  };

  const handleChange = (info) => {
    if (info.file.status === "uploading") {
      setImageLoading(true);
    } else if (info.file.status === "done") {
      setImageLoading(false);
      getBase64(info.file.originFileObj, (imageUrl) => setImageUrl(imageUrl));
      // setImageUrl(process.env.NEXT_PUBLIC_REACT_APP_ASSETS_FILE_URL + info.file.response.mediaUrl);
      let requesterName = "";
      if (
        props.userProfile.userProfile &&
        props.userProfile.userProfile.firstName &&
        props.userProfile.userProfile &&
        props.userProfile.userProfile.lastName
      ) {
        requesterName =
          props.userProfile.userProfile.firstName +
          " " +
          props.userProfile.userProfile.lastName;
      }
      let data = {
        profileImage: {
          media: info.file.response,
          altName: requesterName,
        },
      };
      fetch(
        process.env.NEXT_PUBLIC_REACT_APP_API_PROFILE_URL + "/profiles/my",
        {
          method: "PATCH",
          body: JSON.stringify(data),
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + keycloak.token,
          },
        }
      )
        .then((res) => {
          if (res.ok) {
            return res.json();
          } else {
            throw res.statusText || "Error while updating info.";
          }
        })
        .then((res) => {
          // message.success('Your info has been updated successfully.', 5);
          setSuccessUpdateVisible(true);
          props.getUserProfile(keycloak.token);
        })
        .catch((err) => {
          message.error(err.message || err, 5);
        });
    } else {
      setImageLoading(false);
    }
  };

  const handleSignUpAsABuyer = () => {
    logoutFromApp({ currentPath: "/signup" });
  };

  const onSetPassword = () => {
    setPassLoading(true);
    fetch(
      process.env.NEXT_PUBLIC_REACT_APP_API_PROFILE_URL +
        "/profiles/my/verification-email",
      {
        method: "PUT",
        // body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + keycloak.token,
        },
      }
    )
      .then((res) => {
        if (res.ok) {
          setPassLoading(false);
          setSuccessPassVisible(true);
        } else {
          throw res.statusText || "Error while sending e-mail.";
        }
      })
      // .then(res => {
      //     // message.success('Email has been sent successfully.', 5);
      //     setPassLoading(false);
      //     setSuccessPassVisible(true);
      // })
      .catch((err) => {
        message.error(err.message || err, 5);
        setPassLoading(false);
      });
  };

  const onFinish = (values) => {
    // console.log(values);

    let data = {
      username: values.email,
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      country: values.country,
      orgPhone: values.orgPhone,
      orgName: values.orgName,
      orgType: values.orgType,
      roleInOrganization: values.roleInOrganization,
    };

    if (profileType === "BUYER") {
      // data.interestsInOrderTypes = values.inOrderTypes;
      // data.interestsInCategories = values.inCategories;
      data.dealsInOrderTypes = values.inOrderTypes;
      data.dealsInCategories = values.inCategories;
    }

    if (profileType === "SELLER") {
      data.dealsInOrderTypes = values.inOrderTypes;
      data.dealsInCategories = values.inCategories;
    }
    // console.log(data);

    setLoading(true);
    fetch(process.env.NEXT_PUBLIC_REACT_APP_API_PROFILE_URL + "/profiles/my", {
      method: "PATCH",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + keycloak.token,
      },
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          throw res.statusText || "Error while updating info.";
        }
      })
      .then((res) => {
        // message.success('Your info has been updated successfully.', 5);
        setLoading(false);
        setSuccessUpdateVisible(true);
        props.getUserProfile(keycloak.token);
      })
      .catch((err) => {
        message.error(err.message || err, 5);
        setLoading(false);
      });
  };

  let slider;

  const next = () => {
    slider.slickNext();
    setCurrentCount((currentCount) => currentCount + 1);
  };

  const prev = () => {
    slider.slickPrev();
    setCurrentCount((currentCount) => currentCount - 1);
  };

  const accept = () => {
    alert("accepted");
  };

  const reject = () => {
    alert("accepted");
  };

  const timezones = [
    {
      key: 1,
    },
    {
      key: 2,
    },
    {
      key: 3,
    },
  ];

  const handleAccept = (meetingId, orgName, date, requestStart, requestEnd) => {
    setAcceptBuyerOrg(orgName);
    setAcceptDate(date);
    setRequestStart(requestStart);
    setRequestEnd(requestEnd);
    let status = "OPEN";
    let request_status = "SCHEDULED,ACCEPTED";
    if (profileType == "BUYER") {
      status = "OPEN,ACCEPTED";
      request_status = "SCHEDULED";
    }

    let data = {
      eventStatus: "ACCEPTED",
    };

    fetch(
      process.env.NEXT_PUBLIC_REACT_APP_API_MEETING_URL +
        "/events/meeting/my/" +
        meetingId,
      {
        method: "PATCH",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + keycloak.token,
        },
      }
    )
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          throw res.statusText || "Error while updating info.";
        }
      })
      .then((res) => {
        setShowAcceptPopup(true);
        setCurrentCount((currentCount) => 1);
        props.getOpenRequest(
          keycloak.token,
          props.userProfile.userProfile.profileId,
          status
        );
        props.getRequestByStatus(
          keycloak.token,
          props.userProfile.userProfile.profileId,
          request_status
        );
        props.getMeetingCount(
          props.userProfile.userProfile.profileId,
          keycloak.token
        );
      })
      .catch((err) => {
        message.error(err.message || err, 5);
      });
  };

  const handleReject = (meetingId) => {
    let status = "OPEN";
    let request_status = "SCHEDULED,ACCEPTED";
    if (profileType == "BUYER") {
      status = "OPEN,ACCEPTED";
      request_status = "SCHEDULED";
    }

    let data = {
      eventStatus: "RESCHEDULED",
    };

    fetch(
      process.env.NEXT_PUBLIC_REACT_APP_API_MEETING_URL +
        "/events/meeting/my/" +
        meetingId,
      {
        method: "PATCH",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + keycloak.token,
        },
      }
    )
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          throw res.statusText || "Error while updating info.";
        }
      })
      .then((res) => {
        setReschedulePopup(true);
        setCurrentCount((currentCount) => 1);
        props.getOpenRequest(
          keycloak.token,
          props.userProfile.userProfile.profileId,
          status
        );
        props.getRequestByStatus(
          keycloak.token,
          props.userProfile.userProfile.profileId,
          request_status
        );
      })
      .catch((err) => {
        message.error(err.message || err, 5);
      });
  };

  const handleCancel = (meetingId) => {
    let status = "OPEN";
    let request_status = "SCHEDULED,ACCEPTED";
    if (profileType == "BUYER") {
      status = "OPEN,ACCEPTED";
      request_status = "SCHEDULED";
    }

    let data = {
      eventStatus: "CANCELLED",
    };

    fetch(
      process.env.NEXT_PUBLIC_REACT_APP_API_MEETING_URL +
        "/events/meeting/my/" +
        meetingId,
      {
        method: "PATCH",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + keycloak.token,
        },
      }
    )
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          throw res.statusText || "Error while updating info.";
        }
      })
      .then((res) => {
        setShowCancelPopup(true);
        setCurrentCount((currentCount) => 1);
        props.getOpenRequest(
          keycloak.token,
          props.userProfile.userProfile.profileId,
          status
        );
        props.getRequestByStatus(
          keycloak.token,
          props.userProfile.userProfile.profileId,
          request_status
        );
        props.getMeetingCount(
          props.userProfile.userProfile.profileId,
          keycloak.token
        );
      })
      .catch((err) => {
        message.error(err.message || err, 5);
      });
  };

  const handleReschedule = (meetingId) => {
    let status = "OPEN";
    let request_status = "SCHEDULED,ACCEPTED";
    if (profileType == "BUYER") {
      status = "OPEN,ACCEPTED";
      request_status = "SCHEDULED";
    }

    let data = {
      eventStatus: "RESCHEDULED",
    };

    fetch(
      process.env.NEXT_PUBLIC_REACT_APP_API_MEETING_URL +
        "/events/meeting/my/" +
        meetingId,
      {
        method: "PATCH",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + keycloak.token,
        },
      }
    )
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          throw res.statusText || "Error while updating info.";
        }
      })
      .then((res) => {
        setReschedulePopup(true);
        props.getOpenRequest(
          keycloak.token,
          props.userProfile.userProfile.profileId,
          status
        );
        props.getRequestByStatus(
          keycloak.token,
          props.userProfile.userProfile.profileId,
          request_status
        );
      })
      .catch((err) => {
        message.error(err.message || err, 5);
      });
  };

  const slides = props.openRequest.map((v, i) => {
    let id = "HOME::" + v.presenters[0].profileId;
    let requestDate = new Date(v.presenters[0].slotDate).toLocaleDateString(
      "en-us",
      {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }
    );
    return (
      <VideoRequestCarousel
        key={i}
        isWeb={mediaMatch.matches}
        userProfileType={profileType}
        data={v}
        type={props.profileType}
        handleAccept={() =>
          handleAccept(
            v.requestId,
            v.registrants[0].orgName,
            requestDate,
            v.presenters[0].slotStart,
            v.presenters[0].slotEnd
          )
        }
        handleReject={() => handleReject(v.requestId)}
        handleCancel={() => handleCancel(v.requestId)}
        id={id}
      />
    );
  });

  const getFormattedDate = (date) => {
    let date_arr = date.split("-");
    date_arr.pop();
    return date_arr.join(date_arr["-"]);
  };

  const meetingCard = meetingByStatusList.map((v, i) => {
    let options = { year: "numeric", month: "long" };
    let date =
      profileType == "SELLER"
        ? v.presenters[0].slotDate
        : v.registrants[0].slotDate;
    let formattedDate = moment(date).format("MMM YYYY");
    // let formattedDate = new Date(getFormattedDate(date)).toLocaleDateString('en-us', options);
    if (mediaMatch.matches) {
      return (
        <Col
          xs={24}
          sm={24}
          md={24}
          lg={24}
          style={{ border: "1px solid #ffdead", marginBottom: "20px" }}
        >
          <MeetingCard
            key={i}
            isWeb={mediaMatch.matches}
            data={v}
            formattedDate={formattedDate}
            type={profileType}
            handleCancel={() => handleCancel(v.requestId)}
            handleReschedule={() => handleReschedule(v.requestId)}
          />
        </Col>
      );
    } else {
      return (
        <Col
          xs={24}
          sm={24}
          md={24}
          lg={24}
          style={{ border: "1px solid #ffdead", marginBottom: "20px" }}
        >
          <MeetingCardMobile
            key={i}
            isWeb={mediaMatch.matches}
            data={v}
            formattedDate={formattedDate}
            type={profileType}
            handleCancel={() => handleCancel(v.requestId)}
            handleReschedule={() => handleReschedule(v.requestId)}
          />
        </Col>
      );
    }
  });

  const country = getCountries().map((country) => {
    // console.log(country, en[country]);
    if (country === "US") {
      // console.log(country);
      return (
        <Option key={country} value={en[country] + " (US)"}>
          {en[country] + " (US)"}
        </Option>
      );
    }
    if (country === "GB") {
      // console.log(country);
      return (
        <Option key={country} value={en[country] + " (UK)"}>
          {en[country] + " (UK)"}
        </Option>
      );
    }
    if (
      country !== "CU" &&
      country !== "IR" &&
      country !== "KP" &&
      country !== "SD" &&
      country !== "SY" &&
      country !== "PK" &&
      country !== "SO"
    ) {
      return (
        <Option key={country} value={en[country]}>
          {en[country]}
        </Option>
      );
    }
  });

  let assetUrl =
    process.env.NEXT_PUBLIC_REACT_APP_API_ASSETS_URL +
    "/assets?sourceService=profile";

  if (
    props.userProfile.userProfile &&
    props.userProfile.userProfile.profileId
  ) {
    assetUrl =
      process.env.NEXT_PUBLIC_REACT_APP_API_ASSETS_URL +
      "/assets?sourceService=profile&userId=" +
      props.userProfile.userProfile.profileId;
  }

  const handleNavClick = (value) => {
    router.push(`/account/${value}`);
    setShowOrderDetails(false);
    setCollectionDetails(false);
    // let status = "OPEN";
    // let request_status = "SCHEDULED,ACCEPTED";
    // if (profileType == "BUYER") {
    //   status = "OPEN,ACCEPTED";
    //   request_status = "SCHEDULED";
    // }
    // if (value == "video") {
    //   setShowLoader(true);
    //   props.getOpenRequest(
    //     keycloak.token,
    //     props.userProfile.userProfile.profileId,
    //     status
    //   );
    //   props.getRequestByStatus(
    //     keycloak.token,
    //     props.userProfile.userProfile.profileId,
    //     request_status
    //   );
    // }

    // if (value == "addresses") {
    //   // props.getAddresses(keycloak.token)
    //   setShowLoader(true);
    // }
    // // if(value == 'quote'){
    // //   setShowLoader(true);
    // // }
    // // if(value == 'orders'){
    // //   setShowLoader(true);
    // // }
    // setCurrentNav((currentNav) => value);
  };

  const handleTabChange = (key) => {
    let status = null;
    if (profileType == "BUYER") {
      status = key == 1 ? "SCHEDULED" : "COMPLETED";
    } else {
      status = key == 1 ? "SCHEDULED,ACCEPTED" : "COMPLETED";
    }
    props.getRequestByStatus(
      keycloak.token,
      props.userProfile.userProfile.profileId,
      status
    );
    setLoadCount(1);
  };

  const handleShowOrder = (value) => {
    setShowOrderDetails(value);
    if (!value) {
      router.push("/account/orders");
    }
  };

  const redirect = () => {
    router.push("/account/orders");
    setShowOrderDetails(false);
  };

  const quotationComponent = () => {
    if (mediaMatch.matches) {
      return <Quotations />;
    } else {
      return <QuotationMobile />;
    }
  };

  if (showLoader) {
    return <Spinner />;
  }

  // const addNewAddress = (values, countryCode) => {
  //   // setLoading(true)conso
  //   console.log(values);
  //   let data = {
  //     "profileId": props.userProfile.userProfile.profileId,
  //     "fullName": values.fullName,
  //     "addressLine1": values.addressLine1,
  //     "addressLine2": values.AddressLine2,
  //     "country": values.country,
  //     "state": values.state,
  //     "city": values.city,
  //     "zipCode": values.zipCode,
  //     "phoneNumber": values.phoneNumber,
  //     "isDefault": values.isDefault,
  //     "countryCode": countryCode
  //   }

  //   fetch(process.env.NEXT_PUBLIC_REACT_APP_CONTACTS_URL + "/contacts", {
  //     method: "POST",
  //     body: JSON.stringify(data),
  //     headers: {
  //       "Content-Type": "application/json",
  //       Authorization: "Bearer " + keycloak.token,
  //     },
  //   })
  //     .then((res) => {
  //       if (res.ok) {
  //         return res.json();
  //       } else {
  //         throw res.statusText || "Error while updating info.";
  //       }
  //     })
  //     .then((res) => {
  //       // message.success('Your info has been updated successfully.', 5);
  //       setLoading(false);
  //       // setSuccessUpdateVisible(true);
  //       props.getAddresses(keycloak.token);
  //     })
  //     .catch((err) => {
  //       message.error(err.message || err, 5);
  //       setLoading(false);
  //     });
  // }
  return (
    <div id="user-account">
      <Row justify="center" className="banner">
        <Col xs={21} sm={21} md={3} lg={3} xl={3}>
          <Row>
            <Col
              className="align-center"
              xs={24}
              sm={24}
              md={24}
              lg={24}
              xl={24}
            >
              <Upload
                name="files"
                // listType="picture-card"
                // className="avatar-uploader"
                showUploadList={false}
                action={assetUrl}
                headers={{
                  Authorization: "Bearer " + keycloak.token,
                }}
                beforeUpload={beforeUpload}
                onChange={handleChange}
              >
                {imageUrl ? (
                  <span className="align-center">
                    <Avatar size={100} src={imageUrl}></Avatar>
                    <Icon
                      component={ProfileImageIcon}
                      className="profile-icon"
                    />
                  </span>
                ) : (
                  <span className="align-center">
                    <Avatar
                      size={100}
                      icon={
                        <Icon component={AvatarIcon} className="profile-icon" />
                      }
                    />
                    <Icon
                      component={ProfileImageIcon}
                      className="profile-icon"
                    />
                  </span>
                )}
              </Upload>
            </Col>
            <Col
              className="align-center"
              xs={24}
              sm={24}
              md={24}
              lg={24}
              xl={24}
            >
              <span className="upload-text">Upload photo</span>
            </Col>
          </Row>
        </Col>
        <Col xs={21} sm={21} md={9} lg={9} xl={9}>
          <p className="banner-heading">My account</p>
          <p className="banner-para1">
            <span>{profileType === "SELLER" ? "Seller" : "Buyer"}</span>
            <span className="banner-para1-mid">
              &nbsp;&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;&nbsp;
            </span>
            {props.isGuest == "false" || props.isGuest == undefined ? (
              <span>
                {userStatus[
                  props.userProfile.userProfile &&
                    props.userProfile.userProfile.profileType
                ] &&
                  userStatus[
                    props.userProfile.userProfile &&
                      props.userProfile.userProfile.profileType
                  ][
                    props.userProfile.userProfile &&
                      props.userProfile.userProfile.verificationStatus
                  ]}
              </span>
            ) : (
              <span>Invitee</span>
            )}
          </p>
          <p className="banner-para2">
            <span>{orgName}</span>
          </p>
          <p className="banner-para2">
            <span>{firstName}</span>
          </p>
        </Col>
        <Col xs={21} sm={21} md={4} lg={4} xl={4}>
          {props.userProfile.userProfile &&
          props.userProfile.userProfile.verificationStatus &&
          props.userProfile.userProfile.verificationStatus === "CREATED" ? (
            <div className="banner-verified">
              <Button
                className="banner-button"
                onClick={() => {
                  router.push("/applytosell");
                }}
              >
                Apply to sell
              </Button>
              <p className="banner-para3">
                Please click here to initiate your application to be a supplier
                on Qalara.
              </p>
            </div>
          ) : null}
        </Col>
      </Row>
      {showOrderDetails && mediaMatch.matches ? (
        <Row
          justify="center"
          style={{ paddingTop: "2%", background: "#f9f7f2" }}
        >
          <Col xs={0} sm={0} md={5} lg={5} xl={5}>
            <Row justify="space-between">
              <Col
                xs={24}
                sm={24}
                md={24}
                lg={24}
                xl={24}
                className="orders-breadcumb"
              >
                <Breadcrumb>
                  <Breadcrumb.Item
                    onClick={redirect}
                    style={{ cursor: "pointer" }}
                  >
                    <span
                      className="qa-fs-16 qa-font-san"
                      style={{
                        lineHeight: "110%",
                        letterSpacing: "0.01em",
                        color: "#D9BB7F",
                      }}
                    >
                      My orders
                    </span>
                  </Breadcrumb.Item>
                  <Breadcrumb.Item>
                    <span
                      className="qa-fs-16 qa-font-san"
                      style={{ lineHeight: "110%", letterSpacing: "0.01em" }}
                    >
                      Order details
                    </span>
                  </Breadcrumb.Item>
                </Breadcrumb>
              </Col>
            </Row>
          </Col>
          <Col xs={0} sm={0} md={15} lg={15} xl={15}></Col>
        </Row>
      ) : (
        ""
      )}

      {showCollectionDetails && mediaMatch.matches ? (
        <Row
          justify="center"
          style={{ paddingTop: "2%", background: "#f9f7f2" }}
        >
          <Col xs={0} sm={0} md={2} lg={2} xl={2}></Col>
          <Col xs={0} sm={0} md={18} lg={18} xl={18}>
            <Row justify="space-between">
              <Col
                xs={24}
                sm={24}
                md={24}
                lg={24}
                xl={24}
                className="orders-breadcumb"
              >
                <Breadcrumb>
                  <Breadcrumb.Item
                    onClick={() => {
                      setCollectionDetails(false);
                      setCollectionName("");
                    }}
                    style={{ cursor: "pointer" }}
                  >
                    <span
                      className="qa-fs-16 qa-font-san"
                      style={{
                        lineHeight: "110%",
                        letterSpacing: "0.01em",
                        color: "#D9BB7F",
                      }}
                    >
                      My Collections
                    </span>
                  </Breadcrumb.Item>
                  <Breadcrumb.Item>
                    <span
                      className="qa-fs-16 qa-font-san"
                      style={{ lineHeight: "110%", letterSpacing: "0.01em" }}
                    >
                      {collectionName}
                    </span>
                  </Breadcrumb.Item>
                </Breadcrumb>
              </Col>
            </Row>
          </Col>
          <Col xs={0} sm={0} md={4} lg={4} xl={4}></Col>
        </Row>
      ) : (
        ""
      )}

      <Row justify="center" className="body-content">
        <Col
          style={mediaMatch.matches ? {} : { display: "none" }}
          xs={21}
          sm={21}
          md={5}
          lg={5}
          xl={5}
        >
          {/* {showOrderDetails ? <Row justify="space-between">
            <Col xs={24} sm={24} md={24} lg={24} xl={24}>
              <Breadcrumb>
                <Breadcrumb.Item onClick={redirect}><span className="qa-fs-16 qa-font-san qa-fw-b" style={{ lineHeight: '110%', letterSpacing: '0.01em', color: '#D9BB7F' }}>My orders</span></Breadcrumb.Item>
                <Breadcrumb.Item>
                  <span className="qa-fs-16 qa-font-san qa-fw-b" style={{ lineHeight: '110%', letterSpacing: '0.01em', color: '#D9BB7F' }}>Order details</span>
                </Breadcrumb.Item>
              </Breadcrumb>
            </Col>
          </Row> : ''} */}
          <Row justify="space-between">
            {props.userProfile.userProfile &&
            props.userProfile.userProfile.verificationStatus &&
            props.userProfile.userProfile.verificationStatus === "CREATED"
              ? [
                  <Col key="1" xs={24} sm={24} md={24} lg={24} xl={24}>
                    <div className="left-verified-seller">
                      <p className="heading">
                        Benefits of being
                        <br />a registered supplier
                      </p>
                      <p className="para">
                        1. Get discovered by verified buyers across the globe.
                      </p>
                      <p className="para">
                        2. Participate in digital trade fairs and a one to one
                        digital shopcast with buyers.
                      </p>
                      <p className="para">
                        3. Get your own virtual store on our website.
                      </p>
                      <Button
                        className="button"
                        onClick={() => {
                          router.push("/applytosell");
                        }}
                      >
                        Apply to sell
                      </Button>
                    </div>
                  </Col>,
                  <Col
                    key="2"
                    xs={24}
                    sm={24}
                    md={24}
                    lg={24}
                    xl={24}
                    style={{ paddingTop: "20px" }}
                  />,
                ]
              : null}
            <Col
              xs={24}
              sm={24}
              md={24}
              lg={24}
              xl={24}
              style={{ marginBottom: "40px" }}
            >
              <div className="left-nav">
                <Row justify="space-between">
                  <Col
                    xs={24}
                    sm={24}
                    md={24}
                    lg={24}
                    className={currentNav == "profile" ? "side-nav-bg" : ""}
                  >
                    <span
                      className={
                        "qa-font-san side-nav-item " +
                        (currentNav == "profile" ? "side-nav-active" : "")
                      }
                      id="profile"
                      onClick={() => handleNavClick("profile")}
                    >
                      MY PROFILE
                    </span>
                  </Col>
                </Row>
                {/* <hr style={{ border: '1px solid #D9BB7F', opacity: '0.25' }} /> */}
                <Row justify="space-between">
                  <Col
                    xs={24}
                    sm={24}
                    md={24}
                    lg={24}
                    className={currentNav == "video" ? "side-nav-bg" : ""}
                  >
                    <Row>
                      <Col xs={24} sm={24} md={18} lg={18}>
                        <span
                          className={
                            "qa-font-san side-nav-item " +
                            (currentNav == "video" ? "side-nav-active" : "")
                          }
                          id="video"
                          onClick={() => handleNavClick("video")}
                        >
                          VIDEO MEETINGS
                        </span>
                      </Col>
                      <Col
                        xs={2}
                        sm={2}
                        md={4}
                        lg={4}
                        style={{ textAlign: "center" }}
                      >
                        <div style={{ marginTop: "10px" }}>
                          <Badge
                            count={props.meetingCount}
                            style={{
                              backgroundColor: "#D9BB7F",
                              color: "#191919",
                            }}
                          ></Badge>
                        </div>
                      </Col>
                    </Row>
                  </Col>
                </Row>
                {profileType == "BUYER" &&
                (props.isGuest == "false" || props.isGuest == undefined) ? (
                  <React.Fragment>
                    <Row justify="space-between">
                      <Col
                        xs={24}
                        sm={24}
                        md={24}
                        lg={24}
                        className={currentNav == "quote" ? "side-nav-bg" : ""}
                      >
                        <Row>
                          <Col xs={24} sm={24} md={24} lg={24}>
                            <span
                              className={
                                "qa-font-san  side-nav-item " +
                                (currentNav == "quote" ? "side-nav-active" : "")
                              }
                              id="quote"
                              onClick={() => handleNavClick("quote")}
                            >
                              MY QUOTATION
                            </span>
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                    <Row justify="space-between">
                      <Col
                        xs={24}
                        sm={24}
                        md={24}
                        lg={24}
                        className={
                          currentNav == "collections" ? "side-nav-bg" : ""
                        }
                      >
                        <Row>
                          <Col xs={24} sm={24} md={24} lg={24}>
                            <span
                              className={
                                "qa-font-san side-nav-item " +
                                (currentNav == "collections"
                                  ? "side-nav-active"
                                  : "")
                              }
                              id="collections"
                              onClick={() => handleNavClick("collections")}
                            >
                              MY COLLECTIONS
                            </span>
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                    <Row justify="space-between">
                      <Col
                        xs={24}
                        sm={24}
                        md={24}
                        lg={24}
                        className={currentNav == "orders" ? "side-nav-bg" : ""}
                      >
                        <Row>
                          <Col xs={24} sm={24} md={24} lg={24}>
                            <span
                              className={
                                "qa-font-san side-nav-item " +
                                (currentNav == "orders"
                                  ? "side-nav-active"
                                  : "")
                              }
                              id="orders"
                              onClick={() => handleNavClick("orders")}
                            >
                              MY ORDERS
                            </span>
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                    <Row justify="space-between">
                      <Col
                        xs={24}
                        sm={24}
                        md={24}
                        lg={24}
                        className={
                          currentNav == "addresses" ? "side-nav-bg" : ""
                        }
                      >
                        <Row>
                          <Col xs={24} sm={24} md={24} lg={24}>
                            <span
                              className={
                                "qa-font-san side-nav-item " +
                                (currentNav == "addresses"
                                  ? "side-nav-active"
                                  : "")
                              }
                              id="addresses"
                              onClick={() => handleNavClick("addresses")}
                            >
                              ADDRESSES
                            </span>
                          </Col>
                        </Row>
                      </Col>
                    </Row>{" "}
                  </React.Fragment>
                ) : (
                  ""
                )}
              </div>
            </Col>
            <Col
              xs={24}
              sm={24}
              md={24}
              lg={24}
              xl={24}
              style={{ marginBottom: "40px" }}
            >
              <div className="left-services">
                <p className="heading">
                  Services
                  <br />
                  launching soon
                </p>
                <p className="para1">
                  Digital Trade Fairs.
                  <br />
                  Partner Verifications.
                  <br />
                  Financial Services.
                  <br />
                  Collaborative Design Tools.
                  <br />
                  Intelligent Supply Chain.
                </p>
                {/* <p className='para2'>Get early access by sending a “request a quote” with your needs.</p> */}
              </div>
            </Col>
          </Row>
        </Col>
        <Col
          xs={21}
          sm={21}
          md={21}
          lg={15}
          xl={15}
          className="account-container"
        >
          {currentNav == "video" ? (
            <React.Fragment>
              <div className="form-top">
                <p
                  className="form-heading"
                  className="qa-fs-22 qa-font-san qa-fw-b"
                  style={{ color: "#191919", letterSpacing: "0.2px" }}
                >
                  VIDEO MEETINGS
                </p>
              </div>
              {/* <div style={{ marginBottom: '20px' }}>
                <span className="qa-fs-17 qa-font-san qa-fw-b" style={{ color: '#191919' }}>Recent requests</span>
              </div> */}
              <Col
                xs={24}
                sm={24}
                md={24}
                lg={24}
                className="account-tab videoRequest"
              >
                <Tabs defaultActiveKey="1" size="large">
                  <TabPane tab="Recent requests" key="1">
                    {props.openRequest && props.openRequest.length > 0 ? (
                      <Slider ref={(c) => (slider = c)} {...settings}>
                        {slides}
                      </Slider>
                    ) : (
                      <Alert
                        className="alert-info-top no-request seller-timezone"
                        type="info"
                        description={
                          <p
                            className="alert-paragraph qa-fs-12 qa-fw-b qa-font-san"
                            style={{ color: "#332f2f" }}
                          >
                            You have no upcoming video demos
                          </p>
                        }
                      />
                    )}
                  </TabPane>
                </Tabs>
              </Col>
              {props.openRequest.length > 0 ? (
                <Col xs={24} sm={24} md={24} lg={24} className="carousal-btn">
                  <div style={{ textAlign: "right", paddingTop: "10px" }}>
                    <Button
                      disabled={currentCount == 1}
                      className="account-carousel-button"
                      icon={<LeftOutlined />}
                      size="small"
                      onClick={prev}
                    ></Button>
                    <span className="qa-fs-14 qa-font-san">
                      {" "}
                      {currentCount} / {props.openRequest.length}{" "}
                    </span>
                    <Button
                      disabled={currentCount == props.openRequest.length}
                      className="account-carousel-button"
                      icon={<RightOutlined />}
                      size="small"
                      onClick={next}
                    ></Button>
                  </div>
                </Col>
              ) : (
                ""
              )}
              <Col
                xs={24}
                sm={24}
                md={24}
                lg={24}
                className="account-tab"
                style={{ marginTop: "30px" }}
              >
                <Tabs
                  className="tab-color"
                  defaultActiveKey="1"
                  size="large"
                  onChange={handleTabChange}
                >
                  <TabPane tab="Upcoming" key="1">
                    {props.meetingByStatus &&
                    props.meetingByStatus.length > 0 ? (
                      meetingCard
                    ) : (
                      <Alert
                        className="alert-info-top seller-timezone"
                        type="info"
                        style={{ marginBottom: "30px" }}
                        description={
                          <p
                            className="alert-paragraph qa-fs-12 qa-fw-b qa-font-san"
                            style={{ color: "#332f2f" }}
                          >
                            You have no upcoming video demos.
                          </p>
                        }
                      />
                    )}
                  </TabPane>
                  <TabPane tab="|"></TabPane>
                  <TabPane tab="Past" key="2">
                    {props.meetingByStatus &&
                    props.meetingByStatus.length > 0 ? (
                      meetingCard
                    ) : (
                      <Alert
                        className="alert-info-top seller-timezone"
                        type="info"
                        style={{ marginBottom: "30px" }}
                        description={
                          <p
                            className="alert-paragraph qa-fs-12 qa-fw-b qa-font-san"
                            style={{ color: "#332f2f" }}
                          >
                            You have no past video demos.
                          </p>
                        }
                      />
                    )}
                  </TabPane>
                </Tabs>
              </Col>
              {meetingByStatusList.length < props.meetingByStatus.length ? (
                <Col
                  xs={24}
                  sm={24}
                  md={22}
                  lg={22}
                  className="account-tab"
                  style={{ marginTop: "30px" }}
                >
                  <div style={{ textAlign: "center" }}>
                    <Button
                      className="qa-button load-more-button"
                      onClick={loadMoreData}
                    >
                      <span className="load-more-button-text">Load More</span>
                    </Button>
                  </div>
                </Col>
              ) : (
                ""
              )}
              <Modal
                className="confirmation-modal"
                visible={showAcceptPopup}
                footer={null}
                closable={true}
                onCancel={() => {
                  setShowAcceptPopup(false);
                }}
                bodyStyle={{ padding: "30" }}
                centered
              >
                <p className="verification-text" style={{ marginTop: "30px" }}>
                  Thank you for accepting the video demo request with{" "}
                  <b>
                    {acceptBuyerOrg} on {requestStart} to {requestEnd}
                  </b>
                  . Link for the video demo will be updated in your account in
                  the next 24 hours.
                </p>
                <Button
                  className="congratulation-button"
                  onClick={() => {
                    setShowAcceptPopup(false);
                  }}
                >
                  OK
                </Button>
              </Modal>

              <Modal
                className="confirmation-modal"
                visible={showReschedulePopup}
                footer={null}
                closable={true}
                onCancel={() => {
                  setReschedulePopup(false);
                }}
                bodyStyle={{ padding: "30" }}
                centered
              >
                {/* <p className="verification-heading">Thank you!  </p> */}

                <p className="verification-text" style={{ marginTop: "30px" }}>
                  We have received your request to re-schedule the video demo.
                  Our team will reach out to you over email to book a convenient
                  time slot for you. You can write to us at help@qalara.com if
                  you have any queries
                </p>
                <Button
                  className="congratulation-button"
                  // style={{ height: '5vh' }}
                  onClick={() => {
                    setReschedulePopup(false);
                  }}
                >
                  OK
                </Button>
              </Modal>
            </React.Fragment>
          ) : (
            ""
          )}
          {currentNav == "quote" ? (
            mediaMatch.matches ? (
              <Quotations />
            ) : (
              <QuotationMobile />
            )
          ) : (
            ""
          )}

          {currentNav == "collections" ? (
            <Collections
              setCollectionDetails={setCollectionDetails}
              collectionName={collectionName}
              setCollectionName={setCollectionName}
              showCollectionDetails={showCollectionDetails}
            />
          ) : (
            ""
          )}

          {currentNav == "orders" ? (
            mediaMatch.matches ? (
              <Orders
                handleShowOrder={handleShowOrder}
                showOrderDetails={showOrderDetails}
              />
            ) : (
              <OrdersMobile
                handleShowOrder={handleShowOrder}
                showOrderDetails={showOrderDetails}
              />
            )
          ) : (
            ""
          )}

          {currentNav == "addresses" ? (
            <Addresses addresses={props.addresses} />
          ) : (
            ""
          )}
          {currentNav == "profile" &&
          (props.isGuest == "false" || props.isGuest == undefined) ? (
            <Col xs={22} sm={22} md={22} lg={22}>
              <div className="form-top">
                <p className="form-heading">My Profile</p>
                <Button
                  type="link"
                  className="form-button-edit"
                  onClick={() => {
                    setEdit(!edit);
                  }}
                >
                  {edit ? "Edit" : "Cancel"}
                </Button>
              </div>
              <Form
                name="user_register_form"
                initialValues={initialValues}
                onFinish={onFinish}
                form={form}
                scrollToFirstError
                style={edit ? { opacity: "0.6" } : {}}
              >
                <p className="label-paragraph">Your first name</p>
                <Form.Item
                  name="firstName"
                  className="form-item"
                  rules={[
                    { required: true, message: "Field is required." },
                    {
                      min: 3,
                      max: 50,
                      message: "Length should be 3-50 characters!",
                    },
                  ]}
                >
                  <Input disabled={edit} />
                </Form.Item>
                <p className="label-paragraph">Your last name</p>
                <Form.Item
                  name="lastName"
                  className="form-item"
                  rules={[
                    { required: true, message: "Field is required." },
                    {
                      min: 3,
                      max: 50,
                      message: "Length should be 3-50 characters!",
                    },
                  ]}
                >
                  <Input disabled={edit} />
                </Form.Item>
                <p className="label-paragraph">Your e-mail</p>
                <Form.Item
                  name="email"
                  className="form-item"
                  rules={[
                    {
                      type: "email",
                      message: "Enter the correct email address.",
                    },
                    {
                      required: true,
                      message: "Field is required.",
                    },
                    {
                      min: 1,
                      max: 70,
                      message: "Length should be 1-70 characters!",
                    },
                  ]}
                >
                  <Input disabled={true} />
                </Form.Item>
                <p className="label-paragraph">Country</p>
                <Form.Item
                  name="country"
                  className="form-item modified-selector"
                  rules={[{ required: true, message: "Field is required." }]}
                >
                  <Select showSearch disabled={edit}>
                    {country}
                  </Select>
                </Form.Item>
                <p className="label-paragraph">Organization Phone number</p>
                <Form.Item
                  name="orgPhone"
                  className="form-item"
                  rules={[
                    { required: true, message: "Field is required." },
                    {
                      pattern: new RegExp("^[0-9]{6,15}$"),
                      message:
                        "Only numbers are allowed & length should be 6-15 characters.",
                    },
                  ]}
                >
                  <Input
                    className="no-border"
                    disabled={edit}
                    // addonBefore={
                    //     <Form.Item className='no-border' name="phoneCountryCode" noStyle>
                    //         <Select style={{ width: 80 }} showSearch>{phoneCountryCode}</Select>
                    //     </Form.Item>
                    // }
                  />
                </Form.Item>
                <p className="label-paragraph">Organization name</p>
                <Form.Item
                  name="orgName"
                  rules={[
                    { required: true, message: "Field is required." },
                    {
                      min: 3,
                      max: 70,
                      message: "Length should be 3-70 characters!",
                    },
                  ]}
                >
                  <Input disabled={edit} />
                </Form.Item>
                <p className="label-paragraph">Organization type</p>
                <Form.Item
                  name="orgType"
                  className="modified-selector"
                  rules={[{ required: true, message: "Field is required." }]}
                >
                  <Select disabled={edit}>
                    {profileType === "BUYER" ? buyerOrgType : sellerOrgType}
                  </Select>
                </Form.Item>
                <p className="label-paragraph">Role in organization</p>
                <Form.Item
                  className="modified-selector"
                  name="roleInOrganization"
                  rules={[{ required: true, message: "Field is required." }]}
                >
                  <Select disabled={edit}>{roleInOrganization}</Select>
                </Form.Item>
                <p className="label-paragraph">
                  {profileType === "BUYER"
                    ? "Order Types Interested in"
                    : "Order Types you deal in"}
                </p>
                <Form.Item
                  name="inOrderTypes"
                  className="modified-selector"
                  rules={[{ required: true, message: "Field is required." }]}
                >
                  <Select mode="multiple" disabled={edit}>
                    {profileType === "BUYER"
                      ? interestsInOrderTypes
                      : dealsInOrderTypes}
                  </Select>
                </Form.Item>
                <p className="label-paragraph">
                  {profileType === "BUYER"
                    ? "Categories Interested in"
                    : "Categories you deal in"}
                </p>
                <Form.Item
                  name="inCategories"
                  rules={[{ required: true, message: "Field is required." }]}
                >
                  <Select mode="multiple" disabled={edit}>
                    {profileType === "BUYER"
                      ? interestsInCategories
                      : dealsInCategories}
                  </Select>
                </Form.Item>
                <Button
                  type="primary"
                  loading={loading}
                  disabled={loading || edit}
                  htmlType="submit"
                  className="submit-button"
                >
                  Save
                </Button>
              </Form>
              <div className="form-bottom">
                <p className="form-heading">Set your password</p>
                <Button
                  type="link"
                  className="form-button-edit"
                  loading={passLoading}
                  disabled={passLoading}
                  onClick={onSetPassword}
                >
                  Click here
                </Button>
              </div>
            </Col>
          ) : currentNav == "profile" ? (
            <React.Fragment>
              <Col xs={22} sm={22} md={22} lg={22}>
                <div className="form-top">
                  <p className="form-heading">My Profile</p>
                </div>
              </Col>
              <Col
                xs={24}
                sm={24}
                md={24}
                lg={24}
                style={{ backgroundColor: "#F2F0EB" }}
              >
                <Row
                  style={{
                    paddingLeft: "20px",
                    paddingRight: "20px",
                    paddingTop: "20px",
                    paddingBottom: "15px",
                  }}
                >
                  <Col xs={24} sm={24} md={24} lg={24}>
                    <span
                      className={
                        mediaMatch.matches
                          ? "qa-font-butler qa-fs-30"
                          : "qa-font-butler qa-fs-20"
                      }
                      style={{ color: "#191919" }}
                    >
                      Activate your account
                    </span>
                  </Col>
                  <Col xs={24} sm={24} md={17} lg={17}>
                    <span
                      className={
                        mediaMatch.matches
                          ? "qa-font-san qa-fs-17 qa-tc-white"
                          : "qa-font-san qa-fs-14 qa-tc-white"
                      }
                    >
                      In order to activate your account and place an order
                      Please signup as a buyer by clicking below.
                    </span>
                  </Col>
                  <Col xs={0} sm={0} md={7} lg={7}></Col>
                  <Col
                    xs={24}
                    sm={24}
                    md={10}
                    lg={10}
                    style={{ marginTop: "40px" }}
                    className="quote-rfq"
                  >
                    <Button
                      className={
                        mediaMatch.matches
                          ? "qa-button quote-contact-seller"
                          : "qa-button quote-contact-seller-mob"
                      }
                      onClick={handleSignUpAsABuyer}
                    >
                      <span
                        className={
                          mediaMatch.matches
                            ? "qa-font-san qa-fw-b qa-fs-20"
                            : "qa-font-san qa-fw-b qa-fs-14"
                        }
                      >
                        SIGN UP AS A BUYER
                      </span>
                    </Button>
                  </Col>
                </Row>
              </Col>{" "}
            </React.Fragment>
          ) : (
            ""
          )}
        </Col>

        <Col
          style={mediaMatch.matches ? { display: "none" } : {}}
          xs={21}
          sm={21}
          md={21}
          lg={5}
          xl={5}
        >
          <Row>
            {props.userProfile.userProfile &&
            props.userProfile.userProfile.verificationStatus &&
            props.userProfile.userProfile.verificationStatus === "CREATED"
              ? [
                  <Col key="1" xs={24} sm={24} md={24} lg={24} xl={24}>
                    <div className="left-verified-seller">
                      <p className="heading">
                        Benefits of being
                        <br />a registered supplier
                      </p>
                      <p className="para">
                        1. Get discovered by verified buyers across the globe.
                      </p>
                      <p className="para">
                        2. Participate in digital trade fairs and a one to one
                        digital shopcast with buyers.
                      </p>
                      <p className="para">
                        3. Get your own virtual store on our website.
                      </p>
                      <Button
                        className="button"
                        onClick={() => {
                          router.push("/applytosell");
                        }}
                      >
                        Apply to sell
                      </Button>
                    </div>
                  </Col>,
                  <Col
                    key="2"
                    xs={24}
                    sm={24}
                    md={24}
                    lg={24}
                    xl={24}
                    style={{ paddingTop: "20px" }}
                  />,
                ]
              : null}
            <Col xs={24} sm={24} md={24} lg={24} xl={24}>
              <div className="left-services">
                <p className="heading">
                  Services
                  <br />
                  launching soon
                </p>
                <p className="para1">
                  Digital Trade Fairs.
                  <br />
                  Partner Verifications.
                  <br />
                  Financial Services.
                  <br />
                  Collaborative Design Tools.
                  <br />
                  Intelligent Supply Chain.
                </p>
                {/* <p className='para2'>Get early access by sending a “request a quote” with your needs.</p> */}
              </div>
            </Col>
            <Col
              xs={24}
              sm={24}
              md={24}
              lg={24}
              xl={24}
              style={{ paddingTop: "20px" }}
            />
          </Row>
        </Col>
      </Row>
      <Modal
        visible={successUpdateVisible}
        footer={null}
        closable={true}
        onCancel={() => {
          setSuccessUpdateVisible(false);
        }}
        centered
        bodyStyle={{ padding: "0" }}
        width={400}
      >
        <div id="user-account-modal">
          <div className="user-account-modal-content">
            <p className="user-account-modal-para1">Thank you!</p>
            <p className="user-account-modal-para2">
              Your information has been updated successfully.
            </p>
          </div>
          <Button
            className="user-account-modal-button"
            onClick={() => {
              setSuccessUpdateVisible(false);
            }}
          >
            Close
          </Button>
        </div>
      </Modal>
      <Modal
        visible={successPassVisible}
        footer={null}
        closable={true}
        onCancel={() => {
          setSuccessPassVisible(false);
        }}
        centered
        bodyStyle={{ padding: "0" }}
        width={400}
      >
        <div id="user-account-modal">
          <div className="user-account-modal-content">
            <p className="user-account-modal-para1">Thank you!</p>
            <p className="user-account-modal-para2">
              We have sent an email to your registered email address with the
              link to set your password.
            </p>
          </div>
          <Button
            className="user-account-modal-button"
            onClick={() => {
              setSuccessPassVisible(false);
            }}
          >
            Close
          </Button>
        </div>
      </Modal>
      <Modal
        className="confirmation-modal"
        visible={showCancelPopup}
        footer={null}
        closable={true}
        onCancel={() => {
          setShowCancelPopup(false);
        }}
        bodyStyle={{ padding: "30" }}
        centered
      >
        {/* <p className="verification-heading">Thank you!  </p> */}

        <p className="verification-text" style={{ marginTop: "30px" }}>
          We have canceled your video demo request. If you want to reschedule
          the request write to us at help@qalara.com.
        </p>
        <Button
          className="congratulation-button"
          onClick={() => {
            setShowCancelPopup(false);
          }}
        >
          OK
        </Button>
      </Modal>
    </div>
  );
};
const mapStateToProps = (state) => {
  return {
    userProfile: state.userProfile,
    profileType:
      state.userProfile &&
      state.userProfile.userProfile &&
      state.userProfile.userProfile.profileType,
    openRequest: state.userProfile.openRequest,
    meetingByStatus: state.userProfile.meetingByStatus,
    meetingCount: state.userProfile.meetingCount,
    isGuest:
      state.auth &&
      state.auth.userAuth &&
      state.auth.userAuth.attributes &&
      state.auth.userAuth.attributes.isGuest &&
      state.auth.userAuth.attributes.isGuest[0],
    addresses: state.userProfile.addresses,
    quotes: state.userProfile.quotes,
    orders: state.userProfile.orders,
  };
};

export default connect(mapStateToProps, {
  getUserProfile,
  getOpenRequest,
  getRequestByStatus,
  getMeetingCount,
  getAddresses,
})(UserAccount);
// export default UserAccount;
