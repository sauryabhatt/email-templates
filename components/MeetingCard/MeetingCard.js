import React from 'react';
import { Row, Col, Button } from 'antd';

const MeetingCard = (props) => {
    return (
        <Col xs={22} sm={22} md={24} lg={24} style={{ backgroundColor: '#ffffff' }}>
            <Row justify="space-around">
                <Col xs={22} sm={22} md={3} lg={3} className='vertical-divider'>
                    <Row style={{ paddingTop: '15px' }}>
                        <Col xs={24} sm={24} md={24} lg={24} style={{ display: 'flex', justifyContent: 'center' }}>
                            <span className="qa-fs-32 qa-font-san" style={{ color: '#191919' }}>
                                {props.type == 'SELLER' ? props.data.presenters[0].slotDate.split('-')[2] : props.data.registrants[0].slotDate.split('-')[2]}
                            </span>
                        </Col>
                        <Col xs={24} sm={24} md={24} lg={24} style={{ textAlign: 'center', color: '#332f2f', opacity: '80%' }}>
                            <span>
                                {props.formattedDate}
                            </span>
                        </Col>
                    </Row>
                </Col>
                {props.data.eventStatus !== 'COMPLETED' ?
                    <Col xs={22} sm={22} md={11} lg={11} style={{ paddingLeft: '15px' }} className='vertical-divider'>
                        <Row>
                            {props.type == 'SELLER' ?
                                <Col xs={22} sm={22} md={22} lg={22} style={{ marginTop: '15px' }}>
                                    <span className="qa-fs-14 qa-font-san qa-fw-b" style={{ letterSpacing: '0.4px', color: '#191919' }}>Video call with {props.data.registrants[0].orgName}</span>
                                </Col>
                                : <Col xs={22} sm={22} md={22} lg={22} style={{ marginTop: '15px' }}>
                                    <span className="qa-fs-14 qa-font-san qa-fw-b" style={{ letterSpacing: '0.4px', color: '#191919' }}>Video call with {props.data.presenters[0].orgName}</span>
                                </Col>}
                        </Row>
                        <Row>
                            {props.type == 'SELLER' ? <Col xs={22} sm={22} md={22} lg={22} style={{ marginTop: '5px' }}>
                                <span className="qa-fs-12 qa-font-san" style={{ lineHeight: '19px', color: '#332f2f', opacity: '80%' }}><b className="qa-font-san qa-fs-12" style={{ color: '#191919' }}>{props.data.presenters[0].slotStart} to {props.data.presenters[0].slotEnd}</b> India Standard Time - Kolkata</span>
                            </Col> :
                                <Col xs={22} sm={22} md={22} lg={22} style={{ marginTop: '5px' }}>
                                    <span className="qa-fs-12 qa-font-san" style={{ lineHeight: '19px', color: '#332f2f', opacity: '80%' }}><b className="qa-font-san qa-fs-12" style={{ color: '#191919' }}>{props.data.registrants[0].slotStart} to {props.data.registrants[0].slotEnd}</b></span>
                                </Col>}
                        </Row>
                        <Row>
                            {props.type == 'SELLER' ?
                                <Col xs={22} sm={22} md={22} lg={22} style={{ marginTop: '5px', marginBottom: '10px' }}>
                                    <span className="qa-fs-12 qa-font-san" style={{ color: '#332f2f', opacity: '80%' }}>Video call link - <a style={{ color: '#874439' }} className="qa-fs-12 qa-font-san qa-fw-b" href={props.data.presenters[0].meetingURL} target="blank">{props.data.presenters[0].meetingURL}</a></span>
                                </Col> :
                                <Col xs={22} sm={22} md={22} lg={22} style={{ marginTop: '5px', marginBottom: '10px' }}>
                                    <span className="qa-fs-12 qa-font-san" style={{ color: '#332f2f', opacity: '80%' }}>Video call link - <a style={{ color: '#874439' }} className="qa-fs-12 qa-font-san qa-fw-b" href={props.data.registrants[0].meetingURL} target="blank">{props.data.registrants[0].meetingURL}</a></span>
                                </Col>}
                        </Row>
                    </Col> :
                    <Col xs={22} sm={22} md={21} lg={21} style={{ paddingLeft: '15px' }}>
                        <Row>
                            {props.type == 'SELLER' ?
                                <Col xs={22} sm={22} md={22} lg={22} style={{ marginTop: '15px' }}>
                                    <span className="qa-fs-14 qa-font-san qa-fw-b" style={{ letterSpacing: '0.4px', color: '#191919' }}>Video call with {props.data.registrants[0].orgName}</span>
                                </Col>
                                : <Col xs={22} sm={22} md={22} lg={22} style={{ marginTop: '15px' }}>
                                    <span className="qa-fs-14 qa-font-san qa-fw-b" style={{ letterSpacing: '0.4px', color: '#191919' }}>Video call with {props.data.presenters[0].orgName}</span>
                                </Col>}
                        </Row>
                        <Row>
                            {props.type == 'SELLER' ? <Col xs={22} sm={22} md={22} lg={22} style={{ marginTop: '5px' }}>
                                <span className="qa-fs-12 qa-font-san" style={{ lineHeight: '19px', color: '#332f2f', opacity: '80%' }}><b className="qa-font-san qa-fs-12" style={{ color: '#191919' }}>{props.data.presenters[0].slotStart} to {props.data.presenters[0].slotEnd}</b> India Standard Time - Kolkata</span>
                            </Col> :
                                <Col xs={22} sm={22} md={22} lg={22} style={{ marginTop: '5px' }}>
                                    <span className="qa-fs-12 qa-font-san" style={{ lineHeight: '19px', color: '#332f2f', opacity: '80%' }}><b className="qa-font-san qa-fs-12" style={{ color: '#191919' }}>{props.data.registrants[0].slotStart} to {props.data.registrants[0].slotEnd}</b></span>
                                </Col>}
                        </Row>
                        <Row>
                            {props.type == 'SELLER' ?
                                <Col xs={22} sm={22} md={22} lg={22} style={{ marginTop: '5px', marginBottom: '10px' }}>
                                    <span className="qa-fs-12 qa-font-san" style={{ color: '#332f2f', opacity: '80%' }}>Video call link - <a style={{ color: '#874439' }} className="qa-fs-12 qa-font-san qa-fw-b" href={props.data.presenters[0].meetingURL} target="blank">{props.data.presenters[0].meetingURL}</a></span>
                                </Col> :
                                <Col xs={22} sm={22} md={22} lg={22} style={{ marginTop: '5px', marginBottom: '10px' }}>
                                    <span className="qa-fs-12 qa-font-san" style={{ color: '#332f2f', opacity: '80%' }}>Video call link - <a style={{ color: '#874439' }} className="qa-fs-12 qa-font-san qa-fw-b" href={props.data.registrants[0].meetingURL} target="blank">{props.data.registrants[0].meetingURL}</a></span>
                                </Col>}
                        </Row>
                    </Col>}


                {props.data.eventStatus !== 'COMPLETED' ?
                    <Col xs={22} sm={22} md={10} lg={10}>
                        <Col xs={24} sm={24} md={24} lg={24} className={props.isWeb ? 'web-button-section' : 'mobile-button-section'}>
                            {/* <Row>
                            <Col xs={10} sm={10} md={8} lg={8} style={{ marginLeft: '25px' }}>
                                <Button className={props.isWeb ? 'web-reject-button' : 'mobile-reject-button'}>Reschedule</Button>
                            </Col>
                            <Col xs={10} sm={10} md={8} lg={8}>
                            <Button className={props.isWeb ? 'web-reject-button' : 'mobile-reject-button'}>Cancel</Button>
                            </Col>
                            <Col xs={4} sm={4} md={8} lg={8}></Col>
                        </Row> */}
                            <div style={{ textAlign: 'center' }}>
                                <Button
                                    className={props.isWeb ? 'web-reject-button' : 'mobile-reject-button'}
                                    style={{ display: 'inline-block' }}
                                    onClick={props.handleReschedule}
                                >
                                    <span className="qa-font-san qa-fs-12 qa-fw-b" style={{ color: '#191919' }}>RESCHEDULE</span></Button>
                                <Button
                                    className={props.isWeb ? 'web-reject-button' : 'mobile-reject-button'}
                                    style={{ display: 'inline-block', marginLeft: '15px' }}
                                    onClick={props.handleCancel}
                                >
                                    <span className="qa-font-san qa-fs-12 qa-fw-b" style={{ color: '#191919', marginLeft: '-6px' }}>CANCEL REQUEST</span></Button>
                            </div>

                        </Col>
                    </Col> : ''
                    // <Col xs={22} sm={22} md={10} lg={10}>
                    //     <Col xs={22} sm={22} md={2} lg={22} style={{ top: '38%' }}>
                    //         <div style={{ textAlign: 'center' }}>
                    //             <Link className="qa-fs-14 qa-font-san qa-fw-b" target="blank" style={{ color: '#874439', textDecoration: 'underline', pointerEvents: 'none'}}>View buyer profile</Link>
                    //         </div>
                    //     </Col>
                    // </Col>
                }
            </Row>
        </Col>

    )
}

export default MeetingCard;