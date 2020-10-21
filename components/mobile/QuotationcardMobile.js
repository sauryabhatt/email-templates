import React, { useEffect, useState } from 'react';
import { Row, Col, Menu, Button } from "antd";
import { history } from "./../../store";
import { useKeycloak } from "@react-keycloak/web";
import moment from "moment";

const QuotationcardMobile = (props) => {
    const [keycloak] = useKeycloak();
    const [rfqIds, setRfqIds] = useState(null);

    const handleReview = (quoteNumber) => {
        fetch(process.env.NEXT_PUBLIC_REACT_APP_API_FORM_URL + "/quotes/custom/" + quoteNumber + "/margin", {
            method: "PUT",
            headers: {
                "Content-Length": 0,
                Authorization: "Bearer " + keycloak.token,
            },
        })
            .then((res) => {
                if (res.ok) {
                    return res.json();
                } else {
                    throw res.statusText || "Error while signing up.";
                }
            })
            .then((res) => {
                if (props.data.orderId) {
                    let url = '/order-review/' + props.data.orderId
                    history.push(url);
                } else {
                    createOrderFromQuote(quoteNumber);
                }

            })
            .catch((err) => {
                // message.error(err.message || err, 5);
            });

        // let url = '/order-review/' + rfqId
        // history.push(url);
    }

    useEffect(() => {
        if (props.status !== 'requested') {
            let ids = '';
            props.data && props.data.linkedQueriesId && Object.keys(props.data.linkedQueriesId).map(key => {
                ids = `${ids} , ${props.data.linkedQueriesId[key]}`
                console.log(ids);
            })
            setRfqIds(ids.substring(2));
        }

    }, []);
    const createOrderFromQuote = (quoteNumber) => {
        fetch(process.env.NEXT_PUBLIC_REACT_APP_ORDER_ORC_URL + "/orders/custom/" + quoteNumber, {
            method: "POST",
            headers: {
                "Content-Length": 0,
                Authorization: "Bearer " + keycloak.token,
            },
        })
            .then((res) => {
                if (res.ok) {
                    return res.json();
                } else {
                    throw res.statusText || "Error while signing up.";
                }
            })
            .then((res) => {
                console.log(res.orderId);
                let url = '/order-review/' + res.orderId
                history.push(url);
            })
            .catch((err) => {
                // message.error(err.message || err, 5);
            });
    }


    const downloadMedia = (data) => {
        if (data) {
            var a = document.createElement("a");
            a.href = process.env.REACT_APP_ASSETS_FILE_URL + data["mediaUrl"];;
            a.setAttribute("download", 'Spec-sheet');
            a.setAttribute("target", "_blank");
            a.click();
        }
    }

    const redirectToSellerCompany = vanityId => {
        let url = `${/seller/}${vanityId}`;
        history.push(url)
    }

    const getBrandName = props.data && props.data.subOrders && props.data.subOrders.map((subOrder, index) => {
        return (
            <Col xs={24} sm={24} md={24} lg={24} style={index > 0 ? {marginTop: '10px'}: {}}>
                <span className="qa-font-san qa-fs-16 qa-fw-b qa-sm-color" style={{ lineHeight: '20px', textDecoration: 'underline', cursor: 'pointer' }} onClick={(e) => redirectToSellerCompany(props.brandNames[subOrder.sellerCode].vanityId)}>
                    {props.brandNames && props.brandNames[subOrder.sellerCode] && props.brandNames[subOrder.sellerCode].brandName}
                </span>
            </Col>
        )
    })

    // const getAllRfqNumber = props.data && props.data.linkedQueriesId && Object.keys(props.data.linkedQueriesId).map(key => {
    //     return (
    //         <Col xs={24} sm={24} md={24} lg={24}>
    //             <span className="qa-font-san qa-fs-16 qa-fw-b qa-sm-color" style={{ lineHeight: '20px', textDecoration: 'underline' }}>
    //                 {props.data.linkedQueriesId[key]}
    //             </span>
    //         </Col>
    //     )
    // })

    return (
        <Col
            xs={24}
            sm={24}
            md={24}
            lg={24}
            style={{ background: '#f2f0eb', marginBottom: "20px" }}
        >
            <Row>
                <Col xs={24} sm={24} md={24} lg={0}>
                    <Row>
                        <Col xs={5} sm={5} md={5} lg={0} className='vertical-divider qa-vertical-center' style={{ paddingTop: '5px', paddingBottom: '5px' }}>
                            <Row style={{width: '100%'}}>
                                <Col xs={24} sm={24} md={24} lg={0} style={{ display: 'flex', justifyContent: 'center' }}>
                                    <span className="qa-fs-20 qa-fw-b qa-font-san qa-tc-white">
                                        {props.day}
                                    </span>
                                </Col>
                                <Col xs={24} sm={24} md={24} lg={0} style={{ display: 'flex', justifyContent: 'center' }}>
                                    <span className="qa-font-san qa-fs-12" style={{ color: '#332f2f', opacity: '0.8' }}>
                                        {props.formattedDate}
                                    </span>
                                </Col>
                            </Row>
                        </Col>
                        {props.status == 'received' || props.status == 'closed' ? <Col xs={19} sm={19} md={19} lg={0} style={{ paddingLeft: '15px', display: 'flex', alignItems: 'center', paddingRight: '15px' }}>
                            <Row>
                                <Col xs={24} sm={24} md={24} lg={24}>
                                    <span className="qa-fs-10 qa-font-san" style={{ color: '#191919' }}>RFQ ID:</span>
                                </Col>
                                <Col xs={24} sm={24} md={24} lg={24}>
                                    <span className="qa-fs-12 qa-font-san" style={{ color: '#191919' }}>{rfqIds}</span>
                                </Col>
                            </Row>

                            {/* <Row>
                                {getBrandName}
                            </Row> */}
                            {/* <span className="qa-fs-16 qa-font-san qa-fw-b qa-sm-color" style={{ lineHeight: '20px', textDecoration: 'underline' }}>{props.data.sellerCode}</span> */}
                        </Col> : <Col xs={19} sm={19} md={19} lg={0} style={{ paddingLeft: '15px', paddingRight: '15px', display: 'flex', alignItems: 'center' }}>
                                <Row>
                                    <Col xs={24} sm={24} md={24} lg={24}>
                                        <span className="qa-fs-10 qa-font-san" style={{ color: '#191919' }}>RFQ ID:</span>
                                    </Col>
                                    <Col xs={24} sm={24} md={24} lg={24}>
                                        <span className="qa-fs-12 qa-font-san" style={{ color: '#191919' }}>{props.data.queryNumber}</span>
                                    </Col>
                                </Row>
                                {/* <span className="qa-font-san qa-fs-16 qa-fw-b qa-sm-color" style={{ lineHeight: '20px', textDecoration: 'underline' }}>{props.brandNames && props.brandNames[props.data.sellerId] && props.brandNames[props.data.sellerId].brandName}</span> */}
                                {/* <span className="qa-fs-16 qa-font-san qa-fw-b qa-sm-color" style={{ lineHeight: '20px', textDecoration: 'underline' }}>{props.data.sellerCode}</span> */}
                            </Col>}
                        <Col xs={24} sm={24} md={24} lg={0} style={{ marginTop: '-6px' }}>
                            <hr style={{ border: '1px solid #E5E5E5' }} />
                        </Col>
                    </Row>
                    <Row style={{ padding: '20px' }}>
                        <Col xs={24} sm={24} md={24} lg={0}>
                            {props.status == 'received' || props.status == 'closed' ?
                                <React.Fragment>
                                    <Row>
                                        {getBrandName}
                                        <Col xs={6} sm={6} md={6} lg={0} className="qa-vertical-center">
                                            <span className="qa-font-san qa-fs-12" style={{ color: '#332f2f', opacity: '0.8', lineHeight: '17px' }}>Latest quote: </span>
                                        </Col>
                                        <Col xs={4} sm={4} md={4} lg={0}>
                                            <img className='images' src={process.env.PUBLIC_URL + "/pdf_download.png"} onClick={(e) => downloadMedia(props.data.quotationMedia)}></img>
                                        </Col>
                                        <Col xs={14} sm={14} md={14} lg={0}>
                                            <Row>
                                                <Col xs={24} sm={24} md={24} lg={0}>
                                                    <span className="qa-fs-12 qa-font-san" style={{ lineHeight: '12px', color: '#332f2f', opacity: '0.8' }}>Quote ID: {props.data.quoteNumber}</span>
                                                </Col>
                                                <Col xs={24} sm={24} md={24} lg={0}>
                                                    <span className="qa-fs-12 qa-font-san" style={{ lineHeight: '14px', color: '#191919' }}>{props.quoteCreatedDate}*</span>
                                                </Col>
                                            </Row>
                                        </Col></Row></React.Fragment> : ''}
                            {props.status !== 'requested' ?
                                '' :
                                <Col xs={24} sm={24} md={24} lg={0}>
                                    {props.data.sellerId ? <span className="qa-font-san qa-fs-14 qa-fw-b qa-sm-color" style={{ lineHeight: '20px', textDecoration: 'underline', cursor: 'pointer' }} onClick={(e) => redirectToSellerCompany(props.brandNames && props.brandNames[props.data.sellerId] && props.brandNames[props.data.sellerId].vanityId)}>{props.brandNames && props.brandNames[props.data.sellerId] && props.brandNames[props.data.sellerId].brandName}</span> :
                                <span className="qa-font-san qa-fs-14 qa-fw-b qa-tc-white">Custom order quote requested</span>}
                                </Col>}
                        </Col>
                    </Row>
                    {props.status == 'received' || props.status == 'closed' ? <Row>
                        <Col xs={24} sm={24} md={24} lg={0} style={{ marginTop: '-6px' }}>
                            <hr style={{ border: '1px solid #E5E5E5' }} />
                        </Col>
                    </Row> : ''}
                    {props.status == 'received' ? <Row style={{ marginBottom: '25px', marginTop: '15px' }}>
                        <Col xs={24} sm={24} md={24} lg={0}>
                            <div style={{ textAlign: 'center' }}>
                                <Button
                                    className="web-review-button"
                                    onClick={() => handleReview(props.data.quoteNumber)}
                                // onClick={props.handleReschedule}
                                >
                                    <span className="qa-font-san qa-fs-12 qa-fw-b" style={{ color: '#191919' }}>REVIEW AND CHECKOUT</span></Button>
                            </div>
                        </Col>
                    </Row> : ''}

                    {props.status == 'closed' ? <Row style={{ marginBottom: '25px', marginTop: '15px' }}>
                        <Col xs={24} sm={24} md={24} lg={0}>
                            <div style={{ textAlign: 'center' }}>
                                {props.data.orderStatus && props.data.orderStatus === 'CHECKED_OUT' ? <span className="dot-green"></span> :
                                    <span className="dot-red"></span>}&nbsp;&nbsp;&nbsp;
                                {props.data.orderStatus && props.data.orderStatus === 'CHECKED_OUT' ?
                                    <span className="qa-font-san qa-fs-14 qa-fw-b" style={{ color: '#191919' }}>Order confirmed</span> :
                                    <span className="qa-font-san qa-fs-14 qa-fw-b" style={{ color: '#191919' }}>Order cancelled & archived</span>}
                            </div>
                        </Col>
                        <Col xs={24} sm={24} md={24} lg={0}>
                            <div style={{ textAlign: 'center' }}>
                                <span className="qa-font-san qa-fs-12" style={{ color: '#191919' }}>{moment(props.data.updatedTimeStamp).format('DD/MM/YYYY')}*</span>
                            </div>
                        </Col>
                    </Row> : ''}
                </Col>
            </Row>
        </Col >
    )
}

export default QuotationcardMobile;