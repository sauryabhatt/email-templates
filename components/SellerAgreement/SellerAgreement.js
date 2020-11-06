import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Button, Form, Checkbox, Modal, Col, Row } from 'antd';
import {useRouter} from "next/router";
import Spinner from '../Spinner/Spinner';
import { useKeycloak } from '@react-keycloak/ssr';
import { getUserProfile, setSellerAgreement } from '../../store/actions/userProfile';
import { setAuth } from '../../store/actions/auth';
import AgreementAccepted from '../AgreementAccepted/AgreementAccepted';
import NotVerifiedUser from '../NotVerifiedUser/NotVerifiedUser';


const SellerAgreement = (props) => {
    const router = useRouter();
    const mediaMatch = window.matchMedia("(min-width: 1024px)");
    const {keycloak} = useKeycloak();
    const [form] = Form.useForm();
    const [buttonDisabled, setButtonDisbled] = useState(true);
    const [verifiedUser, setverifiedUser] = useState(null);
    const [visible, setVisible] = useState(false);
    const {sellerType} = router.query;
    let url = '';
    let filename = '';
    if (sellerType == 'standard') {
        url = process.env.NEXT_PUBLIC_REACT_APP_SELLER_AGREEMENT_STANDARD_BASE_URL + process.env.NEXT_PUBLIC_REACT_APP_SELLER_AGREEMENT_STANDARD_FILENAME;
        filename = process.env.REACT_APP_SELLER_AGREEMENT_STANDARD_FILENAME;
    } else {
        url = process.env.NEXT_PUBLIC_REACT_APP_SELLER_AGREEMENT_ANCHOR_BASE_URL + process.env.NEXT_PUBLIC_REACT_APP_SELLER_AGREEMENT_ANCHOR_FILENAME;
        filename = process.env.NEXT_PUBLIC_REACT_APP_SELLER_AGREEMENT_ANCHOR_FILENAME;
    }

    const handleClick = (e) => {
        e.preventDefault();
    };

    const onFinish = () => {
        props.setSellerAgreement(filename, keycloak.token);
        setVisible(true);
    };

    const handleButtonDisabled = (e) => {
        setButtonDisbled(!e.target.checked);
    }

    const handleAgreement = () => {
        var a = document.createElement("a");
        a.href = url;
        a.setAttribute("download", "Spec-sheet");
        a.setAttribute("target", "_blank");
        a.click();
    }
    
    if (verifiedUser == null) {
        if (props.userAuth != undefined && props.currentUserProfile != undefined) {
            let seller_code_in_url = router?.query?.sellerCode;
            if (seller_code_in_url == props.userAuth.attributes.parentProfileId[0].split('::')[1]) {
                fetch((process.env.NEXT_PUBLIC_REACT_APP_API_PROFILE_URL + "/profiles/my/verify-primary-logged-in-user?seller_code=" + seller_code_in_url), {
                    method: "GET",
                    headers: {
                        "Authorization": 'Bearer ' + keycloak.token
                    }
                })
                    .then(res => {
                        if (res.ok) {
                            return res.json();
                        } else {
                            throw (res.statusText || 'Error while fetching user profile.');
                        }
                    })
                    .then((response) => setverifiedUser(response.success))
                    .catch((err) => {
                        // console.log("Error ", err);
                        setverifiedUser(false);
                    });
            } else {
                return (<NotVerifiedUser />);
            }
        }
    }

    const handleCancel = (status) => {
        setVisible(false);
        router.push("/");
    };


    if (props.currentUserProfile == undefined || verifiedUser == null) {
        return (<Spinner />)
    }

    if (props.currentUserProfile == "BUYER") {
        router.push("/");
    }

    if(props.agreementAgreed){
        return(<AgreementAccepted />)
    }


    return (
        props.currentUserProfile == "SELLER" && props.status !== "REGISTERED" && verifiedUser ?
            (<div>
                <div id="banner-container-tandc_seller">
                    <span className='banner-text'>
                        Seller agreement
                        <p className='banner-text-small'>Terms of sale digital document</p>
                    </span>
                </div>
                <div id="banner-container-agreement-body" className="embed-responsive" style={{ backgroundColor: "#f9f7f2" }}>
                    <div className='react-pdf__Page'>
                        <Col xs={24} md={24} lg={24} xl={24}>
                            <Row>
                                <Col xs={24} md={24} lg={24} xl={24}>
                                    <span className={mediaMatch.matches ? "qa-font-san qa-fw-b qa-col-center qa-mar-top-3 agreement-header" : "qa-font-san qa-fw-b qa-col-center qa-mar-top-3 agreement-header-mob"} >
                                        Accept the agreement and start the onboarding process
                                    </span>
                                </Col>
                            </Row>
                            {mediaMatch.matches ? <Row className={mediaMatch.matches ? "body-first-row" : "body-first-row-mob"}>
                                <Col xs={22} md={22} lg={24} xl={24}>
                                    <span className="qa-font-san qa-fs-17 qa-mar-top-3 qa-tc-white">
                                        Company / Business name :
                                    </span>
                                    <span className="qa-font-san qa-fs-17 qa-mar-top-3 qa-sm-color">
                                        &nbsp;{props.user && props.user.orgName}
                                    </span>
                                </Col>
                            </Row> :
                                <Row className="body-first-row-mob qa-mar-top-3">
                                    <Col xs={22} md={22} lg={24} xl={24}>
                                        <span className="qa-font-san qa-fs-17 qa-mar-top-3 qa-tc-white">
                                            Company / Business name :
                                </span>
                                    </Col>
                                    <Col xs={22} md={22} lg={24} xl={24} className="qa-mar-top-1">
                                        <span className="qa-font-san qa-fs-17 qa-sm-color">
                                            {props.user && props.user.orgName}
                                        </span>
                                    </Col>
                                </Row>}
                            {mediaMatch.matches ? <Row className="body-second-row">
                                <Col xs={22} md={22} lg={24} xl={24}>
                                    <span className="qa-font-san qa-fs-17 qa-mar-top-2" style={{ letterSpacing: '0.02em', color: '#000000' }}>
                                        Seller Agreement
                                    </span>
                                </Col>
                            </Row> :
                                <Row className="qa-mar-top-3 body-second-row-mob">
                                    <Col xs={22} md={22} lg={24} xl={24}>
                                        <span className="qa-font-san qa-fs-17 qa-mar-top-2" style={{ letterSpacing: '0.02em', color: '#000000' }}>
                                            Seller Agreement
                                </span>
                                    </Col>
                                </Row>}
                            {mediaMatch.matches ? <Row className="body-second-row">
                                <Col xs={24} md={24} lg={24} xl={24}>
                                    <div style={{display: 'inline-block'}}>
                                        <Checkbox defaultChecked={false} onClick={handleButtonDisabled}>
                                        </Checkbox>
                                    </div>
                                    <div style={{display: 'inline-block', paddingLeft: '10px', cursor: 'pointer'}}>
                                        <span className="qa-font-san qa-fs-14 qa-tc-white" style={{ letterSpacing: '0.02em' }}>I have read and agree to comply with and/or be bound by the terms and conditions of </span><span className="qa-font-san qa-fs-14 qa-sm-color" style={{ textDecoration: 'underline', letterSpacing: '0.02em' }} onClick={handleAgreement}>Mesindus Ventures-Terms of Sale for Sellers</span>
                                    </div>
                                </Col>
                            </Row> : <Row style={mediaMatch.matches ? { paddingLeft: '60px', paddingTop: '20px' } : { paddingLeft: '25px', paddingRight: '25px', marginTop: '10px' }}>
                                    <Col xs={2} md={2} lg={2} xl={2}>
                                        <Checkbox defaultChecked={false} onClick={handleButtonDisabled}>
                                        </Checkbox>
                                    </Col>
                                    <Col xs={20} md={20} lg={22} xl={22} style={{ lineHeight: '17px' }}>
                                        <span className="qa-font-san qa-fs-14 qa-tc-white" style={{ letterSpacing: '0.02em' }}>I have read and agree to comply with and/or be bound by the terms and conditions of <br /></span><span className="qa-font-san qa-fs-14 qa-sm-color" style={{ textDecoration: 'underline', letterSpacing: '0.02em', cursor: 'pointer' }} onClick={handleAgreement}>Mesindus Ventures-Terms of Sale for Sellers</span>
                                    </Col>
                                </Row>}
                        </Col>
                    </div>
                    {/* <div className='react-pdf__Page' style={{ paddingTop: '100px' }}>
                        <object id="agreement" style={{ height: '850px', width: '750px' }} data={url} type="application/pdf" />
                    </div> */}
                    {/* <div className="agreemnt_accept" style={{ marginTop: '50px' }}>
                        <Checkbox defaultChecked={false} onClick={handleButtonDisabled}>
                            <span style={{ fontSize: '14px', color: '#ffffff' }}>I agree and accept the terms of sale</span></Checkbox>
                    </div> */}
                    <div className="agreemnt_accept" style={{ paddingBottom: '50px', marginTop: '25px' }}>
                        <Button className='banner-button' style={{ width: '300px', height: '70px' }} onClick={onFinish} disabled={buttonDisabled}><span style={{ fontSize: '16px' }}>CONTINUE</span></Button>
                    </div>
                </div>
                <Modal
                    className="confirmation-modal"
                    visible={visible}
                    footer={null}
                    closable={true}
                    onCancel={handleCancel}
                    bodyStyle={{ padding: "30" }}
                    centered
                >
                    <p className="verification-heading">Thank you!  </p>
                    <p className="verification-text">
                        Your registration process is complete.
                    </p>
                    <Button
                        className="congratulation-button"
                        onClick={() => {
                            router.push("/");
                        }}
                    >
                        Back to home page
                    </Button>
                </Modal>
            </div>
            )
            : <NotVerifiedUser />
    )
}

const mapStateToProps = (state) => {
    return {
        currentUserProfile: state.userProfile.userProfile?.profileType,
        status: state.userProfile.userProfile?.verificationStatus,
        userAuth: state.auth.userAuth,
        agreementAgreed: state.userProfile.userProfile?.agreementAgreed,
        user: state.userProfile.userProfile
    };
}


export default connect(mapStateToProps, { getUserProfile, setSellerAgreement, setAuth })(SellerAgreement);
