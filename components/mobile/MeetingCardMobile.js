import React from 'react';
import { Row, Col, Button } from 'antd';
import { Link } from "react-router-dom";

const MeetingCardMobile = (props) => {
    return (
        <Col xs={24} sm={24} md={24} lg={24} style={{ backgroundColor: '#ffffff' }}>
            <Row>
                <Col xs={5} sm={5} md={0} lg={0} className='vertical-divider' style={{ paddingTop: '5px', paddingBottom: '5px' }}>
                    <Row>
                        <Col xs={24} sm={24} md={0} lg={0} style={{ display: 'flex', justifyContent: 'center' }}>
                            <span className="qa-fs-20 qa-fw-b qa-font-san">
                                {props.type == 'SELLER' ? props.data.presenters[0].slotDate.split('-')[2] : props.data.registrants[0].slotDate.split('-')[2]}
                            </span>
                        </Col>
                        <Col xs={24} sm={24} md={0} lg={0} style={{ display: 'flex', justifyContent: 'center' }}>
                            <span className="qa-font-san qa-fs-12">
                                {props.formattedDate}
                            </span>
                        </Col>
                    </Row>
                </Col>
                {props.type == 'SELLER' ?
                    <Col xs={19} sm={19} md={0} lg={0} style={{ paddingLeft: '15px', paddingTop: '20px' }}>
                        <span className="qa-fs-14 qa-font-san qa-fw-b" style={{ letterSpacing: '0.4px', colo: '#191919' }}>Video call with {props.data.registrants[0].orgName}</span>
                    </Col>
                    : <Col xs={19} sm={19} md={0} lg={0} style={{ paddingLeft: '15px', paddingTop: '20px' }}>
                        <span className="qa-fs-14 qa-font-san qa-fw-b" style={{ letterSpacing: '0.4px', colo: '#191919' }}>Video call with {props.data.presenters[0].orgName}</span>
                    </Col>}
                {/* <Col xs={20} sm={20} md={0} lg={0} style={{ paddingLeft: '15px', paddingTop: '10px' }}>
                    <span className="qa-fs-16 qa-font-san qa-fw-b">Video call with ABC buyer</span>
                </Col> */}
                <Col xs={24} sm={24} md={0} lg={0} style={{ marginTop: '-6px' }}>
                    <hr style={{ border: '1px solid #ebeff2' }} />
                </Col>
            </Row>

            <Row>
                <Col xs={24} sm={24} md={0} lg={0} style={{ paddingLeft: '15px', paddingTop: '15px', paddingBottom: '15px' }}>
                    <Row>
                        {props.type == 'SELLER' ? <Col xs={22} sm={22} md={0} lg={0} style={{ marginTop: '5px' }}>
                            <span className="qa-fs-12 qa-font-san" style={{ lineHeight: '19px', color: '#332f2f', opacity: '80%' }}>Time - <b className="qa-font-san qa-fs-12" style={{ color: '#191919' }}>{props.data.presenters[0].slotStart} to {props.data.presenters[0].slotEnd}</b> India Standard Time - Kolkata</span>
                        </Col> :
                            <Col xs={22} sm={22} md={22} lg={22} style={{ marginTop: '5px' }}>
                                <span className="qa-fs-12 qa-font-san" style={{ lineHeight: '19px', color: '#332f2f', opacity: '80%' }}>Time - <b className="qa-font-san qa-fs-12" style={{ color: '#191919' }}>{props.data.registrants[0].slotStart} to {props.data.registrants[0].slotEnd}</b></span>
                            </Col>}
                        {/* <Col xs={24} sm={24} md={0} lg={0} style={{ marginTop: '5px' }}>
                            <span className="qa-fs-12 qa-font-san qa-fw-b">1pm to 2pm</span>
                        </Col> */}
                        {/* <Col xs={24} sm={24} md={0} lg={0} style={{ marginTop: '5px' }}>
                            <span className="qa-fs-12 qa-font-san qa-fw-b">India Standard Time - Kolkata</span>
                        </Col> */}
                    </Row>
                    <Row>
                        {props.type == 'SELLER' ?
                            <Col xs={22} sm={22} md={0} lg={0} style={{ marginTop: '5px', marginBottom: '10px' }}>
                                <span className="qa-fs-12 qa-font-san" style={{ color: '#332f2f', opacity: '80%' }}>Video call link - <a style={{ color: '#874439' }} className="qa-fs-12 qa-font-san qa-fw-b" href={props.data.presenters[0].meetingURL} target="blank">{props.data.presenters[0].meetingURL}</a></span>
                            </Col> :
                            <Col xs={22} sm={22} md={0} lg={0} style={{ marginTop: '5px', marginBottom: '10px' }}>
                                <span className="qa-fs-12 qa-font-san" style={{ color: '#332f2f', opacity: '80%' }}>Video call link - <a style={{ color: '#874439' }} className="qa-fs-12 qa-font-san qa-fw-b" href={props.data.registrants[0].meetingURL} target="blank">{props.data.registrants[0].meetingURL}</a></span>
                            </Col>}
                    </Row>
                </Col>
            </Row>
            {props.data.eventStatus !== 'COMPLETED' ? <hr style={{ border: '1px solid #ebeff2' }} /> : ''}
            <Row>
                <Col xs={24} sm={24} md={0} lg={0} style={{ marginBottom: '25px', marginTop: '15px' }}>
                    {props.data.eventStatus !== 'COMPLETED' ?
                        <Row>
                            <Col xs={10} sm={10} md={10} lg={10} className='card-btn'>
                                <Button className={props.isWeb ? 'web-reject-button' : 'mobile-reject-button mobile-button'} onClick={props.handleReschedule}>
                                    <span className="qa-font-san qa-fs-12 qa-fw-b" style={{ color: '#191919' }}>RESCHEDULE</span></Button>
                            </Col>
                            <Col xs={10} sm={10} md={10} lg={10}>
                                <Button className={props.isWeb ? 'web-reject-button' : 'mobile-reject-button mobile-button cancel-btn'} onClick={props.handleCancel}>
                                    <span className="qa-font-san qa-fs-12 qa-fw-b cancel-button" style={{ color: '#191919' }}>CANCEL REQUEST</span></Button>
                            </Col>
                            <Col xs={4} sm={4} md={4} lg={4}></Col>
                        </Row> : ''
                        //  <Row>
                        //     <Col xs={24} sm={24} md={0} lg={0}>
                        //         <div style={{ textAlign: 'center' }}>
                        //             <Link className="qa-fs-14 qa-font-san qa-fw-b" target="blank" style={{ color: '#874439', textDecoration: 'underline', pointerEvents: 'none' }}>View buyer profile</Link>
                        //         </div>
                        //     </Col>
                        // </Row>
                        }
                </Col>
            </Row>

            {/* <Col xs={22} sm={22} md={0} lg={0} style={{ paddingLeft: '15px' }} className='vertical-divider'>
                    <Row>
                        <Col xs={22} sm={22} md={22} lg={22} style={{ marginTop: '15px' }}>
                            <span className="qa-fs-14 qa-font-san qa-fw-b">Video call with ABC buyer</span>
                            Time - 1pm to 2pm India Standard Time - Kolkata
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={22} sm={22} md={22} lg={22} style={{ marginTop: '5px' }}>
                            <span className="qa-fs-12 qa-font-san qa-fw-b">Time - 1pm to 2pm India Standard Time - Kolkata</span>
                            Video call link -        www.qalara.com/videocall/abc+xyz
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={22} sm={22} md={22} lg={22} style={{ marginTop: '5px', marginBottom: '10px' }}>
                            <span className="qa-fs-12 qa-font-san qa-fw-b">Video call link - <a>www.qalara.com/videocall/abc+xyz</a></span>
                        </Col>
                    </Row>
                </Col> */}
        </Col>

    )
}

export default MeetingCardMobile;