import React, {useState, useEffect} from 'react';
//import Cookies from 'universal-cookie';
//import { useCookies } from 'react-cookie';
//import { useBeforeunload } from 'react-beforeunload';
import { useSelector, connect } from "react-redux";
import { useKeycloak  } from '@react-keycloak/ssr';
import {Modal, Button} from 'antd';
import Icon from "@ant-design/icons";
import whiteCloseButton from "../../public/filestore/whiteCloseButton";
//import isMobileTablet from "./../../deviceType";

function FeedbackModal(props) {
	const [visible, setVisible] = useState(false);
	const [thanks, setThanks] = useState(false);
	const [loading, setLoading] = useState(false);
	const [selectedOption, setSelectedOption] = useState('no');
  const [userCountry, setUserCountry] = useState('');
  const [userIp, setUserIp] = useState('');
  //const [cookie, setCookie] = useCookies(['qalaraUser']);
  const [keycloak] = useKeycloak();
  const { userProfile } = props.userProfile;

  const appToken = useSelector(
    (state) => state.appToken.token && state.appToken.token.access_token
  );

  const token = keycloak.token || appToken;

	const handleSubmit = (status, event) => {
    event.preventDefault();
    const data = {
    "purpose" : event.target[0].value,
    "purposeSuccess" :event.target[3].value ? true : false,
    "ipAddress": userIp,
    "ipCountry" : userCountry ? userCountry : 'IN',
    "isLoggedIn": true,
    "email" : (userProfile && userProfile.email) ? userProfile.email : null,
    "feedbackOnUrl" : window.location.href
    }
    fetch(process.env.NEXT_PUBLIC_REACT_APP_FEEDBACK_MODAL_URL + "/app-feedback", {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      }
    })
    .then(resp => {
      console.log('0909090', resp);
      if(resp.ok && resp.status == 204){
    		setVisible(status);
    		setLoading(!status);
        setTimeout(() => {
          setLoading(false);
          setThanks(true);
        },2000);
      }
    })
    .catch((data, status) => {
      console.log('failed', data);
    })
	}

	const handleOptionChange = (changeEvent) => {
    setSelectedOption(changeEvent.target.value);
  }

  const showModalWindow = (status) => {
    setVisible(status);
    // setCookie('qalaraUser', 'oldUser', {path: '/', maxAge: 60*60*24*30});
  }

  const handleCloseModal = (status) => {
    setVisible(false);
    //setCookie('qalaraUser', 'oldUser', {path: '/', maxAge: 60*60*24*30});
  }

  const handleCloseOnSubmit = (status) => {
    setThanks(status);
    //setCookie('qalaraUser', 'oldUser', {path: '/', maxAge: 60*60*24*30});
  }

  useEffect(() => {

    /*-- get IP address and country of end user --*/
    fetch('https://ipapi.co/json/')
    .then( res => res.json())
    .then(response => {
        // console.log("Country is : ", response);
        setUserCountry(response.country);
        setUserIp(response.ip);
     })
     .catch((data, status) => {
        console.log('Request failed:', data);
     });
     /* ------- */

    /* -- logic to show modal window on mouseleave event by user --*/
    if(cookie && cookie.qalaraUser === 'oldUser'){
      showModalWindow(false);
    } else{
      let elem;
      setTimeout(() => {
        if(isMobileTablet()){
          console.log('%%%%%%%%%', isMobileTablet());
          elem = document.getElementById('root'); // trigger mouse leave on exit from document element root
        } else {
          elem = document.body; // trigger mouse leave on exit from html body
        }
        let country;
        fetch('https://ipapi.co/json/')
            .then( res => res.json())
            .then(response => {
            // console.log("Country is : ", response);
              country = response.country;
            })
            .catch((data, status) => {
            console.log('Request failed:', data);
            });
        elem.addEventListener('mouseleave', event => {          
            if(country!=="IN") {
              showModalWindow(false);
            }else showModalWindow(true);          
          // console.log('type of user', cookie.qalaraUser)
        });
      }, 2000*60); // set time to 2 minutes
    }
    /* ------ */
    

    
  },[]);

	return(
		<div className="feedback-modal-container">
			 <Modal
        visible={visible}
        footer={null}
        closable={false}
        onOk={handleSubmit}
        onCancel={handleSubmit}
        style={{ top: 5 }}
        bodyStyle={{ padding: "0" }}
        width={775}
        className="feedback-form-modal"
      >
      	<div className="feedback-modal-body">
      		<div className="close-tag" onClick={() => handleCloseModal(false)}>
            <Icon
              component={whiteCloseButton}
              className="close-icon"
            />
          </div>
          <div className='feedback-header'>
	      		<h1>Sorry to see you go  
	      			<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
								<path d="M8.00647 1.16384e-05C10.1282 0.00334095 12.1617 0.849388 13.6596 2.35203C15.1576 3.85467 15.9972 5.89083 15.9939 8.01256C15.9906 10.1343 15.1445 12.1678 13.6419 13.6657C12.1392 15.1637 10.1031 16.0033 7.98137 16C3.55584 15.9868 -0.0220255 12.3906 0.000102087 7.9783C0.00393591 5.85863 0.849589 3.8273 2.35105 2.3311C3.85251 0.834907 5.88681 -0.00360304 8.00647 1.16384e-05ZM7.99073 14.9787C11.8354 14.9685 14.9635 11.8783 14.9733 8.01787C14.982 7.09764 14.8086 6.18476 14.4629 5.33187C14.1173 4.47898 13.6062 3.70293 12.9593 3.04846C12.3123 2.39398 11.5422 1.87403 10.6933 1.51857C9.84448 1.1631 8.93366 0.979158 8.01339 0.977332C7.09311 0.975507 6.18158 1.15584 5.33132 1.50793C4.48106 1.86003 3.70889 2.37692 3.05933 3.02882C2.40976 3.68072 1.89564 4.45474 1.5466 5.30626C1.19756 6.15777 1.0205 7.06995 1.02563 7.99021C1.02053 11.846 4.12946 14.9557 7.99073 14.9787Z" fill="#EADA99"/>
								<path d="M8.02072 10.0025C9.38242 10.0285 10.6088 10.5204 11.6237 11.5208C11.8624 11.7566 11.8505 12.0855 11.5969 12.3042C11.4369 12.4417 11.1224 12.4208 10.9526 12.2506C10.4634 11.7582 9.85702 11.3982 9.19051 11.2042C8.64861 11.0464 8.08114 10.9958 7.51987 11.0553C6.9231 11.1137 6.34612 11.301 5.82881 11.6042C5.51774 11.788 5.22852 12.0064 4.96668 12.2553C4.74711 12.46 4.44158 12.4553 4.24583 12.2451C4.05009 12.0349 4.05435 11.7379 4.27051 11.5242C4.93592 10.8602 5.76932 10.3895 6.68158 10.1625C7.12008 10.0566 7.56959 10.0028 8.02072 10.0025Z" fill="#EADA99"/>
								<path d="M10.8826 8.13063C10.3154 8.15702 9.69625 7.65872 9.69923 6.93915C9.7004 6.78268 9.73238 6.62797 9.79335 6.48386C9.85431 6.33976 9.94306 6.20906 10.0545 6.09925C10.166 5.98944 10.298 5.90267 10.443 5.84387C10.588 5.78508 10.7432 5.75542 10.8997 5.75659C11.0561 5.75777 11.2108 5.78975 11.3549 5.85071C11.499 5.91167 11.6297 6.00042 11.7395 6.11189C11.8494 6.22336 11.9361 6.35537 11.9949 6.50038C12.0537 6.64538 12.0834 6.80055 12.0822 6.95702C12.0784 7.62553 11.5009 8.16085 10.8826 8.13063Z" fill="#EADA99"/>
								<path d="M5.10006 8.13065C4.49708 8.15533 3.90857 7.62214 3.9141 6.943C3.91579 6.62699 4.04295 6.32461 4.26759 6.10236C4.49224 5.88011 4.79597 5.7562 5.11197 5.75789C5.42797 5.75958 5.73036 5.88674 5.95261 6.11138C6.17486 6.33603 6.29877 6.63976 6.29708 6.95576C6.29282 7.66342 5.68261 8.16172 5.10006 8.13065Z" fill="#EADA99"/>
								<path d="M9.53136 4.10215C9.5296 4.02041 9.54835 3.93952 9.58589 3.86688C9.62344 3.79424 9.67859 3.73217 9.7463 3.68634C9.81402 3.64051 9.89214 3.61237 9.97353 3.6045C10.0549 3.59664 10.137 3.60929 10.2122 3.6413C10.7705 3.86343 11.3285 4.08598 11.8863 4.30896C12.2335 4.44726 12.3118 4.77322 12.1416 5.08811C12.0522 5.25832 11.7586 5.33236 11.5505 5.24981C10.9854 5.02655 10.421 4.80102 9.85732 4.57322C9.63604 4.48428 9.52753 4.32173 9.53136 4.10215Z" fill="#EADA99"/>
								<path d="M3.74619 4.72595C3.7547 4.5651 3.8547 4.40552 4.05257 4.32467C4.62193 4.09233 5.193 3.86411 5.76576 3.63999C5.88545 3.59325 6.01865 3.59497 6.13709 3.6448C6.25553 3.69464 6.34989 3.78865 6.40016 3.9069C6.45043 4.02516 6.45265 4.15835 6.40635 4.27821C6.36004 4.39807 6.26886 4.49518 6.15214 4.54893C5.92704 4.65148 5.6947 4.73701 5.46491 4.82893C5.12449 4.96595 4.78193 5.10084 4.44066 5.23786C4.24236 5.31786 4.06619 5.27403 3.90662 5.14467C3.79172 5.05148 3.74364 4.9268 3.74619 4.72595Z" fill="#EADA99"/>
							</svg>
	      		</h1>
	      		<span>
	      			We would love your feedback to help us get better!
	      		</span>
      		</div>
      		<form className='form-feedback' onSubmit={(event) => handleSubmit(false, event)}>
      			<span id='purpose-info'>What was the purpose of your visit?</span>
      			<textarea id='purpose' name='purpose' rows='4' cols='50'></textarea>
      			<span id='interest-info'>Did you find what you were looking for?</span><br />
      			<div className="interest-info-options">
              <div className='container'>
                <input type='radio' id='yes' name='yes' value={'yes'} onChange={handleOptionChange} checked={selectedOption === 'yes'}></input>
	      			  <label id='option-yes' htmlFor='yes'><span className='radio'>Yes</span></label>
              </div>
              <div className='container container-no'>
                <input type='radio' id='no' name='no' value={'no'} onChange={handleOptionChange} checked={selectedOption === 'no'}></input>
  	      		  <label id='option-no' htmlFor='no'><span className='radio'>No (please tell us what products or services you would like to see?)</span></label>
              </div>
            </div>
      			{selectedOption === 'no' && <div className='textarea-class'><textarea id='info' name='info' rows='3' cols='50'></textarea></div>}
	      		<button className='submit-feedback' type='submit'>
	      			<div>Send feedback</div>
	      		</button>
      		</form>
      	</div>
      </Modal>
      <Modal
        visible={thanks}
        footer={null}
        closable={false}
        style={{ top: 5 }}
        bodyStyle={{ padding: "0" }}
        width={775}
        className="feedback-form-modal"
      >
	      <div className='thanks-wrapper'>
	      	<div className="close-tag" onClick={() => handleCloseOnSubmit(false)}>
            <Icon
              component={whiteCloseButton}
              className="close-icon"
            />
          </div>
	        <div className='thanks-svg'>
	          <svg width="98" height="99" viewBox="0 0 98 99" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path d="M97.3033 80.1194L76.2486 66.3588C76.0135 66.2051 75.7408 66.1192 75.4604 66.1105C75.18 66.1017 74.9025 66.1705 74.6584 66.3094C74.4143 66.4482 74.2128 66.6517 74.076 66.8977C73.9393 67.1436 73.8724 67.4226 73.8828 67.7041C73.8828 67.7041 73.8828 67.8886 73.8828 68.1884L68.2172 63.1147C68.0751 62.9496 67.9668 62.7581 67.8985 62.551C67.8302 62.3439 67.8032 62.1253 67.8191 61.9077L70.3303 40.8671C70.5948 38.5325 70.2022 36.1702 69.1972 34.0482L52.9812 1.99138C52.2692 0.530752 50.9906 -0.23031 49.7656 0.0618147C49.4949 0.120145 49.2361 0.224118 49 0.369315C48.7639 0.224118 48.5051 0.120145 48.2344 0.0618147C47.0094 -0.23031 45.7308 0.530752 45.0341 1.96831L28.8028 34.0406C27.7999 36.1469 27.4021 38.4924 27.6544 40.8132L30.1809 61.9616C30.1975 62.3839 30.0523 62.7965 29.7752 63.1147L24.1095 68.1884C24.1095 67.8963 24.1095 67.7272 24.1095 67.7118C24.1214 67.4296 24.0556 67.1497 23.9194 66.9026C23.7832 66.6555 23.5819 66.4508 23.3375 66.311C23.0931 66.1712 22.8151 66.1018 22.5339 66.1102C22.2528 66.1186 21.9794 66.2046 21.7438 66.3588L0.696721 80.1194C0.482499 80.2592 0.306525 80.4507 0.184834 80.6762C0.063143 80.9018 -0.000397519 81.1544 1.87122e-06 81.4109V96.8628C1.87122e-06 97.2706 0.16133 97.6616 0.448495 97.95C0.73566 98.2383 1.12514 98.4003 1.53125 98.4003H23.7344L33.1592 90.0055C33.3222 89.8613 33.4527 89.6838 33.542 89.485C33.6314 89.2862 33.6776 89.0706 33.6776 88.8524C33.6776 88.6343 33.6314 88.4187 33.542 88.2198C33.4527 88.021 33.3222 87.8436 33.1592 87.6993C32.807 87.3841 32.4702 87.0612 32.1486 86.746C35.2111 83.9401 40.892 78.6972 45.4628 73.7619C46.9626 71.9785 47.87 69.7692 48.0583 67.4427C48.077 67.0361 47.9344 66.6387 47.6617 66.3375C47.389 66.0363 47.0085 65.856 46.6036 65.8361C46.1986 65.8172 45.8028 65.9604 45.5028 66.2343C45.2029 66.5081 45.0233 66.8901 45.0034 67.2967C44.8461 68.8981 44.226 70.4185 43.2195 71.6709C38.7177 76.5294 33.1363 81.703 30.0891 84.4705C27.2209 80.8289 25.3002 76.528 24.5 71.9553L31.7964 65.4209C32.3088 64.9317 32.7018 64.3303 32.9448 63.6637C33.1879 62.997 33.2743 62.2829 33.1975 61.5772L30.6709 40.4289C30.5147 38.733 30.8052 37.0257 31.5131 35.4781L47.4688 3.944V15.3753H47.262C45.5317 15.3753 43.7095 17.0973 42.7984 18.7886C41.2716 21.8679 39.9094 25.0268 38.7177 28.2519C37.952 30.2045 37.0716 32.4108 36.0992 34.7632C35.9559 35.1368 35.9634 35.5518 36.1201 35.92C36.2768 36.2882 36.5704 36.5805 36.9384 36.7347C37.3064 36.8889 37.7198 36.8929 38.0907 36.7458C38.4615 36.5987 38.7607 36.3121 38.9244 35.9471C39.912 33.5639 40.7925 31.3346 41.5658 29.3819C42.7153 26.2684 44.0264 23.2174 45.4934 20.2415C45.8755 19.4688 46.4958 18.8405 47.262 18.4503H47.4688V29.2128C45.792 29.4357 43.5181 30.8195 43.0205 32.9566C42.4845 35.2629 41.9869 37.2155 41.405 39.491V39.5525C41.3144 39.9437 41.3798 40.3549 41.5873 40.6982C41.7948 41.0416 42.1278 41.2898 42.5152 41.3898C42.6293 41.4462 42.7503 41.4875 42.875 41.5128C43.2249 41.5139 43.5652 41.3983 43.8424 41.1839C44.1196 40.9696 44.3179 40.6688 44.4063 40.3289C44.9881 38.0227 45.4934 36.0624 46.037 33.7331C46.1672 33.1565 46.9405 32.6568 47.4994 32.4416V55.3503C47.4994 55.7581 47.6607 56.1491 47.9479 56.4375C48.235 56.7258 48.6245 56.8878 49.0306 56.8878C49.4367 56.8878 49.8262 56.7258 50.1134 56.4375C50.4005 56.1491 50.5619 55.7581 50.5619 55.3503V32.4108C51.0902 32.6107 51.7486 33.0412 51.8558 33.4717C52.3764 35.5934 52.8664 37.3846 53.4253 39.4679L53.678 40.3827C53.7655 40.7026 53.9537 40.9855 54.2145 41.1892C54.4753 41.3929 54.7947 41.5064 55.125 41.5128C55.262 41.5132 55.3985 41.4951 55.5308 41.459C55.9211 41.3511 56.2531 41.0924 56.4539 40.7394C56.6548 40.3865 56.7083 39.968 56.6027 39.5756L56.35 38.6531C55.7911 36.5928 55.3087 34.8093 54.8187 32.7337C54.3287 30.6581 52.1237 29.4742 50.5312 29.2512V18.4503H50.7073C51.4913 18.83 52.1251 19.4636 52.5066 20.2492C53.9733 23.2253 55.2843 26.2763 56.4342 29.3896C57.1998 31.3499 58.088 33.5716 59.0756 35.9547C59.2394 36.3198 59.5385 36.6064 59.9093 36.7535C60.2802 36.9005 60.6936 36.8966 61.0616 36.7424C61.4296 36.5881 61.7232 36.2959 61.8799 35.9277C62.0366 35.5595 62.0441 35.1445 61.9008 34.7709C60.9208 32.4108 60.048 30.2045 59.2823 28.2596C58.0906 25.0345 56.7284 21.8756 55.2016 18.7962C54.2905 17.0973 52.4683 15.3753 50.738 15.3753H50.5312V3.95169L66.4792 35.4704C67.1879 37.0313 67.4732 38.7524 67.3061 40.4596L64.7948 61.5003C64.7048 62.2177 64.784 62.9464 65.026 63.6274C65.2681 64.3085 65.6662 64.9228 66.1883 65.4209L73.5 71.9476C72.6986 76.5176 70.778 80.8158 67.9109 84.4552C64.8484 81.6954 59.29 76.5217 54.7805 71.6555C53.774 70.4031 53.1539 68.8828 52.9966 67.2813C52.9769 66.887 52.8069 66.5154 52.5219 66.2435C52.2368 65.9716 51.8585 65.8202 51.4653 65.8207H51.3888C50.9839 65.8406 50.6033 66.0209 50.3306 66.3221C50.058 66.6233 49.9153 67.0208 49.9341 67.4274C50.1223 69.7538 51.0298 71.9631 52.5295 73.7465C57.1233 78.6819 62.7506 83.9247 65.8438 86.7307C65.5222 87.0535 65.1853 87.3687 64.8331 87.6839C64.6702 87.8282 64.5397 88.0056 64.4503 88.2045C64.3609 88.4033 64.3147 88.6189 64.3147 88.837C64.3147 89.0552 64.3609 89.2708 64.4503 89.4696C64.5397 89.6685 64.6702 89.8459 64.8331 89.9902L74.2656 98.4003H96.4688C96.8749 98.4003 97.2643 98.2383 97.5515 97.95C97.8387 97.6616 98 97.2706 98 96.8628V81.4109C98.0004 81.1544 97.9369 80.9018 97.8152 80.6762C97.6935 80.4507 97.3033 80.1194 97.3033 80.1194Z" fill="#C2B7A2"/>
						</svg><br />
		      	<span>Thank you for your feedback!</span>
	        </div>
	      </div>
      </Modal>
      <Modal
        visible={loading}
        footer={null}
        closable={false}
        style={{ top: 5 }}
        bodyStyle={{ padding: "0" }}
        width={775}
        className="feedback-form-modal"
      >
      <div className='loading-wrapper'>
      	<div className="close-tag" onClick={() => { setLoading(false); setThanks(true);}}>
          <Icon
            component={whiteCloseButton}
            className="close-icon"
          />
        </div>
        <div className='loading-svg'>
					<svg width="71" height="71" viewBox="0 0 71 71" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path fillRule="evenodd" clipRule="evenodd" d="M35.5 7.8473C35.2372 7.84571 34.9755 7.71404 34.8093 7.45125C32.8398 4.39628 29.8459 2.84402 27.0788 0.832974C26.5301 0.434185 25.7352 0.647205 25.4594 1.26693C24.0687 4.39205 22.252 7.23318 22.074 10.8639C22.0607 11.1745 21.9003 11.4198 21.6737 11.552C21.4454 11.682 21.1528 11.6985 20.8778 11.5546C17.6444 9.8934 14.2754 10.0461 10.8733 9.68771C10.1987 9.61664 9.61664 10.1987 9.68771 10.8733C10.0461 14.2754 9.8934 17.6444 11.5546 20.8778C11.6985 21.1528 11.682 21.4454 11.5525 21.6737C11.4192 21.9003 11.1745 22.0607 10.8639 22.0734C7.23318 22.2519 4.39205 24.0687 1.26693 25.4594C0.647204 25.7352 0.434184 26.5301 0.832974 27.0788C2.84402 29.8459 4.39628 32.8398 7.45125 34.8093C7.71404 34.9755 7.84571 35.2372 7.8473 35.5C7.84571 35.7628 7.71404 36.0245 7.45125 36.1907C4.39623 38.1602 2.84396 41.1542 0.832867 43.9213C0.434105 44.47 0.647054 45.2648 1.26671 45.5406C4.39191 46.9316 7.2331 48.7481 10.8639 48.9266C11.1745 48.9388 11.4192 49.0997 11.5525 49.3264C11.682 49.5546 11.6985 49.8472 11.5546 50.1227C9.8934 53.3556 10.0461 56.7246 9.68771 60.1263C9.61663 60.8009 10.1986 61.3829 10.8732 61.3119C14.2753 60.9539 17.6444 61.1066 20.8778 59.4454C21.1528 59.3015 21.4454 59.318 21.6737 59.448C21.9003 59.5802 22.0607 59.8255 22.074 60.1361C22.252 63.7664 24.0687 66.6079 25.4594 69.7331C25.7352 70.3528 26.5301 70.5658 27.0788 70.167C29.8459 68.156 32.8398 66.6037 34.8093 63.5488C34.9755 63.2865 35.2372 63.1543 35.5 63.1527C35.7628 63.1543 36.024 63.2865 36.1907 63.5488C38.1602 66.6037 41.1541 68.156 43.9212 70.167C44.4699 70.5658 45.2648 70.3528 45.5406 69.7331C46.9313 66.6079 48.7481 63.7664 48.9266 60.1361C48.9388 59.8255 49.0997 59.5802 49.3264 59.448C49.5546 59.318 49.8472 59.3015 50.1222 59.4454C53.3552 61.1067 56.7247 60.9539 60.1266 61.312C60.8012 61.383 61.3831 60.8011 61.3121 60.1266C60.9543 56.7248 61.1067 53.3557 59.4454 50.1227C59.3015 49.8472 59.318 49.5546 59.448 49.3264C59.5802 49.0997 59.8261 48.9388 60.1361 48.9266C63.7664 48.7481 66.608 46.9316 69.7333 45.5406C70.3529 45.2648 70.5659 44.47 70.1671 43.9213C68.156 41.1542 66.6038 38.1602 63.5488 36.1907C63.286 36.0245 63.1543 35.7628 63.1527 35.5C63.1543 35.2372 63.286 34.9755 63.5488 34.8093C66.6037 32.8398 68.156 29.8459 70.167 27.0788C70.5658 26.5301 70.3528 25.7352 69.7331 25.4594C66.6079 24.0687 63.7664 22.2519 60.1361 22.0734C59.8261 22.0607 59.5802 21.9003 59.448 21.6737C59.318 21.4454 59.3015 21.1528 59.4454 20.8778C61.1067 17.6443 60.9543 14.2752 61.3121 10.873C61.3831 10.1984 60.8011 9.61662 60.1265 9.68769C56.7246 10.0461 53.3552 9.89337 50.1222 11.5546C49.8472 11.6985 49.5546 11.682 49.3264 11.552C49.0997 11.4198 48.9388 11.1745 48.9266 10.8639C48.7481 7.23318 46.9313 4.39205 45.5406 1.26693C45.2648 0.647204 44.4699 0.434184 43.9212 0.832974C41.1541 2.84402 38.1602 4.39628 36.1907 7.45125C36.024 7.71404 35.7628 7.84571 35.5 7.8473Z" stroke="#C2B7A2"/>
						<path fillRule="evenodd" clipRule="evenodd" d="M27.6432 10.774C28.2344 10.4644 28.8916 10.2883 29.5584 10.2609C30.7342 10.2125 31.76 10.5184 32.6606 11.6666C33.3371 12.5264 33.8491 13.5073 34.1054 14.5636C34.2448 15.1384 34.7471 15.5843 35.3385 15.5813V15.5813V15.5813C35.9298 15.5843 36.4321 15.1383 36.5716 14.5637C36.828 13.5073 37.3401 12.5264 38.0163 11.6666C38.9169 10.5184 39.9428 10.2125 41.1185 10.2609C41.7853 10.2883 42.4425 10.4644 43.0337 10.774C44.0762 11.3199 44.8117 12.0978 45.0176 13.5426C45.1735 14.6254 45.1265 15.7311 44.8203 16.774C44.6537 17.3414 44.8656 17.9783 45.3791 18.2715V18.2715V18.2715C45.8895 18.5704 46.548 18.4346 46.9561 18.0066C47.7062 17.2201 48.6402 16.6267 49.6558 16.2205C51.0112 15.6757 52.0533 15.9247 53.048 16.5561C53.6096 16.9125 54.089 17.392 54.4455 17.9535C55.0768 18.9481 55.3258 19.9901 54.781 21.3462C54.3745 22.3615 53.7813 23.2951 52.9948 24.0452C52.5668 24.4535 52.4317 25.1116 52.73 25.6224V25.6224V25.6224C53.0232 26.1359 53.6602 26.3478 54.2276 26.1812C55.2704 25.875 56.3757 25.828 57.4585 25.9839C58.9037 26.1898 59.6816 26.9253 60.2275 27.9678C60.5371 28.559 60.7132 29.2162 60.7407 29.883C60.7892 31.0587 60.4835 32.0846 59.3349 32.9852C58.4751 33.6614 57.4943 34.1735 56.4379 34.4299C55.8632 34.5694 55.4172 35.0717 55.4203 35.663V35.663V35.663C55.4172 36.2544 55.8632 36.7566 56.4379 36.8961C57.4943 37.1525 58.4751 37.6647 59.3349 38.3409C60.4835 39.2415 60.7892 40.2673 60.7407 41.4431C60.7132 42.1099 60.5371 42.767 60.2275 43.3582C59.6816 44.4008 58.9037 45.1362 57.4585 45.3421C56.3758 45.498 55.2707 45.4511 54.228 45.1449C53.6603 44.9783 53.0231 45.1902 52.73 45.7041V45.7041V45.7041C52.4315 46.2144 52.5668 46.8724 52.9946 47.2804C53.7812 48.0305 54.3745 48.9646 54.781 49.9803C55.3258 51.3357 55.0768 52.3778 54.4454 53.3725C54.089 53.9341 53.6096 54.4135 53.048 54.77C52.0533 55.4013 51.0112 55.6503 49.6558 55.1056C48.6402 54.6991 47.7062 54.1058 46.9562 53.3194C46.548 52.8915 45.8898 52.7563 45.3791 53.0545V53.0545V53.0545C44.8656 53.3478 44.6536 53.9847 44.8203 54.5521C45.1265 55.595 45.1735 56.7003 45.0176 57.7834C44.8117 59.2283 44.0762 60.0061 43.0337 60.552C42.4425 60.8616 41.7853 61.0377 41.1185 61.0652C39.9428 61.1136 38.9169 60.8076 38.0163 59.6594C37.3401 58.7996 36.828 57.8188 36.5716 56.7624C36.4321 56.1877 35.9298 55.7417 35.3385 55.7448V55.7448V55.7448C34.7471 55.7417 34.2448 56.1877 34.1054 56.7624C33.8491 57.8188 33.3371 58.7996 32.6606 59.6594C31.76 60.8076 30.7342 61.1136 29.5584 61.0652C28.8916 61.0377 28.2344 60.8616 27.6432 60.552C26.6007 60.0061 25.8652 59.2283 25.6593 57.7834C25.5034 56.7003 25.5504 55.595 25.8566 54.5521C26.0233 53.9847 25.8113 53.3478 25.2978 53.0545V53.0545V53.0545C24.787 52.7562 24.1289 52.8913 23.7206 53.3194C22.9705 54.1058 22.0368 54.699 21.0211 55.1056C19.6657 55.6503 18.6236 55.4013 17.6289 54.77C17.0673 54.4135 16.5879 53.9341 16.2315 53.3725C15.6001 52.3778 15.3511 51.3357 15.8959 49.9803C16.3021 48.9645 16.8957 48.0304 17.6824 47.2802C18.1102 46.8724 18.2458 46.2143 17.9474 45.7041V45.7041V45.7041C17.6543 45.1901 17.0165 44.9784 16.4488 45.145C15.4061 45.4511 14.3006 45.498 13.218 45.3421C11.7737 45.1363 10.9959 44.4013 10.45 43.3595C10.1399 42.7675 9.96366 42.1094 9.93638 41.4416C9.88838 40.2665 10.1942 39.2411 11.342 38.3409C12.2018 37.6647 13.1828 37.1526 14.239 36.8962C14.8137 36.7567 15.2597 36.2544 15.2566 35.663V35.663V35.663C15.2597 35.0717 14.8137 34.5694 14.239 34.4299C13.1828 34.1735 12.2018 33.6613 11.342 32.9852C10.1942 32.0849 9.88838 31.0596 9.93638 29.8844C9.96366 29.2167 10.1399 28.5585 10.45 27.9666C10.9959 26.9247 11.7737 26.1897 13.218 25.9839C14.3007 25.828 15.4063 25.875 16.4491 26.1811C17.0166 26.3477 17.6541 26.136 17.9474 25.6224V25.6224V25.6224C18.2456 25.1118 18.1102 24.4535 17.6822 24.0454C16.8956 23.2953 16.3021 22.3616 15.8959 21.3462C15.3511 19.9901 15.6001 18.9481 16.2315 17.9535C16.5879 17.392 17.0673 16.9125 17.6289 16.5561C18.6236 15.9247 19.6657 15.6757 21.0211 16.2205C22.0368 16.6267 22.9705 17.2201 23.7207 18.0067C24.1289 18.4348 24.7873 18.5704 25.2978 18.2715V18.2715V18.2715C25.8113 17.9783 26.0232 17.3413 25.8566 16.774C25.5504 15.7311 25.5034 14.6254 25.6593 13.5426C25.8652 12.0978 26.6007 11.3199 27.6432 10.774Z" stroke="#C2B7A2"/>
						<path fillRule="evenodd" clipRule="evenodd" d="M30.6699 19.0137C31.4437 18.8077 32.2289 18.6468 33.0141 18.5371H33.1086L33.2035 18.5053C33.8473 18.4345 34.5109 18.3989 35.1746 18.3989C35.8383 18.3989 36.502 18.4345 37.1462 18.5053L37.2407 18.5371H37.3351C38.1203 18.6468 38.9056 18.8077 39.6794 19.0137C40.4522 19.2221 41.2132 19.4752 41.9481 19.7728L42.0303 19.8203L42.1276 19.8402C42.7205 20.1009 43.313 20.4018 43.8879 20.7337C44.4623 21.066 45.0197 21.4282 45.5419 21.8113L45.6079 21.8859L45.69 21.9333C46.3152 22.4209 46.9148 22.9531 47.4816 23.518C48.047 24.0853 48.5792 24.6854 49.0668 25.3101L49.1143 25.3923L49.1888 25.4578C49.5719 25.9805 49.9346 26.5373 50.2664 27.1122C50.5983 27.6871 50.8993 28.2796 51.1599 28.8725L51.1798 28.9699L51.2273 29.052C51.5245 29.7874 51.778 30.5479 51.9864 31.3207C52.1924 32.0946 52.3534 32.8798 52.4635 33.665V33.7595L52.4948 33.8544C52.5656 34.4981 52.6012 35.1618 52.6012 35.8255C52.6012 36.4892 52.5656 37.1529 52.4948 37.7966L52.4635 37.8916V37.986C52.3534 38.7712 52.1924 39.5564 51.9864 40.3303C51.778 41.1031 51.5245 41.8641 51.2273 42.599L51.1798 42.6812L51.1599 42.7785C50.8993 43.3714 50.5983 43.9639 50.2664 44.5388C49.9346 45.1132 49.5719 45.6706 49.1888 46.1928L49.1143 46.2592L49.0668 46.3409C48.5792 46.9661 48.047 47.5657 47.4816 48.1325C46.9148 48.6979 46.3152 49.2301 45.69 49.7177L45.6079 49.7651L45.5419 49.8397C45.0197 50.2228 44.4623 50.5855 43.8879 50.9173C43.313 51.2492 42.7205 51.5501 42.1276 51.8108L42.0303 51.8307L41.9481 51.8782C41.2132 52.1754 40.4522 52.4289 39.6794 52.6373C38.9056 52.8433 38.1203 53.0043 37.3351 53.1144H37.2407L37.1462 53.1457C36.502 53.2165 35.8383 53.2521 35.1746 53.2521C34.5109 53.2521 33.8473 53.2165 33.2035 53.1457L33.1086 53.1144H33.0141C32.2289 53.0043 31.4437 52.8433 30.6699 52.6373C29.897 52.4289 29.1365 52.1754 28.4011 51.8782L28.3194 51.8307L28.2216 51.8108C27.6287 51.5501 27.0362 51.2492 26.4613 50.9173C25.8864 50.5855 25.3296 50.2228 24.8074 49.8397L24.7414 49.7651L24.6592 49.7177C24.0345 49.2301 23.4344 48.6979 22.8671 48.1325C22.3022 47.5657 21.7705 46.9661 21.2824 46.3409L21.235 46.2592L21.1604 46.1928C20.7773 45.6706 20.4146 45.1132 20.0828 44.5388C19.751 43.9639 19.45 43.3714 19.1893 42.7785L19.1694 42.6812L19.1219 42.599C18.8243 41.8641 18.5712 41.1031 18.3628 40.3303C18.1568 39.5564 17.9959 38.7712 17.8857 37.986V37.8916L17.8544 37.7966C17.7837 37.1529 17.7485 36.4892 17.748 35.8255C17.7485 35.1618 17.7837 34.4981 17.8544 33.8544L17.8857 33.7595V33.665C17.9959 32.8798 18.1568 32.0946 18.3628 31.3207C18.5712 30.5479 18.8243 29.7874 19.1219 29.052L19.1694 28.9699L19.1893 28.8725C19.45 28.2796 19.751 27.6871 20.0828 27.1122C20.4146 26.5373 20.7773 25.9805 21.1604 25.4578L21.235 25.3923L21.2824 25.3101C21.7705 24.6854 22.3022 24.0853 22.8671 23.518C23.4344 22.9531 24.0345 22.4209 24.6592 21.9333L24.7414 21.8859L24.8074 21.8113C25.3296 21.4282 25.8864 21.066 26.4613 20.7337C27.0362 20.4018 27.6287 20.1009 28.2216 19.8402L28.3194 19.8203L28.4011 19.7728C29.1365 19.4752 29.897 19.2221 30.6699 19.0137V19.0137Z" stroke="#C2B7A2"/>
						<path fillRule="evenodd" clipRule="evenodd" d="M34.4537 32.8347C34.6023 32.7952 34.7531 32.7643 34.9038 32.7432H34.922L34.9402 32.7371C35.0638 32.7235 35.1913 32.7167 35.3187 32.7167C35.4461 32.7167 35.5735 32.7235 35.6972 32.7371L35.7154 32.7432H35.7335C35.8843 32.7643 36.0351 32.7952 36.1836 32.8347C36.332 32.8747 36.4781 32.9233 36.6192 32.9805L36.635 32.9896L36.6537 32.9934C36.7676 33.0435 36.8813 33.1012 36.9917 33.165C37.102 33.2288 37.209 33.2983 37.3093 33.3719L37.3219 33.3862L37.3377 33.3953C37.4578 33.4889 37.5729 33.5911 37.6817 33.6996C37.7903 33.8085 37.8925 33.9237 37.9861 34.0437L37.9952 34.0594L38.0095 34.072C38.0831 34.1724 38.1527 34.2793 38.2164 34.3897C38.2801 34.5001 38.3379 34.6138 38.388 34.7277L38.3918 34.7464L38.4009 34.7621C38.458 34.9033 38.5067 35.0494 38.5467 35.1978C38.5862 35.3463 38.6171 35.4971 38.6383 35.6479V35.666L38.6443 35.6842C38.6579 35.8078 38.6647 35.9353 38.6647 36.0627C38.6647 36.1901 38.6579 36.3176 38.6443 36.4412L38.6383 36.4594V36.4775C38.6171 36.6283 38.5862 36.7791 38.5467 36.9276C38.5067 37.076 38.458 37.2222 38.4009 37.3633L38.3918 37.379L38.388 37.3977C38.3379 37.5116 38.2801 37.6253 38.2164 37.7357C38.1527 37.846 38.0831 37.953 38.0095 38.0533L37.9952 38.0661L37.9861 38.0817C37.8925 38.2018 37.7903 38.3169 37.6817 38.4257C37.5729 38.5343 37.4578 38.6365 37.3377 38.7301L37.3219 38.7392L37.3093 38.7535C37.209 38.8271 37.102 38.8967 36.9917 38.9604C36.8813 39.0242 36.7676 39.0819 36.6537 39.132L36.635 39.1358L36.6192 39.1449C36.4781 39.202 36.332 39.2507 36.1836 39.2907C36.0351 39.3302 35.8843 39.3611 35.7335 39.3823H35.7154L35.6972 39.3883C35.5735 39.4019 35.4461 39.4087 35.3187 39.4087C35.1913 39.4087 35.0638 39.4019 34.9402 39.3883L34.922 39.3823H34.9038C34.7531 39.3611 34.6023 39.3302 34.4537 39.2907C34.3053 39.2507 34.1593 39.202 34.0181 39.1449L34.0024 39.1358L33.9837 39.132C33.8698 39.0819 33.7561 39.0242 33.6457 38.9604C33.5353 38.8967 33.4284 38.8271 33.3281 38.7535L33.3154 38.7392L33.2997 38.7301C33.1797 38.6365 33.0645 38.5343 32.9556 38.4257C32.8471 38.3169 32.745 38.2018 32.6513 38.0817L32.6422 38.0661L32.6279 38.0533C32.5543 37.953 32.4847 37.846 32.4209 37.7357C32.3572 37.6253 32.2994 37.5116 32.2494 37.3977L32.2456 37.379L32.2365 37.3633C32.1793 37.2222 32.1307 37.076 32.0907 36.9276C32.0511 36.7791 32.0202 36.6283 31.9991 36.4775V36.4594L31.9931 36.4412C31.9795 36.3176 31.9727 36.1901 31.9727 36.0627C31.9727 35.9353 31.9795 35.8078 31.9931 35.6842L31.9991 35.666V35.6479C32.0202 35.4971 32.0511 35.3463 32.0907 35.1978C32.1307 35.0494 32.1793 34.9033 32.2365 34.7621L32.2456 34.7464L32.2494 34.7277C32.2994 34.6138 32.3572 34.5001 32.4209 34.3897C32.4847 34.2793 32.5543 34.1724 32.6279 34.072L32.6422 34.0594L32.6513 34.0437C32.745 33.9237 32.8471 33.8085 32.9556 33.6996C33.0645 33.5911 33.1797 33.4889 33.2997 33.3953L33.3154 33.3862L33.3281 33.3719C33.4284 33.2983 33.5353 33.2288 33.6457 33.165C33.7561 33.1012 33.8698 33.0435 33.9837 32.9934L34.0024 32.9896L34.0181 32.9805C34.1593 32.9233 34.3053 32.8747 34.4537 32.8347V32.8347Z" stroke="#C2B7A2"/>
						<path fillRule="evenodd" clipRule="evenodd" d="M-nan -nanL32.6373 26.0526L32.6504 26.0512C32.6519 26.0511 32.6533 26.0506 32.6547 26.05L32.6687 26.0433C32.6765 26.0396 32.6846 26.0368 32.6931 26.0353C32.8259 26.0109 32.96 26.0262 33.1197 26.106C33.9701 26.5999 34.6834 26.9566 35.3144 27.5461C35.3153 27.547 35.3168 27.547 35.3177 27.5462V27.5462C35.3186 27.5453 35.32 27.5453 35.321 27.5462V27.5462C35.3219 27.547 35.3234 27.547 35.3243 27.5461C35.9553 26.9566 36.6685 26.5999 37.5194 26.106C37.6787 26.0262 37.8127 26.0109 37.9456 26.0353C37.954 26.0368 37.9622 26.0396 37.9699 26.0433L37.9789 26.0476C37.9836 26.0498 37.9887 26.0513 37.9939 26.0518V26.0518C37.9988 26.0524 38.0036 26.0537 38.0082 26.0557V26.0557C38.0132 26.0581 38.0187 26.0594 38.0243 26.0598L38.0338 26.0605C38.0422 26.061 38.0505 26.0627 38.0585 26.0655C38.1858 26.111 38.2942 26.191 38.3926 26.34C38.8825 27.1931 39.3219 27.8589 39.5737 28.6853C39.574 28.6863 39.5749 28.6868 39.5759 28.6865V28.6865C39.5766 28.6863 39.5774 28.6866 39.5778 28.6872L39.5784 28.6881C39.5791 28.6892 39.5804 28.6897 39.5817 28.6894C40.423 28.4946 41.2191 28.5421 42.2028 28.54C42.3812 28.5505 42.505 28.6042 42.6083 28.6922C42.6146 28.6975 42.6199 28.7037 42.6245 28.7106L42.6303 28.7194C42.6331 28.7237 42.6368 28.7274 42.6411 28.7303V28.7303C42.6453 28.7332 42.6489 28.7368 42.6517 28.7409V28.7409C42.6547 28.7452 42.6584 28.7489 42.6627 28.7518L42.6715 28.7576C42.6784 28.7621 42.6846 28.7675 42.6899 28.7738C42.7779 28.877 42.8316 29.0009 42.842 29.1793C42.84 30.163 42.8875 30.9591 42.6926 31.8004C42.6924 31.8016 42.693 31.8027 42.6942 31.8031L42.6942 31.8031C42.6954 31.8034 42.696 31.8046 42.6957 31.8058V31.8058C42.6953 31.8069 42.696 31.8081 42.6971 31.8085C43.5234 32.0603 44.1891 32.4997 45.0421 32.9895C45.191 33.0878 45.2715 33.1962 45.317 33.3234C45.3198 33.3315 45.3214 33.3399 45.3219 33.3484L45.3224 33.3576C45.3227 33.3633 45.3241 33.3689 45.3264 33.374V33.374C45.3284 33.3784 45.3297 33.3832 45.3303 33.388L45.3303 33.3882C45.3308 33.3934 45.3323 33.3984 45.3345 33.4032L45.3388 33.4121C45.3425 33.4198 45.3453 33.428 45.3468 33.4364C45.3712 33.5693 45.3559 33.7033 45.2761 33.863C44.7821 34.7135 44.4255 35.4268 43.836 36.0577C43.8351 36.0587 43.8351 36.0601 43.8359 36.0611V36.0611C43.8367 36.062 43.8367 36.0634 43.8359 36.0643V36.0643C43.8351 36.0653 43.8351 36.0667 43.836 36.0676C44.4255 36.6986 44.7821 37.4119 45.2761 38.2628C45.3559 38.4221 45.3712 38.5562 45.3468 38.6894C45.3453 38.6978 45.3425 38.7059 45.3388 38.7136L45.3346 38.7222C45.3323 38.7269 45.3308 38.7321 45.3303 38.7373V38.7373C45.3297 38.7422 45.3284 38.7469 45.3264 38.7514V38.7514C45.3241 38.7565 45.3227 38.7621 45.3224 38.7678L45.3219 38.777C45.3214 38.7855 45.3198 38.7939 45.317 38.8019C45.2715 38.9292 45.191 39.0376 45.0421 39.1359C44.1891 39.6257 43.5234 40.0651 42.6971 40.3169C42.696 40.3172 42.6953 40.3184 42.6957 40.3196V40.3196C42.696 40.3207 42.6954 40.3219 42.6942 40.3223L42.6942 40.3223C42.693 40.3226 42.6924 40.3238 42.6926 40.325C42.8875 41.1663 42.84 41.9624 42.842 42.9461C42.8316 43.1245 42.7779 43.2483 42.6899 43.3516C42.6846 43.3579 42.6784 43.3632 42.6715 43.3678L42.6627 43.3736C42.6584 43.3765 42.6547 43.3801 42.6517 43.3844V43.3844C42.6489 43.3886 42.6453 43.3922 42.6411 43.395V43.395C42.6368 43.398 42.6331 43.4017 42.6303 43.406L42.6245 43.4148C42.6199 43.4217 42.6146 43.4279 42.6083 43.4332C42.505 43.5212 42.3812 43.5749 42.2028 43.5853C41.2191 43.5833 40.423 43.6308 39.5816 43.4359C39.5805 43.4357 39.5793 43.4364 39.579 43.4375L39.579 43.4375C39.5786 43.4387 39.5774 43.4393 39.5763 43.439V43.439C39.5751 43.4386 39.5739 43.4393 39.5736 43.4404C39.3217 44.2667 38.8824 44.9324 38.3926 45.7854C38.2942 45.9339 38.1858 46.0144 38.0585 46.0599C38.0505 46.0627 38.0422 46.0643 38.0338 46.0649L38.0243 46.0656C38.0187 46.0659 38.0132 46.0673 38.0081 46.0697V46.0697C38.0037 46.0717 37.9989 46.073 37.994 46.0735V46.0735C37.9887 46.0741 37.9836 46.0756 37.9788 46.078L37.9701 46.0823C37.9623 46.0861 37.954 46.089 37.9454 46.0905C37.8126 46.1145 37.6786 46.0991 37.5194 46.0193C36.6685 45.5254 35.9553 45.1687 35.3243 44.5793C35.3234 44.5784 35.3219 44.5784 35.321 44.5792V44.5792C35.32 44.58 35.3186 44.58 35.3177 44.5792V44.5792C35.3168 44.5784 35.3153 44.5784 35.3144 44.5793C34.6834 45.1687 33.9701 45.5254 33.1197 46.0193C32.9601 46.0991 32.8261 46.1145 32.6933 46.0905C32.6847 46.089 32.6764 46.0861 32.6686 46.0823L32.6599 46.078C32.6551 46.0756 32.6499 46.0741 32.6447 46.0735V46.0735C32.6398 46.073 32.635 46.0717 32.6306 46.0697V46.0697C32.6255 46.0673 32.62 46.0659 32.6144 46.0656L32.6049 46.0649C32.5965 46.0643 32.5881 46.0627 32.5802 46.0599C32.4529 46.0144 32.3444 45.9339 32.2461 45.7854C31.7563 44.9324 31.3169 44.2667 31.0651 43.4404C31.0648 43.4393 31.0635 43.4386 31.0624 43.439V43.439C31.0613 43.4393 31.0601 43.4387 31.0597 43.4375L31.0597 43.4375C31.0594 43.4364 31.0582 43.4357 31.057 43.4359C30.2157 43.6308 29.4196 43.5833 28.4359 43.5853C28.2575 43.5749 28.1336 43.5212 28.0304 43.4332C28.0241 43.4279 28.0187 43.4217 28.0142 43.4148L28.0085 43.4062C28.0056 43.4018 28.0018 43.3979 27.9973 43.3949V43.3949C27.9933 43.3922 27.9898 43.3887 27.9869 43.3847L27.9867 43.3844C27.9837 43.3801 27.9799 43.3764 27.9755 43.3735L27.9673 43.368C27.9604 43.3633 27.954 43.3578 27.9486 43.3514C27.8611 43.2481 27.8075 43.1244 27.7966 42.9461C27.7991 41.9624 27.7512 41.1663 27.946 40.325C27.9463 40.3238 27.9456 40.3226 27.9445 40.3223L27.9444 40.3223C27.9433 40.3219 27.9426 40.3207 27.943 40.3196V40.3196C27.9433 40.3184 27.9427 40.3172 27.9415 40.3169C27.1153 40.0651 26.4495 39.6257 25.5965 39.1359C25.4476 39.0376 25.3676 38.9291 25.3221 38.8019C25.3192 38.7939 25.3176 38.7855 25.317 38.7771L25.3164 38.7676C25.316 38.762 25.3146 38.7565 25.3123 38.7515V38.7515C25.3103 38.747 25.3089 38.7422 25.3084 38.7373V38.7373C25.3078 38.732 25.3064 38.7269 25.3041 38.7222L25.2999 38.7136C25.2962 38.7059 25.2934 38.6978 25.2919 38.6894C25.2675 38.5562 25.2827 38.4221 25.3626 38.2628C25.8566 37.4118 26.2133 36.6984 26.803 36.0674C26.8037 36.0666 26.8037 36.0654 26.803 36.0646V36.0646C26.8025 36.0639 26.8024 36.063 26.8028 36.0623L26.8032 36.0615C26.8038 36.0602 26.8036 36.0587 26.8026 36.0576C26.2132 35.4267 25.8565 34.7135 25.3626 33.863C25.2828 33.7033 25.2675 33.5693 25.2919 33.4364C25.2934 33.428 25.2962 33.4198 25.2999 33.4121L25.3041 33.4032C25.3064 33.3984 25.3078 33.3934 25.3084 33.3882V33.3882C25.3089 33.3832 25.3103 33.3784 25.3123 33.3739V33.3739C25.3146 33.3688 25.316 33.3634 25.3164 33.3578L25.317 33.3483C25.3176 33.3398 25.3192 33.3315 25.3221 33.3235C25.3676 33.1963 25.4476 33.0878 25.5965 32.9895C26.4495 32.4997 27.1153 32.0603 27.9415 31.8085C27.9427 31.8081 27.9433 31.8069 27.943 31.8058V31.8058C27.9426 31.8046 27.9433 31.8034 27.9444 31.8031L27.9445 31.8031C27.9456 31.8027 27.9463 31.8016 27.946 31.8004C27.7512 30.9591 27.7991 30.163 27.7966 29.1793C27.8075 29.001 27.8611 28.8772 27.9486 28.774C27.954 28.7676 27.9604 28.7621 27.9673 28.7574L27.9755 28.7519C27.9799 28.749 27.9837 28.7453 27.9867 28.741L27.9869 28.7407C27.9898 28.7367 27.9933 28.7332 27.9973 28.7305V28.7305C28.0018 28.7275 28.0056 28.7236 28.0085 28.7192L28.0142 28.7106C28.0187 28.7037 28.0241 28.6975 28.0304 28.6922C28.1336 28.6042 28.2575 28.5505 28.4359 28.54C29.4198 28.5421 30.216 28.4945 31.0576 28.6896C31.0584 28.6898 31.0593 28.6893 31.0596 28.6885V28.6885C31.0598 28.6878 31.0603 28.6874 31.061 28.6873L31.0622 28.6872C31.0636 28.6871 31.0647 28.6861 31.0652 28.6848C31.317 27.8586 31.7563 27.1929 32.2461 26.34C32.3444 26.191 32.4529 26.111 32.5802 26.0655C32.5881 26.0627 32.5965 26.061 32.6049 26.0605L32.6204 26.0594C32.622 26.0593 32.6236 26.0589 32.6251 26.0582L32.6373 26.0526L-nan -nanL-nan -nanZ" stroke="#C2B7A2"/>
					</svg><br />
					<span className='loading'>Loading</span>
				</div>
			</div>
      </Modal>
		</div>
	)
}

const mapStateToProps = (state) => {
  return {
    userProfile: state.userProfile
  }
}

export default connect(mapStateToProps, null)(FeedbackModal);
